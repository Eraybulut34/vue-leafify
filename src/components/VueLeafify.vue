<template>
  <div 
    class="vue-leafify-container" 
    :style="{ height: height, width: width }"
  >
    <div v-if="loading" class="vue-leafify-loading">
      <div class="vue-leafify-spinner"></div>
    </div>
    <slot name="before-map"></slot>
    <div ref="mapElement" class="vue-leafify-map"></div>
    <slot name="after-map"></slot>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, computed, nextTick } from 'vue';
import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useMapControls } from '../composables/useMapControls';
import { useMarkers } from '../composables/useMarkers';
import { useTileLayer } from '../composables/useTileLayer';
import type { MapOptions, MarkerOptions, TileLayerOptions, LatLng, MapEvents } from '../types';

// Fix for Leaflet icon issue
import { onBeforeMount } from 'vue';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

onBeforeMount(() => {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow
  });
});

// Props
const props = withDefaults(defineProps<{
  // Map options
  options: MapOptions;
  height?: string;
  width?: string;
  
  // Controls
  zoomControl?: boolean;
  scaleControl?: boolean;
  attributionControl?: boolean;
  fullscreenControl?: boolean;
  
  // Tile layer
  tileLayer?: TileLayerOptions;
  tileLayerProvider?: string;
  
  // Markers
  markers?: MarkerOptions[];
  
  // Events
  events?: Record<string, (e: any) => void>;
}>(), {
  height: '500px',
  width: '100%',
  zoomControl: true,
  scaleControl: false,
  attributionControl: true,
  fullscreenControl: false,
  markers: () => [],
  options: () => ({
    center: [0, 0],
    zoom: 13,
    dragging: true,
    touchZoom: true,
    doubleClickZoom: true,
    scrollWheelZoom: true
  })
});

const emit = defineEmits<{
  'update:center': [center: LatLng];
  'update:zoom': [zoom: number];
  'map-ready': [map: L.Map];
  'map-click': [event: L.LeafletMouseEvent];
  'marker-click': [markerId: string, event: L.LeafletMouseEvent];
  'marker-drag': [markerId: string, event: L.LeafletEvent];
  'marker-dragend': [markerId: string, event: L.LeafletEvent];
}>();

const mapElement = ref<HTMLElement | null>(null);
const mapInstance = ref<L.Map | null>(null);
const mapControls = ref<ReturnType<typeof useMapControls> | null>(null);
const markersManager = ref<ReturnType<typeof useMarkers> | null>(null);
const tileLayerManager = ref<ReturnType<typeof useTileLayer> | null>(null);
const loading = ref(true);

// Composables
const initializeMap = () => {
  if (!mapElement.value) return;
  
  // Create map instance
  mapInstance.value = L.map(mapElement.value, {
    center: props.options.center || [0, 0],
    zoom: props.options.zoom || 13,
    minZoom: props.options.minZoom,
    maxZoom: props.options.maxZoom,
    maxBounds: props.options.maxBounds,
    zoomControl: false, // We'll add this manually
    attributionControl: false, // We'll add this manually
    dragging: props.options.dragging !== undefined ? props.options.dragging : true,
    touchZoom: props.options.touchZoom !== undefined ? props.options.touchZoom : true,
    doubleClickZoom: props.options.doubleClickZoom !== undefined ? props.options.doubleClickZoom : true,
    scrollWheelZoom: props.options.scrollWheelZoom !== undefined ? props.options.scrollWheelZoom : true
  });
  
  // Update composables with map instance
  mapControls.value = useMapControls(mapInstance.value);
  markersManager.value = useMarkers(mapInstance.value);
  tileLayerManager.value = useTileLayer(mapInstance.value);
  
  // Add tile layer
  if (props.tileLayer) {
    tileLayerManager.value.createTileLayer('default', props.tileLayer);
  } else if (props.tileLayerProvider) {
    tileLayerManager.value.createTileLayerFromProvider('default', props.tileLayerProvider as any);
  } else {
    // Default tile layer if none provided
    tileLayerManager.value.createTileLayerFromProvider('default', 'osm');
  }
  
  // Add controls based on props
  if (props.zoomControl) {
    mapControls.value.addZoomControl();
  }
  
  if (props.scaleControl) {
    mapControls.value.addScaleControl();
  }
  
  if (props.attributionControl) {
    mapControls.value.addAttributionControl();
  }
  
  if (props.fullscreenControl) {
    mapControls.value.addFullscreenControl();
  }
  
  // Wait for the map to be ready before adding markers
  mapInstance.value.whenReady(() => {
    // Add markers if provided
    if (props.markers && Array.isArray(props.markers)) {
      props.markers.forEach(marker => {
        if (marker && marker.position) {
          markersManager.value.createMarker(marker.id, marker);
        }
      });
    }
    
    // Add events
    if (props.events) {
      Object.entries(props.events).forEach(([event, handler]) => {
        if (handler && mapInstance.value) {
          mapInstance.value.on(event, handler);
        }
      });
    }
    
    // Add default events
    mapInstance.value.on('click', (e) => {
      emit('map-click', e);
    });
    
    mapInstance.value.on('moveend', () => {
      if (mapInstance.value) {
        emit('update:center', mapInstance.value.getCenter());
      }
    });
    
    mapInstance.value.on('zoomend', () => {
      if (mapInstance.value) {
        emit('update:zoom', mapInstance.value.getZoom());
      }
    });
    
    // Hide loading spinner
    loading.value = false;
    
    // Emit map ready event
    emit('map-ready', mapInstance.value);
  });
};

// Watch for changes in props
watch(() => props.options.center, (newCenter) => {
  if (mapInstance.value && newCenter) {
    mapInstance.value.setView(newCenter, mapInstance.value.getZoom());
  }
});

watch(() => props.options.zoom, (newZoom) => {
  if (mapInstance.value && newZoom !== undefined) {
    mapInstance.value.setZoom(newZoom);
  }
});

watch(() => props.zoomControl, (newValue) => {
  if (newValue) {
    mapControls.value.addZoomControl();
  } else {
    mapControls.value.removeZoomControl();
  }
});

watch(() => props.scaleControl, (newValue) => {
  if (newValue) {
    mapControls.value.addScaleControl();
  } else {
    mapControls.value.removeScaleControl();
  }
});

watch(() => props.attributionControl, (newValue) => {
  if (newValue) {
    mapControls.value.addAttributionControl();
  } else {
    mapControls.value.removeAttributionControl();
  }
});

watch(() => props.fullscreenControl, (newValue) => {
  if (newValue) {
    mapControls.value.addFullscreenControl();
  } else {
    mapControls.value.removeFullscreenControl();
  }
});

watch(() => props.tileLayer, (newTileLayer) => {
  if (newTileLayer) {
    tileLayerManager.value.createTileLayer('default', newTileLayer);
  }
});

watch(() => props.tileLayerProvider, (newProvider) => {
  if (newProvider) {
    tileLayerManager.value.createTileLayerFromProvider('default', newProvider as any);
  }
});

watch(() => props.markers, (newMarkers) => {
  if (!mapInstance.value) return;
  
  // Remove all markers
  markersManager.value.removeAllMarkers();
  
  // Add new markers
  newMarkers.forEach(marker => {
    markersManager.value.createMarker(marker.id, marker);
  });
}, { deep: true });

// Public methods
const getMap = () => mapInstance.value;
const getCenter = () => mapInstance.value?.getCenter();
const getZoom = () => mapInstance.value?.getZoom();
const getMarkers = () => markersManager.value.markers;
const getTileLayers = () => tileLayerManager.value.tileLayers;
const getSelectedMarker = () => markersManager.value.selectedMarker;
const getActiveTileLayer = () => tileLayerManager.value.activeTileLayer;
const getIsFullscreen = () => mapControls.value.isFullscreen;

const setView = (center: L.LatLngExpression, zoom?: number) => {
  if (!mapInstance.value) return;
  
  if (zoom !== undefined) {
    mapInstance.value.setView(center, zoom);
  } else {
    mapInstance.value.setView(center, mapInstance.value.getZoom());
  }
};

const flyTo = (center: L.LatLngExpression, zoom?: number, options?: L.ZoomPanOptions) => {
  if (!mapInstance.value) return;
  
  if (zoom !== undefined) {
    mapInstance.value.flyTo(center, zoom, options);
  } else {
    mapInstance.value.flyTo(center, mapInstance.value.getZoom(), options);
  }
};

const invalidateSize = () => {
  if (!mapInstance.value) return;
  
  mapInstance.value.invalidateSize();
};

// Lifecycle hooks
onMounted(() => {
  nextTick(() => {
    initializeMap();
  });
});

onUnmounted(() => {
  if (mapInstance.value) {
    // Call cleanup functions for composables
    mapControls.value.cleanupEventListeners();
    markersManager.value.cleanup();
    tileLayerManager.value.cleanup();
    
    mapInstance.value.remove();
    mapInstance.value = null;
  }
});

// Expose public methods
defineExpose({
  getMap,
  getCenter,
  getZoom,
  getMarkers,
  getTileLayers,
  getSelectedMarker,
  getActiveTileLayer,
  getIsFullscreen,
  setView,
  flyTo,
  invalidateSize,
  createMarker: (id: string, options: MarkerOptions, popupOptions?: any, tooltipOptions?: any) => 
    markersManager.value.createMarker(id, options, popupOptions, tooltipOptions),
  updateMarker: (id: string, options: Partial<MarkerOptions>, popupOptions?: any, tooltipOptions?: any) => 
    markersManager.value.updateMarker(id, options, popupOptions, tooltipOptions),
  removeMarker: (id: string) => markersManager.value.removeMarker(id),
  removeAllMarkers: () => markersManager.value.removeAllMarkers(),
  openPopup: (id: string) => markersManager.value.openPopup(id),
  closePopup: (id: string) => markersManager.value.closePopup(id),
  panToMarker: (id: string) => markersManager.value.panToMarker(id),
  fitBoundsToMarkers: () => markersManager.value.fitBoundsToMarkers(),
  createTileLayer: (id: string, options: TileLayerOptions) => 
    tileLayerManager.value.createTileLayer(id, options),
  createTileLayerFromProvider: (id: string, provider: string) => 
    tileLayerManager.value.createTileLayerFromProvider(id, provider),
  switchTileLayer: (id: string) => tileLayerManager.value.switchTileLayer(id)
});
</script>

<style>
.vue-leafify-container {
  position: relative;
  overflow: hidden;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.vue-leafify-map {
  height: 100%;
  width: 100%;
}

.vue-leafify-loading {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.vue-leafify-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>

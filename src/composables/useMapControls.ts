import { ref, onMounted, onUnmounted, watch } from 'vue';
import * as L from 'leaflet';
import type { Map } from 'leaflet';
import type { MapControlOptions } from '../types';

export function useMapControls(mapInstance: Map | null) {
  const zoomControl = ref<L.Control.Zoom | null>(null);
  const scaleControl = ref<L.Control.Scale | null>(null);
  const layersControl = ref<L.Control.Layers | null>(null);
  const fullscreenControl = ref<any | null>(null);
  const attributionControl = ref<L.Control.Attribution | null>(null);

  const isFullscreen = ref(false);

  const addZoomControl = (options?: MapControlOptions) => {
    if (!mapInstance) return;
    
    if (zoomControl.value) {
      mapInstance.removeControl(zoomControl.value);
    }
    
    zoomControl.value = L.control.zoom({
      position: options?.position || 'topleft'
    });
    
    zoomControl.value.addTo(mapInstance);
  };

  const removeZoomControl = () => {
    if (!mapInstance || !zoomControl.value) return;
    
    mapInstance.removeControl(zoomControl.value);
    zoomControl.value = null;
  };

  const addScaleControl = (options?: MapControlOptions) => {
    if (!mapInstance) return;
    
    if (scaleControl.value) {
      mapInstance.removeControl(scaleControl.value);
    }
    
    scaleControl.value = L.control.scale({
      position: options?.position || 'bottomleft',
      imperial: true,
      metric: true
    });
    
    scaleControl.value.addTo(mapInstance);
  };

  const removeScaleControl = () => {
    if (!mapInstance || !scaleControl.value) return;
    
    mapInstance.removeControl(scaleControl.value);
    scaleControl.value = null;
  };

  const addLayersControl = (baseLayers: Record<string, L.Layer>, overlays: Record<string, L.Layer>, options?: MapControlOptions) => {
    if (!mapInstance) return;
    
    if (layersControl.value) {
      mapInstance.removeControl(layersControl.value);
    }
    
    layersControl.value = L.control.layers(baseLayers, overlays, {
      position: options?.position || 'topright',
      collapsed: true
    });
    
    layersControl.value.addTo(mapInstance);
  };

  const removeLayersControl = () => {
    if (!mapInstance || !layersControl.value) return;
    
    mapInstance.removeControl(layersControl.value);
    layersControl.value = null;
  };

  const addAttributionControl = (options?: MapControlOptions) => {
    if (!mapInstance) return;
    
    if (attributionControl.value) {
      mapInstance.removeControl(attributionControl.value);
    }
    
    attributionControl.value = L.control.attribution({
      position: options?.position || 'bottomright',
      prefix: 'Vue Leafify'
    });
    
    attributionControl.value.addTo(mapInstance);
  };

  const removeAttributionControl = () => {
    if (!mapInstance || !attributionControl.value) return;
    
    mapInstance.removeControl(attributionControl.value);
    attributionControl.value = null;
  };

  // Fullscreen control implementation
  const toggleFullscreen = () => {
    if (!mapInstance) return;
    
    const container = mapInstance.getContainer();
    
    if (!isFullscreen.value) {
      if (container.requestFullscreen) {
        container.requestFullscreen();
      } else if ((container as any).mozRequestFullScreen) {
        (container as any).mozRequestFullScreen();
      } else if ((container as any).webkitRequestFullscreen) {
        (container as any).webkitRequestFullscreen();
      } else if ((container as any).msRequestFullscreen) {
        (container as any).msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if ((document as any).mozCancelFullScreen) {
        (document as any).mozCancelFullScreen();
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen();
      } else if ((document as any).msExitFullscreen) {
        (document as any).msExitFullscreen();
      }
    }
  };

  const addFullscreenControl = (options?: MapControlOptions) => {
    if (!mapInstance) return;
    
    // Custom fullscreen control
    const FullscreenControl = L.Control.extend({
      options: {
        position: options?.position || 'topleft'
      },
      
      onAdd: function() {
        const container = L.DomUtil.create('div', 'leaflet-control-fullscreen leaflet-bar leaflet-control');
        const button = L.DomUtil.create('a', 'leaflet-control-fullscreen-button', container);
        button.href = '#';
        button.title = 'Toggle Fullscreen';
        button.innerHTML = '<svg viewBox="0 0 24 24" width="18" height="18"><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/></svg>';
        
        L.DomEvent.on(button, 'click', L.DomEvent.stop)
          .on(button, 'click', toggleFullscreen);
          
        return container;
      }
    });
    
    if (fullscreenControl.value) {
      mapInstance.removeControl(fullscreenControl.value);
    }
    
    fullscreenControl.value = new FullscreenControl();
    fullscreenControl.value.addTo(mapInstance);
  };

  const removeFullscreenControl = () => {
    if (!mapInstance || !fullscreenControl.value) return;
    
    mapInstance.removeControl(fullscreenControl.value);
    fullscreenControl.value = null;
  };

  // Handle fullscreen change events
  const handleFullscreenChange = () => {
    isFullscreen.value = !!(
      document.fullscreenElement ||
      (document as any).mozFullScreenElement ||
      (document as any).webkitFullscreenElement ||
      (document as any).msFullscreenElement
    );
    
    if (mapInstance) {
      mapInstance.invalidateSize();
    }
  };

  // Setup and cleanup functions to replace lifecycle hooks
  const setupEventListeners = () => {
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('msfullscreenchange', handleFullscreenChange);
  };

  const cleanupEventListeners = () => {
    document.removeEventListener('fullscreenchange', handleFullscreenChange);
    document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
    document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.removeEventListener('msfullscreenchange', handleFullscreenChange);
  };

  setupEventListeners();

  return {
    addZoomControl,
    removeZoomControl,
    addScaleControl,
    removeScaleControl,
    addLayersControl,
    removeLayersControl,
    addAttributionControl,
    removeAttributionControl,
    addFullscreenControl,
    removeFullscreenControl,
    toggleFullscreen,
    isFullscreen,
    setupEventListeners,
    cleanupEventListeners
  };
}

import { ref, reactive } from 'vue';
import * as L from 'leaflet';
import type { Map, TileLayer } from 'leaflet';
import type { TileLayerOptions } from '../types';

export function useTileLayer(mapInstance: Map | null) {
  const tileLayers = reactive<Record<string, TileLayer>>({});
  const activeTileLayer = ref<string | null>(null);

  // Common tile layer providers
  const tileLayerProviders = {
    osm: {
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      options: {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
        subdomains: 'abc'
      }
    },
    cartoDB: {
      url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
      options: {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20
      }
    },
    esriWorldImagery: {
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      options: {
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
        maxZoom: 18
      }
    },
    openTopoMap: {
      url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
      options: {
        attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
        maxZoom: 17,
        subdomains: 'abc'
      }
    },
    stamenTerrain: {
      url: 'https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}{r}.png',
      options: {
        attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        subdomains: 'abcd',
        minZoom: 0,
        maxZoom: 18
      }
    }
  };

  const createTileLayer = (id: string, options: TileLayerOptions) => {
    if (!mapInstance) return null;
    
    // If tile layer with this id already exists, remove it first
    if (tileLayers[id]) {
      removeTileLayer(id);
    }
    
    // Create tile layer with default subdomains if not provided
    const tileLayerOptions = {
      attribution: options.attribution || '',
      minZoom: typeof options.minZoom === 'number' ? options.minZoom : 0,
      maxZoom: typeof options.maxZoom === 'number' ? options.maxZoom : 19,
      subdomains: options.subdomains || 'abc', // Default subdomains if not provided
      errorTileUrl: options.errorTileUrl,
      zoomOffset: options.zoomOffset || 0,
      tms: options.tms || false,
      zoomReverse: options.zoomReverse || false,
      detectRetina: options.detectRetina || false,
      crossOrigin: options.crossOrigin,
      id: options.id,
      accessToken: options.accessToken
    };
    
    // Create tile layer
    const tileLayer = L.tileLayer(options.url, tileLayerOptions);
    
    // Add tile layer to map
    tileLayer.addTo(mapInstance);
    
    // Store tile layer
    tileLayers[id] = tileLayer;
    
    // Set as active tile layer
    activeTileLayer.value = id;
    
    return tileLayer;
  };

  const createTileLayerFromProvider = (id: string, provider: keyof typeof tileLayerProviders) => {
    if (!mapInstance || !tileLayerProviders[provider]) return null;
    
    const { url, options } = tileLayerProviders[provider];
    
    return createTileLayer(id, {
      url,
      ...options
    });
  };

  const switchTileLayer = (id: string) => {
    if (!mapInstance || !tileLayers[id]) return;
    
    // Remove current active tile layer from map
    if (activeTileLayer.value && tileLayers[activeTileLayer.value]) {
      tileLayers[activeTileLayer.value].remove();
    }
    
    // Add new tile layer to map
    tileLayers[id].addTo(mapInstance);
    
    // Set as active tile layer
    activeTileLayer.value = id;
  };

  const removeTileLayer = (id: string) => {
    if (!mapInstance || !tileLayers[id]) return;
    
    // Remove tile layer from map
    tileLayers[id].remove();
    
    // Remove tile layer from store
    delete tileLayers[id];
    
    // Clear active tile layer if it's the one being removed
    if (activeTileLayer.value === id) {
      activeTileLayer.value = null;
    }
  };

  const removeAllTileLayers = () => {
    Object.keys(tileLayers).forEach(id => {
      removeTileLayer(id);
    });
  };

  // Cleanup function to replace lifecycle hook
  const cleanup = () => {
    // Remove all tile layers
    Object.values(tileLayers).forEach(layer => {
      if (mapInstance) {
        layer.remove();
      }
    });
    
    Object.keys(tileLayers).forEach(id => {
      delete tileLayers[id];
    });
    
    activeTileLayer.value = null;
  };

  return {
    tileLayers,
    activeTileLayer,
    tileLayerProviders,
    createTileLayer,
    createTileLayerFromProvider,
    switchTileLayer,
    removeTileLayer,
    removeAllTileLayers,
    cleanup
  };
}

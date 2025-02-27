import { ref, reactive } from 'vue';
import * as L from 'leaflet';
import type { Map, Marker, LatLngExpression } from 'leaflet';
import type { MarkerOptions, PopupOptions, TooltipOptions, MarkerEvents } from '../types';

export function useMarkers(mapInstance: Map | null) {
  const markers = reactive<Record<string, Marker>>({});
  const selectedMarker = ref<string | null>(null);

  const createMarker = (id: string, options: MarkerOptions) => {
    if (!mapInstance) return null;
    
    // Remove marker if already exists
    if (markers[id]) {
      removeMarker(id);
    }
    
    try {
      // Create marker with basic options first
      const marker = L.marker(options.position, {
        draggable: options.draggable,
        title: options.title
      });
      
      // Set icon if provided
      if (options.icon) {
        try {
          const icon = L.icon(options.icon);
          marker.setIcon(icon);
        } catch (error) {
          console.warn(`Failed to set icon for marker ${id}:`, error);
        }
      }
      
      // Add popup if provided
      if (options.popup) {
        marker.bindPopup(options.popup);
      }
      
      // Add tooltip if provided
      if (options.tooltip) {
        marker.bindTooltip(options.tooltip);
      }
      
      // Add events if provided
      if (options.events) {
        Object.entries(options.events).forEach(([event, handler]) => {
          if (handler) {
            marker.on(event, handler);
          }
        });
      }
      
      // Add click event to select marker
      marker.on('click', () => {
        selectedMarker.value = id;
      });
      
      // Add marker to map
      marker.addTo(mapInstance);
      
      // Store marker
      markers[id] = marker;
      
      return marker;
    } catch (error) {
      console.error(`Error creating marker ${id}:`, error);
      return null;
    }
  };

  const updateMarker = (
    id: string, 
    options: Partial<MarkerOptions>, 
    popupOptions?: PopupOptions, 
    tooltipOptions?: TooltipOptions
  ) => {
    if (!mapInstance || !markers[id]) return null;
    
    const marker = markers[id];
    
    // Update position if provided
    if (options.position) {
      marker.setLatLng(options.position);
    }
    
    // Update icon if provided
    if (options.icon) {
      marker.setIcon(options.icon);
    }
    
    // Update opacity if provided
    if (options.opacity !== undefined) {
      marker.setOpacity(options.opacity);
    }
    
    // Update draggable if provided
    if (options.draggable !== undefined) {
      marker.dragging?.[options.draggable ? 'enable' : 'disable']();
    }
    
    // Update zIndexOffset if provided
    if (options.zIndexOffset !== undefined) {
      marker.setZIndexOffset(options.zIndexOffset);
    }
    
    // Update popup if provided
    if (popupOptions) {
      marker.unbindPopup();
      marker.bindPopup(popupOptions.content || '', {
        maxWidth: popupOptions.maxWidth,
        minWidth: popupOptions.minWidth,
        maxHeight: popupOptions.maxHeight,
        autoPan: popupOptions.autoPan,
        autoPanPaddingTopLeft: popupOptions.autoPanPaddingTopLeft,
        autoPanPaddingBottomRight: popupOptions.autoPanPaddingBottomRight,
        autoPanPadding: popupOptions.autoPanPadding,
        keepInView: popupOptions.keepInView,
        closeButton: popupOptions.closeButton,
        autoClose: popupOptions.autoClose,
        closeOnEscapeKey: popupOptions.closeOnEscapeKey,
        className: popupOptions.className
      });
    }
    
    // Update tooltip if provided
    if (tooltipOptions) {
      marker.unbindTooltip();
      marker.bindTooltip(tooltipOptions.content || '', {
        pane: tooltipOptions.pane,
        offset: tooltipOptions.offset,
        direction: tooltipOptions.direction,
        permanent: tooltipOptions.permanent,
        sticky: tooltipOptions.sticky,
        interactive: tooltipOptions.interactive,
        opacity: tooltipOptions.opacity
      });
    }
    
    return marker;
  };

  const removeMarker = (id: string) => {
    if (!mapInstance || !markers[id]) return;
    
    const marker = markers[id];
    
    // Remove marker from map
    marker.remove();
    
    // Remove marker from store
    delete markers[id];
    
    // Reset selected marker if it was the selected one
    if (selectedMarker.value === id) {
      selectedMarker.value = null;
    }
  };

  const removeAllMarkers = () => {
    if (!mapInstance) return;
    
    // Remove all markers from map
    Object.values(markers).forEach(marker => {
      marker.remove();
    });
    
    // Clear markers store
    Object.keys(markers).forEach(id => {
      delete markers[id];
    });
    
    // Reset selected marker
    selectedMarker.value = null;
  };

  const showMarker = (id: string) => {
    if (!mapInstance || !markers[id]) return;
    
    // Add marker to map if it's not already there
    if (!mapInstance.hasLayer(markers[id])) {
      markers[id].addTo(mapInstance);
    }
  };

  const hideMarker = (id: string) => {
    if (!mapInstance || !markers[id]) return;
    
    // Remove marker from map but keep it in store
    if (mapInstance.hasLayer(markers[id])) {
      mapInstance.removeLayer(markers[id]);
    }
  };

  const openPopup = (id: string) => {
    if (!mapInstance || !markers[id]) return;
    
    markers[id].openPopup();
  };

  const closePopup = (id: string) => {
    if (!mapInstance || !markers[id]) return;
    
    markers[id].closePopup();
  };

  const openTooltip = (id: string) => {
    if (!mapInstance || !markers[id]) return;
    
    markers[id].openTooltip();
  };

  const closeTooltip = (id: string) => {
    if (!mapInstance || !markers[id]) return;
    
    markers[id].closeTooltip();
  };

  const panToMarker = (id: string) => {
    if (!mapInstance || !markers[id]) return;
    
    mapInstance.panTo(markers[id].getLatLng());
  };

  const fitBoundsToMarkers = () => {
    if (!mapInstance || Object.keys(markers).length === 0) return;
    
    const markerLatLngs = Object.values(markers).map(marker => marker.getLatLng());
    const bounds = L.latLngBounds(markerLatLngs);
    
    mapInstance.fitBounds(bounds, {
      padding: [50, 50]
    });
  };

  // Cleanup function to replace lifecycle hook
  const cleanup = () => {
    removeAllMarkers();
  };

  return {
    markers,
    selectedMarker,
    createMarker,
    updateMarker,
    removeMarker,
    removeAllMarkers,
    showMarker,
    hideMarker,
    openPopup,
    closePopup,
    openTooltip,
    closeTooltip,
    panToMarker,
    fitBoundsToMarkers,
    cleanup
  };
}

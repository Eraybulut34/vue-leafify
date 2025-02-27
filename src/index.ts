import VueLeafify from './components/VueLeafify.vue';
import { useMapControls } from './composables/useMapControls';
import { useMarkers } from './composables/useMarkers';
import { useTileLayer } from './composables/useTileLayer';
import type { 
  MapOptions, 
  MarkerOptions, 
  TileLayerOptions, 
  LatLng, 
  MapControlOptions,
  PopupOptions,
  TooltipOptions
} from './types';

export { 
  VueLeafify,
  useMapControls,
  useMarkers,
  useTileLayer
};

export type {
  MapOptions,
  MarkerOptions,
  TileLayerOptions,
  LatLng,
  MapControlOptions,
  PopupOptions,
  TooltipOptions
};

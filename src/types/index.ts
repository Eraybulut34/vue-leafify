import type { LatLngExpression, LatLngBounds, LatLng as LeafletLatLng, Map, Marker, TileLayer, Popup, Tooltip, PointExpression, IconOptions } from 'leaflet';

export interface LatLng {
  lat: number;
  lng: number;
}

export interface MapOptions {
  center: LatLngExpression;
  zoom: number;
  minZoom?: number;
  maxZoom?: number;
  maxBounds?: LatLngBounds;
  zoomControl?: boolean;
  attributionControl?: boolean;
  fullscreenControl?: boolean;
  scaleControl?: boolean;
  dragging?: boolean;
  touchZoom?: boolean;
  doubleClickZoom?: boolean;
  scrollWheelZoom?: boolean;
}

export interface MarkerOptions {
  id: string;
  position: LatLngExpression;
  draggable?: boolean;
  title?: string;
  alt?: string;
  opacity?: number;
  zIndexOffset?: number;
  riseOnHover?: boolean;
  riseOffset?: number;
  pane?: string;
  shadowPane?: string;
  bubblingMouseEvents?: boolean;
  autoPan?: boolean;
  autoPanPadding?: PointExpression;
  autoPanSpeed?: number;
  icon?: IconOptions;
  popup?: string;
  tooltip?: string;
  events?: Record<string, (e: any) => void>;
}

export interface TileLayerOptions {
  url: string;
  attribution?: string;
  minZoom?: number;
  maxZoom?: number;
  subdomains?: string | string[];
  errorTileUrl?: string;
  zoomOffset?: number;
  tms?: boolean;
  zoomReverse?: boolean;
  detectRetina?: boolean;
  crossOrigin?: boolean | string;
  id?: string;
  accessToken?: string;
}

export interface MapControlOptions {
  position?: 'topleft' | 'topright' | 'bottomleft' | 'bottomright';
}

export interface PopupOptions {
  maxWidth?: number;
  minWidth?: number;
  maxHeight?: number;
  autoPan?: boolean;
  autoPanPaddingTopLeft?: [number, number];
  autoPanPaddingBottomRight?: [number, number];
  autoPanPadding?: [number, number];
  keepInView?: boolean;
  closeButton?: boolean;
  autoClose?: boolean;
  closeOnEscapeKey?: boolean;
  className?: string;
  content?: string;
}

export interface TooltipOptions {
  pane?: string;
  offset?: [number, number];
  direction?: 'right' | 'left' | 'top' | 'bottom' | 'center' | 'auto';
  permanent?: boolean;
  sticky?: boolean;
  interactive?: boolean;
  opacity?: number;
  content?: string;
}

export interface MapEvents {
  click?: (e: any) => void;
  dblclick?: (e: any) => void;
  mousedown?: (e: any) => void;
  mouseup?: (e: any) => void;
  mouseover?: (e: any) => void;
  mouseout?: (e: any) => void;
  mousemove?: (e: any) => void;
  contextmenu?: (e: any) => void;
  focus?: (e: any) => void;
  blur?: (e: any) => void;
  preclick?: (e: any) => void;
  load?: (e: any) => void;
  unload?: (e: any) => void;
  viewreset?: (e: any) => void;
  movestart?: (e: any) => void;
  move?: (e: any) => void;
  moveend?: (e: any) => void;
  dragstart?: (e: any) => void;
  drag?: (e: any) => void;
  dragend?: (e: any) => void;
  zoomstart?: (e: any) => void;
  zoom?: (e: any) => void;
  zoomend?: (e: any) => void;
  zoomlevelschange?: (e: any) => void;
  resize?: (e: any) => void;
  autopanstart?: (e: any) => void;
  layeradd?: (e: any) => void;
  layerremove?: (e: any) => void;
  baselayerchange?: (e: any) => void;
  overlayadd?: (e: any) => void;
  overlayremove?: (e: any) => void;
  locationfound?: (e: any) => void;
  locationerror?: (e: any) => void;
  popupopen?: (e: any) => void;
  popupclose?: (e: any) => void;
}

export interface MarkerEvents {
  click?: (e: any) => void;
  dblclick?: (e: any) => void;
  mousedown?: (e: any) => void;
  mouseup?: (e: any) => void;
  mouseover?: (e: any) => void;
  mouseout?: (e: any) => void;
  contextmenu?: (e: any) => void;
  dragstart?: (e: any) => void;
  drag?: (e: any) => void;
  dragend?: (e: any) => void;
  add?: (e: any) => void;
  remove?: (e: any) => void;
  popupopen?: (e: any) => void;
  popupclose?: (e: any) => void;
  tooltipopen?: (e: any) => void;
  tooltipclose?: (e: any) => void;
}

# Vue Leafify

Vue Leafify is a powerful and flexible component that allows you to easily use the Leaflet map library in Vue 3 applications. It is developed with full type safety using Composition API and TypeScript.

## Features

- Easy integration of Leaflet maps in Vue 3 applications
- Responsive design
- Add, update, and delete markers
- Custom tile layers support
- Popup and tooltip support
- Fullscreen mode
- Customizable controls (zoom, scale, etc.)
- Full type support with TypeScript
- Modular usage with Composable API

## Installation

```bash
npm install vue-leafify
```

## Basic Usage

```vue
<template>
  <VueLeafify 
    :options="{ center: [41.0082, 28.9784], zoom: 13 }"
    height="500px"
  />
</template>

<script setup lang="ts">
import { VueLeafify } from 'vue-leafify'
</script>
```

## Features

### Adding Markers

You can use the `markers` prop to add markers to the map:

```vue
<template>
  <VueLeafify 
    :options="{ center: [41.0082, 28.9784], zoom: 13 }"
    :markers="markers"
    @marker-click="handleMarkerClick"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { VueLeafify } from 'vue-leafify'
import type { MarkerOptions } from 'vue-leafify'

const markers = ref([
  {
    id: 'marker1',
    position: [41.0082, 28.9784],
    title: 'Istanbul',
    draggable: true
  },
  {
    id: 'marker2',
    position: [41.0422, 29.0083],
    title: 'Kadıköy',
    draggable: false
  }
])

const handleMarkerClick = (markerId: string) => {
  console.log(`Marker clicked: ${markerId}`)
}
</script>
```

### Different Map Layers

You can switch between different tile layers:

```vue
<template>
  <VueLeafify 
    :options="{ center: [41.0082, 28.9784], zoom: 13 }"
    :tile-layer-provider="currentProvider"
  />
  
  <div class="controls">
    <button @click="currentProvider = 'osm'">OpenStreetMap</button>
    <button @click="currentProvider = 'esriWorldImagery'">Satellite</button>
    <button @click="currentProvider = 'openTopoMap'">Topographic</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { VueLeafify } from 'vue-leafify'

const currentProvider = ref('osm')
</script>
```

### Interactive Map

You can add markers by clicking on the map:

```vue
<template>
  <VueLeafify 
    ref="mapRef"
    :options="{ center: [41.0082, 28.9784], zoom: 13 }"
    :markers="markers"
    @map-click="handleMapClick"
  />
  
  <div class="controls">
    <button @click="clearMarkers">Clear All Markers</button>
    <button @click="fitBoundsToMarkers">Fit to Markers</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { VueLeafify } from 'vue-leafify'
import type { MarkerOptions } from 'vue-leafify'

const mapRef = ref<InstanceType<typeof VueLeafify> | null>(null)
const markers = ref<(MarkerOptions & { id: string })[]>([])
let markerCounter = 0

const handleMapClick = (e: any) => {
  const id = `marker-${++markerCounter}`
  markers.value.push({
    id,
    position: [e.latlng.lat, e.latlng.lng],
    title: `Marker ${markerCounter}`,
    draggable: true
  })
}

const clearMarkers = () => {
  markers.value = []
}

const fitBoundsToMarkers = () => {
  if (mapRef.value && markers.value.length > 0) {
    mapRef.value.fitBoundsToMarkers()
  }
}
</script>
```

### Map Controls

You can customize map controls:

```vue
<template>
  <VueLeafify 
    :options="{ center: [41.0082, 28.9784], zoom: 13 }"
    :zoom-control="controls.zoom"
    :scale-control="controls.scale"
    :attribution-control="controls.attribution"
    :fullscreen-control="controls.fullscreen"
  />
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { VueLeafify } from 'vue-leafify'

const controls = reactive({
  zoom: true,
  scale: true,
  attribution: true,
  fullscreen: true
})
</script>
```

## Composable API

Vue Leafify provides composables to make map operations more modular:

### useMapControls

```typescript
import { ref } from 'vue'
import { VueLeafify, useMapControls } from 'vue-leafify'

const mapRef = ref<InstanceType<typeof VueLeafify> | null>(null)

// After the map instance is created
const { 
  addZoomControl, 
  removeZoomControl, 
  addScaleControl, 
  removeScaleControl,
  addFullscreenControl,
  toggleFullscreen,
  isFullscreen
} = useMapControls(mapRef.value?.getMap())
```

### useMarkers

```typescript
import { ref } from 'vue'
import { VueLeafify, useMarkers } from 'vue-leafify'

const mapRef = ref<InstanceType<typeof VueLeafify> | null>(null)

// After the map instance is created
const {
  markers,
  selectedMarker,
  createMarker,
  updateMarker,
  removeMarker,
  removeAllMarkers,
  openPopup,
  panToMarker,
  fitBoundsToMarkers
} = useMarkers(mapRef.value?.getMap())
```

### useTileLayer

```typescript
import { ref } from 'vue'
import { VueLeafify, useTileLayer } from 'vue-leafify'

const mapRef = ref<InstanceType<typeof VueLeafify> | null>(null)

// After the map instance is created
const {
  tileLayers,
  activeTileLayer,
  tileLayerProviders,
  createTileLayer,
  createTileLayerFromProvider,
  switchTileLayer
} = useTileLayer(mapRef.value?.getMap())
```

## API Reference

### Props

| Prop | Type | Default | Description |
|------|-----|------------|----------|
| options | MapOptions | { center: [51.505, -0.09], zoom: 13 } | Map configuration options |
| markers | Array<MarkerOptions & { id: string }> | [] | Markers to display on the map |
| tileLayer | TileLayerOptions | undefined | Custom tile layer configuration |
| tileLayerProvider | string | 'osm' | Predefined tile layer provider |
| height | string | '500px' | Map height |
| width | string | '100%' | Map width |
| zoomControl | boolean | true | Show/hide zoom control |
| scaleControl | boolean | true | Show/hide scale control |
| attributionControl | boolean | true | Show/hide attribution control |
| fullscreenControl | boolean | true | Show/hide fullscreen control |
| loading | boolean | false | Map loading state |

### Events

| Event | Parameters | Description |
|-------|-------------|----------|
| update:center | center: LatLng | Triggered when the map center changes |
| update:zoom | zoom: number | Triggered when the map zoom level changes |
| map-ready | map: L.Map | Triggered when the map is ready |
| map-click | event: L.LeafletMouseEvent | Triggered when the map is clicked |
| marker-click | markerId: string, event: L.LeafletMouseEvent | Triggered when a marker is clicked |
| marker-drag | markerId: string, event: L.LeafletEvent | Triggered when a marker is dragged |
| marker-dragend | markerId: string, event: L.LeafletEvent | Triggered when a marker drag operation ends |

### Exposed Methods

| Method | Parameters | Return Value | Description |
|--------|-------------|--------------|----------|
| getMap | - | L.Map | Returns the Leaflet map instance |
| getCenter | - | L.LatLng | Returns the map center |
| getZoom | - | number | Returns the map zoom level |
| setView | center: L.LatLngExpression, zoom?: number | - | Sets the map view |
| flyTo | center: L.LatLngExpression, zoom?: number, options?: L.ZoomPanOptions | - | Moves the map to the specified location with animation |
| invalidateSize | - | - | Recalculates the map size |
| createMarker | id: string, options: MarkerOptions, popupOptions?: PopupOptions, tooltipOptions?: TooltipOptions | L.Marker | Creates a new marker |
| updateMarker | id: string, options: Partial<MarkerOptions>, popupOptions?: PopupOptions, tooltipOptions?: TooltipOptions | L.Marker | Updates an existing marker |
| removeMarker | id: string | - | Removes a marker |
| removeAllMarkers | - | - | Removes all markers |
| panToMarker | id: string | - | Moves the map to the specified marker |
| fitBoundsToMarkers | - | - | Adjusts the map to show all markers |
| createTileLayer | id: string, options: TileLayerOptions | L.TileLayer | Creates a new tile layer |
| createTileLayerFromProvider | id: string, provider: string | L.TileLayer | Creates a tile layer from a predefined provider |
| switchTileLayer | id: string | - | Switches to the specified tile layer |

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build the library
npm run build:lib
```

## License

MIT

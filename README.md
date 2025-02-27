# Vue Leafify

Vue Leafify, Vue 3 uygulamaları için Leaflet harita kütüphanesini kolayca kullanmanızı sağlayan güçlü ve esnek bir bileşendir. Composition API ve TypeScript ile tamamen tip güvenli olarak geliştirilmiştir.

## Özellikler

- Leaflet haritalarını Vue 3 uygulamalarında kolayca kullanma
- Duyarlı (responsive) tasarım
- Marker ekleme, güncelleme ve silme
- Özel harita katmanları (tile layers) desteği
- Popup ve tooltip desteği
- Tam ekran modu
- Özelleştirilebilir kontroller (zoom, ölçek, vb.)
- TypeScript ile tam tip desteği
- Composable API ile modüler kullanım

## Kurulum

```bash
npm install vue-leafify
```

## Temel Kullanım

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

## Özellikler

### Marker Ekleme

Haritaya marker eklemek için `markers` prop'unu kullanabilirsiniz:

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

### Farklı Harita Katmanları

Farklı harita katmanları (tile layers) arasında geçiş yapabilirsiniz:

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

### Etkileşimli Harita

Haritaya tıklayarak marker ekleyebilirsiniz:

```vue
<template>
  <VueLeafify 
    ref="mapRef"
    :options="{ center: [41.0082, 28.9784], zoom: 13 }"
    :markers="markers"
    @map-click="handleMapClick"
  />
  
  <div class="controls">
    <button @click="clearMarkers">Tüm Markerları Temizle</button>
    <button @click="fitBoundsToMarkers">Markerları Sığdır</button>
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

### Harita Kontrolleri

Harita kontrollerini özelleştirebilirsiniz:

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

Vue Leafify, harita işlemlerini daha modüler hale getirmek için composable'lar sağlar:

### useMapControls

```typescript
import { ref } from 'vue'
import { VueLeafify, useMapControls } from 'vue-leafify'

const mapRef = ref<InstanceType<typeof VueLeafify> | null>(null)

// Map instance'ı oluşturulduktan sonra
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

// Map instance'ı oluşturulduktan sonra
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

// Map instance'ı oluşturulduktan sonra
const {
  tileLayers,
  activeTileLayer,
  tileLayerProviders,
  createTileLayer,
  createTileLayerFromProvider,
  switchTileLayer
} = useTileLayer(mapRef.value?.getMap())
```

## API Referansı

### Props

| Prop | Tip | Varsayılan | Açıklama |
|------|-----|------------|----------|
| options | MapOptions | { center: [51.505, -0.09], zoom: 13 } | Harita yapılandırma seçenekleri |
| markers | Array<MarkerOptions & { id: string }> | [] | Haritada gösterilecek marker'lar |
| tileLayer | TileLayerOptions | undefined | Özel harita katmanı yapılandırması |
| tileLayerProvider | string | 'osm' | Önceden tanımlanmış harita katmanı sağlayıcısı |
| height | string | '500px' | Harita yüksekliği |
| width | string | '100%' | Harita genişliği |
| zoomControl | boolean | true | Zoom kontrolünü göster/gizle |
| scaleControl | boolean | true | Ölçek kontrolünü göster/gizle |
| attributionControl | boolean | true | Atıf kontrolünü göster/gizle |
| fullscreenControl | boolean | true | Tam ekran kontrolünü göster/gizle |
| loading | boolean | false | Harita yükleniyor durumu |

### Events

| Event | Parametreler | Açıklama |
|-------|-------------|----------|
| update:center | center: LatLng | Harita merkezi değiştiğinde tetiklenir |
| update:zoom | zoom: number | Harita zoom seviyesi değiştiğinde tetiklenir |
| map-ready | map: L.Map | Harita hazır olduğunda tetiklenir |
| map-click | event: L.LeafletMouseEvent | Haritaya tıklandığında tetiklenir |
| marker-click | markerId: string, event: L.LeafletMouseEvent | Bir marker'a tıklandığında tetiklenir |
| marker-drag | markerId: string, event: L.LeafletEvent | Bir marker sürüklendiğinde tetiklenir |
| marker-dragend | markerId: string, event: L.LeafletEvent | Bir marker sürükleme işlemi bittiğinde tetiklenir |

### Exposed Methods

| Method | Parametreler | Dönüş Değeri | Açıklama |
|--------|-------------|--------------|----------|
| getMap | - | L.Map | Leaflet harita instance'ını döndürür |
| getCenter | - | L.LatLng | Harita merkezini döndürür |
| getZoom | - | number | Harita zoom seviyesini döndürür |
| setView | center: L.LatLngExpression, zoom?: number | - | Harita görünümünü ayarlar |
| flyTo | center: L.LatLngExpression, zoom?: number, options?: L.ZoomPanOptions | - | Haritayı animasyonlu şekilde belirtilen konuma taşır |
| invalidateSize | - | - | Harita boyutunu yeniden hesaplar |
| createMarker | id: string, options: MarkerOptions, popupOptions?: PopupOptions, tooltipOptions?: TooltipOptions | L.Marker | Yeni bir marker oluşturur |
| updateMarker | id: string, options: Partial<MarkerOptions>, popupOptions?: PopupOptions, tooltipOptions?: TooltipOptions | L.Marker | Var olan bir marker'ı günceller |
| removeMarker | id: string | - | Bir marker'ı kaldırır |
| removeAllMarkers | - | - | Tüm marker'ları kaldırır |
| panToMarker | id: string | - | Haritayı belirtilen marker'a taşır |
| fitBoundsToMarkers | - | - | Haritayı tüm marker'ları gösterecek şekilde ayarlar |
| createTileLayer | id: string, options: TileLayerOptions | L.TileLayer | Yeni bir harita katmanı oluşturur |
| createTileLayerFromProvider | id: string, provider: string | L.TileLayer | Önceden tanımlanmış bir sağlayıcıdan harita katmanı oluşturur |
| switchTileLayer | id: string | - | Belirtilen harita katmanına geçiş yapar |

## Geliştirme

```bash
# Bağımlılıkları yükle
npm install

# Geliştirme sunucusunu başlat
npm run dev

# Kütüphaneyi derle
npm run build:lib
```

## Lisans

MIT

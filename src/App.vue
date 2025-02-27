<template>
  <div class="app">
    <header class="header">
      <h1>Vue Leafify</h1>
      <p class="subtitle">Powerful and flexible Leaflet maps for Vue 3</p>
      <div class="badges">
        <img src="https://img.shields.io/badge/vue-3.x-brightgreen" alt="vue version" />
        <img src="https://img.shields.io/badge/leaflet-1.9.4-blue" alt="leaflet version" />
        <img src="https://img.shields.io/badge/license-MIT-green" alt="license" />
      </div>
    </header>

    <main>
      <!-- Basic Usage -->
      <section class="demo-section">
        <h2>Basic Usage</h2>
        <p>Simple map with default OpenStreetMap layer</p>
        <div class="map-container">
          <VueLeafify 
            :options="{ center: [41.0082, 28.9784], zoom: 13, dragging: true, touchZoom: true, scrollWheelZoom: true }"
            height="400px"
          />
        </div>
        <div class="code-example">
          <pre><code>{{ basicUsageCode }}</code></pre>
        </div>
      </section>

      <!-- Custom Markers -->
      <section class="demo-section">
        <h2>Custom Markers</h2>
        <p>Map with multiple markers and popups</p>
        <div class="map-container">
          <VueLeafify 
            :options="{ center: [41.0082, 28.9784], zoom: 12, dragging: true, touchZoom: true, scrollWheelZoom: true }"
            :markers="customMarkers"
            height="400px"
            @marker-click="handleMarkerClick"
          />
        </div>
        <div class="control-panel">
          <p v-if="selectedMarkerId">Selected marker: {{ selectedMarkerId }}</p>
        </div>
        <div class="code-example">
          <pre><code>{{ customMarkersCode }}</code></pre>
        </div>
      </section>

      <!-- Different Tile Layers -->
      <section class="demo-section">
        <h2>Different Tile Layers</h2>
        <p>Switch between different map styles</p>
        <div class="map-container">
          <VueLeafify 
            ref="tileLayerMap"
            :options="{ center: [41.0082, 28.9784], zoom: 12, dragging: true, touchZoom: true, scrollWheelZoom: true }"
            :tile-layer-provider="currentTileProvider"
            height="400px"
          />
        </div>
        <div class="control-panel">
          <button 
            v-for="(provider, index) in tileProviders" 
            :key="index"
            @click="currentTileProvider = provider.value"
            :class="{ active: currentTileProvider === provider.value }"
          >
            {{ provider.label }}
          </button>
        </div>
        <div class="code-example">
          <pre><code>{{ tileLayersCode }}</code></pre>
        </div>
      </section>

      <!-- Interactive Map -->
      <section class="demo-section">
        <h2>Interactive Map</h2>
        <p>Add markers by clicking on the map</p>
        <div class="map-container">
          <VueLeafify 
            ref="interactiveMap"
            :options="{ center: [41.0082, 28.9784], zoom: 12, dragging: true, touchZoom: true, scrollWheelZoom: true }"
            :markers="interactiveMarkers"
            height="400px"
            @map-click="handleMapClick"
          />
        </div>
        <div class="control-panel">
          <button @click="clearInteractiveMarkers">Clear All Markers</button>
          <button @click="fitBoundsToInteractiveMarkers" :disabled="interactiveMarkers.length === 0">Fit to Markers</button>
        </div>
        <div class="code-example">
          <pre><code>{{ interactiveMapCode }}</code></pre>
        </div>
      </section>

      <!-- Map Controls -->
      <section class="demo-section">
        <h2>Map Controls</h2>
        <p>Toggle different map controls</p>
        <div class="map-container">
          <VueLeafify 
            :options="{ center: [41.0082, 28.9784], zoom: 12, dragging: true, touchZoom: true, scrollWheelZoom: true }"
            :zoom-control="controls.zoom"
            :scale-control="controls.scale"
            :attribution-control="controls.attribution"
            :fullscreen-control="controls.fullscreen"
            height="400px"
          />
        </div>
        <div class="control-panel">
          <label>
            <input type="checkbox" v-model="controls.zoom"> Zoom Control
          </label>
          <label>
            <input type="checkbox" v-model="controls.scale"> Scale Control
          </label>
          <label>
            <input type="checkbox" v-model="controls.attribution"> Attribution Control
          </label>
          <label>
            <input type="checkbox" v-model="controls.fullscreen"> Fullscreen Control
          </label>
        </div>
        <div class="code-example">
          <pre><code>{{ controlsCode }}</code></pre>
        </div>
      </section>

      <!-- All Features Combined -->
      <section class="demo-section">
        <h2>All Features Combined</h2>
        <p>Experience all features working together seamlessly</p>
        <div class="map-container">
          <VueLeafify 
            ref="allFeaturesMap"
            :options="{ center: [41.0082, 28.9784], zoom: 11, dragging: true, touchZoom: true, scrollWheelZoom: true }"
            :markers="allFeaturesMarkers"
            :tile-layer-provider="currentTileProvider"
            height="500px"
            @map-click="handleAllFeaturesMapClick"
            @marker-click="handleAllFeaturesMarkerClick"
          />
        </div>
        <div class="control-panel">
          <button 
            v-for="(provider, index) in tileProviders" 
            :key="index"
            @click="currentTileProvider = provider.value"
            :class="{ active: currentTileProvider === provider.value }"
          >
            {{ provider.label }}
          </button>
          <button @click="clearAllFeaturesMarkers">Clear Markers</button>
          <button @click="fitBoundsToAllFeaturesMarkers" :disabled="allFeaturesMarkers.length === 0">Fit to Markers</button>
          <button @click="toggleFullscreen">Toggle Fullscreen</button>
        </div>
      </section>
    </main>

    <footer>
      <p>Vue Leafify - Created by Abdullah Eray Bulut</p>
      <p>
        <a href="https://github.com/abdullaheraybulut/vue-leafify" target="_blank">GitHub</a> | 
        <a href="https://www.npmjs.com/package/vue-leafify" target="_blank">npm</a>
      </p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import VueLeafify from './components/VueLeafify.vue';
import 'leaflet/dist/leaflet.css';
import type { MarkerOptions } from './types';

// Basic Usage
const basicUsageCode = `<template>
  <VueLeafify 
    :options="{ center: [41.0082, 28.9784], zoom: 13, dragging: true, touchZoom: true, scrollWheelZoom: true }"
    height="400px"
  />
</template>

<script setup>
import { VueLeafify } from 'vue-leafify';
<\/script>`;

// Custom Markers
const selectedMarkerId = ref<string | null>(null);

const customMarkers = [
  {
    id: 'marker1',
    position: [41.0082, 28.9784],
    title: 'Istanbul',
    draggable: true,
    popup: 'Welcome to Istanbul!',
    icon: {
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      shadowSize: [41, 41]
    }
  },
  {
    id: 'marker2',
    position: [41.0422, 29.0083],
    title: 'Kadıköy',
    draggable: false,
    popup: 'This is Kadıköy',
    icon: {
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      shadowSize: [41, 41]
    }
  },
  {
    id: 'marker3',
    position: [41.0451, 28.9885],
    title: 'Beyoğlu',
    draggable: false,
    popup: 'This is Beyoğlu',
    icon: {
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      shadowSize: [41, 41]
    }
  }
];

const handleMarkerClick = (markerId: string) => {
  selectedMarkerId.value = markerId;
};

const customMarkersCode = `<template>
  <VueLeafify 
    :options="{ center: [41.0082, 28.9784], zoom: 12, dragging: true, touchZoom: true, scrollWheelZoom: true }"
    :markers="markers"
    height="400px"
    @marker-click="handleMarkerClick"
  />
</template>

<script setup>
import { ref } from 'vue';
import { VueLeafify } from 'vue-leafify';

const selectedMarkerId = ref(null);

const markers = [
  {
    id: 'marker1',
    position: [41.0082, 28.9784],
    title: 'Istanbul',
    draggable: true,
    popup: 'Welcome to Istanbul!',
    icon: {
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      shadowSize: [41, 41]
    }
  },
  {
    id: 'marker2',
    position: [41.0422, 29.0083],
    title: 'Kadıköy',
    draggable: false,
    popup: 'This is Kadıköy',
    icon: {
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      shadowSize: [41, 41]
    }
  },
  {
    id: 'marker3',
    position: [41.0451, 28.9885],
    title: 'Beyoğlu',
    draggable: false,
    popup: 'This is Beyoğlu',
    icon: {
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      shadowSize: [41, 41]
    }
  }
];

const handleMarkerClick = (markerId) => {
  selectedMarkerId.value = markerId;
};
<\/script>`;

// Different Tile Layers
const tileLayerMap = ref<InstanceType<typeof VueLeafify> | null>(null);
const currentTileProvider = ref('osm');

const tileProviders = [
  { label: 'OpenStreetMap', value: 'osm' },
  { label: 'CartoDB', value: 'cartoDB' },
  { label: 'Satellite', value: 'esriWorldImagery' },
  { label: 'Topographic', value: 'openTopoMap' },
  { label: 'Terrain', value: 'stamenTerrain' }
];

const tileLayersCode = `<template>
  <VueLeafify 
    ref="mapRef"
    :options="{ center: [41.0082, 28.9784], zoom: 12, dragging: true, touchZoom: true, scrollWheelZoom: true }"
    :tile-layer-provider="currentTileProvider"
    height="400px"
  />
  
  <div class="controls">
    <button 
      v-for="provider in tileProviders" 
      :key="provider.value"
      @click="currentTileProvider = provider.value"
    >
      {{ provider.label }}
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { VueLeafify } from 'vue-leafify';

const mapRef = ref(null);
const currentTileProvider = ref('osm');

const tileProviders = [
  { label: 'OpenStreetMap', value: 'osm' },
  { label: 'CartoDB', value: 'cartoDB' },
  { label: 'Satellite', value: 'esriWorldImagery' },
  { label: 'Topographic', value: 'openTopoMap' },
  { label: 'Terrain', value: 'stamenTerrain' }
];
<\/script>`;

// Interactive Map
const interactiveMap = ref<InstanceType<typeof VueLeafify> | null>(null);
const interactiveMarkers = ref<(MarkerOptions & { id: string })[]>([]);
let markerCounter = 0;

const handleMapClick = (e: any) => {
  const id = `marker-${++markerCounter}`;
  interactiveMarkers.value.push({
    id,
    position: [e.latlng.lat, e.latlng.lng],
    title: `Marker ${markerCounter}`,
    draggable: true
  });
};

const clearInteractiveMarkers = () => {
  interactiveMarkers.value = [];
};

const fitBoundsToInteractiveMarkers = () => {
  if (interactiveMap.value && interactiveMarkers.value.length > 0) {
    interactiveMap.value.fitBoundsToMarkers();
  }
};

const interactiveMapCode = `<template>
  <VueLeafify 
    ref="mapRef"
    :options="{ center: [41.0082, 28.9784], zoom: 12, dragging: true, touchZoom: true, scrollWheelZoom: true }"
    :markers="markers"
    height="400px"
    @map-click="handleMapClick"
  />
  
  <div class="controls">
    <button @click="clearMarkers">Clear All Markers</button>
    <button @click="fitBoundsToMarkers" :disabled="markers.length === 0">
      Fit to Markers
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { VueLeafify } from 'vue-leafify';

const mapRef = ref(null);
const markers = ref([]);
let markerCounter = 0;

const handleMapClick = (e) => {
  const id = \`marker-\${++markerCounter}\`;
  markers.value.push({
    id,
    position: [e.latlng.lat, e.latlng.lng],
    title: \`Marker \${markerCounter}\`,
    draggable: true
  });
};

const clearMarkers = () => {
  markers.value = [];
};

const fitBoundsToMarkers = () => {
  if (mapRef.value && markers.value.length > 0) {
    mapRef.value.fitBoundsToMarkers();
  }
};
<\/script>`;

// Map Controls
const controls = reactive({
  zoom: true,
  scale: true,
  attribution: true,
  fullscreen: true
});

const controlsCode = `<template>
  <VueLeafify 
    :options="{ center: [41.0082, 28.9784], zoom: 12, dragging: true, touchZoom: true, scrollWheelZoom: true }"
    :zoom-control="controls.zoom"
    :scale-control="controls.scale"
    :attribution-control="controls.attribution"
    :fullscreen-control="controls.fullscreen"
    height="400px"
  />
  
  <div class="controls">
    <label>
      <input type="checkbox" v-model="controls.zoom"> Zoom Control
    </label>
    <label>
      <input type="checkbox" v-model="controls.scale"> Scale Control
    </label>
    <label>
      <input type="checkbox" v-model="controls.attribution"> Attribution
    </label>
    <label>
      <input type="checkbox" v-model="controls.fullscreen"> Fullscreen
    </label>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import { VueLeafify } from 'vue-leafify';

const controls = reactive({
  zoom: true,
  scale: true,
  attribution: true,
  fullscreen: true
});
<\/script>`;

// All Features Combined
const allFeaturesMap = ref<any>(null);
const allFeaturesMarkers = [
  {
    id: 'all-marker1',
    position: [41.0082, 28.9784],
    title: 'Istanbul',
    draggable: true,
    popup: 'Welcome to Istanbul!',
    icon: {
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      shadowSize: [41, 41]
    }
  },
  {
    id: 'all-marker2',
    position: [41.0422, 29.0083],
    title: 'Kadıköy',
    draggable: true,
    popup: 'This is Kadıköy',
    icon: {
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      shadowSize: [41, 41]
    }
  }
];

const handleAllFeaturesMapClick = (e: any) => {
  const id = `marker-${++allFeaturesMarkerCounter}`;
  allFeaturesMarkers.push({
    id,
    position: [e.latlng.lat, e.latlng.lng],
    title: `Location ${allFeaturesMarkerCounter}`,
    draggable: true
  });
};

const handleAllFeaturesMarkerClick = (markerId: string) => {
  console.log(`Marker clicked: ${markerId}`);
};

const clearAllFeaturesMarkers = () => {
  allFeaturesMarkers.length = 0;
};

const fitBoundsToAllFeaturesMarkers = () => {
  if (allFeaturesMap.value && allFeaturesMarkers.length > 0) {
    allFeaturesMap.value.fitBoundsToMarkers();
  }
};

const toggleFullscreen = () => {
  if (allFeaturesMap.value) {
    const mapInstance = allFeaturesMap.value.getMap();
    if (mapInstance) {
      const container = mapInstance.getContainer();
      
      if (!document.fullscreenElement) {
        container.requestFullscreen().catch(err => {
          console.error(`Error attempting to enable fullscreen: ${err.message}`);
        });
      } else {
        document.exitFullscreen();
      }
    }
  }
};

let allFeaturesMarkerCounter = 1;

onMounted(() => {
  // Initialize any additional functionality if needed
});
</script>

<style>
.app {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.header {
  text-align: center;
  margin-bottom: 40px;
}

.header h1 {
  color: #4CAF50;
  font-size: 2.5rem;
  margin-bottom: 10px;
}

.subtitle {
  color: #666;
  font-size: 1.2rem;
  margin-bottom: 20px;
}

.badges {
  display: flex;
  gap: 10px;
  justify-content: center;
}

.demo-section {
  margin-bottom: 60px;
  background-color: #f9f9f9;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.demo-section h2 {
  color: #333;
  margin-top: 0;
  margin-bottom: 10px;
}

.demo-section p {
  color: #666;
  margin-bottom: 20px;
}

.map-container {
  margin-bottom: 20px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.control-panel {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
}

.control-panel button {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
}

.control-panel button:hover {
  background-color: #45a049;
}

.control-panel button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.control-panel button.active {
  background-color: #2E7D32;
}

.control-panel label {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-right: 15px;
  cursor: pointer;
}

.code-example {
  background-color: #f5f5f5;
  padding: 15px;
  border-radius: 4px;
  overflow-x: auto;
  margin-top: 20px;
}

.code-example pre {
  margin: 0;
  font-family: monospace;
  font-size: 14px;
}

.code-example code {
  color: #333;
}

footer {
  text-align: center;
  margin-top: 60px;
  padding: 20px;
  color: #666;
  border-top: 1px solid #eee;
}

footer a {
  color: #4CAF50;
  text-decoration: none;
}

footer a:hover {
  text-decoration: underline;
}
</style>

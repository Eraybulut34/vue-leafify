import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import dts from 'vite-plugin-dts'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const isLibrary = mode === 'library'

  return {
    plugins: [
      vue(),
      dts({
        insertTypesEntry: true,
        include: ['src/components/**/*.vue', 'src/types/**/*.ts', 'src/composables/**/*.ts']
      })
    ],
    build: isLibrary ? {
      lib: {
        entry: resolve(__dirname, 'src/index.ts'),
        name: 'VueLeafify',
        fileName: (format) => `vue-leafify.${format}.js`
      },
      rollupOptions: {
        external: ['vue', 'leaflet'],
        output: {
          globals: {
            vue: 'Vue',
            leaflet: 'L'
          },
          assetFileNames: (assetInfo) => {
            if (assetInfo.name === 'style.css') return 'style.css';
            return assetInfo.name;
          }
        }
      }
    } : {}
  }
})

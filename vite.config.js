import { defineConfig } from 'vite'
import glslify from 'rollup-plugin-glslify'
import * as path from 'path'

export default defineConfig({
  root: '',
  base: '/webgl-distortion-bulge-effect/', // for Github pages, otherwise use './'
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        demo1: './index.html',
        demo2: './index2.html',
      },
    },
  },
  server: {
    host: true, // to test on other devices with IP address
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  plugins: [glslify()],
})

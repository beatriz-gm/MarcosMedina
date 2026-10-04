import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    // The lazily loaded 3D chunk (three + @react-three/fiber) is expected to be large.
    chunkSizeWarningLimit: 1000,
  },
  ssr: {
    // GSAP plugins ship as browser modules; bundle them for the prerender step.
    noExternal: ['gsap'],
  },
})

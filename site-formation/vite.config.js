import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Écouter sur toutes les interfaces réseau
    port: 5173,
    strictPort: false, // Permettre d'utiliser un autre port si 5173 est occupé
  },
})

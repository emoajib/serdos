import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Vetted by AI - Manual Review Required by Senior Engineer/Manager
export default defineConfig({
  plugins: [react()],
   server: {
     port: 3000,          // Dev server on 3000; Laravel serves the built app on 1111
     host: '127.0.0.1',
     proxy: {
       '/api': {
         target: 'http://127.0.0.1:1111',  // Forward API calls to Laravel
         changeOrigin: true,
         secure: false,
       },
       '/ai': {
         target: 'http://127.0.0.1:5000',  // Forward AI Engine calls
         changeOrigin: true,
         secure: false,
       },
     },
   },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
})


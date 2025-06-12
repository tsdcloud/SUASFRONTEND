import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    https: {
      key: fs.readFileSync(path.resolve(__dirname, 'cert', 'cert.key')),
      cert: fs.readFileSync(path.resolve(__dirname, 'cert', 'cert.crt')),
    },
    port: 5050, // You can choose your desired port
    // host: '192.168.56.1',
    // proxy: {
    //   '/api': {
    //     target: 'https://77.37.122.205:5000',
    //     changeOrigin: true,
    //   },
    // },
  },
})

import { readFileSync } from 'fs'
import path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  root: './app/',
  plugins: [vue()],
  server: {
    port: 8443,
    https: {
      key: readFileSync('./.cert/key.pem'),
      cert: readFileSync('./.cert/cert.pem'),
      passphrase: 'localhost'
    },
    host: true
  },
  preview: {
    port: 8443,
    https: {
      key: readFileSync('./.cert/key.pem'),
      cert: readFileSync('./.cert/cert.pem'),
      passphrase: 'localhost'
    },
    host: true
  },
  build: {
    outDir: './../app-dist',
    emptyOutDir: true
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  publicDir: './static'
})
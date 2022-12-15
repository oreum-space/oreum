import { readFileSync } from 'fs'
import path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import eslint from 'vite-plugin-eslint'

const host = true // 'local.oreum.space'

module.exports = defineConfig({
  root: './app/',
  plugins: [vue(), void eslint()],
  define: {
    __VUE_OPTIONS_API__: false
  },
  server: {
    port: 8443,
    https: {
      key: readFileSync('./.cert/key.pem'),
      cert: readFileSync('./.cert/cert.pem'),
      passphrase: 'localhost'
    },
    host: host
  },
  preview: {
    port: 8443,
    https: {
      key: readFileSync('./.cert/key.pem'),
      cert: readFileSync('./.cert/cert.pem'),
      passphrase: 'localhost'
    },
    host: host
  },
  build: {
    outDir: './../app-dist',
    cssCodeSplit: false,
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  publicDir: './static'
})
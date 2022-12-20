import type { Ref } from 'vue'

declare global {
  const __VITE_BUILD_TIMESTAMP__: string
  type RefAny = Ref['value']
}

/// <reference types="vite/client" />
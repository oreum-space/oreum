<template>
  <footer
    v-show="$route.name && $route.meta.footer !== false"
    id="app-footer"
    class="app-footer"
  >
    <ul>
      <li v-once>
        Build timestamp: {{ buildTimestamp }}
      </li>
      <li>
        {{ windowHeight }} x {{ windowWidth }}
      </li>
    </ul>
  </footer>
</template>

<script
  setup
  lang="ts"
>
import { inject, onMounted, Ref } from 'vue'

const buildTimestamp = new Date(__VITE_BUILD_TIMESTAMP__).toLocaleString()
const emits = defineEmits<{
  (e: 'mounted'): void
}>()
onMounted(() => emits('mounted'))
const windowHeight = inject('windowHeight') as Ref<number>
const windowWidth = inject('windowWidth') as Ref<number>

</script>

<style lang="scss">
.app-footer {
  width: 100%;
  --background-color: var(--surface-card);
  background-color: var(--background-color);
  height: var(--app-footer-min-height);
}
</style>
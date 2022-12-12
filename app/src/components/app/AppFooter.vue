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

const buildTimestamp =
  new Date(document.head.querySelector<HTMLMetaElement>('[name="build-timestamp"]')!.content).toLocaleString()
const emits = defineEmits<{
  (e: 'mounted'): void
}>()
onMounted(() => emits('mounted'))
const windowHeight = inject<Ref<number>>('windowHeight')!
const windowWidth = inject<Ref<number>>('windowWidth')!

</script>

<style lang="scss">
.app-footer {
  width: 100%;
  --background-color: var(--surface-card);
  background-color: var(--background-color);
  height: var(--app-footer-min-height);
}
</style>
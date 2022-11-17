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
    </ul>
  </footer>
</template>

<script
  setup
  lang="ts"
>
const buildTimestamp =
  new Date(document.head.querySelector<HTMLMetaElement>('[name="build-timestamp"]')!.content).toLocaleString()
</script>

<style lang="scss">
.app-footer {
  width: 100%;
  --background-color: var(--surface-card);
  background-color: var(--background-color);
  height: var(--app-footer-min-height);
}
</style>
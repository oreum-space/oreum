<template>
  <footer
    v-show="$route.name && $route.meta.footer !== false"
    id="app-footer"
    class="app-footer"
  >
    footer
  </footer>
</template>

<script
  setup
  lang="ts"
>

</script>

<style lang="scss">
.app-footer {
  width: 100%;
  --background-color: var(--surface-card);
  background-color: var(--background-color);
  height: var(--app-footer-min-height);
}
</style>
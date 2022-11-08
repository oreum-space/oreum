<template>
  <router-view
    v-if="$route.meta.main"
    class="app-main"
  />
  <main
    v-else
    class="app-main"
  >
    <router-view />
  </main>
</template>

<script
  setup
  lang="ts"
>

</script>

<style
  lang="scss"
  scoped
>

</style>
<template>
  <header
    id="app-header"
    class="app-header"
  >
    header
  </header>
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
.app-header {
  position: fixed;
  display: flex;
  width: 100%;
  height: var(--app-header-height);
  background-color: red;
  top: 0;
}
</style>
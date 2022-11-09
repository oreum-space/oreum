<template>
  <svg
    class="app-logo"
    width="192"
    height="48"
  >
    <use
      :href="`${oreum}#svg`"
      color="var(--surface-900)"
      width="192"
      height="48"
    />
  </svg>
</template>

<script
  setup
  lang="ts"
>
import oreum from '@/assets/logo/oreum.svg'
</script>

<style
  lang="scss"
  scoped
>
.app-logo {
  margin: -8px;
}
</style>
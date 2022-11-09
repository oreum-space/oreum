<template>
  <template v-if="$route.name">
    <transition name="app-header">
      <app-header />
    </transition>
    <app-main :class="{ 'app-main_full': $route.meta.header === false }" />
    <!-- TODO: <app-dialog /> -->
    <app-footer />
    <app-scroll />
  </template>
</template>

<script
  setup
  lang="ts"
>
import AppHeader from '@/components/app/AppHeader.vue'
import AppMain from '@/components/app/AppMain.vue'
import AppFooter from '@/components/app/AppFooter.vue'
import AppScroll from '@/components/app/AppScroll.vue'
import { useRouter } from 'vue-router'

console.log(useRouter())
</script>
<style lang="scss">
.app-header {
  transition: translate var(--transition-cubic-slow);
}
.app-header-enter-active,
.app-header-leave-active {
  top: -56px;
}

.app-header-enter-from,
.app-header-leave-to {
  translate: 0 calc(-1 * var(--app-header-height));
}
</style>
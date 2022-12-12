<template>
  <router-view v-slot="{ Component }">
    <transition :name="$route.meta.transition || 'app-page'">
      <main
        v-if="!$route.meta.main"
        class="app-main"
      >
        <component :is="Component" />
      </main>
      <component
        v-else
        :is="Component"
        class="app-main"
      />
    </transition>
  </router-view>
</template>

<style lang="scss">
.app-page {
  &_enter-active,
  &-leave-active {
    transition: var(--transition-linear-fast);
  }

  &-enter-from,
  &-leave-to {
    opacity: 0;
  }
}

.sign-page {
  &-enter-active {
    transition: var(--transition-linear-fast);
  }

  &-enter-from {
    opacity: 0;
    scale: 0;
    translate: min(50vw, 640px) -50vh;
  }

  &-enter-to {
    opacity: 1;
    scale: 1;
    translate: 0 0;
  }

  &-leave-active {
    transition: var(--transition-linear-fast);
  }

  &-leave-to {
    opacity: 0;
  }
}
</style>
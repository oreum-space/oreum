<template>
  <header
    v-show="$route.name && $route.meta.header !== false"
    id="app-header"
    class="app-header"
  >
    <router-link
      to="/"
      aria-label
      title="Oreum Space Home"
      class="app-header__logo"
    >
      <app-logo />
    </router-link>
    <div class="app-header__space"/>
    <app-profile v-if="profile.id" />
    <app-auth v-else />
  </header>
</template>

<script
  setup
  lang="ts"
>
import AppAuth from '@/components/app/AppAuth.vue'
import AppLogo from '@/components/app/AppLogo.vue'
import AppProfile from '@/components/app/AppProfile.vue'
import useProfile from '@/store/profile'

const profile = useProfile()
</script>

<style
  lang="scss"
  scoped
>
.app-header {
  display: flex;
  align-items: center;
  position: fixed;
  width: 100%;
  height: var(--app-header-height);
  --background-color: var(--surface-card);
  background-color: var(--background-color);
  box-shadow: 0 3px 5px rgb(0 0 0 / 4%), 0 0 2px rgb(0 0 0 / 10%), 0 1px 4px rgb(0 0 0 / 16%);
  padding-block: 8px;
  top: 0;
  z-index: 1;

  @media screen and (display-mode: standalone) {
    top: -16px;
    height: calc(var(--app-header-height) + 16px);
  }

  @media (max-width: 768px) {

    &__space {
      display: none;
    }

    justify-content: center;
  }

  &__space {
    flex: 1 1 0;
  }

  &__logo {
    display: flex;
    height: var(--app-header-height);
    align-items: center;
  }

  .app-logo {
    transition: scale var(--transition-cubic-slow);

    &:hover {
      scale: 1.0625;
    }

    &:active {
      scale: 0.9375
    }
  }
}
</style>
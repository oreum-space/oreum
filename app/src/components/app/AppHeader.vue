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
    <div class="app-header__tabs">
      <ui-select
        model-value="Menu"
        @update:model-value="$router.push($event.to)"
        :options="options"
      >
        <template #option="{ option }">
          {{ option['name'] }}
        </template>
      </ui-select>
      <router-link
        v-for="option of options"
        :key="option.name"
        :to="option.to"
      >
        <ui-button
          size="large"
          seriousness="secondary"
          appearance="text"
        >
          {{ option.name }}
        </ui-button>
      </router-link>
    </div>
    <div class="app-header__space" />
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
import UiButton from '@/components/ui/UiButton.vue'
import UiSelect from '@/components/ui/UiSelect.vue'
import useProfile from '@/store/profile'
import { onMounted } from 'vue'

const profile = useProfile()
const emits = defineEmits<{
  (e: 'mounted'): void
}>()
onMounted(() => emits('mounted'))

const options = [
  {
    name: 'UI',
    to: '/user-interface'
  },
  {
    name: 'Wheel',
    to: '/other/lucky-wheel'
  }
]
</script>

<style lang="scss">
.app-header {
  display: flex;
  align-items: flex-end;
  position: fixed;
  width: 100%;
  height: var(--app-header-height);
  --background-color: var(--surface-card);
  background-color: var(--background-color);
  box-shadow:
    0 3px 5px rgb(0 0 0 / 4%),
    0 0 2px rgb(0 0 0 / 10%),
    0 1px 4px rgb(0 0 0 / 16%);
  top: 0;
  z-index: 10;

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

  &__tabs {
    display: flex;
    align-items: center;
    height: var(--app-header-height);
    padding-inline: 12px;
    gap: 8px;

    .ui-select {
      display: none;
    }
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
    transition: scale var(--transition-default);
    margin: -8px;

    &:hover {
      transition: scale var(--transition-fast);
      scale: 1.0625;
    }

    &:active {
      transition: scale var(--transition-fast);
      scale: 0.9375;
    }
  }

  @media (max-width: 768px) {
    .app-logo {
      width: 144px;
      height: 36px;
      margin: 0;

      use {
        width: 144px;
        height: 36px;
        scale: 75%;
      }
    }

    &__tabs {
      position: absolute;
      left: 0;

      a {
        display: none;
      }

      .ui-select {
        display: unset;
        --width: 96px;
      }
    }
  }
}
</style>
<template>
  <main class="app-main_user-interface user-interface">
    <ui-card
      class="user-interface__navigation"
      tag="nav"
    >
      <router-link to="/user-interface">
        <ui-button
          size="small"
          appearance="text"
        >
          <h3>
            User Interface
          </h3>
        </ui-button>
      </router-link>
      <router-link
        v-for="route of children"
        :key="route.path"
        :to="route.path"
      >
        <ui-button
          size="small"
          appearance="text"
        >
          {{ route.name }}
        </ui-button>
      </router-link>
    </ui-card>
    <section class="user-interface__content">
      <router-view />
    </section>
  </main>
</template>

<script
  setup
  lang="ts"
>
import UiButton from '@/components/ui/UiButton.vue'
import UiCard from '@/components/ui/UiCard.vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const children = router.options.routes.find(_ => _.name === 'UserInterface')?.children?.filter(_ => _.path)
</script>

<style
  lang="scss"
  scoped
>
.user-interface {
  display: flex;
  flex-flow: row;

  &__navigation {
    position: fixed;
    min-width: 256px;
    height: min(calc(var(--view) - 48px), calc(var(--fvh) - var(--app-header-height) - 48px));
    gap: 8px;

    .ui-button {
      justify-content: flex-start;
      width: 100%;
    }
  }

  &__content {
    padding-left: 280px;
    width: 100%;
  }
}

@media (max-width: 1024px) {
  .user-interface {
    display: flex;
    flex-flow: column;

    &__navigation {
      display: flex;
      flex-flow: row;
      align-items: baseline;
      position: static;
      height: 64px;
      padding-block: 16px;
      white-space: nowrap;
      overflow: scroll;
      scrollbar-width: none;

      &::-webkit-scrollbar {
        display: none;
      }
    }

    &__content {
      padding: var(--app-padding) 0 0;
      width: 100%;
    }
  }
}
</style>
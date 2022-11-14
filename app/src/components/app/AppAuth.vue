<template>
  <nav
    class="app-auth"
    role="navigation"
  >
    <router-link to="/auth">
      <ui-button
        seriousness="secondary"
        appearance="outlined"
      >
        Login
      </ui-button>
    </router-link>
    <router-link to="/new-account">
      <ui-button
        seriousness="success"
      >
        New Account
      </ui-button>
    </router-link>
  </nav>
</template>

<script
  setup
  lang="ts"
>
import UiButton from '@/components/ui/UiButton.vue'
</script>

<style
  lang="scss"
  scoped
>
.app-auth {
  display: flex;
  gap: 12px;
}

@media (max-width: 768px) {
  .app-auth {
    display: none;
  }
}
</style>
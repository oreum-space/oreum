<template>
  <nav
    class="app-auth"
    role="navigation"
  >
    <router-link to="/auth">
      <ui-button
        seriousness="secondary"
        appearance="outlined"
        size="small"
      >
        <ui-icon icon="user" />
        <span>
          Login
        </span>
      </ui-button>
    </router-link>
    <router-link to="/new-account">
      <ui-button
        seriousness="success"
        size="small"
      >
        <ui-icon icon="new-user" />
        <span>
          New Account
        </span>
      </ui-button>
    </router-link>
  </nav>
</template>

<script
  setup
  lang="ts"
>
import UiButton from '@/components/ui/UiButton.vue'
import UiIcon from '@/components/ui/UiIcon.vue'
</script>

<style
  lang="scss"
  scoped
>
.app-auth {
  display: flex;
  padding-block: 10px;
  gap: 12px;
}

@media (max-width: 768px) {
  .app-auth {
    position: absolute;
    right: var(--app-padding);
    span {
      display: none;
    }
  }
}

@media (max-width: 374px) {
  .app-auth {
    position: absolute;

    & > *:first-child {
      display: none;
    }
  }
}
</style>
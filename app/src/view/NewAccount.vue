<template>
  <transition name="sign-page">
    <main class="new-account">
      <ui-card>
        <h1>New Account</h1>
        <p style="max-width: 256px;">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Animi atque, autem consequatur debitis et facere itaque iusto provident quos recusandae rerum sed sequi tenetur ullam unde ut veniam vero, voluptate.
        </p>
      </ui-card>
    </main>
  </transition>
</template>

<script
  setup
  lang="ts"
>

import UiCard from '@/components/ui/UiCard.vue'
</script>

<style
  lang="scss"
  scoped
>
.new-account {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
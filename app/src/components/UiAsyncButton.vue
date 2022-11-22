<template>
  <ui-button

  />
</template>

<script
  setup
  lang="ts"
>
import UiButton from '@/components/ui/UiButton.vue'

type Props = {
  type?: 'button' | 'submit' | 'reset'
  seriousness?: 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'danger' | 'passive'
  appearance?: '' | 'text' | 'outlined' | 'rounded' | 'rounded-outlined' | 'rounded-text'
  size?: 'small' | 'large'
  disabled?: boolean
}


</script>

<style
  lang="scss"
  scoped
>

</style>
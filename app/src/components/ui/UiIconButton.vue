<template>
  <ui-button
    class="ui-icon-button"
    :seriousness="seriousness"
    :appearance="appearance"
    :disabled="disabled"
  >
    <ui-icon
      class="ui-icon-button__icon"
      :icon="icon"
      :height="height"
    />
  </ui-button>
</template>

<script
  setup
  lang="ts"
>

import UiButton from '@/components/ui/UiButton.vue'
import UiIcon from '@/components/ui/UiIcon.vue'

type Props = {
  icon?: string,
  width?: number,
  height?: number,
  appearance?: 'default' | 'text' | 'outlined' | 'rounded' | 'rounded-outlined' | 'rounded-text'
  seriousness?: 'secondary' | 'primary' | 'success' | 'info' | 'warning' | 'danger' | 'passive',
  disabled?: boolean
}

withDefaults(defineProps<Props>(), {
  icon: undefined,
  width: undefined,
  height: undefined,
  appearance: undefined,
  seriousness: undefined
})
</script>

<style
  lang="scss"
  scoped
>

</style>
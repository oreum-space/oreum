<template>
  <button
    class="ui-button"
    :class="classes"
    :type="type"
    :disabled="disabled"
  >
    <slot />
  </button>
</template>

<script
  setup
  lang="ts"
>
import { computed } from 'vue'

type Props = {
  type?: 'button' | 'submit' | 'reset'
  seriousness?: 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'danger' | 'passive'
  appearance?: 'text' | 'outlined' | 'rounded' | 'rounded-outlined' | 'rounded-text'
  size?: 'small' | 'large'
  disabled?: boolean
}

const
  props = defineProps<Props>(),
  classes = computed(() => ({
    'ui-button_text': props.appearance === 'text',
    'ui-button_outlined': props.appearance === 'outlined',
    'ui-button_rounded': props.appearance === 'rounded',
    'ui-button_rounded-outlined': props.appearance === 'rounded-outlined',
    'ui-button_rounded-text': props.appearance === 'rounded-text',
    'ui-button_secondary': props.seriousness === 'secondary',
    'ui-button_success': props.seriousness === 'success',
    'ui-button_info': props.seriousness === 'info',
    'ui-button_warning': props.seriousness === 'warning',
    'ui-button_danger': props.seriousness === 'danger',
    'ui-button_passive': props.seriousness === 'passive',
    'ui-button_large': props.size === 'large',
    'ui-button_small': props.size === 'small'
  }))
</script>
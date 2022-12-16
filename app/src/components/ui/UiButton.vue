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
  appearance?: 'default' | 'text' | 'outlined' | 'rounded' | 'rounded-outlined' | 'rounded-text'
  size?: 'default' | 'small' | 'large'
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'button',
  seriousness: 'primary',
  appearance: 'default',
  size: 'default'
})
const classes = computed(() => ({
  ...(props.seriousness !== 'primary' && { [`ui-button_${ props.seriousness }`]: true }),
  ...(props.appearance !== 'default' && { [`ui-button_${ props.appearance }`]: true }),
  ...(props.size !== 'default' && { [`ui-button_${ props.size }`]: true })
}))
</script>
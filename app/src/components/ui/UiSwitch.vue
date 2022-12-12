<template>
  <div
    tabindex="0"
    role="switch"
    class="ui-switch"
    :class="{
      [`ui-switch_${seriousness}`]: !!seriousness
    }"
    :aria-checked="!!modelValue"
    :aria-disabled="!!disabled"
    @click="_switch"
    @keydown.space.enter.stop.prevent="_switch"
  />
</template>

<script
  setup
  lang="ts"
>
type Props = {
  modelValue?: boolean
  disabled?: boolean
  seriousness?: 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'danger' | 'passive'
}

const props = defineProps<Props>()
const emits = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

function _switch (): void {
  if (!props.disabled) {
    emits('update:modelValue', !props.modelValue)
  }
}
</script>
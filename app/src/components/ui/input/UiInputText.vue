<template>
  <label class="ui-input-wrapper ui-input-text">
    <input
      ref="input"
      v-model="value"
      class="ui-input ui-input-text__input"
      placeholder=" "
      :class="{ 'ui-input_invalid': invalid }"
      :type="type"
      :autocomplete="autocomplete"
      :maxlength="maxlength"
      :disabled="_disabled"
      :style="{ '--width': width }"
      @focus="onfocus"
      @blur="onblur"
    >
    <label
      v-if="label"
      class="ui-input-label"
    >
      {{ label }}
    </label>
  </label>
</template>

<script
  setup
  lang="ts"
>
import { computed, Ref, ref } from 'vue'

type Props = {
  label?: string,
  modelValue?: string,
  invalid?: boolean,
  disabled?: boolean,
  maxlength?: string,
  autocomplete?: string,
  width?: string | number,
  type?: 'password' | 'email' | 'text'
}

const props = defineProps<Props>()
const emits = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()
const value = computed({
  get (): string {
    return props.modelValue || ''
  },
  set (value: string) {
    emits('update:modelValue', value)
  }
})
const _disabled = computed(() => typeof props.modelValue !== 'string' || !!props.disabled)
const input = ref() as Ref<HTMLInputElement>
const focused = ref<boolean>(false)

function focus (): void {
  input.value.focus()
}

function onfocus (): void {
  focused.value = true
}

function onblur () {
  if (input.value === document.activeElement) {
    focused.value = false
  }
}

defineExpose({ focus, focused, input })
</script>

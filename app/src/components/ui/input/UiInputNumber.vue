<template>
  <label
    class="ui-input-wrapper ui-input-number"
  >
    <input
      ref="input"
      :value="value"
      class="ui-input ui-input-number__input"
      placeholder=" "
      :class="{ 'ui-input_invalid': invalid }"
      :disabled="_disabled"
      :style="{ '--width': width }"
      :step="computedStep"
      type="number"
      :max="computedMax"
      :min="computedMin"
      @keyup.shift="shift = false"
      @keyup.ctrl="ctrl = false"
      @keydown="onkeydown"
      @focus="onfocus"
      @blur="onblur"
      @input="oninput"
    >
    <label
      v-if="label"
      class="ui-input-label"
    >
      {{ label }}
    </label>
    <ui-icon-button
      class="ui-input-number__arrow ui-input-number__arrow_up"
      appearance="text"
      seriousness="passive"
      icon="spin-arrow"
      @click="onarrowup"
    />
    <ui-icon-button
      class="ui-input-number__arrow ui-input-number__arrow_down"
      appearance="text"
      seriousness="passive"
      icon="spin-arrow"
      @click="onarrowdown"
    />
  </label>
</template>

<script
  setup
  lang="ts"
>
import UiIconButton from '@/components/ui/UiIconButton.vue'
import { computed, Ref, ref } from 'vue'

type Props = {
  label?: string,
  modelValue?: number,
  max?: number,
  min?: number,
  step?: number,
  width?: number,
  invalid?: boolean,
  disabled?: boolean,
  integer?: boolean,
  unsigned?: boolean,
  unsafe?: boolean
}

type Emits = {
  (e: 'update:modelValue', value: number): void
}

const props = withDefaults(defineProps<Props>(), {
  label: '',
  modelValue: undefined,
  max: Number.MAX_SAFE_INTEGER,
  min: Number.MIN_SAFE_INTEGER,
  step: 1,
  width: undefined,
  invalid: false,
  disabled: false,
  integer: false,
  unsigned: false,
  unsafe: false
})
const emits = defineEmits<Emits>()
const value = computed({
  get (): number {
    return (props.modelValue as number | undefined) === undefined
      ? NaN
      : props.modelValue as number
  },
  set (value: number): void {
    emits('update:modelValue', value)
  }
})
const _disabled = computed(() => (props.modelValue as number | undefined) === undefined || props.disabled)
const input = ref() as Ref<HTMLInputElement>
const focused = ref<boolean>(false)
const computedMax = computed<number | undefined>(() => {
  if (props.unsafe) {
    return undefined
  }
  return Math.max(Number.MAX_SAFE_INTEGER, Math.min(Number.MIN_SAFE_INTEGER, props.max))
})
const computedMin = computed<number | undefined>(() => {
  if (props.unsafe) {
    return undefined
  }
  return Math.min(Number.MAX_SAFE_INTEGER, Math.max(Number.MIN_SAFE_INTEGER, props.min))
})
const shift = ref<boolean>(false)
const ctrl = ref<boolean>(false)
const computedStep = computed<number>(() =>
  ctrl.value && shift.value && props.step * 100 ||
  ctrl.value && props.step * 10 ||
  shift.value && props.step * 0.1 ||
  props.step
)

function focus (): void {
  input.value.focus()
}

function onfocus (): void {
  focused.value = true
}

function onblur (): void {
  if (input.value === document.activeElement) {
    focused.value = false
  }
  shift.value = false
  ctrl.value = false
}

// const arrowKeys = ['ArrowUp', 'ArrowDown']

function onkeydown (event: KeyboardEvent): void {
  const { key, shiftKey, ctrlKey } = event
  if (shiftKey !== shift.value) {
    shift.value = shiftKey
  }
  if (ctrlKey !== ctrl.value) {
    ctrl.value = ctrlKey
  }
  if (key === 'ArrowUp') {
    event.preventDefault()
    onarrowup()
    return
  }
  if (key === 'ArrowDown') {
    event.preventDefault()
    onarrowdown()
    return
  }
}

function oninput (event: InputEvent): void {
  if (isFinite(input.value.valueAsNumber)) {
    value.value = input.value.valueAsNumber
    return
  }
  event.preventDefault()
}

function onarrowup (): void {
  if (computedStep.value > 1) {
    value.value = value.value + computedStep.value
  } else {
    value.value = (value.value * 10 + computedStep.value * 10) / 10
  }
}

function onarrowdown (): void {

  if (computedStep.value > 1) {
    value.value = value.value - computedStep.value
  } else {
    value.value = (value.value * 10 - computedStep.value * 10) / 10
  }
}

defineExpose({ focus, focused, input })
</script>

<style
  lang="scss"
  scoped
>

</style>
<template>
  <div
    class="ui-color-slider ui-input"
    :style="{
      width: width,
      backgroundImage,
      '--value': value,
      '--max': max || 255
    }"
  >
    <span
      v-if="display"
      class="ui-color-slider__text"
    >
      {{ display(modelValue) }}
    </span>
    <input
      v-else
      class="ui-color-slider__text"
      :value="modelValue"
      type="number"
      min="0"
      :max="max || 255"
      @input="inputNumberHandler"
    >
    <input
      v-model="value"
      class="ui-color-slider__slider"
      type="range"
      :max="max || 255"
    >
    <span
      v-if="label"
      class="ui-color-slider__label"
    >
      {{ label }}
    </span>
  </div>
</template>

<script
  setup
  lang="ts"
>
import { computed } from 'vue'

type Props = {
  modelValue: number,
  width?: number
  max?: number
  background?: [string, string] | string,
  label?: string,
  scale?: number,
  display?: (n: number) => string | number
}

const props = defineProps<Props>()
const emits = defineEmits<{
  (e: 'update:modelValue', v: number): void
}>()
const backgroundImage = computed<string>(() => {
  return props.background
    ? (
      typeof props.background === 'string'
        ? props.background
        : `linear-gradient(to right, ${ props.background[0] }, ${ props.background[1] })`
    )
    : ''
})
const value = computed<number>({
  get () {
    return props.modelValue
  },
  set (value: number | string) {
    emits('update:modelValue', typeof value === 'string' ? parseInt(value) : value)
  }
})

function inputNumberHandler (event: Event) {
  const target = event.target as HTMLInputElement | null
  if (target) {
    const asNumber = target.valueAsNumber
    value.value = Math.min(props.max || 255, Math.max(isFinite(asNumber) ? asNumber : 0, 0))
    target.value = value.value.toString()
  }
}

</script>

<style
  lang="scss"
  scoped
>
.ui-color-slider {
  text-align: end;
  position: relative;
  border: 0 solid transparent;
  padding-block: 10px;
  clip-path: inset(0 0 0 0);
  box-shadow: 0 0 0 1px var(--surface-border-a-static) inset;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  flex-flow: row-reverse;
  user-select: none;

  &::before,
  &::after {
    position: absolute;
    content: ' ';
    width: 9px;
    height: 9px;
    background-color: var(--surface-overlay);
    // border: 1px solid var(--surface-border-a-static);
    box-shadow: inherit;
    transform-origin: center center;
    transform: rotate(45deg);
    left: calc(100% * (var(--value)) / 255 - 5px);  // calc((var(--value) - 5px) * 1.0075 * (255 / var(--max)));
    z-index: 2;
  }

  &::before {
    top: -5px;
  }

  &::after {
    bottom: -5px;
    transform: rotate(-135deg);
  }

  &:focus-within {
    box-shadow: inset 0 0 0 2px var(--primary-color),
    inset 0 0 0 2px var(--primary-color),
    inset 0 0 0 2px var(--primary-color),
    inset 0 0 0 2px var(--primary-color);

    &::before {
      top: -3.67px;
    }

    &::after {
      bottom: -3.67px;
    }
  }

  &__slider {
    // opacity: 0;
    cursor: pointer;
    position: absolute;
    width: 100%;
    left: 0;
    top: 0;
    height: 40px;
    z-index: 3;
    background-color: transparent;
    opacity: 0.0001;

    &:focus {
      cursor: ew-resize;
    }

    &::-webkit-slider-runnable-track {
      height: 100%;
      opacity: 0;
    }

    &::-webkit-slider-thumb {
      width: 32px;
      height: 36px;
    }
  }

  &__text {
    z-index: 4;
    width: fit-content;
    display: flex;
    appearance: none;
    border: none;
    background: transparent;
    text-align: end;
    max-width: 48px;
    font-size: inherit;
    font-family: inherit;
    outline: none;

    &::-webkit-inner-spin-button {
      display: none;
    }
  }

  &__label,
  &__text {
    font-weight: 600;
    color: white;
    text-shadow: 0 0 1.5px black, 0 0 1.5px black, 0 0 1.5px black, 0 0 1.5px black;
  }

  &__text {
    padding-right: 2px;
  }
}
</style>
<template>
  <div class="ui-input-color__model">
    <ui-input-color-slider
      label="Hue"
      :model-value="v.h"
      :background="hueBackground"
      :scale="1"
      :max="359"
      round
      @update:model-value="v = { model: 'HSV', h: $event, s: v.s, v: v.v }"
    />
    <ui-input-color-slider
      label="Saturation"
      :model-value="Math.round(v.s * 2.55)"
      :display="display"
      :background="[
        `hsl(${v.h}deg, 0%, ${v.v / 2}%)`,
        `hsl(${v.h}deg, 100%, ${v.v / 2}%)`
      ]"
      @update:model-value="v = { model: 'HSV', h: v.h, s: display($event), v: v.v }"
    />
    <ui-input-color-slider
      label="Value"
      :model-value="Math.round(v.v * 2.55)"
      :display="display"
      :background="[
        `hsl(${v.h}deg, ${v.s}%, 0%)`,
        `hsl(${v.h}deg, ${v.s}%, 50%)`
      ]"
      @update:model-value="v = { model: 'HSV', h: v.h, s: v.s, v: display($event) }"
    />
  </div>
</template>

<script
  setup
  lang="ts"
>
import UiInputColorSlider from '@/components/ui/input/color/UiInputColorSlider.vue'
import type { ColorValueHSV } from '@/components/ui/input/color/index'
import { computed } from 'vue'

type Props = {
  value: Omit<ColorValueHSV, 'value'>
}

const props = defineProps<Props>()
const emits = defineEmits<{ (e: 'setValue', value: Props['value']): void }>()
const v = computed<Props['value']>({
  get () {
    return props.value
  },
  set (value) {
    emits('setValue', value)
  }
})
const hueBackground = computed(() => {
  const hl = `hsl(_deg ${ v.value.s }% ${ v.value.v / 2 }%)`
  return `linear-gradient(90deg, ${
    hl.replace('_', '0')
  } 0%, ${
    hl.replace('_', '60')
  } 17%, ${
    hl.replace('_', '120')
  } 33%, ${
    hl.replace('_', '180')
  } 50%, ${
    hl.replace('_', '240')
  } 66%, ${
    hl.replace('_', '300')
  } 83%, ${
    hl.replace('_', '360')
  } 100%)`
})

function display (n: number): number {
  return Math.round(n * 100 / 2.55) / 100
}
</script>
<template>
  <div class="ui-input-color__model">
    <ui-input-color-slider
      label="Cyan"
      :model-value="Math.round(v.c * 255)"
      :background="[
        `rgb(255, ${Math.round((1 - v.m) * 255)}, ${Math.round((1 - v.y) * 255)})`,
        `rgb(0, ${Math.round((1 - v.m) * 255)}, ${Math.round((1 - v.y) * 255)})`
      ]"
      :display="display"
      @update:model-value="v = { model: 'CMY', c: $event / 255, m: v.m, y: v.y }"
    />
    <ui-input-color-slider
      label="Magenta"
      :model-value="Math.round(v.m * 255)"
      :background="[
        `rgb(${Math.round((1 - v.c) * 255)}, 255, ${Math.round((1 - v.y) * 255)})`,
        `rgb(${Math.round((1 - v.c) * 255)}, 0, ${Math.round((1 - v.y) * 255)})`
      ]"
      @update:model-value="v = { model: 'CMY', c: v.c, m: $event / 255, y: v.y }"
    />
    <ui-input-color-slider
      label="Yellow"
      :model-value="Math.round(v.y * 255)"
      :background="[
        `rgb(${Math.round((1 - v.c) * 255)}, ${Math.round((1 - v.m) * 255)}, 255)`,
        `rgb(${Math.round((1 - v.c) * 255)}, ${Math.round((1 - v.m) * 255)}, 0)`
      ]"
      @update:model-value="v = { model: 'CMY', c: v.c, m: v.m, y: $event / 255 }"
    />
  </div>
</template>

<script
  setup
  lang="ts"
>
import UiInputColorSlider from '@/components/ui/input/color/UiInputColorSlider.vue'
import type { ColorValueCMY } from '@/components/ui/input/color/index'
import { computed } from 'vue'

type Props = {
  value: Omit<ColorValueCMY, 'value'>
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

function display (n: number): string {
  return (n / 255).toFixed(3)
}
</script>
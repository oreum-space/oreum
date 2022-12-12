<template>
  <div class="ui-input-color__model">
    <ui-input-color-slider
      label="Red"
      :model-value="v.r"
      :background="[ `rgb(0, ${v.g}, ${v.b})`, `rgb(255, ${v.g}, ${v.b})` ]"
      @update:model-value="v = { model: 'RGB', r: $event, g: v.g, b: v.b }"
    />
    <ui-input-color-slider
      label="Green"
      :model-value="v.g"
      :background="[ `rgb(${v.r}, 0, ${v.b})`, `rgb(${v.r}, 255, ${v.b})` ]"
      @update:model-value="v = { model: 'RGB', r: v.r, g: $event, b: v.b }"
    />
    <ui-input-color-slider
      label="Blue"
      :model-value="v.b"
      :background="[ `rgb(${v.r}, ${v.g}, 0)`, `rgb(${v.r}, ${v.g}, 255)` ]"
      @update:model-value="v = { model: 'RGB', r: v.r, g: v.g, b: $event }"
    />
  </div>
</template>

<script
  setup
  lang="ts"
>
import UiInputColorSlider from '@/components/ui/input/color/UiInputColorSlider.vue'
import type { ColorModel, ColorValueRGB } from '@/components/ui/input/color/index'
import { computed } from 'vue'

type Props = {
  value: Omit<ColorValueRGB, 'value'>
  model: ColorModel
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
</script>
<template>
  <div
    ref="wrapper"
    class="ui-input-color"
  >
    <button
      ref="button"
      role="button"
      tabindex="0"
      class="ui-input-color__button ui-button"
      :style="{
        backgroundColor: modelValue ? (typeof modelValue === 'string' ? modelValue : `#${modelValue}`) : valueHEX.value,
        color: contrast
      }"
      @click="visible = !visible"
      @keydown.enter.space="visible = !visible"
    >
      {{ modelValue || valueHEX.value }}
    </button>
    <div
      ref="popover"
      class="ui-input-color__popover"
    >
      <div
        ref="box"
        class="ui-input-color__box"
        :class="{ 'ui-input-color__box_hsl': colorModel === 'HSL' }"
        :style="{
          color: `hsl(${valueHSL.h}deg 100% 50%)`,
          '--contrast': contrast
        }"
        @scroll.prevent.capture
        @pointerdown="boxPointerDown"
      >
        <div
          class="ui-input-color__pointer"
          :style="{
            backgroundColor: valueHEX.value,
            left: `${(colorModel === 'HSL' ? valueHSL.s : valueHSV.s)}%`,
            bottom: `${(colorModel === 'HSL' ? valueHSL.l : valueHSV.v)}%`
          }"
        />
      </div>
      <div class="ui-input-color__form">
        <ui-select
          :model-value="{ display: colorModel, value: colorModel }"
          :options="COLOR_MODELS.map(_ => ({ display: _, value: _ }))"
          @update:model-value="setColorModel"
        >
          <template #option="{ option }">
            <div class="ui-input-color__color-model ui-input-color__color-model_option">
              <b>{{ option['display'] }}</b>
              <small>{{ getValue(option?.value).value }}</small>
            </div>
          </template>
          <template #selected="{ selected, close }">
            <div class="ui-input-color__color-model">
              <b>{{ selected?.display }}</b>
              <small
                class="ui-input-color__copy-color-model small-small"
                @click="copyColorModelValue($event); close()"
              >
                <ui-icon
                  size="small"
                  icon="copy"
                />{{ getValue(selected?.value).value }}
              </small>
            </div>
          </template>
        </ui-select>
        <component
          :is="colorModelForm"
          :value="getValue(colorModel)"
          :model="colorModel"
          @set-value="setValue"
        />
      </div>
      <div
        class="ui-input-color__popover-arrow"
        data-popper-arrow
      />
    </div>
  </div>
</template>

<script
  setup
  lang="ts"
>
import UiIcon from '@/components/ui/UiIcon.vue'
import type {
  ColorModel, ColorValueCMY, ColorValueHEX, ColorValueHSL, ColorValueHSV,
  ColorValueRaw, ColorValueRGB, ColorValueRGBLike
} from '.'
import type { Component, ComputedRef, Ref } from 'vue'
import UiSelect from '@/components/ui/UiSelect.vue'
import { createPopper, flip, Instance } from '@popperjs/core'
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import {
  COLOR_MODELS,
  getColorModelComponent, hslToRgb, hsvToRgb, rgbToHsl, rgbToHsv,
  valueCMYValue, valueHEXValue, valueHSLValue, valueHSVValue, valueRGBValue
} from '.'

function updateVisibility (popper: Instance | null, visible: Ref<boolean> | ComputedRef<boolean>) {
  if (popper) {
    popper.state.elements.popper.dataset['popperHidden'] = visible.value ? 'false' : 'true'
    const promise = popper.setOptions((options) => ({
      ...options,
      modifiers: [
        ...(options.modifiers || []),
        { name: 'eventListeners', enabled: visible.value }
      ]
    }))

    if (visible.value) {
      promise.then(() => {
        if (visible.value) {
          popper.update()
        }
      })
    }
  }
}

type TModeValue = string | number

type Props = {
  modelValue: TModeValue
  alpha?: true,
  colorModel?: ColorModel
}

type Emits = {
  (e: 'update:modelValue', v: TModeValue): void
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()

const
  colorModel = ref<ColorModel>(props.colorModel || COLOR_MODELS[0]),
  alpha = computed(() => {
    return props.alpha
      ? (typeof props.modelValue === 'string' ? parseInt(props.modelValue.slice(1), 16) : props.modelValue) & 0xff
      : undefined
  }),
  value = computed<number>((): number => {
      if (typeof props.modelValue === 'string') {
        return parseInt(props.modelValue.slice(1), 16) >> (props.alpha ? 8 : 0)
      }
      return props.modelValue
    }
  ),
  valueHEX = ref<ColorValueHEX>({
    model: COLOR_MODELS[0],
    r: value.value >> 16 & 0xff,
    g: value.value >> 8 & 0xff,
    b: value.value & 0xff,
    value: valueHEXValue(
      { r: value.value >> 16 & 0xff, g: value.value >> 8 & 0xff, b: value.value & 0xff },
      alpha.value
    )
  }),
  valueRGB = ref<ColorValueRGB>({
    model: COLOR_MODELS[1],
    r: valueHEX.value.r,
    g: valueHEX.value.g,
    b: valueHEX.value.b,
    value: valueRGBValue(valueHEX.value, alpha.value)
  }),
  valueCMY = ref<ColorValueCMY>({
    model: COLOR_MODELS[2],
    c: 1 - valueHEX.value.r / 0xff,
    m: 1 - valueHEX.value.g / 0xff,
    y: 1 - valueHEX.value.b / 0xff,
    value: valueCMYValue({
      c: 1 - valueHEX.value.r / 0xff,
      m: 1 - valueHEX.value.g / 0xff,
      y: 1 - valueHEX.value.b / 0xff
    }, alpha.value)
  }),
  valueHSL = ref<ColorValueHSL>(rgbToHsl(valueRGB.value, alpha.value)),
  valueHSV = ref<ColorValueHSV>(rgbToHsv(valueRGB.value, alpha.value)),
  contrast = computed<string>(
    () => {
      const
        r = valueRGB.value.r / 255,
        g = valueRGB.value.g / 255,
        b = valueRGB.value.b / 255

      return ((r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4)) * 0.2126
        + (g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4)) * 0.7152
        + (b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4)) * 0.0722) > 0.179
        ? 'black'
        : 'white'
    }
  ),
  colorModelForm = computed<Component>(() => getColorModelComponent(colorModel.value)),
  box = ref<HTMLElement>()

let rects: DOMRect

function pointerMoveHandle (event: PointerEvent) {
  if (rects) {
    const width = rects.width - 1
    const height = rects.height - 1
    const isHSV = colorModel.value !== COLOR_MODELS[3]
    const x = Math.max(Math.min(event.clientX - rects.x, width), 0)
    const y = Math.max(Math.min(event.clientY - rects.y, height), 0)
    const xx = Math.round(x * 100 / (width / 100)) / 100
    const yy = Math.round(10000 - y * 100 / (height / 100)) / 100

    setValue(isHSV ? {
      model: COLOR_MODELS[4],
      h: valueHSV.value.h,
      s: xx,
      v: yy
    } as Omit<ColorValueHSV, 'value'> : {
      model: COLOR_MODELS[3],
      h: valueHSV.value.h,
      s: xx,
      l: yy
    } as Omit<ColorValueHSL, 'value'>)
  }
}


function pointerUpHandler (event: PointerEvent) {
  removeEventListener('pointermove', pointerMoveHandle)
  addEventListener('click', (event) => event.stopImmediatePropagation(), { capture: true, once: true })
  pointerMoveHandle(event)
}

function boxPointerDown (event: PointerEvent) {
  const target = event.target as HTMLElement

  if (target) {
    rects = target.getBoundingClientRect()
    addEventListener('pointermove', pointerMoveHandle)
    addEventListener('pointerup', pointerUpHandler, { once: true })
  }
}

function setValue (v: TModeValue | ColorValueRaw): void {
  let rgb: ColorValueRGBLike

  if (typeof v !== 'object') {
    emits('update:modelValue', v)
    const n = typeof v === 'string' ? parseInt(v, 16) : v
    rgb = {
      r: n >> 16 & 0xff,
      g: n >> 8 & 0xff,
      b: n & 0xff
    }
  } else {
    if (v.model === COLOR_MODELS[0] || v.model === COLOR_MODELS[1]) {
      rgb = {
        r: v.r,
        g: v.g,
        b: v.b
      }
    } else if (v.model === COLOR_MODELS[2]) {
      valueCMY.value = {
        ...v,
        value: valueCMYValue(v, alpha.value)
      }
      rgb = {
        r: Math.round((1 - v.c) * 255),
        g: Math.round((1 - v.m) * 255),
        b: Math.round((1 - v.y) * 255)
      }
    } else if (v.model === COLOR_MODELS[3]) {
      rgb = hslToRgb(valueHSL.value = {
        ...v,
        value: valueHSLValue(v)
      })
    } else {
      rgb = hsvToRgb(valueHSV.value = {
        ...v,
        value: valueHSVValue(v)
      })
    }
    emits(
      'update:modelValue',
      typeof props.modelValue === 'string'
        ? valueHEXValue(rgb, alpha.value)
        : rgb.r << 16 + rgb.g << 8 + rgb.b
    )
  }
  valueHEX.value = {
    model: COLOR_MODELS[0],
    ...rgb,
    value: valueHEXValue(rgb, alpha.value)
  }
  valueRGB.value = {
    model: COLOR_MODELS[1],
    ...rgb,
    value: valueRGBValue(rgb, alpha.value)
  }
  if (typeof v === 'object') {
    if (v.model !== COLOR_MODELS[2]) {
      const cmy = {
        c: 1 - rgb.r / 0xff,
        m: 1 - rgb.g / 0xff,
        y: 1 - rgb.b / 0xff
      }
      valueCMY.value = {
        model: COLOR_MODELS[2],
        ...cmy,
        value: valueCMYValue(cmy, alpha.value)
      }
    }
    if (v.model !== COLOR_MODELS[3]) {
      valueHSL.value = rgbToHsl(valueRGB.value, alpha.value, valueHSL.value.h)
    }
    if (v.model !== COLOR_MODELS[4]) {
      valueHSV.value = rgbToHsv(valueRGB.value, alpha.value, valueHSV.value.h)
    }
  }
}

// Popover
const
  wrapper = ref<HTMLElement>(),
  button = ref<HTMLElement>(),
  popover = ref<HTMLElement>(),
  visible = ref<boolean>(false)

let popper: Instance | null = null

function pointerdownHandler (event: PointerEvent) {
  if (visible.value === true && wrapper.value && !event.composedPath().includes(wrapper.value)) {
    event.preventDefault()
    event.stopImmediatePropagation()
    visible.value = false
    addEventListener('click', (event) => {
      event.stopImmediatePropagation()
    }, { once: true , capture: true })
  }
}

addEventListener('pointerdown', pointerdownHandler)

function _updateVisibility () {
  updateVisibility(popper, visible)
}

watch(visible, _updateVisibility)

onMounted(() => {
  if (button.value && popover.value) {
    popper = createPopper(button.value, popover.value, {
      modifiers: [
        flip,
        {
          name: 'arrow',
          options: {
            padding: 12,
          }
        },
        {
          name: 'preventOverflow',
          options: {
            altAxis: true,
            padding: {
              top: 64,
              left: 8,
              right: 8,
              bottom: 8
            }
          }
        },
        {
          name: 'offset',
          options: {
            offset: [0, 8],
          }
        }
      ],
      onFirstUpdate () {
        _updateVisibility()
      },
      placement: 'right'
    })
  }
})

onBeforeUnmount(() => {
  if (popper) {
    popper?.destroy()
  }
  removeEventListener('pointerdown', pointerdownHandler)
})

function copyColorModelValue (event: Event) {
  const target = event.target as HTMLElement

  if (navigator.clipboard && !target.classList.contains('ui-input-color__copy-color-model_copied')) {
    navigator.clipboard.writeText(target.innerText)
    target.classList.add('ui-input-color__copy-color-model_copied')
    setTimeout(() => {
      if (target && target.parentElement) {
        target.classList.remove('ui-input-color__copy-color-model_copied')
      }
    }, 3000)
  } else {
    console.warn('Clipboard API are not available!')
  }
}

const pseudoContext = [valueHEX, valueRGB, valueCMY, valueHSL, valueHSV]

function getValue (model: string | undefined): { value: string } {
  return model
    ? pseudoContext[(
      COLOR_MODELS as Readonly<string[]>
    ).indexOf(model)].value
    : { value: 'unknown' }
}

function setColorModel (v: Ref['value']) {
  colorModel.value = COLOR_MODELS.find(_ => _ === v.value) || COLOR_MODELS[0]
}
</script>

<style lang="scss">
.ui-input-color {
  max-width: fit-content;
  max-height: fit-content;

  &__button {
    display: flex;
    text-align: center;
    width: 96px;
    border: 1px solid;
    outline: 2px solid currentcolor;
    outline-offset: -2px;
    padding-block: 9px;
    text-transform: capitalize;

    &:not(:hover):not(:focus) {
      outline-color: transparent;
    }
  }

  &__popover {
    display: flex;
    padding: 8px;
    background-color: var(--surface-overlay);
    box-shadow: var(--surface-overlay-shadow);
    border-radius: 12px;
    gap: 8px;
    z-index: 4;
    user-select: none;
    -webkit-user-drag: none;
    touch-action: none;

    @media (orientation: portrait), (min-height: 768px) {
      flex-flow: column;
    }

    &[data-popper-hidden=true] {
      display: none;
    }

    .ui-select,
    .ui-input {
      --width: 256px !important;
      width: 256px;

      @media (max-width: 512px) {
        --width: 196px !important;
        width: 196px;
      }
    }

    &-arrow {
      width: 16px;
      height: 16px;
      clip-path: polygon(8px 0, 16px 8px, 8px 16px, 0 8px);
      left: -8px;
      background-color: var(--surface-overlay);
    }
  }

  &__box {
    position: relative;
    width: 256px;
    height: 256px;
    background: linear-gradient(0, #000000FF, #00000000), linear-gradient(90deg, #FFFFFFFF, #FFFFFF00) currentcolor;
    user-select: none;
    -webkit-user-drag: none;

    @media (max-width: 512px), (max-height: 512px) {
      width: 196px;
      height: 196px;
    }

    &_hsl {
      background: linear-gradient(0deg, #000000FF, #00000000 50%, #FFFFFF00 50%, #FFFFFFFF), linear-gradient(90deg, #808080FF, currentcolor);
    }
  }

  &__pointer {
    position: absolute;
    width: 11px;
    height: 11px;
    border-radius: 5px;
    border: 1px solid var(--contrast);
    transform: translate(-5px, 5px);
    transition: border-color ease-in-out 0.25s;
    background-color: transparent;
    z-index: 1;
    left: 0;
    bottom: 100%;

    &::after {
      content: ' ';
      display: block;
      left: 4px;
      top: 4px;
      position: relative;
      width: 1px;
      height: 1px;
      background-color: var(--contrast);
      border-radius: 1px;
      transition: background-color ease-in-out 0.25s;
    }
  }

  &__form,
  &__model {
    display: flex;
    flex-flow: column;
    gap: 8px;
  }

  &__copy-color-model {
    background-color: var(--primary-color);
    color: var(--primary-color-text);
    border-radius: 4px;
    padding: 2px 4px;
    font-size: 12px;
    font-weight: 500;
    line-height: 16px;
    max-height: 20px;
    margin-right: 8px;
    cursor: copy;
    max-width: 128px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: flex;
    gap: 4px;
    transition: outline 0.25s ease-in-out,
    color 0.25s ease-in-out,
    background-color 0.25s ease-in-out;
    align-items: center;

    &_copied {
      outline-offset: -1px;
      outline: 1px solid var(--primary-color);
      color: var(--primary-color);
      background-color: transparent;
    }
  }

  &__color-model {
    display: flex;
    flex-flow: row nowrap;
    gap: 8px;
    white-space: nowrap;
    justify-content: space-between;
  }
}

</style>
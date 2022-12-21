<template>
  <div
    ref="select"
    class="ui-select"
    :data-select-open="open"
    :aria-disabled="!!disabled"
    @focusout="focusout"
    @keydown="preventScrolling"
  >
    <transition name="list">
      <div
        v-show="open"
        ref="list"
        role="list"
        class="ui-select__list"
        @pointerdown.prevent
      >
        <div
          ref="mask"
          class="ui-select__mask"
          :class="{
            'ui-select__mask_scroll-top': maskScrollTop,
            'ui-select__mask_scroll-bottom': maskScrollBottom
          }"
          @scroll="maskScroll"
        >
          <slot
            name="list"
          />
          <template v-if="options.length && !$slots.list">
            <div
              v-for="option of options"
              :key="option"
              role="listitem"
              class="ui-select__option"
              :class="{ 'ui-select__option_selected': option === modelValue }"
              @click="updateModelValue(option); close()"
            >
              <slot
                name="option"
                :option="option"
              >
                {{ option }}
              </slot>
            </div>
          </template>
          <div
            v-if="options.length === 0"
            class="ui-select__no-option"
            @click="close()"
          >
            <slot name="no-options">
              No options
            </slot>
          </div>
        </div>
      </div>
    </transition>
    <div
      ref="button"
      role="button"
      class="ui-select__button ui-input ui-input-text__input"
      :tabindex="disabled ? undefined : '0'"
      @click="buttonClick"
      @keydown="keydownPagesHandler"
    >
      <transition name="ui-select__value">
        <div
          v-if="modelValue"
          class="ui-select__value"
        >
          <slot
            name="selected"
            :selected="modelValue"
            :close="close"
          >
            {{ modelValue }}
          </slot>
        </div>
      </transition>
      <span
        v-if="label"
        class="ui-select__label"
      >
        {{ label }}
      </span>
      <ui-icon
        class="ui-select__arrow"
        icon="dropdown-arrow"
      />
    </div>
  </div>
</template>

<script
  setup
  lang="ts"
>
import UiIcon from '@/components/ui/UiIcon.vue'
import { createPopper, flip, Instance } from '@popperjs/core'
import { onBeforeUnmount, onMounted, Ref, ref, watch } from 'vue'

type TModelValue = Ref['value']

type Props = {
  label?: string,
  modelValue?: TModelValue,
  options?: Array<TModelValue>,
  disabled?: boolean,
  keydownActions?: Record<string, () => unknown>
}

type Emits = {
  (e: 'update:modelValue', value: TModelValue): void
}

const props = withDefaults(defineProps<Props>(), {
  label: undefined,
  modelValue: undefined,
  options: () => [],
  keydownActions: () => ({})
})

const emits = defineEmits<Emits>()

// Elements
const select = ref<HTMLElement>() as Ref<HTMLElement>
const list = ref<HTMLElement>() as Ref<HTMLElement>
const button = ref<HTMLElement>() as Ref<HTMLElement>

const open = ref<boolean>(false)

let popper: Instance

onMounted(() => {
  popper = createPopper(button.value, list.value, {
    modifiers: [
      flip,
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
        name: 'eventListeners',
        enabled: open.value
      }
    ]
  })
})

function update () {
  popper.state.elements.popper.dataset.popperHidden = open.value ? 'false' : 'true'

  const promise = popper.setOptions(options => ({
    ...options,
    modifiers: [
      ...(options.modifiers || []),
      {
        name: 'eventListeners',
        enabled: open.value
      }
    ]
  }))

  if (open.value) {
    promise.then(() => {
      if (open.value) {
        popper.update()
      }
    })
  }
}

onBeforeUnmount(() => {
  popper?.destroy()
  removeEventListener('pointerdown', pointerdownHandler)
})

function pointerdownHandler (event: PointerEvent) {
  if (open.value === true && open.value && !event.composedPath().includes(select.value)) {
    open.value = false
  }
}

const resizeObserver = new ResizeObserver(() => {
  popper.forceUpdate()
  maskScroll()
})

watch(open, (value) => {
  if (value) {
    requestAnimationFrame(() => resizeObserver.observe(list.value))
    addEventListener('pointerdown', pointerdownHandler)
  } else {
    resizeObserver.unobserve(list.value)
    removeEventListener('pointerdown', pointerdownHandler)
  }
  update()
})

function buttonClick () {
  open.value = !open.value
}

function focusout () {
  setTimeout(function () {
    if (document.activeElement && !select.value?.contains(document.activeElement)) {
      close()
    }
  })
}

function close () {
  open.value = false
}

const maskScrollTop = ref<boolean>(false)
const maskScrollBottom = ref<boolean>(false)

const mask = ref<HTMLElement>()

function maskScroll (): void {
  if (mask.value) {
    maskScrollTop.value = mask.value.scrollTop > 4
    maskScrollBottom.value = mask.value.scrollTop + mask.value.clientHeight <= mask.value.scrollHeight - 4
  }
}

function updateModelValue (value: TModelValue): void {
  emits('update:modelValue', value)
  const index = props.options.findIndex(option => value === option)
  const item = list.value.children.item(index)
  if (item?.clientHeight) {
    item.scrollIntoView({ block: 'center' })
  } else {
    select.value.scrollIntoView({ block: 'center' })
  }
}

function updateModelValueByIndex (value: number): void {
  if (props.options) {
    const modelValue = props.options.at(
      value >= 0
        ? Math.min(props.options.length - 1, value)
        : Math.max(-props.options.length, value)
    )
    if (modelValue) {
      updateModelValue(modelValue)
    }
  }
}

function getCurrentIndex (): number {
  return props.options.indexOf(props.options.find(_ => props.modelValue === _) || props.options[0])
}

function keydownUpHandler () {
  updateModelValueByIndex(Math.max(getCurrentIndex() - 1, 0))
}

function keydownDownHandler () {
  updateModelValueByIndex(Math.min(getCurrentIndex() + 1, (props.options ? props.options.length - 1 : 0)))
}

const keydownActions: Exclude<Props['keydownActions'], undefined> = {
  ['Space'] () {
    open.value = true
  },
  ['Home'] () {
    updateModelValueByIndex(0)
  },
  ['End'] () {
    updateModelValueByIndex(-1)
  },
  ['Escape']: close,
  ['Enter']: close,
  ['ArrowUp']: keydownUpHandler,
  ['ArrowLeft']: keydownUpHandler,
  ['ArrowDown']: keydownDownHandler,
  ['ArrowRight']: keydownDownHandler,
  ['PageUp'] () {
    updateModelValueByIndex(Math.max(getCurrentIndex() - 10, 0))
  },
  ['PageDown'] () {
    updateModelValueByIndex(getCurrentIndex() + 10)
  }
}

function keydownPagesHandler (event: KeyboardEvent): void {
  (props.keydownActions[event.code] || keydownActions[event.code])?.()
}

const preventedCodes = [
  'ArrowDown',
  'ArrowUp',
  'End',
  'Home',
  'PageDown',
  'PageUp',
  'ArrowLeft',
  'ArrowRight',
  'Space'
]

function preventScrolling (event: KeyboardEvent) {
  if (preventedCodes.includes(event.code)) {
    event.preventDefault()
  }
}

defineExpose({
  updateModelValue,
  close,
  open
})
</script>
<template>
  <teleport to="#app-dialog">
    <transition name="dialog">
      <div
        v-if="shown"
        ref="element"
        role="dialog"
        class="ui-dialog"
        :class="classes"
        :data-dialog-name="name"
        :data-dialog-shown="shown"
        :style="{
          '--x': `${x}px`,
          '--y': `${y}px`
        }"
        @keydown.esc="keydownEsc"
        @click.stop
      >
        <slot name="custom">
          <div
            v-if="!disableHeader"
            class="ui-dialog__header"
            @pointerdown="headerPointerDown"
          >
            <slot name="header">
              <slot name="title">
                <h4 v-if="title">
                  {{ title }}
                </h4>
              </slot>
              <ui-icon-button
                appearance="text"
                seriousness="secondary"
                icon="cross"
                @click="shown = false"
              />
            </slot>
          </div>
          <div
            v-if="!disableBody"
            class="ui-dialog__body"
          >
            <slot name="body" />
          </div>
          <div
            v-if="!disableFooter"
            class="ui-dialog__footer"
          >
            <slot name="footer">
              <ui-button
                appearance="text"
                seriousness="secondary"
                icon="cross"
                @click="shown = false"
              >
                Close
              </ui-button>
            </slot>
          </div>
        </slot>
      </div>
    </transition>
  </teleport>
</template>

<script
  setup
  lang="ts"
>
import UiButton from '@/components/ui/UiButton.vue'
import UiIconButton from '@/components/ui/UiIconButton.vue'
import useDialog, { UiDialogExposes } from '@/store/dialog'
import { getCurrentInstance, onBeforeUnmount, onMounted, ref, watch } from 'vue'

type Props = {
  name: string,
  title?: string,
  classes?: string | Record<string, string>,
  disableHeader?: boolean,
  disableBody?: boolean,
  disableFooter?: boolean,
  uniqueKey?: string,
  shownByDefault?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Untitled',
  classes: undefined,
  disableHeader: false,
  disableBody: false,
  disableFooter: false,
  uniqueKey: undefined,
  name: 'untitled',
  shownByDefault: false
})

const element = ref<HTMLElement>()
const shown = ref<boolean>(props.shownByDefault)
const x = ref<number>(0)
const y = ref<number>(0)

function keydownEsc (): void {
  shown.value = false
}

let xxx = 0, yyy = 0
let xx = 0, yy = 0

function fixPosition () {
  const halfX = (window.innerWidth - (element.value?.clientWidth || 0)) / 2 - 16
  const halfY = (window.innerHeight - (element.value?.clientHeight || 0)) / 2 - 16
  x.value = Math.min(
    Math.max(
      -halfX,
      x.value
    ),
    halfX
  )
  y.value = Math.min(
    Math.max(
      -halfY,
      y.value
    ),
    halfY
  )
}

let resizeObserver: ResizeObserver | null = null

watch(element, () => {
  if (element.value) {
    resizeObserver = new ResizeObserver(fixPosition)
    resizeObserver.observe(element.value)
    addEventListener('resize', fixPosition)
  } else if (resizeObserver) {
    resizeObserver.disconnect()
    resizeObserver = null
    removeEventListener('resize', fixPosition)
  }
})

function windowPointerMove (event: PointerEvent) {
  const halfX = (window.innerWidth - (element.value?.clientWidth || 0)) / 2 - 16
  const halfY = (window.innerHeight - (element.value?.clientHeight || 0)) / 2 - 16
  x.value = Math.min(
    Math.max(
      -halfX,
      (event.pageX - xx) + xxx
    ),
    halfX
  )
  y.value = Math.min(
    Math.max(
      -halfY,
      (event.pageY - yy) + yyy
    ),
    halfY
  )
}

function windowPointerUp () {
  xxx = x.value
  yyy = y.value
  removeEventListener('pointermove', windowPointerMove)
}

function headerPointerDown (event: PointerEvent) {
  if (event.target === event.currentTarget) {
    xx = event.pageX
    yy = event.pageY

    addEventListener('pointermove', windowPointerMove)
    addEventListener('pointerup', windowPointerUp, { once: true })
  }

}

const dialog = useDialog()

onMounted(() => {
  const expose = getCurrentInstance()?.exposed

  if (expose) {
    dialog.onMounted(expose as UiDialogExposes)
  }
})

onBeforeUnmount(() => {
  dialog.onBeforeUnmount(props.name)
  if (resizeObserver) {
    resizeObserver.disconnect()
  }
  removeEventListener('resize', fixPosition)
})

defineExpose({
  shown,
  element,
  props
})
</script>

<style lang="scss">

.dialog {
  transition: var(--transition-default);
}

.dialog-enter-active,
.dialog-leave-active {
  transition: var(--transition-default);
}

.dialog-enter-from,
.dialog-leave-to {
  opacity: 0;
  scale: 0.8;
}

.ui-dialog {
  display: flex;
  flex-flow: column;
  --background-color: var(--surface-overlay);
  background-color: var(--background-color);
  min-width: 256px;
  min-height: 96px;
  translate: var(--x) var(--y);
  pointer-events: all;
  user-select: text;
  -webkit-user-drag: unset;
  border-radius: 8px;
  box-shadow: 0 0 6px #00000040;

  &__header {
    display: flex;
    align-items: center;
    padding: 8px 8px 8px 16px;
    justify-content: space-between;
    user-select: none;

    * {
      user-select: text;
    }
  }

  &__body {
    flex-grow: 1;
    padding: 16px 16px;
    display: flex;
    flex-flow: column;
    gap: 12px;
    box-shadow: inset 0 8px 8px -8px #00000040;
  }

  &__footer {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 8px 16px;
    gap: 8px;
  }
}
</style>
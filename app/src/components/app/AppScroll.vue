<template>
  <transition name="fade">
    <div
      v-show="show"
      ref="scrollbar"
      role="scrollbar"
      class="app-scrollbar"
      :style="style"
      @pointerdown="pointerdown"
    />
  </transition>
</template>

<script
  setup
  lang="ts"
>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'

class ScrollBarStyle {
  '--scrollbar-bottom' = '0'
  _scrollbarBottom = 0
  get scrollbarBottom () {
    return this._scrollbarBottom
  }
  set scrollbarBottom (value: number) {
    this['--scrollbar-bottom'] = (this._scrollbarBottom = value) + 'px'
  }

  '--thumb-height' = '0'
  _thumbHeight = 0
  get thumbHeight () {
    return this._thumbHeight
  }
  set thumbHeight (value: number) {
    this['--thumb-height'] = ((this._thumbHeight = value) * 100).toFixed(4)
  }

  '--thumb-top' = '0'
  _thumbTop = 0
  get thumbTop () {
    return this._thumbTop
  }
  set thumbTop (value: number) {
    this['--thumb-top'] = ((this._thumbTop = value) * 100).toFixed(4) + '%'
  }
}

const scrollbar = ref<HTMLElement>()
const style = ref(new ScrollBarStyle)
const html = document.documentElement
const show = computed(() => {
  return style.value.thumbHeight <= 0.90 && document.querySelectorAll('.app-main').length === 1
})

watch(() => style.value.thumbHeight, () => console.log(style.value.thumbHeight))

onMounted(function () {
  const footer = document.getElementById('app-footer')!
  const resizeObserver = new ResizeObserver(scrollHandler)

  function calculateHeight () {
    const { innerHeight } = window
    const { scrollTop, scrollHeight } = html
    const scrollHeightSubInnerHeight = scrollHeight - innerHeight
    style.value.scrollbarBottom = -Math.min(0, scrollHeightSubInnerHeight - scrollTop - footer.clientHeight)

    style.value.thumbHeight = innerHeight / scrollHeight
    style.value.thumbTop = scrollTop / scrollHeightSubInnerHeight
  }

  function scrollHandler () {
    if (!window.matchMedia('(max-width: 768px)').matches && !window.matchMedia('(hover: none)').matches) {
      calculateHeight()
    }
  }

  addEventListener('scroll', scrollHandler)
  addEventListener('resize', scrollHandler)
  resizeObserver.observe(html)

  onUnmounted(function () {
    removeEventListener('scroll', scrollHandler)
    removeEventListener('resize', scrollHandler)
    resizeObserver.unobserve(html)
    resizeObserver.disconnect()
  })
})

let down = 0
let scrollTopDown = 0

function pointermove (event: PointerEvent): void {
  const scrollBound = html.scrollHeight - window.innerHeight
  const percent = scrollBound / (window.innerHeight - 56 -
    parseFloat(window.getComputedStyle(scrollbar.value!, ':after').height))
  html.scrollTop = Math.max(Math.min(scrollTopDown - (down - event.y) * percent, scrollBound), 0)
}

function isThumb (event: PointerEvent): boolean {
  const { height, top } = window.getComputedStyle(scrollbar.value!, '::after')
  return event.offsetY >= parseFloat(top) && event.offsetY <= parseFloat(top) + parseFloat(height)
}

function pointerdown (event: PointerEvent): void {
  if (!isThumb(event)) {
    const height = parseFloat(window.getComputedStyle(scrollbar.value!, '::after').height)
    html.scrollTop = Math.max(
      Math.min(
        ((event.offsetY + height / 2) / scrollbar.value!.clientHeight) * html.scrollHeight - window.innerHeight,
        html.scrollHeight - window.innerHeight
      ), 0)
  }
  down = event.y
  scrollTopDown = html.scrollTop
  scrollbar.value!.classList.add('app-scrollbar_active')
  document.documentElement.classList.add('prevent-scrolling_scrollbar')
  addEventListener('pointermove', pointermove)
  addEventListener('pointerup', pointerup)
  pointermove(event)
}

function pointerup (event: PointerEvent): void {
  removeEventListener('pointermove', pointermove)
  scrollbar.value!.classList.remove('app-scrollbar_active')
  document.documentElement?.classList.remove('prevent-scrolling_scrollbar')
}
</script>

<style lang="scss">
.app-scrollbar {
  position: fixed;
  width: 10px;
  right: 0;
  top: var(--header-height);
  height: calc(100% - var(--header-height) - var(--scrollbar-bottom));
  -webkit-user-drag: none;
  user-select: none;
  --scrollbar-width: 7px;

  &_active,
  &:hover {
    --scrollbar-width: var(--app-scrollbar-width);

    &::before {
      background-color: var(--surface-c);
    }

    &::after {
      background-color: var(--surface-d);
    }
  }

  &::before, &::after {
    position: absolute;
    content: ' ';
    width: var(--scrollbar-width);
    right: 0;
    transition: width var(--transition-fast), background-color var(--transition-linear-fast);
  }

  &::before {
    height: 100%;
    background-color: transparent;
    top: 0;
  }

  &::after {
    background-color: var(--surface-d);
    border-radius: 5px;
    border: 2px solid transparent;
    background-clip: content-box;
    height: calc(var(--thumb-height) * 1%);
    top: calc(var(--thumb-top) * (1 - var(--thumb-height) / 100));
  }
}

@media (max-width: 768px) {
  .app-scrollbar {
    display: none !important;
  }
}

@media (hover: none) {
  .app-scrollbar {
    display: none !important;
  }
}
</style>
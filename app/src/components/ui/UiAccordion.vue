<template>
  <div
    ref="accordion"
    class="ui-accordion"
    :data-accordion-state="state"
    :style="{
      '--ui-accordion-duration': computedDuration,
      '--ui-accordion-easing': easing
    }"
  >
    <slot />
  </div>
</template>

<script
  setup
  lang="ts"
>
import { computed, onBeforeMount, onBeforeUnmount, Ref, ref } from 'vue'

type Props = {
  collapsed?: boolean,
  duration?: number | `${number}`
  easing?: CSSStyleDeclaration['transitionTimingFunction']
}

const props = withDefaults(defineProps<Props>(), {
  collapsed: false,
  duration: 250,
  easing: 'ease-in-out'
})

type UiAccordionState = 'unknown' |
  'start-collapsing' | 'collapsing' | 'collapsed' |
  'start-extending' | 'extending' | 'extended'

const state = ref<UiAccordionState>('unknown')
const timeoutId = ref<number>(-1)
const animationId = ref<number>(-1)
const accordion = ref<HTMLElement>() as Ref<HTMLElement>

const computedDuration = computed(function () {
  const value = +props.duration

  return isFinite(value) && value >= 0 ? value : 250
})

function clearAccordionTimeout (): boolean {
  if (timeoutId.value !== -1) {
    clearTimeout(timeoutId.value)
    timeoutId.value = -1
    return true
  }
  return false
}

function clearAccordionAnimation (): boolean {
  if (animationId.value !== -1) {
    cancelAnimationFrame(animationId.value)
    animationId.value = -1
    return true
  }
  return false
}

function startCollapsing (): void {
  state.value = 'start-collapsing'
  clearAccordionTimeout()
  clearAccordionAnimation()
  accordion.value.style.height = `${accordion.value.clientHeight}px`
  animationId.value = requestAnimationFrame(collapsing)
}

function collapsing (): void {
  animationId.value = -1
  accordion.value.style.height = '0'
  state.value = 'collapsing'
  timeoutId.value = setTimeout(endCollapsing, computedDuration.value)
}

function endCollapsing (): void {
  timeoutId.value = -1
  accordion.value.style.removeProperty('height')
  state.value = 'collapsed'
}

function startExtending (): void {
  state.value = 'start-extending'
  clearAccordionTimeout()
  accordion.value.style.height = clearAccordionAnimation() ? `${accordion.value.clientHeight}px` : '0'
  animationId.value = requestAnimationFrame(extending)
}

function extending (): void {
  animationId.value = -1
  state.value = 'extending'
  accordion.value.style.height = `${accordion.value.scrollHeight}px`
  timeoutId.value = setTimeout(endExtending, computedDuration.value)
}

function endExtending (): void {
  timeoutId.value = -1
  accordion.value.style.removeProperty('height')
  state.value = 'extended'
}

onBeforeMount(function (): void {
  state.value = props.collapsed ? 'collapsed' : 'extended'
})

onBeforeUnmount(function (): void {
  clearAccordionTimeout()
  clearAccordionAnimation()
})
</script>

<style lang="scss">
.ui-accordion {
  transition:
    height calc(var(--new-ui-accordion-duration, 250ms) * 1ms) var(--new-ui-accordion-easing),
    margin calc(var(--new-ui-accordion-duration, 250ms) * 1ms) var(--new-ui-accordion-easing);

  &[data-accordion-status=start-collapsing],
  &[data-accordion-status=collapsing],
  &[data-accordion-status=extending],
  &[data-accordion-status=start-extending] {
    overflow: hidden;
  }

  &[data-accordion-status=collapsing] {
    margin-block: 0;
  }

  &[data-accordion-status=extending] {
    transition:
      height calc(var(--new-ui-accordion-duration, 250ms) * 1ms) var(--new-ui-accordion-easing),
      margin calc(var(--new-ui-accordion-duration, 250ms) * 1ms) var(--new-ui-accordion-easing);
  }

  &[data-accordion-status=collapsed],
  &[data-accordion-status=start-extending] {
    margin-block: 0;
    transition:
      height 0ms var(--new-ui-accordion-easing),
      margin calc(var(--new-ui-accordion-duration, 250ms) * 1ms) var(--new-ui-accordion-easing);
  }

  &[data-accordion-status=collapsed] {
    display: none;
    height: 0;
  }
}
</style>
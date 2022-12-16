<template>
  <ui-button
    class="ui-button-async"
    :class="{
      'ui-button-async_progress': isProgress(progress),
      'ui-button-async_progress-unknown': isProgress(progress) && !isFinite(progress)
    }"
    :style="{
      '--ui-button-async-progress':
        isProgress(progress) && isFinite(progress)
          ? `${(progress * 100).toFixed(2)}%`
          : undefined
    }"
    :seriousness="seriousness"
    :appearance="appearanceProgress"
    :disabled="disabled || progress !== undefined"
    :size="size"
  >
    <span class="ui-button-async__text">
      <slot />
    </span>
    <svg
      class="ui-button-async__spinner"
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
    >
      <circle
        cx="12"
        cy="12"
        fill="none"
        stroke="currentColor"
        stroke-width="3"
        r="8"
        stroke-dasharray="150.79644737231007 52.26548245743669"
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          repeatCount="indefinite"
          dur="1.5s"
          values="0 12 12;360 12 12"
          keyTimes="0;1"
        />
        <animate
          attributeName="stroke-dasharray"
          repeatCount="indefinite"
          dur="2.1s"
          values="3.141875 43.98625 3.141875;21.993125 6.28375 21.993125;3.141875 43.98625 3.141875"
          keyTimes="0;0.5;1"
        />
      </circle>
    </svg>
  </ui-button>
</template>

<script
  setup
  lang="ts"
>
import UiButton from '@/components/ui/UiButton.vue'
import { computed } from 'vue'

type Props = {
  type?: 'button' | 'submit' | 'reset'
  seriousness?: 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'danger' | 'passive'
  appearance?: 'text' | 'outlined' | 'rounded' | 'rounded-outlined' | 'rounded-text'
  size?: 'small' | 'large'
  progress?: number
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: undefined,
  seriousness: undefined,
  appearance: undefined,
  size: undefined,
  progress: undefined,
  disabled: false
})

function isProgress (progress: undefined | number): progress is number {
  return typeof progress === 'number'
}

const appearanceProgress = computed(() => {
  if (isProgress(props.progress)) {
    if (!props.appearance) {
      return 'outlined'
    }
    if (props.appearance === 'rounded') {
      return 'rounded-outlined'
    }
  }
  return props.appearance
})

</script>
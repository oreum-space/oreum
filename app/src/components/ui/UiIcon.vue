<template>
  <svg
    class="ui-icon"
    :width="width"
    :height="height"
    xmlns="http://www.w3.org/2000/svg"
  >
    <use :href="`${icons}#${icon}`">
      <slot />
    </use>
  </svg>
</template>

<script
  setup
  lang="ts"
>
import icons from '@/assets/icon.svg'

type Props = {
  width?: number,
  height?: number,
  icon?: string
}

withDefaults(defineProps<Props>(), {
  width: 24,
  height: (props) => props.width || 24,
  icon: 'blob'
})
</script>

<style
  lang="scss"
  scoped
>

</style>
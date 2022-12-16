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
  icon?: string,
  width?: number,
  height?: number
}

withDefaults(defineProps<Props>(), {
  icon: 'blob',
  width: 24,
  height: (props) => props.width || 24
})
</script>

<style
  lang="scss"
  scoped
>

</style>
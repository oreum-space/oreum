<template>
  <svg
    class="ui-icon"
    :class="size !== 'default' ? `ui-icon_${size}` : undefined"
    :width="width"
    :height="height"
    xmlns="http://www.w3.org/2000/svg"
  >
    <use
      :href="`${icons}#${icon}`"
    >
      <slot />
    </use>
  </svg>
</template>

<script
  setup
  lang="ts"
>
import defaultIcons from '@/assets/icon.svg'

type Props = {
  size?: 'default' | 'small' | 'large',
  icon?: string,
  icons?: typeof defaultIcons,
  width?: number,
  height?: number
}

withDefaults(defineProps<Props>(), {
  icon: 'blob',
  size: 'default',
  width: 24,
  icons: defaultIcons,
  height: (props) => props.width || 24
})
</script>

<style
  lang="scss"
  scoped
>

</style>
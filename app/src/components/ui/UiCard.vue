<template>
  <component
    class="ui-card"
    :is="_tag_"
    :class="classes"
  >
    <slot />
  </component>
</template>

<script
  setup
  lang="ts"
>
import { computed } from 'vue'

type Props = {
  tag?: 'div' | 'section' | 'nav' | 'aside',
  row?: boolean
}

const
  props = defineProps<Props>(),
  _tag_ = computed(() => props.tag || 'div'),
  classes = computed(() => ({ ['ui-cord_row']: props.row }))
</script>
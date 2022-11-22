<template>
  <ui-accordion
    class="ui-table__wrapper ui-table__wrapper_accordion"
    :collapsed="collapsed"
  >
    <ui-button
      class="ui-table__toggle"
      appearance="text"
      size="small"
      seriousness="secondary"
      @click="collapsed = !collapsed"
    >
      <slot name="caption" />
      <img :src="arrowSvg" alt="dropdown">
    </ui-button>
    <table
      class="ui-table ui-table_accordion"
    >
      <caption v-if="$slots.caption">
        <slot name="caption" />
      </caption>
      <slot />
    </table>
  </ui-accordion>
</template>

<script
  setup
  lang="ts"
>
import UiAccordion from '@/components/ui/UiAccordion.vue'
import arrowSvg from '@/assets/elements/arrow.svg'
import UiButton from '@/components/ui/UiButton.vue'
import { ref } from 'vue'

const collapsed = ref<boolean>(true)

defineExpose({
  _collapsed: collapsed
})
</script>
<template>
  <teleport to="#app-dialog">
    <div
      ref="dialog"
      role="dialog"
      class="ui-dialog"
      :class="classes"
      :data-dialog-name="name"
      :data-dialog-shown="shown"
      @keydown.esc="keydownEsc"
    >
      <slot name="custom">
        <div
          v-if="!disableHeader"
          class="ui-dialog__header"
        >
          <slot name="header">
            <h4 v-if="title">
              {{ title }}
            </h4>
          </slot>
          <ui-icon-button />
        </div>
        <div
          v-if="disableBody"
          class="ui-dialog__body"
        >
          <slot name="body" />
        </div>
      </slot>
    </div>
  </teleport>
</template>

<script
  setup
  lang="ts"
>
import UiIconButton from '@/components/ui/UiIconButton.vue'
import { ref } from 'vue'

type Props = {
  title?: string,
  classes?: string,
  disableHeader?: boolean,
  disableBody?: boolean,
  disableFooter?: boolean,
  uniqueKey?: string,
  name: string,
  shownByDefault: boolean
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
const dialog = ref<HTMLElement>()
const shown = ref<boolean>(props.shownByDefault)

function keydownEsc (): void {
  shown.value = false
}
</script>

<style
  lang="scss"
  scoped
>

</style>
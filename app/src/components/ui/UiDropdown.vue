<template>
  <div
    class="ui-dropdown"
    :data-open="open"
  >
    <div class="ui-dropdown__head">
      <slot name="head">

      </slot>
    </div>
    <div class="ui-dropdown__body">
      <slot name="body">

      </slot>
    </div>
  </div>
</template>

<script
  setup
  lang="ts"
>
import { ref } from 'vue'

type Props = {
  autoClose: boolean
}

const props = withDefaults(defineProps<Props>(), {
  autoClose: false
})

const open = ref<boolean>(false)

function toggle (): void {
  open.value = !open.value
}
function show (): void {
  open.value = !open.value
}
function close (): void {

}

defineExpose({
  open,
  toggle,
  show,
  close
})
</script>

<style
  lang="scss"
  scoped
>

</style>
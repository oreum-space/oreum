<template>
  <aside
    id="app-dialog"
    ref="aside"
    class="app-dialog"
    :class="{
      'app-dialog_visible': !!dialogs.length
    }"
    @click="hide"
    @keydown.esc="hide"
  />
</template>

<script
  setup
  lang="ts"
>
import useDialog from '@/store/dialog'
import { computed, watch } from 'vue'

const dialog = useDialog()

const dialogs = computed(() => {
  return dialog.dialogs.filter(_ => _.exposes.shown)
})

watch(dialogs, (value) => {
  if (value.length) {
    document.documentElement.classList.add('prevent-scrolling_dialog')
  } else {
    document.documentElement.classList.remove('prevent-scrolling_dialog')
  }
})

function hide () {
  dialog.hide()
}

</script>

<style lang="scss">
.app-dialog {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transition: var(--transition-default);
  z-index: 20;
  display: flex;
  justify-content: center;
  align-items: center;
  pointer-events: none;
  user-select: none;
  -webkit-user-drag: none;

  &_visible {
    pointer-events: unset;
    background-color: var(--maskbg);
  }
}
</style>
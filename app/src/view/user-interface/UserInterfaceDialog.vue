<template>
  <ui-card>
    <ui-dialog
      name="ui-dialog"
    />
    <ui-button
      @click="dialog.show('ui-dialog')"
    >
      Default
    </ui-button>
  </ui-card>
</template>

<script
  setup
  lang="ts"
>
import UiButton from '@/components/ui/UiButton.vue'
import UiCard from '@/components/ui/UiCard.vue'
import UiDialog from '@/components/ui/UiDialog.vue'
import useDialog from '@/store/dialog'

const dialog = useDialog()
</script>

<style lang="scss">

</style>
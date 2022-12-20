import { defineStore } from 'pinia'

type UiDialogProps = {
  name: string,
  title?: string,
  classes?: string,
  disableHeader?: boolean,
  disableBody?: boolean,
  disableFooter?: boolean,
  uniqueKey?: string,
  shownByDefault?: boolean
}

export type UiDialogExposes = {
  shown: boolean
  element: HTMLElement
  props: UiDialogProps
}

class UiDialog {
  exposes: UiDialogExposes
  name: string

  constructor (exposes: UiDialogExposes) {
    this.exposes = exposes
    this.name = this.exposes.props.name
  }
}

type State = {
  dialogs: Array<UiDialog>
}

const useDialog = defineStore('dialog', {
  state: (): State => ({
    dialogs: []
  }),
  actions: {
    onMounted (exposes: UiDialogExposes): void {
      this.dialogs.push(new UiDialog(exposes))
    },
    onBeforeUnmount (name: string): void {
      this.dialogs = this.dialogs.filter(_ => _.name !== name)
    },
    show (name: string): void {
      const dialog = this.dialogs.find(_ => _.name === name)

      if (dialog && !dialog.exposes.shown) {
        dialog.exposes.shown = true
      }
    },
    hide (name?: string): void {
      if (name) {
        const dialog = this.dialogs.find(_ => _.name === name)

        if (dialog && dialog.exposes.shown) {
          dialog.exposes.shown = false
        }
        return
      }

      for (const dialog of this.dialogs) {
        if (dialog.exposes.shown) {
          dialog.exposes.shown = false
        }
      }
    }
  }
})

export default useDialog
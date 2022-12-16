<template>
  <div
    class="ui-tree-select-branch"
    tabindex="0"
    role="listitem"
  >
    <div
      class="ui-tree-select-branch__content"
      :class="{ 'ui-tree-select-branch__content_selected': selected && selected === option.value }"
      @click="selectOption(option.value)"
    >
      <slot
        :option="option"
      >
        <ui-button
          class="ui-tree-select-branch__toggle"
          :class="{ 'ui-tree-select-branch__toggle_collapsed': collapsed }"
          seriousness="secondary"
          appearance="text"
          size="small"
          @click.stop="toggle"
        >
          <ui-icon icon="select-arrow" />
        </ui-button>
        <span>
          {{ option.value }}
        </span>
      </slot>
    </div>
    <ui-accordion
      class="ui-tree-select-branch__children"
      :collapsed="collapsed"
    >
      <template
        v-for="child of option.children"
        :key="child"
      >
        <ui-tree-select-branch
          v-if="child.type === 'branch'"
          ref="branches"
          :option="child"
          :selected="selected"
          @select-option="selectOption"
        >
          <slot
            name="branch"
          />
          <template
            v-if="$slots.node"
            #node
          >
            <slot
              name="node"
            />
          </template>
        </ui-tree-select-branch>
        <ui-tree-select-node
          v-else
          :option="child"
          :selected="selected"
          @select-option="selectOption"
        >
          <template v-if="$slots.node">
            <slot name="node" />
          </template>
        </ui-tree-select-node>
      </template>
    </ui-accordion>
  </div>
</template>

<script
  setup
  lang="ts"
>
import UiTreeSelectBranch from '@/components/ui/tree-select/UiTreeSelectBranch.vue'
import UiTreeSelectNode from '@/components/ui/tree-select/UiTreeSelectNode.vue'
import UiAccordion from '@/components/ui/UiAccordion.vue'
import UiButton from '@/components/ui/UiButton.vue'
import UiIcon from '@/components/ui/UiIcon.vue'
import { ref, Ref } from 'vue'

type TOption = Ref['value']

type Props = {
  option?: TOption,
  selected?: TOption
}

type Emits = {
  (e: 'select-option', value: TOption, close: boolean): void
}

const props = defineProps<Props>()

const emits = defineEmits<Emits>()

const collapsed = ref<boolean>(true)

function toggle () {
  collapsed.value = !collapsed.value
}

function selectOption (option: TOption, close = true): void {
  emits('select-option', option, close)
}

const branches = ref<typeof UiTreeSelectBranch>()

function sendOpen (rightArrow = false): boolean {
  if (branches.value) {
    if (Array.isArray(branches.value)) {
      for (const branch of branches.value) {
        if (branch.toggleIfSelected(rightArrow)) {
          return true
        }
      }
    } else {
      return branches.value.toggleIfSelected(rightArrow)
    }
  }
  return false
}

function toggleIfSelected (rightArrow = false): boolean {
  if (props.selected === props.option.value) {
    if (rightArrow && !collapsed.value && props.option.children[0]) {
      selectOption(props.option.children[0], false)
      return true
    }
    toggle()
    return true
  }
  sendOpen(rightArrow)
  return false
}

function sendClose (parentValue: Props['selected']): boolean {
  if (branches.value) {
    if (Array.isArray(branches.value)) {
      for (const branch of branches.value) {
        const result = branch.close(parentValue)
        if (result) {
          return result
        }
      }
    } else {
      return branches.value.close(parentValue)
    }
  }
  return props.option.children.includes(parentValue)
}

function close (parentValue: Props['selected']): boolean {
  if (parentValue === props.option.value) {
    if (!collapsed.value) {
      collapsed.value = true
      return false
    }
    return true
  }
  return sendClose(parentValue)
}

defineExpose({
  toggleIfSelected,
  close
})
</script>

<style lang="scss">

</style>
<template>
  <ui-select
    ref="select"
    class="ui-tree-select"
    :label="label"
    :options="options"
    :model-value="modelValue"
    :keydown-actions="keydownActions"
  >
    <template #list>
      <template
        v-for="option of options"
        :key="option"
      >
        <ui-tree-select-branch
          v-if="option.type === 'branch'"
          ref="branches"
          :selected="modelValue"
          :option="option"
          @select-option="updateModelValue"
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
          :selected="modelValue"
          :option="option"
          @select-option="updateModelValue"
        >
          <slot
            name="node"
          />
        </ui-tree-select-node>
      </template>
    </template>
    <template
      v-if="$slots['no-options']"
      #no-options
    >
      <slot name="no-options" />
    </template>
  </ui-select>
</template>

<script
  setup
  lang="ts"
>
import UiSelect from '@/components/ui/UiSelect.vue'
import UiTreeSelectBranch from '@/components/ui/tree-select/UiTreeSelectBranch.vue'
import UiTreeSelectNode from '@/components/ui/tree-select/UiTreeSelectNode.vue'
import { computed, ref } from 'vue'
import type { Ref } from 'vue'

type TModelValue = Ref['value']

type TUiTreeSelectBranch = {
  type: 'branch',
  children: Array<TUiTreeSelectBranch | RUiTreeSelectNode>
  value: TModelValue
}

type RUiTreeSelectNode = TModelValue

type Props = {
  label?: string,
  modelValue?: TModelValue,
  options?: Array<TUiTreeSelectBranch | RUiTreeSelectNode>,
  disabled?: boolean,
  selectableBranches?: boolean
}

type Emits = {
  (e: 'update:modelValue', value: TModelValue): void
}

const props = withDefaults(defineProps<Props>(), {
  label: undefined,
  modelValue: undefined,
  options: () => [],
  selectableBranches: false
})

const emits = defineEmits<Emits>()

const select = ref<typeof UiSelect>() as Ref<typeof UiSelect>

type TCurrent = {
  parent: Props['options'] | TUiTreeSelectBranch,
  self: TModelValue
}

function childrenFromParent (parent: Exclude<Props['options'], undefined> | TUiTreeSelectBranch): Array<TModelValue> {
  return Array.isArray(parent) ? parent : parent.children
}

function findParent (possibleParent: TCurrent['parent'], value: TModelValue): TCurrent['parent'] | undefined {
  if (!possibleParent) {
    return
  }

  const children: Array<TUiTreeSelectBranch | TModelValue> = childrenFromParent(possibleParent)

  if (children.find(_ => _ === value || _.value === value)) {
    return possibleParent
  }

  for (const child of children) {
    if (child.type === 'branch') {
      const result = findParent(child, value)

      if (result) {
        return result
      }
    }
  }
}

const branches = ref<typeof UiTreeSelectBranch>()

function sendToggle (rightArrow = false): boolean {
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

function sendClose (parentValue: TModelValue): boolean {
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
  return false
}

let current = computed(() => props.modelValue && {
  parent: findParent(props.options, props.modelValue),
  self: props.modelValue
})

function getChildIndex (children: Array<TModelValue>) {
  return children.findIndex(_ => _ === current.value.self || _.value === current.value.self)
}

const keydownActions = {
  ['ArrowDown'] () {
    if (!select.value.open) {
      return select.value.open = true
    }
    if (!current.value || !current.value.parent) {
      return updateModelValue(props.options[0], false)
    }
    const children = childrenFromParent(current.value.parent)
    const index = getChildIndex(children)
    if (children[index + 1]) {
      updateModelValue(children[index + 1], false)
    }
  },
  ['ArrowUp'] () {
    if (!select.value.open) {
      return select.value.open = true
    }
    if (!current.value || !current.value.parent) {
      return updateModelValue(props.options.at(-1), false)
    }
    const children = childrenFromParent(current.value.parent)
    const index = getChildIndex(children)
    if (children[index - 1]) {
      updateModelValue(children[index - 1], false)
    }
  },
  ['Space'] () {
    if (!select.value.open) {
      return select.value.open = true
    }
    if (!current.value || !current.value.parent) {
      return updateModelValue(props.options[0], false)
    }
    sendToggle()
  },
  ['ArrowRight'] () {
    if (!select.value.open) {
      select.value.open = true
    }
    if (!current.value || !current.value.parent) {
      return updateModelValue(props.options[0], false)
    }
    sendToggle(true)
  },
  ['ArrowLeft'] () {
    if (!select.value.open) {
      return select.value.open = true
    }
    if (!current.value || !current.value.parent) {
      return updateModelValue(props.options[0], false)
    }
    if (current.value.self) {
      const result = sendClose(current.value.self)
      if (result && current.value.parent?.type === 'branch') {
        updateModelValue(current.value.parent, false)
      }
    }
  }
}

function updateModelValue (value: TModelValue, close = true): void {
  if (close) {
    select.value?.close()
  }
  emits('update:modelValue', value.type === 'branch' ? value.value : value)
}
</script>

<style lang="scss">
.ui-tree-select-node,
.ui-tree-select-branch__content {
  padding: 8px 8px;
  cursor: pointer;
  white-space: nowrap;
  text-overflow: ellipsis;
  max-width: 100%;
  overflow: clip;
  border-radius: 4px;
  transition: background-color var(--transition-fast);
  scrollbar-width: none;

  &:hover {
    background-color: var(--surface-c);
    overflow-x: scroll;
    text-overflow: unset;
  }
  
  &::-webkit-scrollbar {
    display: none;
  }

  &_selected {
    background-color: var(--primary-color);
    color: var(--primary-color-text);

    .ui-button {
      color: var(--primary-color-text);
    }
  }

  &_selected:hover {
    background-color: var(--primary-color-hover);
  }
}

.ui-tree-select .ui-select__list {
  padding-inline: 4px;
}

.ui-tree-select-branch__content {
  display: flex;
  gap: 8px;
  align-items: center;
}

.ui-tree-select-branch__toggle {
  padding: 4px;
  margin: -6px -4px;
  background-clip: content-box;
  border-radius: 8px;

  svg {
    transition: var(--transition-default);
  }

  &_collapsed svg {
    rotate: -90deg;
  }
}

.ui-tree-select-branch .ui-tree-select-branch {
  padding-left: 12px;
}

.ui-tree-select-branch .ui-tree-select-node {
  margin-left: 32px;
}
</style>

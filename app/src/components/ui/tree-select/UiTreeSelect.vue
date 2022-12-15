<template>
  <ui-select
    ref="select"
    class="ui-tree-select"
    :label="label"
    :options="options"
    :model-value="modelValue"
  >
    <template #list>
      <template
        v-for="option of options"
        :key="option"
      >
        <ui-tree-select-branch
          v-if="option.type === 'branch'"
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
import { ref } from 'vue'
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

withDefaults(defineProps<Props>(), {
  label: undefined,
  modelValue: undefined,
  options: () => [],
  selectableBranches: false
})

const emits = defineEmits<Emits>()

const select = ref<UiSelect>()

function updateModelValue (value: TModelValue): void {
  select.value.close()
  emits('update:modelValue', value)
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

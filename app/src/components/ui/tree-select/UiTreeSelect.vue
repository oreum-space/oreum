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
      <ui-tree-select-item
        v-for="item of computedItems"
        :key="item[valueKey]"
        ref="items"
        :item="item"
        :items-key="itemsKey"
        :value-key="valueKey"
        :model-value="modelValue"
        :directories-disabled="directoriesDisabled"
        :update-model-value="updateModelValueThenClose"
      />
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
import UiTreeSelectItem from '@/components/ui/tree-select/UiTreeSelectItem.vue'
import UiSelect from '@/components/ui/UiSelect.vue'
import { computed, ref } from 'vue'
import { IndexSymbol, InstanceSymbol, ParentSymbol, TItem, TItemRaw } from './ui-tree-select'

type Props = {
  label?: string,
  valueKey?: string,
  itemsKey?: string,
  modelValue?: RefAny,
  options?: Array<TItemRaw>,
  disabled?: boolean,
  directoriesDisabled?: boolean
}

type Emits = {
  (e: 'update:modelValue', value: RefAny): void
}

const props = withDefaults(defineProps<Props>(), {
  label: '',
  valueKey: 'value',
  itemsKey: 'items',
  modelValue: undefined,
  options: () => [],
  disabled: false,
  directoriesDisabled: false
})

const emits = defineEmits<Emits>()

const items = ref<Array<InstanceType<typeof UiTreeSelectItem>>>()
const select = ref<InstanceType<typeof UiSelect>>()

function recursiveItems (options = props.options, instances = items.value, parent?: TItem): Array<TItem> {
  const result: Array<TItem> = []

  for (const index in options) {
    const option = options[index]
    const instance = instances?.[index]
    const item: TItem = {
      [IndexSymbol]: parseInt(index),
      [props.valueKey]: option[props.valueKey] || option,
      [InstanceSymbol]: instance,
      [ParentSymbol]: parent
    }

    if (option[props.itemsKey]) {
      item[props.itemsKey] = recursiveItems(option[props.itemsKey], instance?.items, item)
    }

    result.push(item)
  }

  return result
}

const computedItems = ref<Array<TItem>>(recursiveItems())

function findRecursive (currentItems = computedItems.value): TItem | undefined {
  if (!currentItems) {
    return undefined
  }

  for (const currentItem of currentItems) {
    if (props.modelValue === (currentItem[props.valueKey] || currentItem)) {
      return currentItem
    }

    if (currentItem[props.itemsKey]) {
      const result = findRecursive(currentItem[props.itemsKey])

      if (result) {
        return result
      }
    }
  }
}

const currentItem = computed<TItem | undefined>(findRecursive)

function openIfClosed (): boolean {
  return select.value?.open === false
    ? select.value.open = true
    : false
}

function setRecursiveGrandParentNext (parent: TItem | undefined) {
  const grandParent = parent && parent[ParentSymbol]
  const grandParentList: Array<TItem> = grandParent?.[props.itemsKey] || computedItems.value
  const nextParent = parent && grandParentList[parent[IndexSymbol] + 1]

  if (nextParent) {
    updateModelValue(nextParent)
    return
  }

  if (grandParent) {
    setRecursiveGrandParentNext(grandParent)
  }
}

let prevent = false

const keydownActions = {
  ['ArrowDown'] () {
    if (prevent) {
      return
    }
    prevent = true
    setTimeout(() => prevent = false)
    if (openIfClosed()) {
      return
    }
    if (!currentItem.value) {
      if (computedItems.value?.length) {
        updateModelValue(computedItems.value.at(0))
      }
      return
    }
    if (currentItem.value[props.itemsKey]?.length && currentItem.value[InstanceSymbol]?.collapsed === false) {
      updateModelValue(currentItem.value[props.itemsKey][0])
      return
    }

    const parent = currentItem.value[ParentSymbol]
    const parentList: Array<TItem> = parent ? parent[props.itemsKey] : computedItems.value
    const nextItem: TItem | undefined = parentList[currentItem.value[IndexSymbol] + 1]

    if (nextItem) {
      updateModelValue(nextItem)
      return
    }

    setRecursiveGrandParentNext(parent)
  },
  ['ArrowUp'] () {
    if (openIfClosed()) {
      return
    }
    if (!currentItem.value) {
      if (computedItems.value?.length) {
        updateModelValue(computedItems.value.at(-1))
      }
      return
    }

    const parent = currentItem.value[ParentSymbol]
    const parentList: Array<TItem> = parent ? parent[props.itemsKey] : computedItems.value
    const prevItem: TItem | undefined = parentList[currentItem.value[IndexSymbol] - 1]

    if (prevItem) {
      if (prevItem[props.itemsKey]?.length && prevItem[InstanceSymbol]?.collapsed === false) {
        updateModelValue(prevItem[props.itemsKey].at(-1))
        return
      }
      updateModelValue(prevItem)
      return
    }

    if (currentItem.value[IndexSymbol] === 0 && parent) {
      updateModelValue(parent)
    }
  },
  ['Space'] () {
    if (openIfClosed()) {
      return
    }
    if (!currentItem.value) {
      if (computedItems.value?.length) {
        updateModelValue(computedItems.value.at(0))
      }
      return
    }
    const instance = currentItem.value[InstanceSymbol]

    if (instance && typeof instance.collapsed === 'boolean') {
      instance.collapsed = !instance.collapsed
    }
  },
  ['ArrowRight'] () {
    if (openIfClosed()) {
      return
    }
    if (!currentItem.value) {
      if (computedItems.value?.length) {
        updateModelValue(computedItems.value.at(0))
      }
      return
    }

    const instance = currentItem.value[InstanceSymbol]

    if (instance && typeof instance.collapsed === 'boolean') {
      if (instance.collapsed === true) {
        instance.collapsed = false
        return
      }
      if (currentItem.value[props.itemsKey]?.length) {
        updateModelValue(currentItem.value[props.itemsKey][0])
      }
    }
  },
  ['ArrowLeft'] () {
    if (openIfClosed()) {
      return
    }
    if (!currentItem.value) {
      if (computedItems.value?.length) {
        updateModelValue(computedItems.value.at(0))
      }
      return
    }

    const instance = currentItem.value[InstanceSymbol]

    if (instance && instance.collapsed === false) {
      instance.collapsed = true
      return
    }

    if (currentItem.value[ParentSymbol]) {
      updateModelValue(currentItem.value[ParentSymbol])
    }
  }
}

function updateModelValueThenClose (value: Props['modelValue']): void {
  updateModelValue(value)
  select.value?.close()
}

function updateModelValue (value: Props['modelValue']): void {
  if (value[InstanceSymbol] && value[InstanceSymbol].itemElement) {
    value[InstanceSymbol].itemElement?.scrollIntoView({ block: 'center' })
  }
  if (props.directoriesDisabled && value[props.itemsKey]) {
    return
  }
  emits('update:modelValue', value[props.valueKey] || value)
}
</script>

<style lang="scss">
.ui-tree-select {
  .ui-select__list {
    padding: 4px;
  }
}
</style>

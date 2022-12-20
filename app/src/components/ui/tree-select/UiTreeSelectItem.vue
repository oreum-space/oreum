<template>
  <div
    ref="itemElement"
    class="ui-tree-select-item"
    :class="{
      'ui-tree-select-item_directory': isDirectory,
      'ui-tree-select-item_collapsed': collapsed,
      'ui-tree-select-item_selected': modelValue === (item[valueKey] || item)
    }"
    :style="{ '--deep': deep }"
    role="listitem"
    @click="updateModelValue(item)"
  >
    <ui-icon-button
      v-if="isDirectory"
      class="ui-tree-select-item__toggle"
      appearance="text"
      seriousness="secondary"
      icon="collapse-arrow"
      size="small"
      @click.stop="collapsed = !collapsed"
    />
    <div class="ui-tree-select-item__content">
      <slot
        :item="item"
        :is-directory="isDirectory"
      >
        {{ item[valueKey] }}
      </slot>
    </div>
  </div>
  <template v-if="isDirectory">
    <ui-accordion :collapsed="collapsed">
      <ui-tree-select-item
        v-for="subItem of item[itemsKey]"
        :key="subItem[valueKey]"
        ref="items"
        :deep="nextDeep"
        :item="subItem"
        :items-key="itemsKey"
        :value-key="valueKey"
        :model-value="modelValue"
        :directories-disabled="directoriesDisabled"
        :update-model-value="updateModelValue"
        :parent-collapsed="collapsed"
      >
        <template v-if="$slots.default">
          <slot
            :item="item"
            :is-directory="isDirectory"
          />
        </template>
      </ui-tree-select-item>
    </ui-accordion>
  </template>
</template>

<script
  setup
  lang="ts"
>
import UiTreeSelectItem from '@/components/ui/tree-select/UiTreeSelectItem.vue'
import UiAccordion from '@/components/ui/UiAccordion.vue'
import UiIconButton from '@/components/ui/UiIconButton.vue'
import { getCurrentInstance, onMounted, ref, watch } from 'vue'
import { InstanceSymbol } from './ui-tree-select'
import type { TItem } from './ui-tree-select'

type Props = {
  item: TItem,
  updateModelValue: (value: RefAny) => void,
  valueKey: string,
  itemsKey: string,
  modelValue: RefAny | undefined,
  directoriesDisabled: boolean,
  deep?: number,
  parentCollapsed?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  deep: 0
})

const collapsed = props.item[props.itemsKey]
  ? ref<boolean>(true)
  : undefined

if (collapsed) {
  watch(() => props.parentCollapsed, () => {
    if (props.parentCollapsed) {
      collapsed.value = true
    }
  })
}

const nextDeep = props.deep + 1
const isDirectory = !!props.item[props.itemsKey]

const items = ref()

onMounted(() => {
  // eslint-disable-next-line vue/no-mutating-props
  props.item[InstanceSymbol] = getCurrentInstance()?.exposeProxy || undefined
})

const itemElement = ref<HTMLElement>()

defineExpose({
  item: props.item,
  itemElement,
  collapsed,
  items
})
</script>

<style lang="scss">
.ui-tree-select-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 8px 8px calc(28px + var(--deep) * 12px);
  cursor: pointer;
  white-space: nowrap;
  text-overflow: ellipsis;
  max-width: 100%;
  overflow: clip;
  border-radius: 4px;
  transition: background-color var(transition-fast);
  scrollbar-width: none;
  line-height: 24px;

  &_directory {
    padding: 8px 8px 8px calc(8px + var(--deep) * 12px);
  }

  svg {
    transition: rotate var(--transition-default);
  }

  &_collapsed svg {
    rotate: -90deg;
  }

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

    &,
    .ui-button {
      color: var(--primary-color-text);
    }

    &:hover {
      background-color: var(--primary-color-hover);
    }
  }

  &__toggle {
    margin: -2px;
  }
}
</style>
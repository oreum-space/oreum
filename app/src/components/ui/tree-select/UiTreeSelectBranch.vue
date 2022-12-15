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
          :option="child"
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
import UiTreeSelectNode from '@/components/ui/tree-select/UiTreeSelectNode.vue'
import UiAccordion from '@/components/ui/UiAccordion.vue'
import UiButton from '@/components/ui/UiButton.vue'
import UiIcon from '@/components/ui/UiIcon.vue'
import { ref } from 'vue'
import type { Ref } from 'vue'

type TOption = Ref['value']

type Props = {
  option?: TOption,
  selected?: TOption
}

type Emits = {
  (e: 'select-option', value: TOption): void
}

defineProps<Props>()

const emits = defineEmits<Emits>()

const collapsed = ref<boolean>(true)

function toggle () {
  collapsed.value = !collapsed.value
}

function selectOption (option: TOption): void {
  emits('select-option', option)
}
</script>

<style lang="scss">

</style>
<template>
  <div
    class="ui-tree-select-node"
    :class="{ 'ui-tree-select-node_selected': selected === option }"
    tabindex="0"
    role="listitem"
    @click="selectOption"
  >
    <slot
      :option="option"
      :select-option="selectOption"
    >
      {{ option }}
    </slot>
  </div>
</template>

<script
  setup
  lang="ts"
>
import type { Ref } from 'vue'

type TOption = Ref['value']

type Props = {
  option?: TOption,
  selected?: TOption
}

type Emits = {
  (e: 'select-option', value: TOption): void
}

const props = defineProps<Props>()

const emits = defineEmits<Emits>()

function selectOption (): void {
  emits('select-option', props.option)
}
</script>

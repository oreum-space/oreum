<template>
  <th
    ref="cell"
    class="ui-table-cell-diagonal"
    :style="{ '--ui-table-cell-diagonal-rotate': `${radians}rad` }"
  >
    <div class="ui-table-cell-diagonal__text">
      <div>
        {{ rowText }}
      </div>
      <div>
        {{ columnText }}
      </div>
    </div>
  </th>
</template>

<script
  setup
  lang="ts"
>
import { onBeforeUnmount, onMounted, Ref, ref } from 'vue'

type Props = {
  rowText: string,
  columnText: string
}

defineProps<Props>()
const cell = ref<HTMLTableCellElement>() as Ref<HTMLTableCellElement>
const radians = ref<number>(0)

const resizeObserver = new ResizeObserver(rotate)

function rotate () {
  const { clientHeight, clientWidth } = cell.value

  radians.value = Math.atan(clientHeight / clientWidth)
}

onMounted(() => {
  resizeObserver.observe(cell.value)
  rotate()
})

onBeforeUnmount(() => {
  resizeObserver.disconnect()
})

</script>

<style lang="scss">
.ui-table-cell-diagonal {
  background-image: linear-gradient(var(--ui-table-cell-diagonal-rotate, 0),
    var(--tcolp-background) calc(50% - 1px),
    var(--surface-border-a-static) calc(50% - 0.5px),
    var(--surface-border-a-static) calc(50% + 0.5px),
    transparent calc(50% + 1px));

  &__text {
    display: flex;
    flex-flow: column;
    align-items: center;
    justify-content: center;
    rotate: var(--ui-table-cell-diagonal-rotate, 0);
    height: fit-content;
    gap: 4px;
    padding-block: 0.5em;
    font-weight: normal;

    div {
      display: block;
      min-width: 100%;
    }
    div:first-child {
      padding-left: 1em;
    }
    div:last-child {
      padding-right: 1em;
    }
  }
}
</style>
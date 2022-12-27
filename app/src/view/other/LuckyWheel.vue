<template>
  <main class="app-main other-lucky-wheel">
    <div class="other-lucky-wheel__wheel">
      <div class="other-lucky-wheel__arrow" />
      <div
        class="other-lucky-wheel__winner"
        :class="{ 'other-lucky-wheel__winner_hidden': rotating }"
        :style="{
          backgroundColor: winner?.item?.color
        }"
      >
        {{ winner?.item.name || '' }}
      </div>
      <div
        class="other-lucky-wheel__content"
        :style="{ rotate: `${angle - 0.7853981633974483}rad` }"
      >
        <div class="other-lucky-wheel__shadow" />
        <template v-if="items.length">
          <div
            v-for="item of items"
            :key="item.name"
            :style="getItemStyle(item)"
            class="other-lucky-wheel__item"
            @click.left="currentItem = item; dialog.show('lucky-wheel-edit')"
            @click.prevent.right="currentItem = item; dialog.show('lucky-wheel-edit')"
            @click.middle="removeItem(item)"
          >
            <div class="other-lucky-wheel__item-content">
              <h3
                v-if="!item.image.endsWith('hide=true')"
                class="other-lucky-wheel__item-name"
              >
                {{ item.name }}
              </h3>
              <div
                v-if="item.image"
                class="other-lucky-wheel__item-image"
              />
              <div class="other-lucky-wheel__item-border" />
            </div>
          </div>
        </template>
        <div
          v-else
          class="other-lucky-wheel__empty"
        >
          <h2>
            Empty
          </h2>
        </div>
      </div>
      <ui-button
        class="other-lucky-wheel__add"
        size="large"
        seriousness="success"
        appearance="outlined"
        @click="dialog.show('lucky-wheel-add')"
      >
        <ui-icon
          icon="plus"
        />
        Add
      </ui-button>
      <ui-button
        class="other-lucky-wheel__start"
        size="large"
        seriousness="primary"
        appearance="outlined"
        :disabled="rotating"
        @click="wheel"
      >
        <ui-icon
          icon="dot"
        />
        Spin
      </ui-button>
    </div>
    <ui-dialog
      classes="other-lucky-wheel__dialog"
      name="lucky-wheel-edit"
      title="Edit"
    >
      <template #body>
        <div
          v-if="currentItem"
          class="other-lucky-wheel__general"
        >
          <ui-input-text
            label="Name"
            :model-value="currentItem.name"
            @update:model-value="currentItem && (currentItem.name = $event); items = [...items]"
          />
          <ui-input-text
            label="Value"
            :model-value="`${currentItem.value}` || ''"
            @update:model-value="currentItem && (currentItem.value = +$event); items = [...items]"
          />
        </div>
        <div
          v-if="currentItem"
          class="other-lucky-wheel__background"
        >
          <ui-input-color
            v-if="currentItem.color"
            :model-value="currentItem.color"
            @update:model-value="currentItem && (currentItem.color = `${$event}`); items = [...items]"
          />
          <ui-input-text
            v-if="currentItem.image"
            :model-value="currentItem.image"
            label="Image URL"
            @update:model-value="currentItem && (currentItem.image = $event); items = [...items]"
          />
        </div>
      </template>
      <template #footer>
        <ui-button
          seriousness="passive"
          appearance="outlined"
          @click="dialog.hide()"
        >
          Close
        </ui-button>
        <div style="flex: 1" />
        <ui-button
          seriousness="danger"
          appearance="outlined"
          @click="dialog.hide(); currentItem && removeItem(currentItem)"
        >
          Remove
        </ui-button>
      </template>
    </ui-dialog>
    <ui-dialog
      classes="other-lucky-wheel__dialog"
      name="lucky-wheel-add"
      title="New element"
      disable-footer
    >
      <template #body>
        <ui-tree-select
          :model-value="element"
          :options="elements"
          label="Element"
          directories-disabled
          @update:model-value="selectElement"
        >
          <template #selected="{ selected }">
            <div
              :style="{
                width: '16px',
                height: '16px',
                borderRadius: '4px',
                backgroundColor: selected?.value.color || '#808080',
                border: '1px solid var(--surface-border-a)'
              }"
            />
            <span>
              {{ selected?.value.name || '' }}
            </span>
            <small>
              <code>
                {{ selected?.value.value }}
              </code>
            </small>
          </template>
          <template #item="{ item, directory }">
            <ui-icon
              v-if="directory"
              class="other-lucky-wheel__folder"
              icon="folder-empty"
            />
            <div
              v-else
              :style="{
                width: '16px',
                height: '16px',
                borderRadius: '4px',
                backgroundColor: item.value.color,
                border: '1px solid var(--surface-border-a)'
              }"
            />
            <span>
              {{ item.value.name }}
            </span>
            <small>
              <code>
                {{ item.value.value }}
              </code>
            </small>
          </template>
        </ui-tree-select>
        <div class="other-lucky-wheel__general">
          <ui-input-text
            v-model="name"
            label="Name"
          />
          <ui-input-text
            v-model="value"
            label="Value"
          />
        </div>
        <div class="other-lucky-wheel__background">
          <ui-select
            v-model="background"
            label="Background"
            :options="backgrounds"
          />
          <ui-input-color
            v-if="background === backgrounds[1]"
            v-model="color"
          />
          <ui-input-text
            v-else
            v-model="image"
            label="Image URL"
          />
        </div>
        <div class="d-flex f-row g2 justify-between">
          <ui-button
            size="small"
            seriousness="success"
            appearance="text"
            @click="saveItem"
          >
            <ui-icon
              icon="plus"
            />
            Save
          </ui-button>
          <ui-button
            size="small"
            seriousness="success"
            appearance="default"
            @click="addItem"
          >
            <ui-icon
              icon="plus"
            />
            Add
          </ui-button>
        </div>
      </template>
    </ui-dialog>
  </main>
</template>

<script
  setup
  lang="ts"
>
import UiInputColor from '@/components/ui/input/color/UiInputColor.vue'
import UiInputText from '@/components/ui/input/UiInputText.vue'
import type { TItemRaw } from '@/components/ui/tree-select/ui-tree-select'
import UiTreeSelect from '@/components/ui/tree-select/UiTreeSelect.vue'
import UiButton from '@/components/ui/UiButton.vue'
import UiDialog from '@/components/ui/UiDialog.vue'
import UiIcon from '@/components/ui/UiIcon.vue'
import UiSelect from '@/components/ui/UiSelect.vue'
import localStorageRef from '@/library/localStorageRef'
import useDialog from '@/store/dialog'
import { computed, ref, watch } from 'vue'

interface ItemBase {
  name: string,
  value: number
}

interface ItemImage extends ItemBase {
  image: string
}

interface ItemColor extends ItemBase {
  color: string
}

type Item = ItemImage & ItemColor

const defaultItems = [
  {
    items: [
      {
        value: {
          name: 'Yes',
          color: '#689F38'
        }
      },
      {
        value: {
          name: 'No',
          color: '#D32F2F'
        }
      },
      {
        value: {
          name: 'One more time!',
          color: '#D4D4D4'
        }
      }
    ],
    value: { name: 'Simple' }
  },
  {
    items: [
      {
        value: {
          name: 'Valheim',
          color: '#00606f',
          image: 'https://cdn2.steamgriddb.com/file/sgdb-cdn/logo/70e12d315a19ad3e37b2593a58f37459.png?hide=true'
        }
      },
      {
        value: {
          name: 'Overwatch',
          color: '#ecca01',
          image: 'https://logolook.net/wp-content/uploads/2021/07/Overwatch-Logo-text.png?hide=true'
        }
      },
      {
        value: {
          name: 'Minecraft',
          color: '#0a601e'
        }
      },
      {
        value: {
          name: 'Red Dead Redemption 2',
          color: '#C40410',
          image:
            'https://upload.wikimedia.org/wikipedia/commons/2/22/Red_Dead_Redemption_2_Logo.png?hide=true'
        }
      },
      {
        value: {
          name: 'Apex Legends',
          color: '#F30101'
        }
      }
    ],
    value: {
      name: 'Games'
    }
  },
  {
    items: [
      {
        value: {
          name: 'YouTube',
          color: '#FF0000'
        }
      }
    ],
    value: {
      name: 'Watch'
    }
  }
]

const savedItems = localStorageRef<{
  items: Array<{ value: Item }>,
  value: {
    name: string
  }
}>('lucky-wheel:saved-items', {
  items: [],
  value: {
    name: 'Saved'
  }
})

const backgrounds = ['Image', 'Color']

const background = ref<string>(backgrounds[1])

const name = localStorageRef<string>('lucky-wheel:name', '')
const value = localStorageRef<string>('lucky-wheel:value', '1')
const color = localStorageRef<string>('lucky-wheel:color', '#808080')
const image = localStorageRef<string>('lucky-wheel:image', '')

const currentItem = ref<Item>()

watch(currentItem, () => items.value = [...items.value])

const computedCustom = computed(() => ({
  value: {
    name: name.value,
    value: value.value,
    color: color.value,
    image: image.value
  }
}))

const elements = computed(() => {
  return [
    ...defaultItems,
    savedItems.value
  ]
})

const _element = ref<unknown>(undefined)

watch([name, value, color, image], () => {
  _element.value = undefined
})

function selectElement (newElement: TItemRaw) {
  name.value = newElement.name || ''
  value.value = newElement.value || '1'
  color.value = newElement.color || '#808080'
  image.value = newElement.image || ''
}

const element = computed({
  get () {
    return _element.value || computedCustom.value
  },
  set (value) {
    _element.value = value
  }
})

const _defaultItems: Array<Item> = [
  {
    name: 'No',
    value: 1,
    color: '#D32F2F',
    image: ''
  },
  {
    name: 'Yes',
    value: 1,
    color: '#689F38',
    image: ''
  }
]
const items = localStorageRef<Array<Item>>('lucky-wheel:items', _defaultItems)
const totalValue = computed(() => items.value.reduce((a, _) => a + _.value, 0))
const angle = localStorageRef<number>('lucky-wheel:angle', Math.PI / 2)
const dialog = useDialog()
const rotating = ref<boolean>(false)

if (items.value.length === 0) {
  items.value = _defaultItems
  angle.value = Math.PI / 2
}

const winner = computed(() => {
  if (!items.value?.length) {
    return undefined
  }
  const items_ = items.value.map((item, index, array) => {
    const nextItem = array[index + 1]
    return {
      name: item.name,
      startRotate: Math.PI * 2 - -parseFloat(getRotate(item).slice(0, -3)),
      endRotate: nextItem ? Math.PI * 2 - -parseFloat(getRotate(nextItem).slice(0, -3)) : 0,
      item
    }
  })

  const angle_ = angle.value % (2 * Math.PI)

  let index = items_.findIndex(_ => _.startRotate >= angle_ && angle_ > _.endRotate)
  return items_.at(index === -1 ? 0 : index)
})

function saveItem (): void {
  const _value = +value.value
  savedItems.value = {
    ...savedItems.value,
    items: [
      ...savedItems.value.items.filter(option => option.value.name !== name.value), {
        value: {
          name: name.value,
          value: isNaN(_value) && _value <= 0 ? 1 : _value,
          image: image.value,
          color: color.value
        }
      }
    ]
  }
}

function isItemColor (item: Item): item is Item {
  return 'color' in item
}

function getClipPosition (percent: number): string {
  return `${200 * Math.cos(percent * Math.PI * 2) + 50}% ${200 * Math.sin(percent * Math.PI * 2) + 50}%`
}

function getClipPath (item: Item): string {
  const percent = item.value / totalValue.value
  const position = getClipPosition(percent)

  if (percent < 0.125) {
    return `polygon(50% 50%, 100% 50%, ${position})`
  }
  if (percent < 0.25) {
    return `polygon(50% 50%, 100% 50%, 100% 100%, ${position})`
  }
  if (percent < 0.375) {
    return `polygon(50% 50%, 100% 50%, 100% 100%, 50% 100%, ${position})`
  }
  if (percent < 0.5) {
    return `polygon(50% 50%, 100% 50%, 100% 100%, 50% 100%, 0 100%, ${position})`
  }
  if (percent < 0.625) {
    return `polygon(50% 50%, 100% 50%, 100% 100%, 50% 100%, 0 100%, 0 50%, ${position})`
  }
  if (percent < 0.75) {
    return `polygon(50% 50%, 100% 50%, 100% 100%, 50% 100%, 0 100%, 0 50%, 0 0, ${position})`
  }
  if (percent < 0.875) {
    return `polygon(50% 50%, 100% 50%, 100% 100%, 50% 100%, 0 100%, 0 50%, 0 0, 50% 0, ${position})`
  }
  return `polygon(50% 50%, 100% 50%, 100% 100%, 50% 100%, 0 100%, 0 50%, 0 0, 50% 0, 100% 0, ${position})`
}

function getRotate (item: Item): string {
  const percent = items.value.slice(0, items.value.indexOf(item)).reduce((a, _) => a + _.value, 0) / totalValue.value

  return `-${Math.PI * 2 * percent}rad`
}

function getHalf (item: Item): string {
  const percent = item.value / totalValue.value

  return `${Math.PI * 2 * percent / 2}rad`
}

function getItemStyle (item: Item): Record<string, string> {
  return {
    '--background-color': isItemColor(item) ? item.color + 'A0' : '#00000080',
    '--background-image': item.image ? `url('${item.image}')` : '',
    '--clip-path': getClipPath(item),
    '--rotate': getRotate(item),
    '--half': getHalf(item)
  }
}

function wheel2 () {
  rotating.value = false
}

function wheel1 () {
  if (isNaN(angle.value)) {
    angle.value = 0
  }
  angle.value = angle.value + (Math.random() * Math.PI * 10 + Math.PI * 5 + Math.random() * Math.PI)
  setTimeout(wheel2, 3000)
}

function wheel () {
  if (rotating.value === false) {
    rotating.value = true
    setTimeout(wheel1, 300)
  }
}

function removeItem (item: Item): void {
  items.value = items.value.filter(_ => _ !== item)
}

function addItem (): void {
  const _value = +value.value

  items.value = [
    ...items.value, {
      name: name.value,
      value: isNaN(_value) && _value <= 0 ? 1 : _value,
      color: color.value,
      image: image.value || ''
    }
  ]
}

</script>

<style lang="scss">
.other-lucky-wheel {
  display: flex;
  flex-flow: row;
  gap: var(--app-padding);
  align-items: center;
  justify-content: center;
  max-height: calc(var(--fvh) - var(--header-height));
  overflow: hidden;

  &__empty {
    position: absolute;
    top: 25%;
    left: 50%;
    translate: -50% -50%;
  }

  &__wheel {
    position: relative;
    width: min(calc(var(--fvh) - var(--header-height) - var(--app-padding) * 3),
    calc(100vw - var(--app-padding) * 2));
    min-height: min(min(
      calc(var(--fvh) - var(--header-height) - var(--app-padding) * 3),
      calc(100vw - var(--app-padding) * 2)), 1000px);
    max-height: 1000px;
    max-width: 1000px;
    border-radius: 50%;
    background-color: var(--surface-a);
    border: 4px solid var(--surface-border);
    box-shadow: 0 0 16px black;

    &::before {
      content: ' ';
      position: absolute;
      left: 50%;
      top: 50%;
      width: 10%;
      height: 10%;
      border-radius: 50%;
      translate: -50% -50%;
      background-color: var(--surface-b);
      border: 4px solid var(--surface-border);
      box-shadow: 0 0 16px black, inset 0 0 16px black;
      z-index: 2;
    }
  }

  &__shadow {
    position: absolute;
    z-index: 1;
    width: 100%;
    height: 100%;
    top: 0;
    border-radius: 50%;
    box-shadow: inset 0 0 16px black;
    pointer-events: none;
  }

  &__content {
    display: flex;
    width: 100%;
    height: 100%;
    position: relative;
    padding: 50% 0;
    overflow: hidden;
    border-radius: 50%;
    transition: rotate cubic-bezier(0.345, -0.215, 0.000, 1.000) 3250ms;
  }

  &__item {
    position: absolute;
    top: 0;
    left: 50%;
    translate: -50% 0;
    transform-origin: 50% 50%;
    height: 100%;
    width: 100%;
    rotate: calc(var(--rotate) * -1);
    border-radius: 50%;
    background-color: var(--background-color);
    clip-path: var(--clip-path);
  }
  
  &__item-content {
    position: relative;
    left: 50%;
    top: 0;
    height: 100%;
    width: 50%;
    transform-origin: center left;
    rotate: var(--half);
  }

  &__item-name {
    position: absolute;
    left: 55%;
    top: 50%;
    translate: -50% -50%;
    max-width: 95%;
  }

  &__item-image {
    position: absolute;
    left: 55%;
    top: 50%;
    translate: -50% -50%;
    width: 80%;
    height: 50%;
    background-image: var(--background-image);
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center center;
  }

  &__item-border {
    position: relative;
  }

  &__winner {
    position: absolute;
    left: 88%;
    top: 12%;
    translate: 0 -100%;
    padding: 4px 8px;
    border-radius: 4px;
    transition: 250ms;
    z-index: 2;

    &_hidden {
      opacity: 0;
    }
  }

  &__arrow {
    position: absolute;
    left: 50%;
    top: -5%;
    width: 5%;
    height: 10%;
    translate: -50% 0;
    background-color: var(--text-color);
    clip-path: polygon(50% 0, 0 25%, 50% 100%, 100% 25%);
    transform-origin: 50% 550%;
    rotate: 45deg;
    z-index: 2;

    &::before {
      position: absolute;
      content: ' ';
      width: 100%;
      height: 100%;
      background-color: var(--info-color);
      clip-path: polygon(50% 4px, 4px 25%, 50% calc(100% - 8px), calc(100% - 4px) 25%);
    }
  }

  &__start {
    position: absolute;
    left: 0;
    bottom: 0;
  }

  &__add {
    position: absolute;
    right: 0;
    bottom: 0;
  }

  &__dialog .ui-dialog__body {
    & > .ui-input-text,
    & > .ui-select {
      --width: min(calc(100vw - 64px), 480px);
    }
  }

  &__dialog {
    .ui-tree-select-item__content {
      max-width: 100%;
      width: 100%;
      span {
        display: flex;
        flex: 1 1;
      }

      code {
        flex-shrink: 0;
      }
    }
  }

  &__general {
    display: flex;
    flex-flow: row;
    justify-content: space-between;
    gap: 12px;
    max-width: calc(100vw - 64px);

    & .ui-input-text:first-child {
      --width: 100%;
    }

    & .ui-input-text:last-child {
      --width: 128px;
    }
  }

  &__background {
    display: flex;
    flex-flow: row;
    justify-content: space-between;
    --width: 128px;
    gap: 12px;
    max-width: calc(100vw - 64px);

    .ui-input-text {
      --width: 100%;
    }

    .ui-input-color,
    .ui-input-color__button {
      max-width: 100%;
      width: 100%;
    }
  }
}

.other-lucky-wheel__folder {
  margin-inline: -4px;
}

@media (max-aspect-ratio: 8 / 10) {
  .other-lucky-wheel {
    &__start,
    &__add {
      translate: 0 calc(100% + 8px);
    }
  }
}

@media (min-aspect-ratio: 4 / 3) and (max-width: 768px) {
  .other-lucky-wheel {
    &__start {
      translate: calc(-100% - 8px) 0;
    }
    &__add {
      translate: calc(100% + 8px) 0;
    }
  }
}


@media (max-width: 768px) {
  .other-lucky-wheel {
    &__arrow::before {
      clip-path: polygon(50% 3px, 3px 25%, 50% calc(100% - 6px), calc(100% - 3px) 25%);
    }
  }
}
</style>
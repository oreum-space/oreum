export const InstanceSymbol: unique symbol = Symbol('ui-tree-select-item')
export const ParentSymbol: unique symbol = Symbol('ui-tree-select-parent')
export const IndexSymbol: unique symbol = Symbol('ui-tree-select-index')

interface TWithInstance {
  [InstanceSymbol]?: Record<string, RefAny>
}

export type TItemRaw = { [field: string]: Array<RefAny> | RefAny } | RefAny

export interface TItem extends TWithInstance {
  [IndexSymbol]: number,
  [field: string]: Array<RefAny | TItem> | RefAny,
  [ParentSymbol]?: TItem
}

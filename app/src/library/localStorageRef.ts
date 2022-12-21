import { computed, ref } from 'vue'

type LocalStorageRefOptions<T> = {
  parser?: (string: string) => T
  stringifier?: (value: T) => string
}

export default function localStorageRef<T> (key: string, defaultValue: T, options?: LocalStorageRefOptions<T>) {
  const localString = localStorage.getItem(key)
  const value: T = localString ? (options?.parser || JSON.parse)(localString) : defaultValue

  const reference = ref(value)

  return computed({
    get () {
      return reference.value
    },
    set (value): void {
      reference.value = value
      localStorage.setItem(key, JSON.stringify(value))
    }
  })
}
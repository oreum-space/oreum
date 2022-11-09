import { defineStore } from 'pinia'

interface Auth {
  id: number,
  username: string,
  access: string
}

interface State {
  id: number | null,
  username: string | null,
  access: string | null
}

function state (): State {
  const local = localStorage.getItem('web-token:auth')

  const data = local ? JSON.parse(local) as Auth : { id: null, username: null, access: null }

  return { ...data }
}

const useProfile = defineStore('profile', {
  state
})

export default useProfile
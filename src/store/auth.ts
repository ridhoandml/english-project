import type { User } from "firebase/auth"
import { defineStore } from "pinia"

export const useAuth = defineStore('auth', {
  state: () => {
    return {
      user: null as User | null,
      authError: null,
    }
  },
  actions: {
    setUser (user: any) {
      this.user = user
    },
    setAuthError(error: any) {
      this.authError = error
    }
  },
})
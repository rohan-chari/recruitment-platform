import { defineStore } from 'pinia'
import { auth } from '../firebase'
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
} from 'firebase/auth'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
  }),
  actions: {
    async login(email, password) {
      const result = await signInWithEmailAndPassword(auth, email, password)
      this.user = result.user
    },
    async createUser(email, password) {
      await createUserWithEmailAndPassword(auth, email, password)
    },
    async logout() {
      await signOut(auth)
      this.user = null
    },
    fetchUser() {
      onAuthStateChanged(auth, (user) => {
        this.user = user ?? null
      })
    },
  },
})

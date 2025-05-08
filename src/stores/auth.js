import { defineStore } from 'pinia'
import { auth } from '../firebase'
import axios from 'axios'
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
} from 'firebase/auth'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    dbUser: null,
  }),
  getters: {
    userObject: (state) => state.user,
    userDbObject: (state) => state.dbUser,
  },
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
    async fetchUserFromDb() {
      const response = await axios.get(`https://vouchforme.org/api/user/get-user`, {
        params: {
          uid: this.user.uid,
          email: this.user.email,
        },
      })
      this.dbUser = response.data
    },
  },
})

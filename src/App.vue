<template>
  <router-view />
</template>

<script>
import { useAuthStore } from './stores/auth'
import { onMounted } from 'vue'
export default {
  setup() {
    const authStore = useAuthStore()

    onMounted(() => {
      authStore.fetchUser()
    })
  },
}
</script>

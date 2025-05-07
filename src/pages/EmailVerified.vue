<template>
  <q-page class="q-pa-lg flex flex-center primary-background-color">
    <q-card
      class="bg-white text-dark q-pa-xl shadow-2 rounded-borders"
      style="max-width: 500px; width: 100%"
    >
      <q-card-section class="text-center">
        <h2 class="text-h4 q-mb-sm primary-color">Verify Your Email</h2>
        <p class="text-body1">We’re verifying your email. Please wait...</p>
      </q-card-section>

      <q-card-section class="q-mt-md text-center">
        <q-spinner-dots v-if="!status" size="40px" color="primary" />
        <h5 class="primary-color">{{ status }}</h5>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { computed, onMounted, ref } from 'vue'
import { useAuthStore } from 'src/stores/auth'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

export default {
  props: {
    modelValue: {
      type: Boolean,
      required: true,
    },
  },
  setup() {
    const userStore = useAuthStore()
    const route = useRoute()
    const router = useRouter()
    const status = ref(null)

    onMounted(() => {
      verifyEmailToken()
    })

    const userObject = computed(() => userStore.userObject)

    const verifyEmailToken = async () => {
      const token = route.query.token
      if (!token) {
        status.value = 'Missing verification token.'
        return
      }

      try {
        await axios.get(`https://vouchforme.org/api/registration/verify-email?token=${token}`)
        status.value = 'Email verified! Redirecting...'
        setTimeout(() => router.push('/home'), 3000)
      } catch {
        status.value = 'Verification failed. The token may be invalid or expired.'
      }
    }

    return {
      userObject,
      verifyEmailToken,
      status,
    }
  },
}
</script>

<style scoped>
.rounded-borders {
  border-radius: 20px;
}
</style>

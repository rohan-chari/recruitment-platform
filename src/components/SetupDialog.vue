<template>
  <div class="q-pa-md q-gutter-sm">
    <q-dialog v-model="setupDialogModel">
      <q-card class="dialog-container">
        <q-card-section align="right">
          <q-icon flat name="close" class="close-btn" @click="setupDialogModel = false" />
        </q-card-section>

        <q-card-section class="q-pa-sm dialog-section" align="center">
          <h2 class="primary-color no-margin">Account Setup</h2>
          <h6 class="secondary-color no-margin">
            Let's get started by verifying your email address.
          </h6>
        </q-card-section>

        <q-card-section class="q-pa-sm dialog-section" align="center">
          <h6 class="primary-color no-margin">We’ll send a verification link to:</h6>
          <div class="row justify-center q-my-md verify-email-row">
            <q-input
              class="disabled-email-input"
              v-model="userObject.email"
              disable
              outlined
              rounded
            ></q-input>
            <q-btn
              label="Send Email"
              size="1.1rem"
              @click="handleSendVerificationEmail"
              rounded
              class="btn-primary"
            />
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useAuthStore } from 'src/stores/auth'
import axios from 'axios'

export default {
  props: {
    modelValue: {
      type: Boolean,
      required: true,
    },
  },
  setup(props, { emit }) {
    const setupDialogModel = computed({
      get: () => props.modelValue,
      set: (val) => emit('update:modelValue', val),
    })

    //const router = useRouter()
    //const $q = useQuasar()
    const userStore = useAuthStore()

    const userObject = computed(() => userStore.userObject)

    const handleSendVerificationEmail = async () => {
      await axios.post('https://vouchforme.org/api/registration/send-verification-email', {
        uid: userObject.value.uid,
        email: userObject.value.email,
      })
    }

    return {
      setupDialogModel,
      userObject,
      handleSendVerificationEmail,
    }
  },
}
</script>
<style scoped>
.disabled-email-input {
  width: fit-content;
}
.verify-email-row {
  gap: 1.75rem;
}
</style>

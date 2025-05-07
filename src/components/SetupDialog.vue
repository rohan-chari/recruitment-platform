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
        <q-card-section
          v-if="displayVerificationCode"
          class="q-pa-sm dialog-section q-mb-md"
          align="center"
        >
          <div class="row justify-center q-my-md q-gutter-sm">
            <q-input
              v-for="(digit, index) in code"
              :key="index"
              v-model="code[index]"
              maxlength="1"
              type="text"
              class="verification-box"
              outlined
              input-class="text-center"
              @keydown="handleKeyDown($event, index)"
              @keyup="handleKeyUp(index)"
              :ref="(el) => (codeInputs[index] = el)"
              @paste="handlePaste"
            />
          </div>
          <q-btn v-if="isCodeComplete" class="btn-primary" label="verify" @click="verifyCode" />
          {{ verificationStatus }}
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { computed, ref, nextTick } from 'vue'
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

    const displayVerificationCode = ref(false)
    const verificationStatus = ref(null)
    //const router = useRouter()
    //const $q = useQuasar()
    const userStore = useAuthStore()

    const userObject = computed(() => userStore.userObject)

    const isCodeComplete = computed(() => code.value.every((char) => char.length === 1))

    const handleSendVerificationEmail = async () => {
      await axios.post('https://vouchforme.org/api/registration/send-verification-email', {
        uid: userObject.value.uid,
        email: userObject.value.email,
      })
      displayVerificationCode.value = true
    }

    const code = ref(['', '', '', '', '', ''])
    const codeInputs = ref([])

    const focusNext = (index) => {
      if (code.value[index].length === 1 && index < 5) {
        nextTick(() => codeInputs.value[index + 1]?.focus())
      }
    }

    const handleKeyDown = (event, index) => {
      if (event.key === 'Backspace' && !code.value[index] && index > 0) {
        codeInputs.value[index - 1]?.focus()
      }
    }

    const handleKeyUp = (index) => {
      if (code.value[index].length === 1 && index < code.value.length - 1) {
        nextTick(() => codeInputs.value[index + 1]?.focus())
      }
    }

    const handlePaste = (event) => {
      const pasted = event.clipboardData.getData('text').trim()

      if (/^\d{6}$/.test(pasted)) {
        // valid 6-digit code
        for (let i = 0; i < 6; i++) {
          code.value[i] = pasted[i]
        }

        // Focus last input so users can hit Enter or trigger validation
        nextTick(() => codeInputs.value[5]?.focus())
      }

      event.preventDefault() // prevent default paste behavior
    }

    const verifyCode = async () => {
      const token = code.value.join('')
      const response = await axios.get(
        `https://vouchforme.org/api/registration/verify-email?token=${token}`,
      )

      if (response.data.emailVerified) {
        verificationStatus.value = 'YERRRRR'
      } else {
        verificationStatus.value = 'NAURRRR'
      }
    }

    return {
      setupDialogModel,
      userObject,
      handleSendVerificationEmail,
      focusNext,
      handleKeyDown,
      displayVerificationCode,
      code,
      codeInputs,
      handleKeyUp,
      handlePaste,
      isCodeComplete,
      verifyCode,
      verificationStatus,
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
.verification-box {
  width: 48px;
  height: 48px;
  font-size: 24px;
  border-radius: 8px;
}
</style>

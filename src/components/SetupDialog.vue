<template>
  <div class="q-pa-md q-gutter-sm">
    <q-dialog v-model="setupDialogModel">
      <q-card class="dialog-container">
        <q-card-section align="right">
          <q-icon flat name="close" class="close-btn" @click="setupDialogModel = false" />
        </q-card-section>
        <div class="row">
          <div class="col-12 col-md-4 text-center q-pl-lg">
            <div
              class="row setup-nav-bar q-pa-sm q-my-sm"
              @click="handleSetupNavStep('Email Verification')"
              :class="{ 'active-setup-nav': activeSetupNav === 'Email Verification' }"
            >
              <h6 v-if="!isEmailVerificationComplete" class="circle-num no-margin">1</h6>
              <q-icon v-if="isEmailVerificationComplete" class="checkbox" name="task_alt" />
              <h6 class="q-ma-md">Email Verification</h6>
            </div>
            <q-separator />
            <div
              class="row setup-nav-bar q-pa-sm q-my-sm"
              @click="handleSetupNavStep('Occuptation')"
              :class="{ 'active-setup-nav': activeSetupNav === 'Occuptation' }"
            >
              <h6 class="circle-num no-margin">2</h6>
              <h6 class="q-ma-md">Occuptation</h6>
            </div>
            <q-separator />
            <div
              class="row setup-nav-bar q-pa-sm q-my-sm"
              @click="handleSetupNavStep('Goals & Intentions')"
              :class="{ 'active-setup-nav': activeSetupNav === 'Goals & Intentions' }"
            >
              <h6 class="circle-num no-margin">3</h6>
              <h6 class="q-ma-md">Goals & Intentions</h6>
            </div>
            <q-separator />
            <div
              class="row setup-nav-bar q-pa-sm q-my-sm"
              :class="{ 'active-setup-nav': activeSetupNav === 'Profile Picture & Bio' }"
              @click="handleSetupNavStep('Profile Picture & Bio')"
            >
              <h6 class="circle-num no-margin">4</h6>
              <h6 class="q-ma-md">Profile Picture & Bio</h6>
            </div>
            <q-separator />
            <div
              class="row setup-nav-bar q-pa-sm q-my-sm"
              @click="handleSetupNavStep('Preview Profile')"
              :class="{ 'active-setup-nav': activeSetupNav === 'Preview Profile' }"
            >
              <h6 class="circle-num no-margin">5</h6>
              <h6 class="q-ma-md">Preview Profile</h6>
            </div>
          </div>
          <div class="col-12 col-md-8 q-pa-md">
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
                  :disable="userDbObject?.emailVerified"
                  rounded
                  class="btn-primary"
                />
              </div>
              <q-card-section align="center">
                <div v-if="userDbObject?.emailVerified" class="row justify-center">
                  <h6 class="secondary-color no-margin">Email verified!</h6>
                </div>
              </q-card-section>
            </q-card-section>
            <q-card-section
              v-if="displayVerificationCode && !userDbObject?.emailVerified"
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
            </q-card-section>
          </div>
        </div>
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
    //const router = useRouter()
    //const $q = useQuasar()
    const userStore = useAuthStore()

    const userObject = computed(() => userStore.userObject)
    const userDbObject = computed(() => userStore.userDbObject)

    const isCodeComplete = computed(() => code.value.every((char) => char.length === 1))

    //navsteps completion status
    const isEmailVerificationComplete = computed(() => userDbObject.value?.emailVerified)

    const activeSetupNav = ref('Email Verification')

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
        for (let i = 0; i < 6; i++) {
          code.value[i] = pasted[i]
        }

        nextTick(() => codeInputs.value[5]?.focus())
      }

      event.preventDefault()
    }

    const verifyCode = async () => {
      const token = code.value.join('')
      await axios.get(`https://vouchforme.org/api/registration/verify-email?token=${token}`)
      userStore.fetchUserFromDb()
    }

    const handleSetupNavStep = (step) => {
      activeSetupNav.value = step
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
      userDbObject,
      handleSetupNavStep,
      activeSetupNav,
      isEmailVerificationComplete,
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
.dialog-container {
  width: 100%;
  max-width: 900px;
}

@media (min-width: 600px) {
  .dialog-container {
    min-height: 400px;
  }
}
.setup-nav-bar {
  align-items: center;
  border-radius: 15px;
}
.setup-nav-bar:hover {
  cursor: pointer;
  background-color: rgb(219, 219, 219);
}
.circle-num {
  width: 2.5rem;
  height: 2.5rem;
  line-height: 2.5rem;
  text-align: center;
  border-radius: 50%;
  border: 2px solid #000;
  display: inline-block;
  font-size: 1.5rem;
}
.active-setup-nav {
  background-color: rgb(219, 219, 219);
}
</style>

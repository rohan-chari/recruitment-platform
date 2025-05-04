<template>
  <div class="q-pa-md q-gutter-sm">
    <q-dialog v-model="dialogModel">
      <q-card class="component-container">
        <q-card-section align="right">
          <q-icon flat name="close" class="close-btn" @click="dialogModel = false" />
        </q-card-section>

        <q-card-section class="q-pt-none dialog-section" align="center">
          <h4>Get Started</h4>
          <p class="secondary-color">Create your account to start chatting with recruiters.</p>
        </q-card-section>

        <q-card-section>
          <div v-if="registrationActive">
            <q-form @submit.prevent="handleCreateAccount">
              <h6 class="card-subheader">Create Account</h6>
              <div class="row sign-in-option">
                <p class="card-subheader secondary-color">Already have an account?</p>
                <p
                  class="card-subheader create-link"
                  @click="registrationActive = !registrationActive"
                >
                  Sign in here.
                </p>
              </div>
              <div class="create-org-form">
                <q-input
                  id="registrationEmail"
                  v-model="registrationEmail"
                  filled
                  dense
                  label="Email"
                ></q-input>
                <q-input
                  id="registrationEmailVerify"
                  v-model="registrationEmailVerify"
                  filled
                  dense
                  fill-input
                  label="Verify Email"
                ></q-input>
                <q-input
                  id="registrationPassword"
                  v-model="registrationPassword"
                  filled
                  dense
                  fill-input
                  label="Password"
                ></q-input>
                <q-input
                  id="registrationPasswordVerify"
                  v-model="registrationPasswordVerify"
                  filled
                  dense
                  fill-input
                  label="Verify Password"
                ></q-input>
                <q-btn rounded color="black" label="Create Account" type="submit" />
              </div>
            </q-form>
          </div>
          <div v-if="!registrationActive">
            <q-form @submit.prevent="handleSignIn">
              <h6 class="card-subheader">Create Account</h6>
              <div class="row sign-in-option">
                <p class="card-subheader secondary-color">Don't have an account?</p>
                <p
                  class="card-subheader create-link"
                  @click="registrationActive = !registrationActive"
                >
                  Sign up here.
                </p>
              </div>
              <div class="create-org-form">
                <q-input
                  id="signInEmail"
                  v-model="signInEmail"
                  filled
                  dense
                  label="Email"
                ></q-input>
                <q-input
                  id="signInPassword"
                  v-model="signInPassword"
                  filled
                  dense
                  fill-input
                  label="Password"
                ></q-input>
                <q-btn rounded color="black" label="Sign In" type="submit" />
              </div>
            </q-form>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useAuthStore } from 'src/stores/auth'

export default {
  props: {
    modelValue: {
      type: Boolean,
      required: true,
    },
  },
  setup(props, { emit }) {
    const dialogModel = computed({
      get: () => props.modelValue,
      set: (val) => emit('update:modelValue', val),
    })

    const router = useRouter()
    const $q = useQuasar()
    const authStore = useAuthStore()

    const registrationActive = ref(true)
    const registrationEmail = ref(null)
    const registrationEmailVerify = ref(null)
    const registrationPassword = ref(null)
    const registrationPasswordVerify = ref(null)

    const signInEmail = ref(null)
    const signInPassword = ref(null)

    const handleCreateAccount = async () => {
      if (
        registrationEmail.value !== registrationEmailVerify.value ||
        registrationPassword.value !== registrationPasswordVerify.value
      ) {
        $q.notify({ type: 'negative', message: 'Emails or passwords do not match.' })
        return
      }

      try {
        await authStore.createUser(registrationEmail.value, registrationPassword.value)
        router.push('/home')
        $q.notify({ type: 'positive', message: 'Account created successfully!' })
      } catch (err) {
        let msg = 'An unexpected error occurred.'
        if (err.code === 'auth/email-already-in-use') {
          msg = 'Email already exists.'
        } else if (err.code === 'auth/invalid-email') {
          msg = 'Invalid email format.'
        } else if (err.code === 'auth/weak-password') {
          msg = 'Password should be at least 6 characters.'
        }
        $q.notify({ type: 'negative', message: msg })
      }
    }
    const handleSignIn = async () => {
      if (!signInEmail.value || !signInPassword.value) {
        $q.notify({
          type: 'negative',
          message: 'Please ensure both the email and password fields are filled out',
        })
        return
      }

      try {
        await authStore.login(signInEmail.value, signInPassword.value)
        router.push('/home')
        $q.notify({ type: 'positive', message: 'Signed in successfully!' })
      } catch (err) {
        let msg = 'An unexpected error occurred.'
        switch (err.code) {
          case 'auth/user-not-found':
            msg = 'No account found with this email.'
            break
          case 'auth/wrong-password':
            msg = 'Incorrect password.'
            break
          case 'auth/invalid-email':
            msg = 'Invalid email format.'
            break
          case 'auth/too-many-requests':
            msg = 'Too many failed attempts. Please try again later.'
            break
          case 'auth/network-request-failed':
            msg = 'Network error. Check your internet connection.'
            break
        }
        $q.notify({ type: 'negative', message: msg })
      }
    }

    return {
      dialogModel,
      registrationEmail,
      registrationEmailVerify,
      registrationPassword,
      registrationPasswordVerify,
      handleCreateAccount,
      registrationActive,
      signInEmail,
      signInPassword,
      handleSignIn,
    }
  },
}
</script>
<style lang="scss" scoped>
.registration-icons {
  font-size: 10rem;
}
.icon-container {
  text-align: center;
  transition: transform 0.3s ease;
}

.icon-container:hover {
  background-color: rgba(209, 209, 209, 0.26);
  cursor: pointer;
  transform: scale(1.05);
}
.org-cand-container {
  gap: 3rem;
  padding-bottom: 1.5rem;
  justify-content: center;
}
.selected-user-type {
  border: 2.5px black solid !important;
}
.next-btn-container {
  justify-content: center;
  font-size: 2rem;
  gap: 1rem;
}
.next-btn {
  cursor: pointer;
  border: 2px solid black !important;
  border-radius: 50%;
  padding: 8px;
  font-size: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.next-btn:hover {
  background-color: black;
  transform: scale(1.15);
  transition: all 0.2s ease;
  color: white;
}
.component-container {
  width: 100%;
}
.org-missing-text {
  margin-top: 0.25rem;
  justify-content: center;
  font-size: 0.8rem;

  .secondary-color {
    color: #666;
    margin-right: 0.25rem;
  }
}
.create-org-container {
  text-align: center;
}

.create-link {
  color: #007aff;
  text-decoration: underline;
  cursor: pointer;
  font-weight: 500;
  transition: color 0.2s ease;

  &:hover {
    color: #005bbb;
  }
}
.sign-in-option {
  display: flex;
  gap: 0.2rem;
}
</style>

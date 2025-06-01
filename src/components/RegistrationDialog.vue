<template>
  <div class="q-pa-md q-gutter-sm">
    <q-dialog v-model="dialogModel">
      <q-card class="dialog-container">
        <q-card-section align="right">
          <q-icon flat name="close" class="close-btn" @click="dialogModel = false" />
        </q-card-section>

        <q-card-section class="dialog-section" align="center">
          <h2 class="text-h4 text-weight-medium q-mb-sm primary-color">Get Started</h2>
          <h6 class="text-subtitle1 text-grey-7 q-ma-none">
            Create your account to start collecting your references!
          </h6>
        </q-card-section>

        <q-card-section class="form-section">
          <div v-if="registrationActive">
            <q-form @submit.prevent="handleCreateAccount" class="auth-form">
              <div class="row justify-between items-center q-mb-lg">
                <h6 class="text-h6 text-weight-medium q-ma-none">Create Account</h6>
                <div class="row items-center">
                  <span class="text-subtitle1 text-grey-7">Already have an account?</span>
                  <q-btn
                    flat
                    dense
                    class="toggle-auth-btn"
                    label="Sign in here"
                    @click="registrationActive = !registrationActive"
                  />
                </div>
              </div>

              <div class="row q-col-gutter-md">
                <div class="col-12">
                  <q-input
                    id="registrationEmail"
                    v-model="registrationEmail"
                    class="modern-input"
                    outlined
                    label="Email"
                  />
                </div>
                <div class="col-12">
                  <q-input
                    id="registrationEmailVerify"
                    v-model="registrationEmailVerify"
                    class="modern-input"
                    outlined
                    label="Verify Email"
                  />
                </div>
                <div class="col-12">
                  <q-input
                    id="registrationPassword"
                    v-model="registrationPassword"
                    class="modern-input"
                    outlined
                    type="password"
                    label="Password"
                  />
                </div>
                <div class="col-12">
                  <q-input
                    id="registrationPasswordVerify"
                    v-model="registrationPasswordVerify"
                    class="modern-input"
                    outlined
                    type="password"
                    label="Verify Password"
                  />
                </div>
                <div class="col-12">
                  <q-btn
                    class="full-width btn-primary q-mt-md"
                    label="Create Account"
                    type="submit"
                  />
                </div>
              </div>
            </q-form>
          </div>

          <div v-else>
            <q-form @submit.prevent="handleSignIn" class="auth-form">
              <div class="row justify-between items-center q-mb-lg">
                <h6 class="text-h6 text-weight-medium q-ma-none">Sign In</h6>
                <div class="row items-center">
                  <span class="text-subtitle1 text-grey-7">Don't have an account?</span>
                  <q-btn
                    flat
                    dense
                    class="toggle-auth-btn"
                    label="Sign up here"
                    @click="registrationActive = !registrationActive"
                  />
                </div>
              </div>

              <div class="row q-col-gutter-md">
                <div class="col-12">
                  <q-input
                    id="signInEmail"
                    v-model="signInEmail"
                    class="modern-input"
                    outlined
                    label="Email"
                  />
                </div>
                <div class="col-12">
                  <q-input
                    id="signInPassword"
                    v-model="signInPassword"
                    class="modern-input"
                    outlined
                    type="password"
                    label="Password"
                  />
                </div>
                <div class="col-12">
                  <q-btn class="full-width btn-primary q-mt-md" label="Sign In" type="submit" />
                </div>
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
import axios from 'axios'

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

    const userObject = computed(() => authStore.userObject)

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
        await addUserToDb()
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

    const addUserToDb = async () => {
      await axios.post('https://vouchforme.org/api/user/create-user', {
        uid: userObject.value.uid,
        email: userObject.value.email,
      })
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
.dialog-container {
  width: 100%;
  max-width: 500px;
  border-radius: 16px;
  background: #ffffff;
}

.dialog-section {
  padding: 1.5rem 2rem;
}

.form-section {
  padding: 0 2rem 2rem;
}

.close-btn {
  font-size: 1.5rem;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    color: var(--btn-primary);
    transform: scale(1.1);
  }
}

.auth-form {
  .modern-input {
    :deep(.q-field__control) {
      height: 56px;
      border-radius: 8px;
      background: #f8f9fa;

      &:hover {
        border-color: rgba(233, 99, 108, 0.3);
      }

      &.q-field__control--focused {
        border-color: var(--btn-primary);
        background: #ffffff;
      }
    }

    :deep(.q-field__label) {
      top: 18px;
      font-size: 0.875rem;
      color: var(--text-secondary);
    }

    &.q-field--float :deep(.q-field__label) {
      transform: translateY(-30px) scale(0.75);
    }
  }
}

.toggle-auth-btn {
  color: var(--btn-primary);
  font-weight: 500;
  padding: 0 0.5rem;
  min-height: unset;

  &:hover {
    color: #d62f3a;
    background: transparent;
  }
}

.btn-primary {
  font-weight: 500;
  padding: 0.75rem;
  border-radius: 8px;
  transition: all 0.2s ease;

  &:hover {
    background-color: #d62f3a;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
}

@media (max-width: 600px) {
  .dialog-container {
    margin: 1rem;
  }

  .dialog-section,
  .form-section {
    padding: 1rem;
  }

  .auth-form {
    .modern-input {
      :deep(.q-field__control) {
        height: 48px;
      }
    }
  }
}
</style>

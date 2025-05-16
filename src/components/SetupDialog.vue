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
              :class="{ 'active-setup-nav': activeSetupNav === 'Profile Picture & Bio' }"
              @click="handleSetupNavStep('Profile Picture & Bio')"
            >
              <h6 v-if="!isPersonalDetailsComplete" class="circle-num no-margin">2</h6>
              <q-icon v-if="isPersonalDetailsComplete" class="checkbox" name="task_alt" />
              <h6 class="q-ma-md">Profile Picture & Bio</h6>
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
              @click="handleSetupNavStep('Occuptation')"
              :class="{ 'active-setup-nav': activeSetupNav === 'Occuptation' }"
            >
              <h6 class="circle-num no-margin">4</h6>
              <h6 class="q-ma-md">Occuptation</h6>
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
            <div v-if="activeSetupNav === 'Email Verification'">
              <q-card-section class="q-pa-sm dialog-section" align="center">
                <h2 class="primary-color no-margin">Account Setup</h2>
                <h6 class="secondary-color no-margin">
                  Let's get started by verifying your email address.
                </h6>
              </q-card-section>

              <q-card-section class="q-pa-sm dialog-section" align="center">
                <h6 class="primary-color no-margin">We'll send a verification link to:</h6>
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
                    :loading="isEmailSending"
                    :disable="userDbObject?.emailVerified || isEmailSending"
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
                <q-btn
                  v-if="isCodeComplete"
                  class="btn-primary"
                  label="verify"
                  :loading="isVerifying"
                  @click="verifyCode"
                />
              </q-card-section>
            </div>

            <div v-if="activeSetupNav === 'Profile Picture & Bio'">
              <q-card-section class="q-pa-sm dialog-section" align="center">
                <h2 class="primary-color no-margin">Personal Details</h2>
                <h6 class="secondary-color no-margin">Let's get some information about you.</h6>
              </q-card-section>

              <q-card-section class="q-pa-sm dialog-section" align="center">
                <h6 class="primary-color no-margin">Let's start with your name.</h6>
                <div class="row justify-center q-my-md verify-email-row">
                  <q-input
                    v-model="userDbObject.firstName"
                    outlined
                    rounded
                    class="col-12 col-md-6"
                    label="First Name"
                  ></q-input>
                  <q-input
                    v-model="userDbObject.middleName"
                    outlined
                    rounded
                    class="col-12 col-md-6"
                    label="Middle Initial (Optional)"
                  ></q-input>
                  <q-input
                    v-model="userDbObject.lastName"
                    outlined
                    rounded
                    class="col-12 col-md-6"
                    label="Last Name"
                  ></q-input>
                </div>
              </q-card-section>
              <q-card-section class="q-pa-sm dialog-section" align="center">
                <h6 class="primary-color no-margin">Next, lets see what you look like.</h6>
                <div v-if="imageUrl" class="row justify-center">
                  <div class="col-7">
                    <img :src="imageUrl" spinner-color="primary" class="profile-picture" />
                  </div>
                </div>
                <div class="row justify-center q-my-md verify-email-row">
                  <input
                    ref="fileInput"
                    type="file"
                    accept="image/*"
                    @change="handleFileChange"
                    class="hidden"
                  />

                  <q-btn
                    label="Upload Image"
                    icon="image"
                    class="btn-primary"
                    @click="triggerFileInput"
                    rounded
                  />
                </div>
              </q-card-section>
            </div>

            <div v-if="activeSetupNav === 'Goals & Intentions'">
              <q-card-section class="q-pa-sm dialog-section" align="center">
                <h2 class="primary-color no-margin">Goals & Intentions</h2>
                <h6 class="secondary-color no-margin">What are you looking to achieve?</h6>
              </q-card-section>

              <q-card-section class="q-pa-sm dialog-section">
                <q-select
                  v-model="userDbObject.goals"
                  :options="goalOptions"
                  multiple
                  outlined
                  label="Select your goals"
                  use-chips
                />
                <q-input
                  v-model="userDbObject.otherGoals"
                  outlined
                  type="textarea"
                  label="Other goals (optional)"
                  class="q-mt-md"
                />
              </q-card-section>
            </div>

            <div v-if="activeSetupNav === 'Occuptation'">
              <q-card-section class="q-pa-sm dialog-section" align="center">
                <h2 class="primary-color no-margin">Occupation</h2>
                <h6 class="secondary-color no-margin">Tell us about your work</h6>
              </q-card-section>

              <q-card-section class="q-pa-sm dialog-section">
                <q-input
                  v-model="userDbObject.occupation"
                  outlined
                  label="Current occupation"
                  class="q-mb-md"
                />
                <q-input
                  v-model="userDbObject.company"
                  outlined
                  label="Company (optional)"
                  class="q-mb-md"
                />
                <q-input
                  v-model="userDbObject.experience"
                  outlined
                  type="number"
                  label="Years of experience"
                />
              </q-card-section>
            </div>

            <div v-if="activeSetupNav === 'Preview Profile'">
              <q-card-section class="q-pa-sm dialog-section" align="center">
                <h2 class="primary-color no-margin">Preview Profile</h2>
                <h6 class="secondary-color no-margin">Review your information</h6>
              </q-card-section>

              <q-card-section class="q-pa-sm dialog-section">
                <div class="row justify-center q-mb-lg">
                  <q-avatar size="150px">
                    <img :src="imageUrl" />
                  </q-avatar>
                </div>
                <div class="row q-mb-md">
                  <div class="col-12">
                    <h5 class="no-margin">
                      {{ userDbObject?.firstName }} {{ userDbObject?.lastName }}
                    </h5>
                    <p class="text-subtitle1">
                      {{ userDbObject?.occupation }} at {{ userDbObject?.company }}
                    </p>
                  </div>
                </div>
                <div class="row q-mb-md">
                  <div class="col-12">
                    <h6 class="text-weight-bold">Goals</h6>
                    <q-chip
                      v-for="goal in userDbObject?.goals"
                      :key="goal"
                      color="primary"
                      text-color="white"
                      class="q-ma-xs"
                    >
                      {{ goal }}
                    </q-chip>
                  </div>
                </div>
              </q-card-section>
            </div>

            <!-- Navigation Buttons -->
            <q-card-section class="q-pa-md">
              <div class="row justify-between">
                <q-btn
                  flat
                  color="primary"
                  label="Back"
                  icon="arrow_back"
                  @click="goToPreviousStep"
                  :disable="activeSetupNav === 'Email Verification'"
                />
                <q-btn
                  color="primary"
                  label="Next"
                  icon-right="arrow_forward"
                  @click="goToNextStep"
                  :disable="activeSetupNav === 'Preview Profile'"
                />
              </div>
            </q-card-section>
          </div>
        </div>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { computed, ref, nextTick, watch } from 'vue'
import { useAuthStore } from 'src/stores/auth'
import { useQuasar } from 'quasar'
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
    const isEmailSending = ref(false)
    const isVerifying = ref(false)
    const $q = useQuasar()
    const userStore = useAuthStore()

    const userObject = computed(() => userStore.userObject)
    const userDbObject = computed(() => userStore.userDbObject)

    const isCodeComplete = computed(() => code.value.every((char) => char.length === 1))

    //navsteps completion status
    const isEmailVerificationComplete = computed(() => userDbObject.value?.emailVerified)
    const isPersonalDetailsComplete = computed(
      () => userDbObject.value?.firstName && userDbObject.value?.lastName && imageUrl.value,
    )

    const activeSetupNav = ref('Email Verification')

    const handleSendVerificationEmail = async () => {
      isEmailSending.value = true
      try {
        await axios.post('https://vouchforme.org/api/registration/send-verification-email', {
          uid: userObject.value.uid,
          email: userObject.value.email,
        })
        displayVerificationCode.value = true
        $q.notify({
          type: 'positive',
          message: 'Verification email sent successfully!',
        })
      } catch (err) {
        $q.notify({
          type: 'negative',
          message:
            err.response?.data?.message || 'Failed to send verification email. Please try again.',
        })
      } finally {
        isEmailSending.value = false
      }
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
      isVerifying.value = true
      try {
        const token = code.value.join('')
        await axios.get(`https://vouchforme.org/api/registration/verify-email?token=${token}`)
        await userStore.fetchUserFromDb()
        $q.notify({
          type: 'positive',
          message: 'Email verified successfully!',
        })
      } catch (err) {
        $q.notify({
          type: 'negative',
          message: err.response?.data?.message || 'Invalid verification code. Please try again.',
        })
      } finally {
        isVerifying.value = false
      }
    }

    const handleSetupNavStep = (step) => {
      // Prevent navigation to later steps if previous steps are not complete
      if (step === 'Profile Picture & Bio' && !isEmailVerificationComplete.value) {
        $q.notify({
          type: 'warning',
          message: 'Please complete email verification first',
        })
        return
      }

      if (step === 'Goals & Intentions' && !isPersonalDetailsComplete.value) {
        $q.notify({
          type: 'warning',
          message: 'Please complete your personal details first',
        })
        return
      }

      if (step === 'Occuptation' && !isGoalsComplete.value) {
        $q.notify({
          type: 'warning',
          message: 'Please complete your goals and intentions first',
        })
        return
      }

      if (step === 'Preview Profile' && !isOccupationComplete.value) {
        $q.notify({
          type: 'warning',
          message: 'Please complete your occupation details first',
        })
        return
      }

      activeSetupNav.value = step
    }

    // Add validation for personal details
    const validatePersonalDetails = () => {
      if (!userDbObject.value?.firstName?.trim()) {
        $q.notify({
          type: 'negative',
          message: 'Please enter your first name',
        })
        return false
      }

      if (!userDbObject.value?.lastName?.trim()) {
        $q.notify({
          type: 'negative',
          message: 'Please enter your last name',
        })
        return false
      }

      if (!imageUrl.value) {
        $q.notify({
          type: 'negative',
          message: 'Please upload a profile picture',
        })
        return false
      }

      return true
    }

    // Add completion status for all steps
    const isGoalsComplete = computed(() => {
      return userDbObject.value?.goals?.length > 0
    })

    const isOccupationComplete = computed(() => {
      return userDbObject.value?.occupation?.trim()
    })

    // Add navigation buttons
    const goToNextStep = () => {
      const steps = [
        'Email Verification',
        'Profile Picture & Bio',
        'Goals & Intentions',
        'Occuptation',
        'Preview Profile',
      ]

      const currentIndex = steps.indexOf(activeSetupNav.value)
      if (currentIndex < steps.length - 1) {
        handleSetupNavStep(steps[currentIndex + 1])
      }
    }

    const goToPreviousStep = () => {
      const steps = [
        'Email Verification',
        'Profile Picture & Bio',
        'Goals & Intentions',
        'Occuptation',
        'Preview Profile',
      ]

      const currentIndex = steps.indexOf(activeSetupNav.value)
      if (currentIndex > 0) {
        handleSetupNavStep(steps[currentIndex - 1])
      }
    }

    const fileInput = ref(null)
    const imageUrl = ref(null)
    const isUploading = ref(false)

    const triggerFileInput = () => {
      fileInput.value?.click()
    }

    const handleFileChange = async (event) => {
      const file = event.target.files[0]
      if (!file) return

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        $q.notify({
          type: 'negative',
          message: 'Image size should be less than 5MB',
        })
        return
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        $q.notify({
          type: 'negative',
          message: 'Please upload an image file',
        })
        return
      }

      isUploading.value = true
      try {
        // First read the file as data URL for preview
        const reader = new FileReader()
        reader.onload = async (e) => {
          imageUrl.value = e.target.result

          // Create form data for upload
          const formData = new FormData()
          formData.append('image', file)
          formData.append('uid', userObject.value.uid)

          // Upload to server
          await axios.post('https://vouchforme.org/api/user/upload-profile-picture', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          })

          $q.notify({
            type: 'positive',
            message: 'Profile picture uploaded successfully!',
          })

          // Refresh user data to get updated profile picture URL
          await userStore.fetchUserFromDb()
        }
        reader.readAsDataURL(file)
      } catch (err) {
        $q.notify({
          type: 'negative',
          message:
            err.response?.data?.message || 'Failed to upload profile picture. Please try again.',
        })
        imageUrl.value = null // Reset preview on error
      } finally {
        isUploading.value = false
      }
    }

    const goalOptions = [
      'Find a new job',
      'Network with professionals',
      'Showcase skills',
      'Get recommendations',
      'Build professional profile',
      'Career advancement',
      'Industry change',
      'Mentorship opportunities',
    ]

    // Debounced save function
    const saveUserData = async (data) => {
      try {
        await axios.post('https://vouchforme.org/api/user/update', {
          uid: userObject.value.uid,
          ...data,
        })
      } catch (err) {
        console.error('Error saving user data:', err)
        $q.notify({
          type: 'negative',
          message: 'Failed to save changes. Please try again.',
        })
      }
    }

    // Watch for changes in user data fields
    watch(
      () => userDbObject.value?.firstName,
      (newVal) => {
        if (newVal) {
          saveUserData({ firstName: newVal })
        }
      },
    )

    watch(
      () => userDbObject.value?.lastName,
      (newVal) => {
        if (newVal) {
          saveUserData({ lastName: newVal })
        }
      },
    )

    watch(
      () => userDbObject.value?.goals,
      (newVal) => {
        if (newVal) {
          saveUserData({ goals: newVal })
        }
      },
    )

    watch(
      () => userDbObject.value?.otherGoals,
      (newVal) => {
        if (newVal) {
          saveUserData({ otherGoals: newVal })
        }
      },
    )

    watch(
      () => userDbObject.value?.occupation,
      (newVal) => {
        if (newVal) {
          saveUserData({ occupation: newVal })
        }
      },
    )

    watch(
      () => userDbObject.value?.company,
      (newVal) => {
        if (newVal) {
          saveUserData({ company: newVal })
        }
      },
    )

    watch(
      () => userDbObject.value?.experience,
      (newVal) => {
        if (newVal) {
          saveUserData({ experience: newVal })
        }
      },
    )

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
      triggerFileInput,
      handleFileChange,
      fileInput,
      imageUrl,
      isPersonalDetailsComplete,
      isEmailSending,
      isVerifying,
      isUploading,
      validatePersonalDetails,
      isGoalsComplete,
      isOccupationComplete,
      goToNextStep,
      goToPreviousStep,
      goalOptions,
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
  max-width: 1100px;
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
.upload-image-btn {
  border-radius: 150px !important;
}
.profile-picture {
  width: 250px;
  height: 250px;
  border-radius: 50%;
}
.text-subtitle1 {
  color: #666;
  font-size: 1rem;
}

.text-weight-bold {
  font-weight: 600;
}
</style>

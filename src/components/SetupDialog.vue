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
              <h6 v-if="!isGoalsComplete" class="circle-num no-margin">3</h6>
              <q-icon v-if="isGoalsComplete" class="checkbox" name="task_alt" />
              <h6 class="q-ma-md">Goals & Intentions</h6>
            </div>
            <q-separator />
            <div
              class="row setup-nav-bar q-pa-sm q-my-sm"
              @click="handleSetupNavStep('Occupation')"
              :class="{ 'active-setup-nav': activeSetupNav === 'Occupation' }"
            >
              <h6 v-if="!isOccupationComplete" class="circle-num no-margin">4</h6>
              <q-icon v-if="isOccupationComplete" class="checkbox" name="task_alt" />
              <h6 class="q-ma-md">Occupation</h6>
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
              <q-card class="q-pa-md q-mb-md" flat>
                <q-card-section class="q-pa-sm q-mb-sm dialog-section text-center">
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
              </q-card>
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
                    v-model="userDbObject.middleInitial"
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
                <h6 class="primary-color no-margin">Next, let's see what you look like.</h6>
                <div v-if="userDbObject.profilePictureUrl" class="row justify-center">
                  <div class="col-7">
                    <img
                      :src="userDbObject.profilePictureUrl"
                      spinner-color="primary"
                      class="profile-picture"
                    />
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

              <q-card-section class="q-pa-sm dialog-section" align="center">
                <h6 class="primary-color no-margin">Tell us about yourself</h6>
                <div class="row justify-center q-my-md">
                  <q-input
                    v-model="userDbObject.userBio"
                    outlined
                    type="textarea"
                    label="Your bio"
                    hint="Share a brief introduction about yourself"
                    class="col-12"
                    :rules="[(val) => !!val || 'Bio is required']"
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

            <div v-if="activeSetupNav === 'Occupation'">
              <q-card-section class="q-pa-sm dialog-section" align="center">
                <h2 class="primary-color no-margin">Occupation</h2>
                <h6 class="secondary-color no-margin">Tell us about your work or studies</h6>
              </q-card-section>

              <q-card-section class="q-pa-sm dialog-section">
                <q-select
                  v-model="userDbObject.employmentStatus"
                  :options="employmentStatusOptions"
                  outlined
                  label="Current Status"
                  class="q-mb-md"
                  :rules="[(val) => !!val || 'Please select your current status']"
                />

                <!-- Professional Fields -->
                <template
                  v-if="
                    userDbObject.employmentStatus === 'Employed' ||
                    userDbObject.employmentStatus === 'Self-Employed/Freelancer'
                  "
                >
                  <q-input
                    v-model="userDbObject.occupation"
                    outlined
                    label="Job Title"
                    class="q-mb-md"
                    :rules="[(val) => !!val || 'Job title is required']"
                  />
                  <q-input
                    v-model="userDbObject.company"
                    outlined
                    label="Company/Organization"
                    class="q-mb-md"
                    :rules="[(val) => !!val || 'Company name is required']"
                  />
                  <q-input
                    v-model="userDbObject.experience"
                    outlined
                    type="number"
                    min="0"
                    :rules="[(val) => val >= 0 || 'Years must be 0 or greater']"
                    @update:model-value="
                      (val) => (userDbObject.experience = val ? parseInt(val) : null)
                    "
                    label="Years of Experience"
                    class="q-mb-md"
                  />
                </template>

                <!-- Student Fields -->
                <template v-if="userDbObject.employmentStatus === 'Student'">
                  <q-input
                    v-model="userDbObject.institution"
                    outlined
                    label="School/University"
                    class="q-mb-md"
                    :rules="[(val) => !!val || 'Institution name is required']"
                  />
                  <q-input
                    v-model="userDbObject.fieldOfStudy"
                    outlined
                    label="Field of Study"
                    class="q-mb-md"
                    :rules="[(val) => !!val || 'Field of study is required']"
                  />
                  <q-select
                    v-model="userDbObject.educationLevel"
                    :options="educationLevelOptions"
                    outlined
                    label="Education Level"
                    class="q-mb-md"
                    :rules="[(val) => !!val || 'Education level is required']"
                  />
                  <q-input
                    v-model="userDbObject.graduationYear"
                    outlined
                    type="number"
                    label="Expected Graduation Year"
                    class="q-mb-md"
                    :rules="[
                      (val) => !!val || 'Graduation year is required',
                      (val) => val >= new Date().getFullYear() || 'Please enter a future year',
                    ]"
                  />
                </template>

                <!-- Looking for Opportunities -->
                <template v-if="userDbObject.employmentStatus === 'Looking for Opportunities'">
                  <q-input
                    v-model="userDbObject.desiredRole"
                    outlined
                    label="Desired Role"
                    class="q-mb-md"
                    :rules="[(val) => !!val || 'Desired role is required']"
                  />
                  <q-select
                    v-model="userDbObject.desiredIndustries"
                    :options="industryOptions"
                    multiple
                    outlined
                    label="Desired Industries"
                    use-chips
                    class="q-mb-md"
                    :rules="[(val) => val.length > 0 || 'Please select at least one industry']"
                  />
                </template>

                <!-- Skills Section for All -->
                <q-select
                  v-model="userDbObject.skills"
                  :options="skillOptions"
                  multiple
                  outlined
                  label="Skills"
                  use-chips
                  class="q-mb-md"
                  hint="Select your key skills"
                  :rules="[(val) => val.length > 0 || 'Please select at least one skill']"
                />
              </q-card-section>
            </div>

            <div v-if="activeSetupNav === 'Preview Profile'">
              <q-card-section class="q-pa-sm dialog-section" align="center">
                <h2 class="primary-color no-margin">Preview Profile</h2>
                <h6 class="secondary-color no-margin">Review your information</h6>
              </q-card-section>

              <q-card-section class="q-pa-sm dialog-section">
                <!-- Profile Picture and Name -->
                <div class="row justify-center q-mb-lg">
                  <q-avatar size="150px">
                    <img :src="userDbObject.profilePictureUrl" />
                  </q-avatar>
                </div>
                <div class="row q-mb-md">
                  <div class="col-12">
                    <h5 class="no-margin">
                      {{ userDbObject?.firstName }}
                      {{ userDbObject?.middleInitial ? userDbObject?.middleInitial + '.' : '' }}
                      {{ userDbObject?.lastName }}
                    </h5>

                    <!-- Occupation Information -->
                    <template
                      v-if="
                        userDbObject?.employmentStatus === 'Employed' ||
                        userDbObject?.employmentStatus === 'Self-Employed/Freelancer'
                      "
                    >
                      <p class="text-subtitle1">
                        {{ userDbObject?.occupation }} at {{ userDbObject?.company }}
                        <span v-if="userDbObject?.experience" class="text-caption">
                          • {{ userDbObject?.experience }} years of experience
                        </span>
                      </p>
                    </template>

                    <template v-if="userDbObject?.employmentStatus === 'Student'">
                      <p class="text-subtitle1">
                        {{ userDbObject?.fieldOfStudy }} Student at {{ userDbObject?.institution }}
                        <br />
                        {{ userDbObject?.educationLevel }} • Class of
                        {{ userDbObject?.graduationYear }}
                      </p>
                    </template>

                    <template v-if="userDbObject?.employmentStatus === 'Looking for Opportunities'">
                      <p class="text-subtitle1">
                        Looking for {{ userDbObject?.desiredRole }} opportunities
                        <br />
                        Interested in: {{ userDbObject?.desiredIndustries?.join(', ') }}
                      </p>
                    </template>

                    <!-- Bio -->
                    <p class="text-body1 q-mt-md">{{ userDbObject?.userBio }}</p>
                  </div>
                </div>

                <!-- Skills -->
                <div class="row q-mb-md">
                  <div class="col-12">
                    <h6 class="text-weight-bold">Skills</h6>
                    <q-chip
                      v-for="skill in userDbObject?.skills"
                      :key="skill"
                      class="q-ma-xs skill-chip"
                    >
                      {{ skill }}
                    </q-chip>
                  </div>
                </div>

                <!-- Goals -->
                <div class="row q-mb-md">
                  <div class="col-12">
                    <h6 class="text-weight-bold">Goals</h6>
                    <q-chip
                      v-for="goal in userDbObject?.goals"
                      :key="goal"
                      class="q-ma-xs goal-chip"
                    >
                      {{ goal }}
                    </q-chip>
                    <p v-if="userDbObject?.otherGoals" class="text-body2 q-mt-sm">
                      Additional goals: {{ userDbObject?.otherGoals }}
                    </p>
                  </div>
                </div>
              </q-card-section>
            </div>

            <!-- Navigation Buttons -->
            <q-card-section class="q-pa-md">
              <div class="row justify-between">
                <q-btn
                  flat
                  :ripple="false"
                  class="navigation-btn back-btn"
                  label="Back"
                  icon="arrow_back"
                  @click="goToPreviousStep"
                  :disable="activeSetupNav === 'Email Verification'"
                />
                <q-btn
                  v-if="activeSetupNav !== 'Preview Profile'"
                  class="navigation-btn next-btn btn-primary"
                  label="Next"
                  icon-right="arrow_forward"
                  @click="goToNextStep"
                />
                <q-btn
                  v-else
                  class="navigation-btn btn-primary"
                  label="Finish Setup"
                  icon-right="check"
                  @click="setupDialogModel = false"
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
import { debounce } from 'lodash'
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage'
import { storage } from 'src/firebase'

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
      () =>
        userDbObject.value?.firstName &&
        userDbObject.value?.lastName &&
        userDbObject.value?.profilePictureUrl &&
        userDbObject.value?.userBio,
    )
    const isGoalsComplete = computed(() => userDbObject.value?.goals?.length > 0)

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

      if (step === 'Occupation' && !isGoalsComplete.value) {
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

      if (!userDbObject.value?.profilePictureUrl) {
        $q.notify({
          type: 'negative',
          message: 'Please upload a profile picture',
        })
        return false
      }

      if (!userDbObject.value?.userBio?.trim()) {
        $q.notify({
          type: 'negative',
          message: 'Please enter your bio',
        })
        return false
      }

      if (!userDbObject.value?.goals?.length > 0) {
        $q.notify({
          type: 'negative',
          message: 'Please select at least one goal',
        })
        return false
      }
      return true
    }

    const isOccupationComplete = computed(() => {
      if (!userDbObject.value?.employmentStatus) return false

      switch (userDbObject.value.employmentStatus) {
        case 'Employed':
        case 'Self-Employed/Freelancer':
          return !!(userDbObject.value?.occupation && userDbObject.value?.company)

        case 'Student':
          return !!(
            userDbObject.value?.institution &&
            userDbObject.value?.fieldOfStudy &&
            userDbObject.value?.educationLevel &&
            userDbObject.value?.graduationYear
          )

        case 'Looking for Opportunities':
          return !!(
            userDbObject.value?.desiredRole && userDbObject.value?.desiredIndustries?.length
          )

        default:
          return false
      }
    })

    const goToNextStep = () => {
      const steps = [
        'Email Verification',
        'Profile Picture & Bio',
        'Goals & Intentions',
        'Occupation',
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
        'Occupation',
        'Preview Profile',
      ]

      const currentIndex = steps.indexOf(activeSetupNav.value)
      if (currentIndex > 0) {
        handleSetupNavStep(steps[currentIndex - 1])
      }
    }

    const fileInput = ref(null)
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
          // Set temporary preview
          userDbObject.value.profilePictureUrl = e.target.result

          try {
            // Upload to Firebase Storage
            const imageRef = storageRef(
              storage,
              `profile-pictures/${userObject.value.uid}/${file.name}`,
            )
            await uploadBytes(imageRef, file)
            const downloadURL = await getDownloadURL(imageRef)

            // Update the user profile with the Firebase Storage URL
            await axios.patch('https://vouchforme.org/api/user/update-user', {
              ...userDbObject.value,
              profilePictureUrl: downloadURL,
            })

            // Update local state
            userDbObject.value.profilePictureUrl = downloadURL

            $q.notify({
              type: 'positive',
              message: 'Profile picture uploaded successfully!',
            })

            // Refresh user data
            await userStore.fetchUserFromDb()
          } catch (error) {
            console.error('Upload error:', error)
            $q.notify({
              type: 'negative',
              message: 'Failed to upload profile picture. Please try again.',
            })
            userDbObject.value.profilePictureUrl = null
          }
        }
        reader.readAsDataURL(file)
      } catch (err) {
        console.error('File reading error:', err)
        $q.notify({
          type: 'negative',
          message: 'Failed to process the image. Please try again.',
        })
        userDbObject.value.profilePictureUrl = null
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

    const employmentStatusOptions = [
      'Employed',
      'Self-Employed/Freelancer',
      'Student',
      'Looking for Opportunities',
    ]

    const educationLevelOptions = [
      'High School',
      'Associate Degree',
      "Bachelor's Degree",
      "Master's Degree",
      'Doctorate',
      'Other',
    ]

    const industryOptions = [
      'Technology',
      'Healthcare',
      'Finance',
      'Education',
      'Marketing',
      'Design',
      'Engineering',
      'Sales',
      'Customer Service',
      'Other',
    ]

    const skillOptions = [
      'Programming',
      'Data Analysis',
      'Project Management',
      'Marketing',
      'Design',
      'Communication',
      'Leadership',
      'Problem Solving',
      'Teamwork',
      'Research',
      'Writing',
      'Public Speaking',
    ]

    const saveUserProfile = debounce(async () => {
      try {
        await axios.patch('https://vouchforme.org/api/user/update-user', userDbObject.value)
      } catch (err) {
        console.error('Save failed:', err)
        $q.notify({
          type: 'negative',
          message: 'Failed to save changes. Please try again.',
        })
      }
    }, 1000)

    watch(
      () => ({
        firstName: userDbObject.value?.firstName,
        middleInitial: userDbObject.value?.middleInitial,
        lastName: userDbObject.value?.lastName,
        goals: userDbObject.value?.goals,
        otherGoals: userDbObject.value?.otherGoals,
        employmentStatus: userDbObject.value?.employmentStatus,
        occupation: userDbObject.value?.occupation,
        company: userDbObject.value?.company,
        experience: userDbObject.value?.experience,
        institution: userDbObject.value?.institution,
        fieldOfStudy: userDbObject.value?.fieldOfStudy,
        educationLevel: userDbObject.value?.educationLevel,
        graduationYear: userDbObject.value?.graduationYear,
        desiredRole: userDbObject.value?.desiredRole,
        desiredIndustries: userDbObject.value?.desiredIndustries,
        skills: userDbObject.value?.skills,
        userBio: userDbObject.value?.userBio,
      }),
      (newVal, oldVal) => {
        if (
          JSON.stringify(newVal) !== JSON.stringify(oldVal) &&
          Object.values(newVal).some((val) => val !== undefined)
        ) {
          saveUserProfile()
        }
      },
      { deep: true },
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
      employmentStatusOptions,
      educationLevelOptions,
      industryOptions,
      skillOptions,
    }
  },
}
</script>
<style lang="scss" scoped>
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
  border-radius: 16px;
  background: #ffffff;
}

.dialog-section {
  padding: 1.5rem;

  h2 {
    font-size: 2rem;
    margin-bottom: 0.5rem;
  }

  h6 {
    font-size: 1rem;
    line-height: 1.5;
  }
}

.setup-nav-bar {
  align-items: center;
  border-radius: 12px;
  padding: 1rem;
  margin: 0.5rem 0;
  transition: all 0.2s ease;

  &:hover {
    cursor: pointer;
    background-color: rgba(233, 99, 108, 0.1);
  }

  &.active-setup-nav {
    background-color: rgba(233, 99, 108, 0.15);
    border-left: 4px solid var(--btn-primary);
  }
}

.circle-num {
  width: 2.5rem;
  height: 2.5rem;
  line-height: 2.5rem;
  text-align: center;
  border-radius: 50%;
  border: 2px solid var(--btn-primary);
  color: var(--btn-primary);
  display: inline-block;
  font-size: 1.5rem;
  margin-right: 1rem;
}

.checkbox {
  font-size: 2.5rem;
  color: #21ba45;
  margin-right: 1rem;
}

.verification-box {
  width: 48px;
  height: 48px;
  font-size: 24px;
  border-radius: 8px;
  border: 2px solid rgba(233, 99, 108, 0.3);
  transition: border-color 0.2s ease;

  &:focus {
    border-color: var(--btn-primary);
  }
}

.verify-email-row {
  gap: 1.75rem;
  margin: 2rem 0;
}

.profile-picture {
  width: 250px;
  height: 250px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid rgba(233, 99, 108, 0.1);
}

.q-chip {
  background-color: rgba(233, 99, 108, 0.1);
  color: var(--btn-primary);
  border: 1px solid rgba(233, 99, 108, 0.2);

  &:hover {
    background-color: rgba(233, 99, 108, 0.15);
  }
}

.q-input {
  margin-bottom: 1rem;

  :deep(.q-field__control) {
    border-radius: 8px;
    border: 2px solid rgba(75, 75, 75, 0.1);
    transition: border-color 0.2s ease;

    &:hover {
      border-color: rgba(233, 99, 108, 0.3);
    }

    &.q-field__control--focused {
      border-color: var(--btn-primary);
    }
  }
}

.btn-primary {
  font-weight: 500;
  padding: 0.5rem 2rem;
  transition: all 0.2s ease;

  &:hover {
    background-color: #d62f3a;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
}

.text-subtitle1 {
  color: var(--text-secondary);
  font-size: 1rem;
  margin: 0.5rem 0;
}

.text-weight-bold {
  font-weight: 600;
  color: var(--text-primary);
}

@media (max-width: 600px) {
  .dialog-container {
    margin: 0;
    border-radius: 0;
    min-height: 100vh;
  }

  .dialog-section {
    padding: 1rem;
  }

  .verify-email-row {
    flex-direction: column;
    gap: 1rem;
  }

  .profile-picture {
    width: 200px;
    height: 200px;
  }
}

.navigation-btn {
  min-width: 120px;
  padding: 8px 24px;
  font-weight: 500;
  border-radius: 8px;
  transition: all 0.2s ease;

  &.back-btn {
    color: var(--text-secondary);
    background: transparent;
    border: 2px solid rgba(75, 75, 75, 0.15);

    &:hover:not(:disabled) {
      background-color: rgba(233, 99, 108, 0.15);
      border-color: rgba(75, 75, 75, 0.25);
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  &.next-btn {
    color: white;

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      background: var(--btn-primary);
    }
  }
}

.goal-chip {
  background-color: rgba(233, 99, 108, 0.1);
  color: var(--btn-primary);
  border: 1px solid rgba(233, 99, 108, 0.2);

  &:hover {
    background-color: rgba(233, 99, 108, 0.15);
  }
}

.skill-chip {
  background-color: rgba(75, 75, 75, 0.1);
  color: var(--text-primary);
  border: 1px solid rgba(75, 75, 75, 0.2);

  &:hover {
    background-color: rgba(75, 75, 75, 0.15);
  }
}

.text-caption {
  color: var(--text-secondary);
  font-size: 0.875rem;
}
</style>

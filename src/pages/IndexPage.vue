<template>
  <q-page class="landing-page">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="container">
        <div class="hero-content">
          <h1 class="text-h2 text-weight-medium primary-color q-mb-sm">
            People know you're great.
          </h1>
          <h1 class="text-h2 text-weight-medium primary-color q-mb-lg">Show it.</h1>
          <p class="text-subtitle1 text-grey-7 q-mb-xl">
            Applying for a job, grad school, or housing? VouchForMe helps you collect and access
            your references in one place—so you're always ready to prove your credibility.
          </p>
          <div class="row q-col-gutter-md q-mb-md justify-center">
            <div class="col-auto">
              <q-btn label="Join Our Waitlist" class="btn-primary" @click="handleJoinWaitlist" />
            </div>
            <div class="col-auto">
              <q-btn
                label="Get Started (TEMPORARY)"
                class="btn-secondary"
                @click="handleGetStarted"
              />
            </div>
            <div class="col-auto">
              <q-btn label="Learn More" class="btn-secondary" @click="goToLearnMoreSection" />
            </div>
          </div>
          <p v-if="waitlistCount > 0" class="text-subtitle1 text-grey-7 q-mt-md">
            {{ waitlistCount }} members are in. Join now!
          </p>
        </div>
        <div class="hero-image q-mt-xl">
          <img alt="Text with recruiter" src="~assets/cta-image.jpg" />
        </div>
      </div>
    </section>

    <q-separator />

    <!-- How it Works Section -->
    <section id="learnMoreSection" class="how-it-works-section">
      <div class="container">
        <h2 class="text-h3 text-weight-medium text-center primary-color q-mb-xl">How it works</h2>
        <div class="row q-col-gutter-xl justify-center">
          <div class="col-12 col-md-3">
            <div class="feature-card">
              <q-icon name="mail" class="feature-icon" />
              <h4 class="text-h5 text-weight-medium q-my-md">Request</h4>
              <p class="text-subtitle1 text-grey-7">Invite someone to vouch for you</p>
            </div>
          </div>
          <div class="col-auto self-center" v-if="!$q.screen.lt.md">
            <q-icon name="trending_flat" class="arrow-icon" />
          </div>
          <div class="col-12 col-md-3">
            <div class="feature-card">
              <q-icon name="folder_open" class="feature-icon" />
              <h4 class="text-h5 text-weight-medium q-my-md">Organize</h4>
              <p class="text-subtitle1 text-grey-7">Tag, store, and categorize by use case</p>
            </div>
          </div>
          <div class="col-auto self-center" v-if="!$q.screen.lt.md">
            <q-icon name="trending_flat" class="arrow-icon" />
          </div>
          <div class="col-12 col-md-3">
            <div class="feature-card">
              <q-icon name="cloud_upload" class="feature-icon" />
              <h4 class="text-h5 text-weight-medium q-my-md">Share</h4>
              <p class="text-subtitle1 text-grey-7">Send a personalized vouched portfolio</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <q-separator />

    <!-- Use Cases Section -->
    <section class="use-cases-section">
      <div class="container">
        <h2 class="text-h3 text-weight-medium text-center primary-color q-mb-xl">
          One tool. Endless use cases.
        </h2>
        <div class="row q-col-gutter-lg justify-center">
          <div class="col-12 col-sm-6 col-md-3">
            <q-card class="use-case-card">
              <q-card-section>
                <q-icon name="school" class="use-case-icon" />
                <h4 class="text-h5 text-weight-medium q-my-md">Students & Grads</h4>
                <p class="text-subtitle1 text-grey-7">College apps, internships, scholarships</p>
              </q-card-section>
            </q-card>
          </div>
          <div class="col-12 col-sm-6 col-md-3">
            <q-card class="use-case-card">
              <q-card-section>
                <q-icon name="business_center" class="use-case-icon" />
                <h4 class="text-h5 text-weight-medium q-my-md">Professionals</h4>
                <p class="text-subtitle1 text-grey-7">Job changes, career pivots</p>
              </q-card-section>
            </q-card>
          </div>
          <div class="col-12 col-sm-6 col-md-3">
            <q-card class="use-case-card">
              <q-card-section>
                <q-icon name="construction" class="use-case-icon" />
                <h4 class="text-h5 text-weight-medium q-my-md">Freelancers</h4>
                <p class="text-subtitle1 text-grey-7">Show client testimonials</p>
              </q-card-section>
            </q-card>
          </div>
          <div class="col-12 col-sm-6 col-md-3">
            <q-card class="use-case-card">
              <q-card-section>
                <q-icon name="home" class="use-case-icon" />
                <h4 class="text-h5 text-weight-medium q-my-md">Renters</h4>
                <p class="text-subtitle1 text-grey-7">Secure housing with trusted references</p>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>
    </section>
  </q-page>

  <!-- Waitlist Dialog -->
  <q-dialog v-model="emailWaitlistWindow">
    <q-card class="dialog-container">
      <q-card-section align="right">
        <q-icon flat name="close" class="close-btn" @click="emailWaitlistWindow = false" />
      </q-card-section>

      <q-card-section class="dialog-section" align="center">
        <h2 class="text-h4 text-weight-medium primary-color q-mb-sm">Join our waitlist.</h2>
        <h6 class="text-subtitle1 text-grey-7 q-ma-none">
          Enter your email and get notified as soon as we go live!
        </h6>
      </q-card-section>

      <q-card-section class="form-section">
        <q-form @submit.prevent="addUserToWaitList" class="waitlist-form">
          <div class="row q-col-gutter-md">
            <div class="col-12">
              <q-input
                id="waitlistEmail"
                v-model="waitlistEmail"
                class="modern-input"
                outlined
                label="Email"
                :error="emptyEmailError || waitListEmailExistsError"
                :error-message="getErrorMessage"
              />
            </div>
            <div class="col-12">
              <q-btn class="full-width btn-primary" label="Join Waitlist" type="submit" />
            </div>
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>

  <RegistrationDialog v-model="showRegistrationDialog" />
</template>

<script>
import RegistrationDialog from '../components/RegistrationDialog.vue'
import { computed, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from 'src/stores/auth'
import { useQuasar } from 'quasar'
import axios from 'axios'

export default {
  components: {
    RegistrationDialog,
  },
  setup() {
    const showRegistrationDialog = ref(false)
    const userStore = useAuthStore()
    const router = useRouter()
    const $q = useQuasar()

    const userObject = computed(() => userStore.userObject)

    const waitlistEmail = ref(null)
    const emptyEmailError = ref(false)
    const waitListEmailExistsError = ref(false)

    const emailWaitlistWindow = ref(false)
    const waitlistCount = ref(null)

    const handleGetStarted = () => {
      if (userObject.value) {
        router.push('/home')
      } else {
        showRegistrationDialog.value = true
      }
    }

    const handleJoinWaitlist = () => {
      emailWaitlistWindow.value = true
    }

    const getWaitlistCount = async () => {
      let response = await axios.get('https://vouchforme.org/api/waitlist')

      waitlistCount.value = response.data.waitlistCount
    }

    const addUserToWaitList = async () => {
      emptyEmailError.value = false
      waitListEmailExistsError.value = false

      if (!waitlistEmail.value) {
        emptyEmailError.value = true
        return
      }

      try {
        await axios.post('https://vouchforme.org/api/waitlist', {
          email: waitlistEmail.value,
        })

        $q.notify({ type: 'positive', message: 'You have been added to the waitlist!' })

        emailWaitlistWindow.value = false
        waitlistEmail.value = ''
        getWaitlistCount()
      } catch (error) {
        if (error.response?.status === 409) {
          waitListEmailExistsError.value = true
        } else {
          console.error('Error submitting waitlist email:', error)
        }
      }
    }

    const goToLearnMoreSection = () => {
      document.getElementById('learnMoreSection').scrollIntoView({ behavior: 'smooth' })
    }

    const getErrorMessage = computed(() => {
      if (emptyEmailError.value) return 'Please enter a valid email.'
      if (waitListEmailExistsError.value) return 'This email is already on the waitlist.'
      return ''
    })

    onMounted(() => {
      getWaitlistCount()
    })

    return {
      showRegistrationDialog,
      userObject,
      handleGetStarted,
      emailWaitlistWindow,
      handleJoinWaitlist,
      waitlistEmail,
      addUserToWaitList,
      emptyEmailError,
      waitListEmailExistsError,
      goToLearnMoreSection,
      waitlistCount,
      getErrorMessage,
    }
  },
}
</script>

<style lang="scss" scoped>
.landing-page {
  background-color: #ffffff;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 4rem 2rem;
}

// Hero Section
.hero-section {
  background-color: #f8f9fa;

  .hero-content {
    max-width: 800px;
    margin: 0 auto;
    text-align: center;
  }

  .hero-image {
    max-width: 1100px;
    margin: 0 auto;

    img {
      width: 100%;
      height: auto;
      border-radius: 16px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
    }
  }
}

// How it Works Section
.how-it-works-section {
  background-color: #ffffff;

  .feature-card {
    text-align: center;
    padding: 2rem;
    border-radius: 16px;
    transition: all 0.2s ease;

    &:hover {
      transform: translateY(-4px);
    }
  }

  .feature-icon {
    font-size: 3.5rem;
    color: var(--btn-primary);
  }

  .arrow-icon {
    font-size: 2rem;
    color: var(--text-secondary);
    opacity: 0.5;
  }
}

// Use Cases Section
.use-cases-section {
  background-color: #f8f9fa;

  .use-case-card {
    height: 100%;
    border-radius: 16px;
    border: 1px solid rgba(233, 99, 108, 0.1);
    transition: all 0.2s ease;
    text-align: center;

    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
    }
  }

  .use-case-icon {
    font-size: 3rem;
    color: var(--btn-primary);
  }
}

// Buttons
.btn-primary {
  font-weight: 500;
  padding: 0.75rem 2rem;
  font-size: 1.1rem;
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

.btn-secondary {
  font-weight: 500;
  padding: 0.75rem 2rem;
  font-size: 1.1rem;
  border-radius: 8px;
  background: transparent;
  color: var(--btn-primary);
  border: 2px solid var(--btn-primary);
  transition: all 0.2s ease;

  &:hover {
    background: rgba(233, 99, 108, 0.1);
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
}

// Dialog Styles
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

.waitlist-form {
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

@media (max-width: 600px) {
  .container {
    padding: 2rem 1rem;
  }

  .hero-section {
    .hero-content {
      h1 {
        font-size: 2rem;
      }
    }
  }

  .how-it-works-section {
    .feature-card {
      margin-bottom: 2rem;
    }
  }

  .use-cases-section {
    .use-case-card {
      margin-bottom: 1rem;
    }
  }

  .btn-primary,
  .btn-secondary {
    width: 100%;
    margin-bottom: 1rem;
  }

  .dialog-container {
    margin: 1rem;
  }

  .dialog-section,
  .form-section {
    padding: 1rem;
  }

  .waitlist-form {
    .modern-input {
      :deep(.q-field__control) {
        height: 48px;
      }
    }
  }
}
</style>

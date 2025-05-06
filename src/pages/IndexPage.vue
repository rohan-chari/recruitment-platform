<template>
  <q-page class="flex primary-background-color">
    <div class="cta-container-full row">
      <div class="cta">
        <div class="row">
          <div class="col-12 primary-color row">
            <h2 class="no-margin">People know you're great.</h2>
          </div>
        </div>
        <div class="row">
          <div class="col-12 primary-color row q-mb-md">
            <h2 class="no-margin">Show it.</h2>
          </div>
        </div>
        <div class="row q-my-lg">
          <h6 class="no-margin cta-caption secondary-color">
            Applying for a job, grad school, or housing? VouchForMe helps you collect and access
            your references in one place—so you're always ready to prove your credibility.
          </h6>
        </div>
        <div class="cta-action-buttons row q-my-lg">
          <q-btn
            label="Join Our Waitlist"
            size="1.3rem"
            @click="handleJoinWaitlist"
            rounded
            class="btn-primary"
          />
          <!--
                    <q-btn
            label="Get Started (TEMPORARY)"
            size="1rem"
            @click="handleGetStarted"
            rounded
            color="black"
          />
          -->
          <q-btn
            label="Learn More"
            size="1.3rem"
            @click="goToLearnMoreSection"
            rounded
            class="btn-primary"
          />
        </div>
      </div>
      <div>
        <img alt="Text with recruiter" class="cta-image" src="~assets/cta-image.png" width="400" />
      </div>
    </div>
  </q-page>
  <q-separator />
  <q-page class="secondary-gray-container q-pb-lg">
    <div class="learn-more-container">
      <div class="row">
        <div id="learnMoreSection" class="col-sm-12 col-md-12 q-pl-xl">
          <div class="row">
            <h2 class="primary-color">How it works</h2>
          </div>
          <div class="row">
            <div class="col-3">
              <div class="row justify-center align-center">
                <q-icon name="mail" class="primary-icon-styling" />
              </div>
              <div class="row justify-center align-center">
                <h4 class="secondary-color">Request</h4>
              </div>
              <div class="row justify-center">
                <h5 class="secondary-color no-margin">Invite someone to vouch for you</h5>
              </div>
            </div>
            <div class="col-1 align-center">
              <q-icon class="secondary-icon-styling" name="trending_flat" />
            </div>
            <div class="col-3">
              <div class="row justify-center align-center">
                <q-icon name="folder_open" class="primary-icon-styling" />
              </div>
              <div class="row justify-center align-center">
                <h4 class="secondary-color">Organize</h4>
              </div>
              <div class="row justify-center">
                <h5 class="secondary-color no-margin">Tag, store, and categorize by use case</h5>
              </div>
            </div>
            <div class="col-1 align-center">
              <q-icon class="secondary-icon-styling" name="trending_flat" />
            </div>
            <div class="col-3">
              <div class="row justify-center align-center">
                <q-icon name="cloud_upload" class="primary-icon-styling" />
              </div>
              <div class="row justify-center align-center">
                <h4 class="secondary-color">Share</h4>
              </div>
              <div class="row justify-center">
                <h5 class="secondary-color no-margin">Send a personalized vouched portfolio</h5>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </q-page>
  <q-separator />
  <!--
<q-page class="flex primary-background-color">
    <div class="learn-more-container">
      <div class="row">
        <div class="col-sm-12 col-md-7 q-pl-xl">
          <div class="row">
            <h2>Tired of chasing recommendations?</h2>
          </div>
          <div class="row">
            <h4 class="secondary-color">
              Whether you're applying for jobs, grad school, internships, or housing- you're
              constantly asked for references. VouchForMe makes it easy to collect, store, and share
              them anytime.
            </h4>
          </div>
        </div>
        <div class="col-sm-12 col-md-4 learn-more-questions">
          <div class="row learn-more-question-row">
            <q-icon name="mail" size="2.5rem" />
            <h4>Lost in inbox threads?</h4>
          </div>
          <div class="row learn-more-question-row">
            <q-icon name="timer" size="2.5rem" />
            <h4>Takes too much time?</h4>
          </div>
          <div class="row learn-more-question-row">
            <q-icon name="groups" size="2.5rem" />
            <h4>Not sure who to ask?</h4>
          </div>
        </div>
      </div>
    </div>
  </q-page>

  -->

  <q-page class="secondary-gray-container q-pb-lg">
    <div class="learn-more-container">
      <div class="row">
        <div class="col-sm-12 col-md-12 q-pl-xl">
          <div class="row">
            <h2 class="primary-color">One tool. Endless use cases.</h2>
          </div>
          <div class="row use-cases-container">
            <q-card class="col-sm-12 col-md-2 use-cases-card">
              <q-card-section>
                <q-icon name="school" class="primary-icon-styling" />
              </q-card-section>
              <q-card-section>
                <h4 class="no-margin">Students & Grads</h4>
              </q-card-section>
              <q-card-section>
                <h5 class="secondary-color no-margin">College apps, internships, scholarships</h5>
              </q-card-section>
            </q-card>
            <q-card class="col-sm-12 col-md-2 use-cases-card">
              <q-card-section>
                <q-icon name="business_center" class="primary-icon-styling" />
              </q-card-section>
              <q-card-section>
                <h4 class="no-margin">Professionals</h4>
              </q-card-section>
              <q-card-section>
                <h5 class="secondary-color no-margin">Job changes, career pivots</h5>
              </q-card-section>
            </q-card>
            <q-card class="col-sm-12 col-md-2 use-cases-card">
              <q-card-section>
                <q-icon name="construction" class="primary-icon-styling" />
              </q-card-section>
              <q-card-section>
                <h4 class="no-margin">Freelancers</h4>
              </q-card-section>
              <q-card-section>
                <h5 class="secondary-color no-margin">Show client testimonials</h5>
              </q-card-section>
            </q-card>
            <q-card class="col-sm-12 col-md-2 use-cases-card">
              <q-card-section>
                <q-icon name="home" class="primary-icon-styling" />
              </q-card-section>
              <q-card-section>
                <h4 class="no-margin">Renters</h4>
              </q-card-section>
              <q-card-section>
                <h5 class="secondary-color no-margin">Secure housing with trusted references</h5>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>
    </div>
  </q-page>
  <q-separator />
  <q-page class="primary-background-color q-pb-lg">
    <div class="learn-more-container">
      <div class="row">
        <div class="col-sm-12 col-md-12 q-pl-xl">
          <div class="row">
            <h2 class="primary-color">Start building your reference vault today.</h2>
          </div>
          <div class="row">
            <h5 class="no-margin">
              "Ellie handled a client escalation during the AWS outage like a pro. Saved a $400K
              contract."
            </h5>
          </div>
          <div class="row">
            <h6 class="secondary-color">— Steve R., VP of Client Success at Twilio</h6>
          </div>
        </div>
      </div>
    </div>
  </q-page>
  <q-dialog v-model="emailWaitlistWindow">
    <q-card class="email-waitlist-container">
      <q-card-section align="right">
        <q-icon flat name="close" class="close-btn" @click="emailWaitlistWindow = false" />
      </q-card-section>
      <q-card-section class="q-pt-none dialog-section" align="center">
        <h2 class="primary-color no-margin">Join our waitlist.</h2>
        <h6 class="secondary-color no-margin">
          Enter your email and get notified as soon as we go live!
        </h6>
      </q-card-section>
      <q-card-section>
        <q-form @submit.prevent="addUserToWaitList">
          <div class="row join-waitlist-form q-mb-sm">
            <q-input
              class="col-8"
              id="waitlistEmail"
              v-model="waitlistEmail"
              rounded
              outlined
              label="Email"
            ></q-input>
            <q-btn rounded color="black" label="Join Waitlist" size="1.1rem" type="submit" />
          </div>
          <div v-if="emptyEmailError" class="row q-pl-md error-message">
            <h6 class="no-margin">Please enter a valid email.</h6>
          </div>
          <div v-if="waitListEmailExistsError" class="row q-pl-md error-message">
            <h6 class="no-margin">This email is already on the waitlist.</h6>
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
  <RegistrationDialog v-model="showDialog" />
</template>

<script>
import RegistrationDialog from '../components/RegistrationDialog.vue'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from 'src/stores/auth'
import { useQuasar } from 'quasar'
import axios from 'axios'

export default {
  components: {
    RegistrationDialog,
  },
  setup() {
    const showDialog = ref(false)
    const userStore = useAuthStore()
    const router = useRouter()
    const $q = useQuasar()

    const userObject = computed(() => userStore.userObject)

    const waitlistEmail = ref(null)
    const emptyEmailError = ref(false)
    const waitListEmailExistsError = ref(false)

    const emailWaitlistWindow = ref(false)

    const handleGetStarted = () => {
      if (userObject.value) {
        router.push('/home')
      } else {
        showDialog.value = true
      }
    }

    const handleJoinWaitlist = () => {
      emailWaitlistWindow.value = true
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

    return {
      showDialog,
      userObject,
      handleGetStarted,
      emailWaitlistWindow,
      handleJoinWaitlist,
      waitlistEmail,
      addUserToWaitList,
      emptyEmailError,
      waitListEmailExistsError,
      goToLearnMoreSection,
    }
  },
}
</script>
<style scoped>
.cta {
  margin-top: 6rem;
  display: flex;
  flex-direction: column;
  p {
    font-size: 1rem;
  }
}
.cta-image {
  border-radius: 25px;
}
.cta-container-full {
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  width: 100%;
}

.cta-action-buttons {
  gap: 1em;
}

.email-waitlist-container {
  width: 100%;
}
.join-waitlist-form {
  width: 100%;
  display: flex;
  justify-content: space-around;
}
.learn-more-container {
  margin-left: auto;
  margin-right: auto;
}
.learn-more-questions {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.learn-more-question-row {
  gap: 1rem;
  align-items: center;
}
.use-cases-card {
  flex-direction: column;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}
.use-cases-container {
  gap: 2rem;
  justify-content: space-around;
}
.cta-caption {
  width: 50rem;
}

@media (max-width: 768px) {
  .cta-container-full {
    flex-direction: column;
    align-items: center;
    gap: 2rem;
    text-align: center;
  }

  .cta-caption {
    width: 90%;
  }

  .cta-image {
    width: 100%;
    height: auto;
  }

  .join-waitlist-form {
    flex-direction: column;
    gap: 1rem;
    align-items: center;
  }

  .join-waitlist-form .q-input,
  .join-waitlist-form .q-btn {
    width: 90%;
  }

  .use-cases-container {
    flex-direction: column;
    align-items: center;
  }

  .use-cases-card {
    width: 90%;
    margin-bottom: 1rem;
  }
}
</style>

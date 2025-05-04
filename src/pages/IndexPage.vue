<template>
  <q-page class="flex flex-center index-page">
    <div class="cta-container-full row">
      <div class="cta">
        <div class="row">
          <div class="col-12">
            <h1>People know you're great.</h1>
          </div>
        </div>
        <div class="row q-mb-sm">
          <div class="col-12">
            <h1>Show it.</h1>
          </div>
        </div>
        <div class="row q-my-lg">
          <h5>
            Stop scrambling for recommendations. Create a profile backed by real people who know
            your value — and keep your vouches ready for every opportunity.
          </h5>
        </div>
        <div class="cta-action-buttons row">
          <q-btn
            label="Join Our Waitlist"
            size="2rem"
            @click="handleJoinWaitlist"
            rounded
            color="black"
          />
          <q-btn label="Learn More" size="2rem" rounded color="black" />
          <q-btn
            label="Get Started (TEMPORARY)"
            size="1rem"
            @click="handleGetStarted"
            rounded
            color="black"
          />
        </div>
      </div>
      <div class="cta-image-container">
        <img
          alt="Text with recruiter"
          class="cta-image"
          src="~assets/cta-image.png"
          style="width: 400px; height: 600px"
        />
      </div>
    </div>
  </q-page>
  <q-page class="flex learn-more-page">
    <div class="learn-more-container">
      <div class="learn-more">
        <h3>Find your next job...</h3>
        <div class="row learn-more-row">
          <div class="learn-more-column column">
            <q-icon class="learn-more-icon" name="upload_file" />
            <h5>Put your best foot forward.</h5>
            <p>
              Upload your resume to get instantly matched with companies looking for your skills.
            </p>
          </div>
          <div class="learn-more-column column">
            <q-icon class="learn-more-icon" name="chat" />
            <h5>Start the conversation.</h5>
            <p>
              Message recruiters and real team members to learn more about roles, culture, and fit.
            </p>
          </div>
          <div class="learn-more-column column">
            <q-icon class="learn-more-icon" name="celebration" />
            <h5>You're in.</h5>
            <p>Land the job, celebrate the win, and share your success.</p>
          </div>
        </div>
      </div>
    </div>
    <q-dialog v-model="emailWaitlistWindow">
      <q-card class="email-waitlist-container">
        <q-card-section align="right">
          <q-icon flat name="close" class="close-btn" @click="emailWaitlistWindow = false" />
        </q-card-section>
        <q-card-section class="q-pt-none dialog-section" align="center">
          <h4>Join our waitlist.</h4>
          <p class="secondary-color">
            Enter your email below and get notified as soon as we go live!
          </p>
        </q-card-section>
        <q-card-section>
          <q-form @submit.prevent="addUserToWaitList">
            <div class="row join-waitlist-form q-mb-sm">
              <q-input
                class="col-8"
                id="waitlistEmail"
                v-model="waitlistEmail"
                filled
                dense
                label="Email"
              ></q-input>
              <q-btn rounded color="black" label="Join Waitlist" type="submit" />
            </div>
            <div v-if="emptyEmailError" class="row q-pl-md error-message">
              <p>Please enter a valid email.</p>
            </div>
            <div v-if="waitListEmailExistsError" class="row q-pl-md error-message">
              <p>This email is already on the waitlist.</p>
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
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
        await axios.post('http://localhost:5000/api/waitlist', {
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
    }
  },
}
</script>
<style scoped>
.cta {
  width: 40%;
  h1 {
    color: black;
    margin-bottom: 0;
    margin-top: 0;
  }
  p {
    font-size: 1rem;
  }
}
.cta-image {
  border-radius: 25px;
}
.cta-container-full {
  justify-content: center;
  gap: 7.5rem;
}

.cta-action-buttons {
  gap: 1em;
}
.index-page {
  background-color: #ffe6f4;
}
.learn-more-page {
  justify-content: center;
}
.learn-more-icon {
  font-size: 7rem;
}
.learn-more-row {
  gap: 10rem;
}
.learn-more-column {
  align-items: center;
  width: 20rem;
  h5 {
    margin-top: 0;
    margin-bottom: 1rem;
  }
}
.learn-more {
  h3 {
    text-align: center;
  }
}
.email-waitlist-container {
  width: 100%;
}
.join-waitlist-form {
  width: 100%;
  display: flex;
  justify-content: space-around;
}
</style>

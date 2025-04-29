<template>
  <q-page class="flex flex-center index-page">
    <div class="cta-container-full row">
      <div class="cta">
        <h3>Recruiters are online. Are you?</h3>
        <p>
          Skip the job boards. Start real conversations with real people. Get matched with
          recruiters from companies that actually fit your goals — and message them instantly.
        </p>
        <div class="cta-action-buttons row">
          <q-btn label="Join Our Waitlist" rounded color="black" />
          <q-btn label="Learn More" rounded color="black" />
          <q-btn label="Get Started (TEMPORARY)" @click="showDialog = true" rounded color="black" />
        </div>
      </div>
      <div class="cta-image-container">
        <img
          alt="Text with recruiter"
          class="cta-image"
          src="~assets/cta-image.png"
          style="width: 275px; height: 400px"
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
  </q-page>
  <RegistrationDialog v-model="showDialog" />
</template>

<script>
import RegistrationDialog from '../components/RegistrationDialog.vue'
import { ref } from 'vue'

export default {
  components: {
    RegistrationDialog,
  },
  setup() {
    const showDialog = ref(false)

    return {
      showDialog,
    }
  },
}
</script>
<style scoped>
.cta {
  width: 30%;
  h4 {
    color: black;
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
  background-color: #6dff91;
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
</style>

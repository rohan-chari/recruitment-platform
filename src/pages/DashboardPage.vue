<template>
  <q-page class="dashboard-page">
    <div class="dashboard-container">
      <div class="row items-center justify-between q-mb-xl">
        <div class="welcome-section">
          <h2 class="text-h4 text-weight-medium q-ma-none">Welcome back,</h2>
          <h3 class="text-h5 primary-color q-mt-sm q-mb-none">{{ userObject?.email }}</h3>
        </div>
        <q-btn flat class="logout-btn" icon="logout" label="Logout" @click="handleLogout" />
      </div>
      <q-card class="setup-card q-pa-md">
        <q-card-section>
          <div class="row items-center">
            <q-icon class="setup-icon q-mr-lg" name="error" />
            <div class="col-grow">
              <div class="text-h6 text-weight-medium q-mb-sm">Complete your account setup</div>
              <div class="text-subtitle1 text-grey-7">
                Set up your account to start using VouchForMe
              </div>
            </div>
            <div class="col-auto">
              <q-btn
                label="Complete Setup"
                @click="openSetupDialog"
                class="setup-btn btn-primary"
              />
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
  <SetupDialog v-model="showSetupDialog" />
</template>
<script>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from 'src/stores/auth'
import SetupDialog from 'src/components/SetupDialog.vue'

export default {
  components: { SetupDialog },
  setup() {
    const userStore = useAuthStore()
    const router = useRouter()

    const showSetupDialog = ref(false)

    const userObject = computed(() => userStore.userObject)

    const handleLogout = () => {
      userStore.logout()
      router.push('/')
    }

    const openSetupDialog = () => {
      showSetupDialog.value = true
      userStore.fetchUserFromDb()
    }

    return {
      userObject,
      handleLogout,
      showSetupDialog,
      openSetupDialog,
    }
  },
}
</script>
<style lang="scss" scoped>
.dashboard-page {
  background-color: #f8f9fa;
  min-height: 100vh;
}

.dashboard-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.welcome-section {
  h2 {
    color: var(--text-primary);
  }

  h3 {
    color: var(--btn-primary);
  }
}

.logout-btn {
  color: var(--text-secondary);
  font-weight: 500;
  padding: 0.5rem 1.5rem;
  border-radius: 8px;
  transition: all 0.2s ease;

  &:hover {
    background-color: rgba(233, 99, 108, 0.1);
    color: var(--btn-primary);
  }

  .q-icon {
    margin-right: 0.5rem;
  }
}

.setup-card {
  background-color: #fff;
  border-radius: 16px;
  border: 1px solid rgba(233, 99, 108, 0.15);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
    transform: translateY(-2px);
  }

  .setup-icon {
    font-size: 2.5rem;
    color: var(--btn-primary);
  }

  .text-subtitle1 {
    font-size: 1rem;
    line-height: 1.5;
  }
}

.setup-btn {
  font-weight: 500;
  padding: 0.75rem 2rem;
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
  .dashboard-container {
    padding: 1rem;
  }

  .welcome-section {
    h2 {
      font-size: 1.5rem;
    }

    h3 {
      font-size: 1.25rem;
    }
  }

  .setup-card {
    .row {
      flex-direction: column;
      text-align: center;
      gap: 1rem;
    }

    .setup-icon {
      font-size: 2rem;
      margin-right: 0 !important;
    }

    .col-auto {
      width: 100%;
    }

    .setup-btn {
      width: 100%;
    }
  }
}
</style>

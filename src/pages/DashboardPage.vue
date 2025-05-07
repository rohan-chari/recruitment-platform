<template>
  <q-page>
    <div class="primary-background-color">
      <div class="row items-center justify-between q-mb-md">
        <h2 class="q-ma-none primary-color">Welcome back, {{ userObject?.email }}</h2>
        <q-btn flat icon="logout" @click="handleLogout" />
      </div>
      <q-card class="complete-setup-card">
        <q-card-section>
          <div class="row items-center">
            <q-icon class="q-mr-md alert-icon" name="error" />
            <div class="col-7">
              <div class="text-weight-medium">Complete your account setup</div>
              <div class="text-caption text-grey-7">
                Set up your account to start using VouchForMe
              </div>
            </div>
            <div class="col-4 row justify-end">
              <q-btn label="Complete Setup" @click="openSetupDialog" rounded color="black" />
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
<style scoped>
.primary-background-color {
  width: 100%;
  height: fit-content;
  padding: 1.5rem;
}
.dashboard-content {
  flex-wrap: wrap;
}
.dashboard-tile {
  min-height: 120px;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  background-color: rgba(253, 253, 253, 0.486);
}
.dashboard-tile:hover {
  box-shadow: 0 10px 16px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.2s ease;
}
h6 {
  margin: 0;
}
.complete-setup-card {
  background-color: #fffbe6;
  border: 1px solid #ffe58f;
  border-radius: 8px;
}
</style>

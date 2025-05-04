<template>
  <q-page>
    <div class="primary-green-container">
      <div class="row items-center justify-between q-mb-md">
        <h5 class="q-ma-none">Welcome back, {{ userObject.email }}</h5>
        <q-btn flat icon="logout" @click="handleLogout" />
      </div>
      <q-card class="complete-setup-card">
        <q-card-section>
          <div class="row items-center">
            <q-icon class="q-mr-md alert-icon" name="error" />
            <div class="col-7">
              <div class="text-weight-medium">Complete your account setup</div>
              <div class="text-caption text-grey-7">Set up your account to start using [Name]</div>
            </div>
            <div class="col-4 row justify-end">
              <q-btn label="Complete Setup" rounded color="black" />
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>
    <div class="dashboard-content row items-start justify-around q-mt-lg">
      <q-card class="q-col-xs-12 q-col-sm-6 q-col-md-3 dashboard-tile">
        <q-card-section>
          <h6>Overview</h6>
          <q-separator />
        </q-card-section>
      </q-card>
      <q-card class="q-col-xs-12 q-col-sm-6 q-col-md-3 dashboard-tile">
        <q-card-section>
          <h6>Active Conversations</h6>
          <q-separator />
        </q-card-section>
      </q-card>
      <q-card class="q-col-xs-12 q-col-sm-6 q-col-md-3 dashboard-tile">
        <q-card-section>
          <h6>Announcements</h6>
          <q-separator />
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>
<script>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from 'src/stores/auth'

export default {
  components: {},
  setup() {
    const userStore = useAuthStore()
    const router = useRouter()

    const userObject = computed(() => userStore.userObject)

    const handleLogout = () => {
      userStore.logout()
      router.push('/')
    }

    return {
      userObject,
      handleLogout,
    }
  },
}
</script>
<style scoped>
.primary-pink-container {
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

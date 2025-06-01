<template>
  <q-page class="profile-page">
    <!-- Header Section -->
    <div class="container">
      <div class="row items-center q-py-xl">
        <div class="col-12 col-sm-8">
          <div class="row items-center">
            <q-avatar size="160px" class="profile-avatar q-mr-md">
              <img :src="userDbObject?.profilePictureUrl" />
            </q-avatar>
            <div class="q-mt-md q-mt-sm-none">
              <div class="text-h4 name">
                {{ userDbObject?.firstName }}
                {{ userDbObject?.middleInitial ? userDbObject?.middleInitial + '.' : '' }}
                {{ userDbObject?.lastName }}
              </div>
              <!-- Professional Info -->
              <template
                v-if="
                  userDbObject?.employmentStatus === 'Employed' ||
                  userDbObject?.employmentStatus === 'Self-Employed/Freelancer'
                "
              >
                <div class="text-h6 occupation q-mt-sm">
                  {{ userDbObject?.occupation }} at {{ userDbObject?.company }}
                </div>
                <div class="text-subtitle2 experience" v-if="userDbObject?.experience">
                  {{ userDbObject?.experience }} years of experience
                </div>
              </template>
            </div>
          </div>
        </div>
        <div class="col-12 col-sm-4">
          <div class="row justify-end q-gutter-sm q-mt-md q-mt-sm-none">
            <q-btn class="btn-primary" label="Edit Profile" icon="edit" @click="openEditDialog" />
            <q-btn flat class="share-btn" icon="share" @click="shareProfile" />
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="container q-mt-xl">
      <div class="row">
        <!-- Left Column - Main Profile Info -->
        <div class="col-12 col-md-8">
          <!-- Basic Info Card -->
          <q-card flat bordered class="profile-card">
            <q-card-section>
              <div class="text-h5">About</div>
              <p class="q-mt-md text-body1">{{ userDbObject?.userBio }}</p>
            </q-card-section>
          </q-card>

          <!-- Skills Section -->
          <q-card flat bordered class="profile-card q-mt-md">
            <q-card-section>
              <div class="text-h5">Skills</div>
              <div class="q-mt-md">
                <q-chip
                  v-for="skill in userDbObject?.skills"
                  :key="skill"
                  class="skill-chip q-ma-xs"
                >
                  {{ skill }}
                </q-chip>
              </div>
            </q-card-section>
          </q-card>

          <!-- Recommendations Section Placeholder -->
          <q-card flat bordered class="profile-card q-mt-md">
            <q-card-section>
              <div class="text-h5">Recommendations</div>
              <div class="text-center q-pa-lg text-subtitle1 text-grey-7">
                <q-icon name="recommend" size="48px" class="q-mb-md" />
                <div>Recommendations coming soon!</div>
                <div class="text-caption q-mt-sm">Get endorsed by your peers and colleagues</div>
              </div>
            </q-card-section>
          </q-card>
        </div>

        <!-- Right Column - Additional Info -->
        <div class="col-12 col-md-4 q-pl-md">
          <!-- Goals Card -->
          <q-card flat bordered class="profile-card">
            <q-card-section>
              <div class="text-h5">Goals</div>
              <div class="q-mt-md">
                <q-chip v-for="goal in userDbObject?.goals" :key="goal" class="goal-chip q-ma-xs">
                  {{ goal }}
                </q-chip>
                <p v-if="userDbObject?.otherGoals" class="text-body2 q-mt-sm text-grey-8">
                  {{ userDbObject?.otherGoals }}
                </p>
              </div>
            </q-card-section>
          </q-card>

          <!-- Profile Strength Card -->
          <q-card flat bordered class="profile-card q-mt-md">
            <q-card-section>
              <div class="text-h5">Profile Strength</div>
              <div class="q-mt-md">
                <q-linear-progress :value="profileStrength" color="primary" class="q-mb-sm" />
                <div class="text-caption text-grey-8">
                  {{ Math.round(profileStrength * 100) }}% Complete
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>

    <!-- Setup Dialog -->
    <SetupDialog v-model="showEditDialog" />
  </q-page>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import { useQuasar } from 'quasar'
import { useAuthStore } from 'src/stores/auth'
import SetupDialog from 'src/components/SetupDialog.vue'

export default {
  name: 'ProfilePage',

  components: {
    SetupDialog,
  },

  setup() {
    const $q = useQuasar()
    const authStore = useAuthStore()
    const showEditDialog = ref(false)
    const userDbObject = computed(() => authStore.userDbObject)

    // Calculate profile strength based on filled fields
    const profileStrength = computed(() => {
      if (!userDbObject.value) return 0

      let totalFields = 0
      let filledFields = 0

      // Basic info
      const basicFields = ['firstName', 'lastName', 'profilePictureUrl', 'userBio']
      totalFields += basicFields.length
      filledFields += basicFields.filter((field) => !!userDbObject.value[field]).length

      // Employment status specific fields
      if (userDbObject.value.employmentStatus) {
        totalFields += 1
        filledFields += 1

        // Define all possible field sets
        const workFields = ['occupation', 'company']
        const studentFields = ['institution', 'fieldOfStudy', 'educationLevel', 'graduationYear']
        const seekerFields = ['desiredRole', 'desiredIndustries']

        switch (userDbObject.value.employmentStatus) {
          case 'Employed':
          case 'Self-Employed/Freelancer':
            totalFields += workFields.length
            filledFields += workFields.filter((field) => !!userDbObject.value[field]).length
            break

          case 'Student':
            totalFields += studentFields.length
            filledFields += studentFields.filter((field) => !!userDbObject.value[field]).length
            break

          case 'Looking for Opportunities':
            totalFields += seekerFields.length
            filledFields += seekerFields.filter((field) => {
              if (field === 'desiredIndustries') {
                return userDbObject.value[field]?.length > 0
              }
              return !!userDbObject.value[field]
            }).length
            break
        }
      }

      // Skills and Goals
      if (userDbObject.value.skills?.length) {
        totalFields += 1
        filledFields += 1
      }
      if (userDbObject.value.goals?.length) {
        totalFields += 1
        filledFields += 1
      }

      return filledFields / totalFields
    })

    const openEditDialog = () => {
      showEditDialog.value = true
    }

    const shareProfile = () => {
      // Copy profile URL to clipboard
      navigator.clipboard.writeText(window.location.href)
      $q.notify({
        type: 'positive',
        message: 'Profile URL copied to clipboard!',
      })
    }

    onMounted(async () => {
      authStore.fetchUser()

      const unwatch = watch(
        () => authStore.userObject,
        async (newUser) => {
          if (newUser) {
            await authStore.fetchUserFromDb()
            unwatch()
          }
        },
        { immediate: true },
      )
    })

    return {
      userDbObject,
      showEditDialog,
      openEditDialog,
      shareProfile,
      profileStrength,
    }
  },
}
</script>

<style lang="scss" scoped>
.profile-page {
  background-color: #f5f5f5;
  min-height: 100vh;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.profile-avatar {
  border: 4px solid white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  background-color: white;

  img {
    object-fit: cover;
    width: 100%;
    height: 100%;
  }
}

.name {
  color: var(--text-primary);
  font-weight: 600;
}

.occupation {
  color: var(--text-primary);
}

.experience {
  color: var(--text-secondary);
}

.share-btn {
  color: var(--btn-primary);
}

.profile-card {
  border-radius: 8px;
  box-shadow: none;
  border: 1px solid rgba(0, 0, 0, 0.12);
  background: white;
}

.skill-chip {
  background-color: rgba(75, 75, 75, 0.1);
  color: var(--text-primary);
  border: 1px solid rgba(75, 75, 75, 0.2);

  &:hover {
    background-color: rgba(75, 75, 75, 0.15);
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

@media (max-width: 600px) {
  .profile-avatar {
    margin: 0 auto;
    display: block;
  }

  .text-h4 {
    text-align: center;
  }

  .occupation,
  .experience {
    text-align: center;
  }

  .row.justify-end {
    justify-content: center;
  }
}
</style>

<template>
  <q-page class="dashboard-page">
    <div class="container q-pa-md">
      <!-- Reference Requests Section -->
      <div class="row q-col-gutter-md">
        <div class="col-12 col-md-7">
          <q-card flat bordered class="dashboard-card">
            <q-card-section>
              <div class="row items-center justify-between q-mb-md">
                <div class="text-h6">Your Reference Requests</div>
                <q-btn color="primary" label="+ New Request" @click="openNewRequestDialog" />
              </div>
              <q-table
                flat
                :rows="referenceRequests"
                :columns="referenceColumns"
                row-key="email"
                :pagination="{ rowsPerPage: 5 }"
                hide-bottom
              />
            </q-card-section>
          </q-card>

          <!-- Recent Activity -->
          <q-card flat bordered class="dashboard-card q-mt-md">
            <q-card-section>
              <div class="text-h6 q-mb-md">Recent Activity</div>
              <div class="activity-list">
                <div class="activity-item q-mb-sm">
                  <div class="row items-center justify-between">
                    <div>You received a new reference from John Doe</div>
                    <div class="text-caption">Today</div>
                  </div>
                </div>
                <div class="activity-item q-mb-sm">
                  <div class="row items-center justify-between">
                    <div>Your reference request to Mary Smith is still pending.</div>
                    <div class="text-caption">Yesterday, 2:77 PM</div>
                  </div>
                </div>
                <div class="activity-item">
                  <div class="row items-center justify-between">
                    <div>3 people viewed your profile this week.</div>
                    <div class="text-caption">April 3, 2024</div>
                  </div>
                </div>
              </div>
            </q-card-section>
          </q-card>

          <!-- Reference Templates -->
          <q-card flat bordered class="dashboard-card q-mt-md">
            <q-card-section>
              <div class="row items-center justify-between q-mb-md">
                <div class="text-h6">Reference Templates</div>
                <q-btn
                  color="primary"
                  label="+ Create Template"
                  @click="openCreateTemplateDialog"
                />
              </div>
              <q-table
                flat
                :rows="templates"
                :columns="templateColumns"
                row-key="name"
                :pagination="{ rowsPerPage: 5 }"
                hide-bottom
              >
                <template v-slot:body-cell-actions="props">
                  <q-td :props="props">
                    <q-btn
                      flat
                      round
                      color="primary"
                      icon="edit"
                      size="sm"
                      @click="editTemplate(props.row)"
                    />
                    <q-btn
                      flat
                      round
                      color="negative"
                      icon="delete"
                      size="sm"
                      @click="deleteTemplate(props.row)"
                    />
                  </q-td>
                </template>
              </q-table>
            </q-card-section>
          </q-card>
        </div>

        <div class="col-12 col-md-5">
          <!-- At a Glance -->
          <q-card flat bordered class="dashboard-card">
            <q-card-section>
              <div class="text-h6 q-mb-md">At a Glance</div>
              <div class="row q-col-gutter-md">
                <div class="col-6">
                  <div class="text-h3 text-center">5</div>
                  <div class="text-caption text-center">Total References Collected</div>
                </div>
                <div class="col-6">
                  <div class="text-h3 text-center">37</div>
                  <div class="text-caption text-center">Profile Views</div>
                  <div class="text-caption text-center text-grey-7">(Last 30 Days)</div>
                </div>
                <div class="col-6">
                  <div class="text-h3 text-center">1</div>
                  <div class="text-caption text-center">Requests Pending</div>
                </div>
                <div class="col-6">
                  <div class="text-h3 text-center">27</div>
                  <div class="text-caption text-center">Total Views</div>
                </div>
              </div>
            </q-card-section>
          </q-card>

          <!-- Profile Link -->
          <q-card flat bordered class="dashboard-card q-mt-md">
            <q-card-section>
              <div class="text-h6 q-mb-md">Shared Profile Link</div>
              <div class="row items-center q-gutter-sm">
                <q-input outlined dense readonly class="col" :model-value="profileUrl" />
                <q-btn flat color="primary" icon="content_copy" @click="shareProfile" />
              </div>
            </q-card-section>
          </q-card>

          <!-- Vouch Links -->
          <q-card flat bordered class="dashboard-card q-mt-md">
            <q-card-section>
              <div class="text-h6 q-mb-md">Your Vouch Links</div>
              <q-table
                flat
                :rows="vouchLinks"
                :columns="vouchColumns"
                row-key="label"
                :pagination="{ rowsPerPage: 5 }"
                hide-bottom
              >
                <template v-slot:body-cell-link="props">
                  <q-td :props="props">
                    <q-btn flat color="primary" icon="content_copy" size="sm" />
                  </q-td>
                </template>
              </q-table>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>
  </q-page>
  <SetupDialog v-model="showSetupDialog" />
  <NewReferenceRequestDialog v-model="showNewRequestDialog" />
  <CreateTemplateDialog v-model="showCreateTemplateDialog" />
</template>

<script>
import { computed, ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from 'src/stores/auth'
import { useQuasar } from 'quasar'
import SetupDialog from 'src/components/SetupDialog.vue'
import NewReferenceRequestDialog from 'src/components/NewReferenceRequestDialog.vue'
import CreateTemplateDialog from 'src/components/CreateTemplateDialog.vue'

export default {
  components: {
    SetupDialog,
    NewReferenceRequestDialog,
    CreateTemplateDialog,
  },
  setup() {
    const userStore = useAuthStore()
    const router = useRouter()
    const $q = useQuasar()
    const showSetupDialog = ref(false)
    const showNewRequestDialog = ref(false)
    const showCreateTemplateDialog = ref(false)
    const selectedTemplate = ref('Job Application')

    const userObject = computed(() => userStore.userObject)
    const userDbObject = computed(() => userStore.userDbObject)
    const profileUrl = computed(() => `${window.location.origin}/profile/${userObject.value?.uid}`)

    // Mock data
    const referenceRequests = [
      {
        recipient: 'John Doe',
        email: 'john@example.com',
        status: 'Pending',
      },
      {
        recipient: 'Mary Smith',
        email: 'mary@example.com',
        status: 'Submitted',
      },
      {
        recipient: 'Michael Brown',
        email: 'michael@example.com',
        status: 'Declined',
      },
    ]

    const referenceColumns = [
      { name: 'recipient', label: 'Recipient', field: 'recipient', align: 'left' },
      { name: 'email', label: 'Email', field: 'email', align: 'left' },
      { name: 'status', label: 'Status', field: 'status', align: 'left' },
    ]

    const vouchLinks = [
      {
        label: 'Summer Internship 2025',
        link: '',
        dateCreated: '01/19/2024',
      },
      {
        label: 'General',
        link: '',
        dateCreated: '11/05/2023',
      },
    ]

    const vouchColumns = [
      { name: 'label', label: 'Label', field: 'label', align: 'left' },
      { name: 'link', label: 'Link', field: 'link', align: 'center' },
      { name: 'dateCreated', label: 'Date Created', field: 'dateCreated', align: 'left' },
    ]

    // Mock data for templates
    const templates = ref([])

    const templateColumns = [
      { name: 'name', label: 'Name', field: 'name', align: 'left' },
      { name: 'category', label: 'Category', field: 'category', align: 'left' },
      { name: 'description', label: 'Description', field: 'description', align: 'left' },
      { name: 'dateCreated', label: 'Created', field: 'dateCreated', align: 'left' },
      { name: 'questionsCount', label: 'Questions', field: 'questionsCount', align: 'center' },
      { name: 'actions', label: 'Actions', field: 'actions', align: 'center' },
    ]

    const handleLogout = () => {
      userStore.logout()
      router.push('/')
    }

    const openSetupDialog = () => {
      showSetupDialog.value = true
    }

    const shareProfile = () => {
      navigator.clipboard.writeText(profileUrl.value)
      $q.notify({
        type: 'positive',
        message: 'Profile URL copied to clipboard!',
      })
    }

    const openNewRequestDialog = () => {
      showNewRequestDialog.value = true
    }

    const openCreateTemplateDialog = () => {
      showCreateTemplateDialog.value = true
    }

    const editTemplate = (template) => {
      // TODO: Implement template editing
      console.log('Edit template:', template)
    }

    const deleteTemplate = async (template) => {
      try {
        await $q.dialog({
          title: 'Confirm Deletion',
          message: `Are you sure you want to delete the template "${template.name}"?`,
          cancel: true,
          persistent: true,
        })

        // TODO: Implement actual deletion
        templates.value = templates.value.filter((t) => t.name !== template.name)

        $q.notify({
          type: 'positive',
          message: 'Template deleted successfully',
        })
      } catch {
        // User cancelled the deletion
      }
    }

    onMounted(async () => {
      userStore.fetchUser()
      const unwatch = watch(
        () => userStore.userObject,
        async (newUser) => {
          if (newUser) {
            await userStore.fetchUserFromDb()
            unwatch()
          }
        },
        { immediate: true },
      )
    })

    return {
      userObject,
      userDbObject,
      handleLogout,
      showSetupDialog,
      openSetupDialog,
      shareProfile,
      profileUrl,
      referenceRequests,
      referenceColumns,
      selectedTemplate,
      vouchLinks,
      vouchColumns,
      showNewRequestDialog,
      openNewRequestDialog,
      showCreateTemplateDialog,
      openCreateTemplateDialog,
      templates,
      templateColumns,
      editTemplate,
      deleteTemplate,
    }
  },
}
</script>

<style lang="scss" scoped>
.dashboard-page {
  background-color: var(--bg-secondary);
  min-height: 100vh;
  padding: 2rem 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.dashboard-card {
  border-radius: 12px;
  background: var(--bg-primary);
  transition: all 0.2s ease;
  border: 1px solid var(--border-color);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);

  .text-h6 {
    color: var(--text-primary);
    font-weight: 600;
    margin-bottom: 1.5rem;
  }

  .text-h3 {
    color: var(--btn-primary);
    font-weight: 600;
  }

  .text-caption {
    color: var(--text-secondary);
    font-size: 0.875rem;
  }

  :deep(.q-table) {
    background: transparent;

    th {
      font-weight: 600;
      color: var(--text-primary);
    }

    td {
      color: var(--text-secondary);
    }
  }

  :deep(.q-btn) {
    border-radius: 8px;
    font-weight: 500;

    &.q-btn--flat:not(.text-primary) {
      color: var(--text-secondary);

      &:hover {
        color: var(--text-primary);
        background: rgba(0, 0, 0, 0.05);
      }
    }
  }

  :deep(.q-field) {
    .q-field__control {
      border-radius: 8px;
      background: white;

      &:hover {
        border-color: var(--btn-primary);
      }
    }

    &.q-field--focused {
      .q-field__control {
        border-color: var(--btn-primary);
        border-width: 2px;
      }
    }
  }
}

.activity-list {
  .activity-item {
    padding: 12px 0;
    border-bottom: 1px solid var(--border-color);

    &:last-child {
      border-bottom: none;
    }

    .text-caption {
      color: var(--text-secondary);
    }
  }
}

@media (max-width: 600px) {
  .dashboard-page {
    padding: 1rem 0;
  }

  .container {
    padding: 0 1rem;
  }

  .dashboard-card {
    margin-bottom: 1rem;
  }

  .text-h3 {
    font-size: 2rem;
  }
}
</style>

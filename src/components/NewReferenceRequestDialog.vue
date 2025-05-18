<template>
  <div class="q-pa-md q-gutter-sm">
    <q-dialog v-model="dialogModel">
      <q-card class="dialog-container">
        <q-card-section align="right">
          <q-icon flat name="close" class="close-btn" @click="closeDialog" />
        </q-card-section>

        <q-card-section>
          <div class="text-h6">New Reference Request</div>
          <div class="q-mt-md">
            <q-input
              v-model="recipientName"
              label="Recipient Name"
              outlined
              dense
              class="q-mb-md"
              :rules="[(val) => !!val || 'Recipient name is required']"
            />
            <q-input
              v-model="recipientEmail"
              label="Recipient Email"
              outlined
              dense
              class="q-mb-md"
              :rules="[(val) => !!val || 'Recipient email is required']"
            />
            <q-select
              v-model="selectedTemplate"
              :options="templates"
              option-label="name"
              label="Reference Template"
              outlined
              dense
              class="q-mb-md"
              :rules="[(val) => !!val || 'Please select a template']"
            />
            <q-input
              v-model="message"
              type="textarea"
              label="Personal Message"
              outlined
              dense
              class="q-mb-lg"
            />

            <!-- Preview Section -->
            <q-expansion-item
              group="preview"
              icon="visibility"
              label="Preview Email"
              class="q-mb-md"
            >
              <q-card>
                <q-card-section>
                  <div class="text-subtitle2">Subject:</div>
                  <p>{{ previewEmailSubject }}</p>
                  <div class="text-subtitle2">Body:</div>
                  <p style="white-space: pre-line">{{ previewEmailBody }}</p>
                </q-card-section>
              </q-card>
            </q-expansion-item>

            <div class="row justify-end">
              <q-btn label="Cancel" flat @click="closeDialog" class="q-mr-sm" />
              <q-btn
                label="Send Request"
                color="primary"
                @click="sendRequest"
                :disable="!isFormValid"
              />
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { ref, watch, computed } from 'vue'
import { useQuasar } from 'quasar'
import { useAuthStore } from 'src/stores/auth'
import axios from 'axios'

export default {
  props: {
    modelValue: {
      type: Boolean,
      required: true,
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const $q = useQuasar()
    const userStore = useAuthStore()
    const recipientName = ref('')
    const recipientEmail = ref('')
    const selectedTemplate = ref(null)
    const message = ref('')

    const dialogModel = ref(props.modelValue)

    // Mock templates data - this should come from your templates API
    const templates = ref([
      {
        id: 1,
        name: 'Job Application',
        emailSubject: 'Reference Request from {yourName}',
        emailBody:
          'Dear {recipientName},\n\nI hope this email finds you well. I am reaching out to request a professional reference for an upcoming job application.\n\n{customMessage}\n\nThank you for your time and consideration.\n\nBest regards,\n{yourName}',
      },
      {
        id: 2,
        name: 'Academic Reference',
        emailSubject: 'Academic Reference Request - {yourName}',
        emailBody:
          'Dear {recipientName},\n\nI am writing to request an academic reference for my graduate school application.\n\n{customMessage}\n\nThank you for your support.\n\nBest regards,\n{yourName}',
      },
    ])

    // Computed properties for preview
    const previewEmailSubject = computed(() => {
      if (!selectedTemplate.value) return ''

      const variables = {
        recipientName: recipientName.value || '[Recipient Name]',
        yourName:
          `${userStore.userDbObject?.firstName || ''} ${userStore.userDbObject?.lastName || ''}`.trim() ||
          '[Your Name]',
        customMessage: message.value,
      }

      return replaceVariables(selectedTemplate.value.emailSubject, variables)
    })

    const previewEmailBody = computed(() => {
      if (!selectedTemplate.value) return ''

      const variables = {
        recipientName: recipientName.value || '[Recipient Name]',
        yourName:
          `${userStore.userDbObject?.firstName || ''} ${userStore.userDbObject?.lastName || ''}`.trim() ||
          '[Your Name]',
        customMessage: message.value,
      }

      return replaceVariables(selectedTemplate.value.emailBody, variables)
    })

    const isFormValid = computed(() => {
      return (
        recipientName.value &&
        recipientEmail.value &&
        selectedTemplate.value &&
        userStore.userDbObject?.firstName &&
        userStore.userDbObject?.lastName
      )
    })

    // Helper function to replace variables in templates
    const replaceVariables = (template, values) => {
      return template.replace(/{(\w+)}/g, (match, key) => values[key] || match)
    }

    // Watch for changes in props.modelValue
    watch(
      () => props.modelValue,
      (newVal) => {
        dialogModel.value = newVal
      },
    )

    // Watch for changes in dialogModel
    watch(
      () => dialogModel.value,
      (newVal) => {
        emit('update:modelValue', newVal)
      },
    )

    const closeDialog = () => {
      emit('update:modelValue', false)
      resetForm()
    }

    const sendRequest = async () => {
      if (!isFormValid.value) {
        $q.notify({
          type: 'warning',
          message: 'Please fill in all required fields',
        })
        return
      }

      try {
        // TODO: Replace with your actual API endpoint
        await axios.post('https://vouchforme.org/api/reference-requests', {
          recipientName: recipientName.value,
          recipientEmail: recipientEmail.value,
          templateId: selectedTemplate.value.id,
          message: message.value,
          userId: userStore.userObject.uid,
          emailSubject: previewEmailSubject.value,
          emailBody: previewEmailBody.value,
        })

        $q.notify({
          type: 'positive',
          message: 'Reference request sent successfully!',
        })
        closeDialog()
      } catch (error) {
        console.error('Error sending reference request:', error)
        $q.notify({
          type: 'negative',
          message: 'Failed to send reference request. Please try again.',
        })
      }
    }

    const resetForm = () => {
      recipientName.value = ''
      recipientEmail.value = ''
      selectedTemplate.value = null
      message.value = ''
    }

    return {
      recipientName,
      recipientEmail,
      selectedTemplate,
      templates,
      message,
      dialogModel,
      closeDialog,
      sendRequest,
      previewEmailSubject,
      previewEmailBody,
      isFormValid,
    }
  },
}
</script>

<style lang="scss" scoped>
.dialog-container {
  width: 100%;
  max-width: 600px;
}

.preview-section {
  background-color: #f5f5f5;
  border-radius: 8px;
  padding: 1rem;
}
</style>

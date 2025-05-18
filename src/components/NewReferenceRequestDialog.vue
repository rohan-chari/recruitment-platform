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
            />
            <q-input
              v-model="recipientEmail"
              label="Recipient Email"
              outlined
              dense
              class="q-mb-md"
            />
            <q-select
              v-model="template"
              :options="['Job Application', 'Academic Reference', 'General']"
              label="Reference Template"
              outlined
              dense
              class="q-mb-md"
            />
            <q-input
              v-model="message"
              type="textarea"
              label="Personal Message"
              outlined
              dense
              class="q-mb-lg"
            />
            <div class="row justify-end">
              <q-btn label="Cancel" flat @click="closeDialog" class="q-mr-sm" />
              <q-btn label="Send Request" color="primary" @click="sendRequest" />
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { ref, watch } from 'vue'
import { useQuasar } from 'quasar'

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
    const recipientName = ref('')
    const recipientEmail = ref('')
    const template = ref('Job Application')
    const message = ref('')

    const dialogModel = ref(props.modelValue)

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

    const sendRequest = () => {
      // TODO: Implement sending reference request
      $q.notify({
        type: 'positive',
        message: 'Reference request sent successfully!',
      })
      closeDialog()
    }

    const resetForm = () => {
      recipientName.value = ''
      recipientEmail.value = ''
      template.value = 'Job Application'
      message.value = ''
    }

    return {
      recipientName,
      recipientEmail,
      template,
      message,
      dialogModel,
      closeDialog,
      sendRequest,
    }
  },
}
</script>

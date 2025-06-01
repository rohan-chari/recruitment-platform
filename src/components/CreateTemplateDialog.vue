<template>
  <div class="q-pa-md q-gutter-sm">
    <q-dialog v-model="dialogModel">
      <q-card class="dialog-container">
        <q-card-section align="right">
          <q-icon flat name="close" class="close-btn" @click="closeDialog" />
        </q-card-section>

        <q-card-section class="dialog-section">
          <h2 class="text-h4 text-weight-medium q-mb-sm primary-color">Create Template</h2>
          <h6 class="text-subtitle1 text-grey-7 q-ma-none">
            Design a template for your reference requests
          </h6>
        </q-card-section>

        <q-card-section class="form-section">
          <q-stepper
            v-model="step"
            ref="stepper"
            color="primary"
            animated
            flat
            class="template-stepper"
          >
            <!-- Basic Info -->
            <q-step :name="1" title="Basic Information" icon="description" :done="step > 1">
              <div class="row q-col-gutter-md">
                <div class="col-12">
                  <q-input
                    v-model="templateData.name"
                    label="Template Name"
                    outlined
                    :rules="[(val) => !!val || 'Template name is required']"
                  />
                </div>
                <div class="col-12">
                  <q-select
                    v-model="templateData.category"
                    :options="categoryOptions"
                    label="Category"
                    outlined
                    :rules="[(val) => !!val || 'Category is required']"
                  />
                </div>
                <div class="col-12">
                  <q-input
                    v-model="templateData.description"
                    type="textarea"
                    label="Description"
                    outlined
                    hint="Brief description of what this template is for"
                  />
                </div>
              </div>

              <q-stepper-navigation>
                <q-btn @click="step = 2" color="primary" label="Next" />
              </q-stepper-navigation>
            </q-step>

            <!-- Email Content -->
            <q-step :name="2" title="Email Content" icon="mail" :done="step > 2">
              <div class="row q-col-gutter-md">
                <div class="col-12">
                  <q-input
                    v-model="templateData.emailSubject"
                    label="Email Subject"
                    outlined
                    :rules="[(val) => !!val || 'Email subject is required']"
                    hint="Use {recipientName} and {yourName} as placeholders"
                  />
                </div>
                <div class="col-12">
                  <q-input
                    v-model="templateData.emailBody"
                    type="textarea"
                    label="Email Body"
                    outlined
                    :rules="[(val) => !!val || 'Email body is required']"
                    hint="Use {recipientName}, {yourName}, and {customMessage} as placeholders"
                    autogrow
                  />
                </div>
              </div>

              <q-stepper-navigation>
                <q-btn @click="step = 3" color="primary" label="Next" class="q-mr-sm" />
                <q-btn flat @click="step = 1" label="Back" />
              </q-stepper-navigation>
            </q-step>

            <!-- Questions -->
            <q-step :name="3" title="Reference Questions" icon="help" :done="step > 3">
              <div class="row q-col-gutter-md">
                <div class="col-12">
                  <div class="text-subtitle1 q-mb-md">
                    Add questions for your reference to answer
                  </div>
                  <div
                    v-for="(question, index) in templateData.questions"
                    :key="index"
                    class="q-mb-md"
                  >
                    <div class="row q-col-gutter-sm items-center">
                      <div class="col">
                        <q-input
                          v-model="question.text"
                          label="Question"
                          outlined
                          :rules="[(val) => !!val || 'Question is required']"
                        />
                      </div>
                      <div class="col-auto">
                        <q-select
                          v-model="question.type"
                          :options="questionTypeOptions"
                          label="Type"
                          outlined
                          style="min-width: 150px"
                        />
                      </div>
                      <div class="col-auto">
                        <q-btn
                          round
                          flat
                          color="negative"
                          icon="delete"
                          @click="removeQuestion(index)"
                        />
                      </div>
                    </div>
                    <div v-if="question.type === 'rating'" class="row q-mt-sm">
                      <div class="col-6">
                        <q-input v-model="question.minLabel" label="Min Label" outlined dense />
                      </div>
                      <div class="col-6">
                        <q-input v-model="question.maxLabel" label="Max Label" outlined dense />
                      </div>
                    </div>
                  </div>
                  <q-btn
                    outline
                    color="primary"
                    icon="add"
                    label="Add Question"
                    @click="addQuestion"
                    class="q-mt-md"
                  />
                </div>
              </div>

              <q-stepper-navigation>
                <q-btn @click="step = 4" color="primary" label="Next" class="q-mr-sm" />
                <q-btn flat @click="step = 2" label="Back" />
              </q-stepper-navigation>
            </q-step>

            <!-- Preview -->
            <q-step :name="4" title="Preview" icon="visibility">
              <div class="row q-col-gutter-md">
                <div class="col-12">
                  <q-card flat bordered>
                    <q-card-section>
                      <div class="text-h6">{{ templateData.name }}</div>
                      <div class="text-subtitle2">{{ templateData.category }}</div>
                      <p class="text-body2">{{ templateData.description }}</p>
                    </q-card-section>
                  </q-card>
                </div>
                <div class="col-12">
                  <q-card flat bordered>
                    <q-card-section>
                      <div class="text-h6">Email Preview</div>
                      <div class="text-subtitle2 q-mt-sm">Subject:</div>
                      <p>{{ templateData.emailSubject }}</p>
                      <div class="text-subtitle2">Body:</div>
                      <p style="white-space: pre-line">{{ templateData.emailBody }}</p>
                    </q-card-section>
                  </q-card>
                </div>
                <div class="col-12">
                  <q-card flat bordered>
                    <q-card-section>
                      <div class="text-h6">Questions</div>
                      <q-list>
                        <q-item v-for="(question, index) in templateData.questions" :key="index">
                          <q-item-section>
                            <q-item-label>{{ index + 1 }}. {{ question.text }}</q-item-label>
                            <q-item-label caption>Type: {{ question.type }}</q-item-label>
                            <q-item-label v-if="question.type === 'rating'" caption>
                              Scale: {{ question.minLabel }} to {{ question.maxLabel }}
                            </q-item-label>
                          </q-item-section>
                        </q-item>
                      </q-list>
                    </q-card-section>
                  </q-card>
                </div>
              </div>

              <q-stepper-navigation>
                <q-btn
                  color="primary"
                  label="Save Template"
                  @click="saveTemplate"
                  class="q-mr-sm"
                />
                <q-btn flat @click="step = 3" label="Back" />
              </q-stepper-navigation>
            </q-step>
          </q-stepper>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
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
  emits: ['update:modelValue', 'template-saved'],
  setup(props, { emit }) {
    const $q = useQuasar()
    const userStore = useAuthStore()
    const step = ref(1)

    const dialogModel = computed({
      get: () => props.modelValue,
      set: (val) => emit('update:modelValue', val),
    })

    const templateData = ref({
      name: '',
      category: null,
      description: '',
      emailSubject: '',
      emailBody: '',
      questions: [],
    })

    const categoryOptions = [
      'Job Application',
      'Academic Reference',
      'Housing Reference',
      'Character Reference',
      'Professional Reference',
      'General',
    ]

    const questionTypeOptions = ['text', 'rating', 'multiple_choice', 'yes_no']

    const addQuestion = () => {
      templateData.value.questions.push({
        text: '',
        type: 'text',
        minLabel: 'Poor',
        maxLabel: 'Excellent',
      })
    }

    const removeQuestion = (index) => {
      templateData.value.questions.splice(index, 1)
    }

    const closeDialog = () => {
      dialogModel.value = false
      step.value = 1
      templateData.value = {
        name: '',
        category: null,
        description: '',
        emailSubject: '',
        emailBody: '',
        questions: [],
      }
    }

    const saveTemplate = async () => {
      try {
        await axios.post('https://vouchforme.org/api/templates/create-template', {
          ...templateData.value,
          userId: userStore.userObject.uid,
        })

        $q.notify({
          type: 'positive',
          message: 'Template saved successfully!',
        })

        emit('template-saved')
        closeDialog()
      } catch (error) {
        console.error('Error saving template:', error)
        $q.notify({
          type: 'negative',
          message: 'Failed to save template. Please try again.',
        })
      }
    }

    return {
      dialogModel,
      step,
      templateData,
      categoryOptions,
      questionTypeOptions,
      addQuestion,
      removeQuestion,
      closeDialog,
      saveTemplate,
    }
  },
}
</script>

<style lang="scss" scoped>
.dialog-container {
  width: 100%;
  max-width: 800px;
  border-radius: 16px;
  background: #ffffff;
}

.dialog-section {
  padding: 1.5rem;
}

.form-section {
  padding: 0 1.5rem 1.5rem;
}

.template-stepper {
  box-shadow: none;
}

.close-btn {
  cursor: pointer;
  font-size: 1.5rem;
  transition: all 0.2s ease;

  &:hover {
    color: var(--btn-primary);
    transform: scale(1.1);
  }
}
</style>

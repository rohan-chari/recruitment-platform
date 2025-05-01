<template>
  <div class="q-pa-md q-gutter-sm">
    <q-dialog v-model="dialogModel">
      <q-card class="component-container">
        <q-card-section align="right">
          <q-icon flat name="close" class="close-btn" @click="dialogModel = false" />
        </q-card-section>

        <q-card-section class="q-pt-none dialog-section" align="center">
          <h4>Get Started</h4>
          <p v-if="currentPage == 0" class="secondary-color">
            Are you an organization or a candidate?
          </p>
          <p v-if="currentPage == 1 && activeUserType == 'organization'" class="secondary-color">
            Let's find your organization. Type its name below.
          </p>
          <p v-if="currentPage == 1 && activeUserType == 'candidate'" class="secondary-color">
            Create your account to start chatting with recruiters.
          </p>
        </q-card-section>

        <q-card v-if="currentPage == 0" class="row org-cand-container q-pa-md">
          <q-card-section
            :class="{
              'icon-container': true,
              'selected-user-type': activeUserType === 'candidate',
            }"
            @click="activeUserType = 'candidate'"
          >
            <q-icon flat name="person" class="registration-icons" />
            <p class="text-body2">Candidate</p>
          </q-card-section>
          <q-card-section
            :class="{
              'icon-container': true,
              'selected-user-type': activeUserType === 'organization',
            }"
            @click="activeUserType = 'organization'"
          >
            <q-icon flat name="domain" class="registration-icons" />
            <p class="text-body2">Organization</p>
          </q-card-section>
        </q-card>
        <q-card-section v-if="currentPage == 1 && activeUserType == 'organization'">
          <q-select
            filled
            :model-value="orgSearch"
            use-input
            hide-selected
            fill-input
            input-debounce="0"
            label="Company Name"
            :options="options"
            @filter="filterFn"
            @input-value="setOrgSearch"
          >
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey"> No results </q-item-section>
              </q-item>
            </template>
          </q-select>
          <div class="org-missing-text row items-center q-gutter-xs">
            <p class="secondary-color">Can't find your organization?</p>
            <p class="create-link" @click="expandCreateOrg">Create a new one.</p>
          </div>
          <!--@submit.prevent="handleCreateOrg"-->
          <div v-if="createOrgActive" class="create-org-container">
            <q-form class="create-org-form">
              <h4>Create Organization</h4>
              <q-input filled fill-input label="Company Name"></q-input>
              <q-input filled fill-input label="Company Website URL"></q-input>
              <q-input filled fill-input label="Company Email Domain" hint="@xxxxxxx.com"></q-input>
              <q-btn label="Upload Logo" />
              <q-input filled fill-input label="Company Name"></q-input>
              <q-checkbox> I verify that I am authorized to create this organization</q-checkbox>
              <q-btn label="Create Organization" type="submit" />
            </q-form>
          </div>
        </q-card-section>
        <q-card-section v-if="currentPage == 1 && activeUserType == 'candidate'">
          Candidate selected.
        </q-card-section>
        <q-card-section class="next-btn-container row">
          <q-btn
            v-if="currentPage > 0"
            class="next-btn"
            flat
            round
            icon="arrow_back_ios"
            @click="changePage('prev')"
          />
          <q-btn
            class="next-btn"
            :disable="!activeUserType"
            flat
            round
            icon="arrow_forward_ios"
            @click="changePage('next')"
          />
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { computed, ref } from 'vue'

export default {
  props: {
    modelValue: {
      type: Boolean,
      required: true,
    },
  },
  setup(props, { emit }) {
    const dialogModel = computed({
      get: () => props.modelValue,
      set: (val) => emit('update:modelValue', val),
    })

    const activeUserType = ref('')
    const createOrgActive = ref(false)
    const currentPage = ref(0)

    const changePage = (action) => {
      if (action == 'prev') {
        if (currentPage.value <= 0) {
          return
        } else {
          currentPage.value--
        }
      } else if (action == 'next') {
        if (currentPage.value >= 10) {
          return
        } else {
          currentPage.value++
        }
      }
    }

    const expandCreateOrg = () => {
      createOrgActive.value = !createOrgActive.value
    }

    const stringOptions = [
      'NTT Data',
      'Booz Allen Hamilton',
      'National Institute of Allergens and Infectious Disease',
      'United States Department of Agriculture',
    ]

    const orgSearch = ref(null)
    const options = ref(stringOptions)

    return {
      dialogModel,
      activeUserType,
      currentPage,
      changePage,
      stringOptions,
      orgSearch,
      options,
      filterFn(val, update) {
        update(() => {
          const needle = val.toLocaleLowerCase()
          options.value = stringOptions.filter((v) => v.toLocaleLowerCase().indexOf(needle) > -1)
        })
      },

      setOrgSearch(val) {
        orgSearch.value = val
      },
      expandCreateOrg,
      createOrgActive,
    }
  },
}
</script>
<style lang="scss" scoped>
.secondary-color {
  color: $text-secondary;
}
.dialog-section {
  h4 {
    margin: 0 0 1rem 0;
  }
}
.registration-icons {
  font-size: 10rem;
}
.icon-container {
  text-align: center;
  transition: transform 0.3s ease;
}

.icon-container:hover {
  background-color: rgba(209, 209, 209, 0.26);
  cursor: pointer;
  transform: scale(1.05);
}
.org-cand-container {
  gap: 3rem;
  padding-bottom: 1.5rem;
  justify-content: center;
}
.selected-user-type {
  border: 2.5px black solid !important;
}
.next-btn-container {
  justify-content: center;
  font-size: 2rem;
  gap: 1rem;
}
.next-btn {
  cursor: pointer;
  border: 2px solid black !important;
  border-radius: 50%;
  padding: 8px;
  font-size: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.next-btn:hover {
  background-color: black;
  transform: scale(1.15);
  transition: all 0.2s ease;
  color: white;
}
.component-container {
  width: 100%;
}
.org-missing-text {
  margin-top: 0.25rem;
  justify-content: center;
  font-size: 0.8rem;

  .create-link {
    color: #007aff;
    text-decoration: underline;
    cursor: pointer;
    font-weight: 500;
    transition: color 0.2s ease;

    &:hover {
      color: #005bbb;
    }
  }

  .secondary-color {
    color: #666;
    margin-right: 0.25rem;
  }
}
.create-org-container {
  text-align: center;
}
.create-org-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>

<template>
  <div class="q-pa-md q-gutter-sm">
    <q-dialog v-model="dialogModel">
      <q-card>
        <q-card-section align="right">
          <q-icon flat name="close" class="close-btn" @click="dialogModel = false" />
        </q-card-section>

        <q-card-section class="q-pt-none dialog-section" align="center">
          <h4>Get Started</h4>
          <p class="secondary-color">Are you an organization or a candidate?</p>
        </q-card-section>

        <q-card class="row org-cand-container q-pa-md">
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
        <q-card-section v-if="activeUserType" class="next-btn-container row">
          <q-icon class="next-btn" name="arrow_forward_ios" />
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

    return {
      dialogModel,
      activeUserType,
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
}
.selected-user-type {
  border: 2.5px black solid !important;
}
.next-btn-container {
  justify-content: center;
  font-size: 2rem;
}
.next-btn {
  cursor: pointer;
  border: 2px solid black !important;
  border-radius: 50%;
  padding: 8px;
  font-size: 24px;
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
</style>

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
          <q-card-section class="icon-container">
            <q-icon flat name="domain" class="registration-icons" />
            <p class="text-body2">Organization</p>
          </q-card-section>
          <q-card-section class="icon-container">
            <q-icon flat name="person" class="registration-icons" />
            <p class="text-body2">Candidate</p>
          </q-card-section>
        </q-card>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { computed } from 'vue'

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

    return {
      dialogModel,
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
}

.icon-container:hover {
  background-color: rgba(209, 209, 209, 0.26);
  cursor: pointer;
}
.org-cand-container {
  gap: 3rem;
}
</style>

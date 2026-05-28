<template>
  <span class="patient-status-badge" :class="statusClassFor(status)">
    {{ status }}
  </span>
</template>

<script setup>
import { statusClassFor } from '~/data/patientPortal'

defineProps({
  status: {
    type: String,
    required: true
  }
})
</script>

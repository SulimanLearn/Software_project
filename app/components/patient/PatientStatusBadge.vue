<template>
  <BaseStatusBadge
    :status="status"
    :status-class="statusClassFor(status)"
    base-class="patient-status-badge"
  />
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

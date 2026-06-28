<template>
  <BaseStatusBadge
    :status="status"
    :status-class="statusClassForPharmacist(status)"
    base-class="pharmacist-status-badge"
  />
</template>

<script setup lang="ts">
import { statusClassForPharmacist } from '~/data/pharmacistPortal'

defineProps({
  status: {
    type: String,
    required: true
  }
})
</script>

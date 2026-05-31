<template>
  <span class="pharmacist-status-badge" :class="statusClassForPharmacist(status)">
    {{ status }}
  </span>
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

<template>
  <BaseEmptyState
    :title="title"
    :description="description"
    base-class="patient-empty-state"
  />
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  }
})
</script>

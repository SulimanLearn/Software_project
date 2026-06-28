<template>
  <div :class="baseClass" aria-live="polite">
    <slot name="icon" />
    <h2>{{ title }}</h2>
    <p v-if="description">{{ description }}</p>
    <slot />
  </div>
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
  },
  baseClass: {
    type: [String, Array, Object],
    default: 'base-empty-state'
  }
})
</script>

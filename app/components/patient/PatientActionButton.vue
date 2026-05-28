<template>
  <component
    :is="to ? NuxtLink : 'button'"
    :to="to || undefined"
    class="patient-action-button"
    :class="variant"
    :type="to ? undefined : type"
    :disabled="disabled"
  >
    <slot />
  </component>
</template>

<script setup>
const NuxtLink = resolveComponent('NuxtLink')

defineProps({
  to: {
    type: String,
    default: ''
  },
  variant: {
    type: String,
    default: 'primary'
  },
  type: {
    type: String,
    default: 'button'
  },
  disabled: {
    type: Boolean,
    default: false
  }
})
</script>

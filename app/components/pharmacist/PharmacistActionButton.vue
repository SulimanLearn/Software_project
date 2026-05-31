<template>
  <component
    :is="to ? NuxtLink : 'button'"
    :to="to || undefined"
    class="pharmacist-action-button"
    :class="variant"
    :type="to ? undefined : type"
    :disabled="disabled"
  >
    <slot />
  </component>
</template>

<script setup lang="ts">
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

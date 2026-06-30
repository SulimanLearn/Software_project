<template>
  <BaseButton
    :to="to || undefined"
    base-class="pharmacist-action-button"
    :variant="variant"
    :type="to ? undefined : type"
    :disabled="disabled"
  >
    <slot />
  </BaseButton>
</template>

<script setup lang="ts">
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

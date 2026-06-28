<template>
  <BaseButton
    :to="to || undefined"
    :base-class="baseClass"
    :variant="variant"
    :type="to ? undefined : type"
    :disabled="disabled"
  >
    <slot />
  </BaseButton>
</template>

<script setup>
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
  },
  baseClass: {
    type: String,
    default: 'app-action-button'
  }
})
</script>

<template>
  <BaseModal
    :title="title"
    :subtitle="subtitle"
    :size="size"
    id-prefix="pharmacist-modal"
    overlay-class="pharmacist-modal-overlay"
    surface-class="pharmacist-modal"
    header-class="pharmacist-modal-header"
    actions-class="pharmacist-modal-actions"
    close-button-class="pharmacist-close-button"
    @close="$emit('close')"
  >
    <slot />

    <template v-if="$slots.actions" #actions>
      <slot name="actions" />
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
defineEmits(['close'])

defineProps({
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String,
    default: ''
  },
  size: {
    type: String,
    default: 'md'
  }
})
</script>

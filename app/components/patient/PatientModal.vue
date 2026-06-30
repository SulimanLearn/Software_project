<template>
  <BaseModal
    :title="title"
    :subtitle="subtitle"
    :size="size"
    id-prefix="patient-modal"
    overlay-class="patient-modal-overlay"
    surface-class="patient-modal"
    header-class="patient-modal-header"
    actions-class="patient-modal-actions"
    close-button-class="patient-close-button"
    @close="$emit('close')"
  >
    <slot />

    <template v-if="$slots.actions" #actions>
      <slot name="actions" />
    </template>
  </BaseModal>
</template>

<script setup>
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

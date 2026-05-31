<template>
  <div class="pharmacist-modal-overlay" dir="rtl" @click.self="$emit('close')">
    <div
      class="pharmacist-modal"
      :class="`pharmacist-modal-${size}`"
      role="dialog"
      aria-modal="true"
      :aria-labelledby="titleId"
    >
      <header class="pharmacist-modal-header">
        <div>
          <h2 :id="titleId">{{ title }}</h2>
          <p v-if="subtitle">{{ subtitle }}</p>
        </div>
        <button class="pharmacist-close-button" type="button" aria-label="إغلاق" @click="$emit('close')">
          ×
        </button>
      </header>

      <slot />

      <footer v-if="$slots.actions" class="pharmacist-modal-actions">
        <slot name="actions" />
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits(['close'])

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

const titleId = `pharmacist-modal-${Math.random().toString(36).slice(2)}`

const closeOnEscape = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    emit('close')
  }
}

onMounted(() => {
  window.addEventListener('keydown', closeOnEscape)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', closeOnEscape)
})
</script>

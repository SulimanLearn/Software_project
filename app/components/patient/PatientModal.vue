<template>
  <div class="patient-modal-overlay" dir="rtl" @click.self="$emit('close')">
    <section
      class="patient-modal"
      :class="`patient-modal-${size}`"
      role="dialog"
      aria-modal="true"
      :aria-labelledby="titleId"
    >
      <div class="patient-modal-header">
        <div>
          <h2 :id="titleId">{{ title }}</h2>
          <p v-if="subtitle">{{ subtitle }}</p>
        </div>
        <button class="patient-close-button" type="button" aria-label="إغلاق" @click="$emit('close')">
          ×
        </button>
      </div>

      <slot />

      <div v-if="$slots.actions" class="patient-modal-actions">
        <slot name="actions" />
      </div>
    </section>
  </div>
</template>

<script setup>
defineEmits(['close'])

const props = defineProps({
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

const titleId = computed(() => `patient-modal-${props.title.replace(/\s+/g, '-')}`)
</script>

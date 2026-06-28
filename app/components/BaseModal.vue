<template>
  <div
    :class="overlayClass"
    dir="rtl"
    @click.self="closeOnBackdrop ? emit('close') : undefined"
  >
    <section
      :class="[surfaceClass, sizeClass]"
      role="dialog"
      aria-modal="true"
      :aria-labelledby="titleId"
    >
      <header :class="headerClass">
        <div>
          <h2 :id="titleId">{{ title }}</h2>
          <p v-if="subtitle">{{ subtitle }}</p>
        </div>
        <button :class="closeButtonClass" type="button" aria-label="إغلاق" @click="emit('close')">
          ×
        </button>
      </header>

      <slot />

      <footer v-if="$slots.actions" :class="actionsClass">
        <slot name="actions" />
      </footer>
    </section>
  </div>
</template>

<script setup>
const emit = defineEmits(['close'])

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
  },
  idPrefix: {
    type: String,
    default: 'base-modal'
  },
  overlayClass: {
    type: [String, Array, Object],
    default: 'base-modal-overlay'
  },
  surfaceClass: {
    type: [String, Array, Object],
    default: 'base-modal-surface'
  },
  headerClass: {
    type: [String, Array, Object],
    default: 'base-modal-header'
  },
  actionsClass: {
    type: [String, Array, Object],
    default: 'base-modal-actions'
  },
  closeButtonClass: {
    type: [String, Array, Object],
    default: 'base-modal-close'
  },
  closeOnBackdrop: {
    type: Boolean,
    default: true
  }
})

const safeTitle = computed(() => props.title.trim().replace(/\s+/g, '-'))
const titleId = computed(() => `${props.idPrefix}-${safeTitle.value || 'dialog'}`)
const sizeClass = computed(() => `${props.idPrefix}-${props.size}`)

const closeOnEscape = (event) => {
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

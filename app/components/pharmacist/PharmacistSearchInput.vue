<template>
  <label class="pharmacist-form-field">
    <span>{{ label }}</span>
    <input
      :value="modelValue"
      type="search"
      :placeholder="placeholder"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    >
  </label>
</template>

<script setup lang="ts">
defineEmits(['update:modelValue'])

defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  label: {
    type: String,
    default: 'بحث'
  },
  placeholder: {
    type: String,
    default: ''
  }
})
</script>

<template>
  <label class="pharmacist-form-field">
    <span>{{ label }}</span>
    <select
      :value="modelValue"
      @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
    >
      <option v-for="option in options" :key="option.value" :value="option.value">
        {{ option.label }}
      </option>
    </select>
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
    required: true
  },
  options: {
    type: Array,
    required: true
  }
})
</script>

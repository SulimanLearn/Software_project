<template>
  <div class="pagination-controls" dir="rtl">
    <button
      type="button"
      :disabled="page <= 1"
      @click="$emit('update:page', page - 1)"
    >
      السابق
    </button>

    <span class="current-page">{{ page }}</span>
    <span class="page-total">من {{ totalPages }}</span>

    <button
      type="button"
      :disabled="page >= totalPages"
      @click="$emit('update:page', page + 1)"
    >
      التالي
    </button>
  </div>
</template>

<script setup>
defineEmits(['update:page'])

defineProps({
  page: {
    type: Number,
    required: true
  },
  totalPages: {
    type: Number,
    required: true
  }
})
</script>

<style scoped>
.pagination-controls {
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
  margin-top: 24px;
}

.pagination-controls button {
  background-color: #ffffff;
  border: 1.5px solid #0b63f6;
  border-radius: 14px;
  color: #115bd2;
  cursor: pointer;
  font-family: inherit;
  font-weight: 800;
  min-width: 88px;
  padding: 9px 16px;
  transition: background-color 0.2s ease, color 0.2s ease, transform 0.2s ease;
}

.pagination-controls button:hover:not(:disabled) {
  background-color: #115bd2;
  color: #ffffff;
  transform: translateY(-1px);
}

.pagination-controls button:disabled {
  cursor: not-allowed;
  opacity: 0.45;
}

.current-page {
  align-items: center;
  background-color: #115bd2;
  border: 1.5px solid #115bd2;
  border-radius: 12px;
  color: #ffffff;
  display: inline-flex;
  font-weight: 900;
  height: 38px;
  justify-content: center;
  min-width: 42px;
  padding: 0 12px;
}

.page-total {
  color: #101010;
  font-weight: 900;
}
</style>

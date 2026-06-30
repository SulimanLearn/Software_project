<template>
  <article class="medical-record-card">
    <div class="record-main">
      <strong>{{ record.title }}</strong>
      <span>{{ formattedDate }}</span>
    </div>

    <p>{{ record.description || record.notes || 'لا يوجد وصف مضاف لهذا السجل.' }}</p>

    <div class="record-footer">
      <small>{{ record.doctor || 'غير محدد' }}</small>
      <div class="record-actions">
        <button type="button" @click="$emit('view', record)">
          عرض التفاصيل
        </button>
        <button type="button" @click="$emit('edit', record)">
          تعديل
        </button>
        <button class="danger-action" type="button" @click="$emit('delete', record)">
          حذف
        </button>
      </div>
    </div>
  </article>
</template>

<script setup>
const props = defineProps({
  record: {
    type: Object,
    required: true
  }
})

defineEmits(['view', 'edit', 'delete'])

const formattedDate = computed(() => props.record.date || props.record.createdAt || 'غير محدد')
</script>

<style scoped>
.medical-record-card {
  background-color: #ffffff;
  border: 1px solid #d6e7ff;
  border-radius: 14px;
  box-shadow: 0 8px 18px rgba(17, 91, 210, 0.08);
  display: grid;
  gap: 8px;
  min-width: 0;
  overflow: hidden;
  padding: 12px 14px;
}

.record-main,
.record-footer {
  align-items: center;
  display: flex;
  justify-content: space-between;
  gap: 12px;
  min-width: 0;
}

.record-main strong {
  font-size: 15px;
  font-weight: 900;
  min-width: 0;
  overflow-wrap: anywhere;
  white-space: normal;
  word-break: break-word;
}

.record-main span,
.record-footer small {
  color: #5a6473;
  font-size: 12px;
  font-weight: 800;
  overflow-wrap: anywhere;
  white-space: normal;
  word-break: break-word;
}

.medical-record-card p {
  color: #343434;
  display: -webkit-box;
  font-size: 13px;
  font-weight: 700;
  line-height: 1.7;
  margin: 0;
  overflow: hidden;
  overflow-wrap: anywhere;
  white-space: normal;
  word-break: break-word;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.record-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
  justify-content: flex-end;
}

.record-actions button {
  background-color: #ffffff;
  border: 1px solid #8dbbfb;
  border-radius: 16px;
  color: #115bd2;
  cursor: pointer;
  font-family: inherit;
  font-size: 12px;
  font-weight: 900;
  min-height: 30px;
  padding: 5px 10px;
  transition: background-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
}

.record-actions button:hover {
  background-color: #0b4db8;
  box-shadow: 0 6px 14px rgba(17, 91, 210, 0.18);
  color: #ffffff;
  transform: translateY(-1px);
}

.record-actions .danger-action {
  border-color: #f4aaaa;
  color: #b42318;
}

.record-actions .danger-action:hover {
  background-color: #b42318;
  color: #ffffff;
}

@media (max-width: 560px) {
  .record-main,
  .record-footer {
    align-items: flex-start;
    flex-direction: column;
  }

  .record-actions,
  .record-actions button {
    width: 100%;
  }

  .record-actions button {
    justify-content: center;
  }
}
</style>

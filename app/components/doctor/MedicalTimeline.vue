<template>
  <TransitionGroup v-if="records.length" name="record-insert" tag="div" class="medical-timeline">
    <div v-for="record in records" :key="record.id" class="timeline-item">
      <span class="timeline-dot" aria-hidden="true" />
      <MedicalRecordCard
        :record="record"
        @view="$emit('view', $event)"
        @edit="$emit('edit', $event)"
        @delete="$emit('delete', $event)"
      />
    </div>
  </TransitionGroup>

  <div v-else class="history-empty-state">
    لا توجد بيانات في هذا القسم
  </div>
</template>

<script setup>
import MedicalRecordCard from '~/components/doctor/MedicalRecordCard.vue'

defineProps({
  records: {
    type: Array,
    default: () => []
  }
})

defineEmits(['view', 'edit', 'delete'])
</script>

<style scoped>
.medical-timeline {
  display: grid;
  gap: 14px;
  padding: 4px 8px 4px 0;
  position: relative;
}

.medical-timeline::before {
  background-color: #d6e7ff;
  border-radius: 999px;
  content: "";
  inset-block: 10px;
  inset-inline-start: 8px;
  position: absolute;
  width: 2px;
}

.timeline-item {
  display: grid;
  gap: 12px;
  grid-template-columns: 18px minmax(0, 1fr);
  position: relative;
}

.timeline-dot {
  background-color: #eaf2fd;
  border: 2px solid #5a99ef;
  border-radius: 50%;
  height: 12px;
  margin-top: 16px;
  position: relative;
  width: 12px;
  z-index: 1;
}

.history-empty-state {
  background-color: #ffffff;
  border: 1px dashed #8dbbfb;
  border-radius: 14px;
  color: #5a6473;
  font-size: 14px;
  font-weight: 800;
  padding: 20px 14px;
  text-align: center;
}

.record-insert-enter-active,
.record-insert-leave-active {
  transition: opacity 0.22s ease, transform 0.22s ease;
}

.record-insert-enter-from,
.record-insert-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>

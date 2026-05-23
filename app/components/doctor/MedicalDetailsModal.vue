<template>
  <div class="modal-overlay" dir="rtl" @click.self="$emit('close')">
    <div class="details-modal" role="dialog" aria-modal="true">
      <div class="details-header">
        <span class="details-icon" aria-hidden="true">
          <component :is="section.icon" :size="22" :stroke-width="2" />
        </span>
        <div>
          <h2>{{ record.title }}</h2>
          <p>{{ section.title }}</p>
        </div>
      </div>

      <dl class="details-list">
        <div>
          <dt>الطبيب</dt>
          <dd>{{ record.doctor || 'غير محدد' }}</dd>
        </div>
        <div>
          <dt>التاريخ</dt>
          <dd>{{ record.date || 'غير محدد' }}</dd>
        </div>
        <div>
          <dt>وقت الإنشاء</dt>
          <dd>{{ record.createdAt || 'غير محدد' }}</dd>
        </div>
        <div>
          <dt>المرفقات</dt>
          <dd>{{ attachmentsText }}</dd>
        </div>
      </dl>

      <div class="details-content">
        <strong>الوصف الكامل</strong>
        <p>{{ record.description || 'لا يوجد وصف كامل.' }}</p>
        <strong>الملاحظات الطبية</strong>
        <p>{{ record.notes || record.reaction || record.status || 'لا توجد ملاحظات إضافية.' }}</p>
      </div>

      <div class="modal-actions">
        <button class="cancel-button" type="button" @click="$emit('close')">
          إغلاق
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  record: {
    type: Object,
    required: true
  },
  section: {
    type: Object,
    required: true
  }
})

defineEmits(['close'])

const attachmentsText = computed(() => {
  if (!props.record.attachments?.length) {
    return 'لا توجد مرفقات'
  }

  return props.record.attachments.join('، ')
})
</script>

<style scoped>
.modal-overlay {
  align-items: center;
  background-color: rgba(68, 139, 239, 0.38);
  display: flex;
  inset: 0;
  justify-content: center;
  overflow-y: auto;
  padding: 24px;
  position: fixed;
  z-index: 2200;
}

.details-modal {
  background-color: #eaf2fd;
  border: 1.5px solid #0b63f6;
  border-radius: 24px;
  box-shadow: 0 18px 45px rgba(0, 0, 0, 0.12);
  max-height: 80vh;
  max-width: 100%;
  overflow-y: auto;
  padding: 28px;
  width: 720px;
}

.details-header {
  align-items: center;
  display: flex;
  gap: 12px;
  margin-bottom: 18px;
  min-width: 0;
}

.details-header > div {
  min-width: 0;
}

.details-icon {
  align-items: center;
  background-color: #ffffff;
  border: 1px solid #8dbbfb;
  border-radius: 16px;
  color: #115bd2;
  display: inline-flex;
  height: 48px;
  justify-content: center;
  width: 48px;
}

.details-header h2 {
  font-size: 23px;
  font-weight: 900;
  margin: 0 0 4px;
  overflow-wrap: anywhere;
  white-space: normal;
  word-break: break-word;
}

.details-header p {
  color: #5a6473;
  font-size: 14px;
  font-weight: 800;
  margin: 0;
  overflow-wrap: anywhere;
  white-space: normal;
  word-break: break-word;
}

.details-list {
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  margin: 0 0 14px;
}

.details-list div,
.details-content {
  background-color: #ffffff;
  border: 1px solid #8dbbfb;
  border-radius: 12px;
  min-width: 0;
  overflow: hidden;
  padding: 12px 14px;
}

.details-list dt {
  color: #5a6473;
  font-size: 12px;
  font-weight: 800;
  margin-bottom: 5px;
  overflow-wrap: anywhere;
  white-space: normal;
  word-break: break-word;
}

.details-list dd {
  font-size: 14px;
  font-weight: 900;
  margin: 0;
  overflow-wrap: anywhere;
  white-space: normal;
  word-break: break-word;
}

.details-content {
  display: grid;
  gap: 8px;
}

.details-content strong {
  font-weight: 900;
  overflow-wrap: anywhere;
  white-space: normal;
  word-break: break-word;
}

.details-content p {
  color: #343434;
  font-size: 14px;
  font-weight: 700;
  line-height: 1.8;
  margin: 0;
  overflow-wrap: anywhere;
  white-space: normal;
  word-break: break-word;
}

.modal-actions {
  background-color: #eaf2fd;
  bottom: -1px;
  display: flex;
  justify-content: center;
  margin-top: 20px;
  padding-top: 12px;
  position: sticky;
}

.cancel-button {
  background-color: #ffffff;
  border: 1px solid #0b63f6;
  border-radius: 18px;
  color: #115bd2;
  cursor: pointer;
  font-family: inherit;
  font-size: 16px;
  font-weight: 800;
  min-width: 118px;
  padding: 10px 22px;
}

@media (max-width: 560px) {
  .modal-overlay {
    padding: 14px;
  }

  .details-modal {
    border-radius: 20px;
    padding: 22px 16px;
  }

  .details-list {
    grid-template-columns: 1fr;
  }

  .cancel-button {
    width: 100%;
  }
}
</style>

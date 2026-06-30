<template>
  <section class="patient-summary-card" aria-label="ملخص المريض">
    <img :src="avatar" :alt="name" class="patient-avatar">

    <div class="summary-grid">
      <article v-for="item in items" :key="item.label">
        <span>{{ item.label }}</span>
        <strong :class="{ 'ltr-text': item.ltr }">{{ item.value }}</strong>
      </article>
    </div>
  </section>
</template>

<script setup>
defineProps({
  avatar: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  items: {
    type: Array,
    required: true
  }
})
</script>

<style scoped>
.patient-summary-card {
  align-items: center;
  background-color: #eaf2fd;
  border: 1.5px solid #0b63f6;
  border-radius: 18px;
  display: flex;
  flex-wrap: nowrap;
  gap: 18px;
  margin-bottom: 16px;
  min-width: 0;
  padding: 14px;
}

.patient-avatar {
  background-color: #ffffff;
  border: 1px solid #8dbbfb;
  border-radius: 50%;
  flex: 0 0 auto;
  height: 78px;
  object-fit: contain;
  padding: 9px;
  width: 78px;
}

.summary-grid {
  align-items: stretch;
  display: flex;
  flex: 1 1 auto;
  flex-wrap: wrap;
  gap: 10px;
  min-width: 0;
}

.summary-grid article {
  background-color: #ffffff;
  border: 1px solid #8dbbfb;
  border-radius: 12px;
  flex: 1 1 150px;
  min-width: 132px;
  padding: 12px 14px;
}

.summary-grid article:first-child {
  flex-grow: 1.45;
  min-width: 190px;
}

.summary-grid span {
  color: #343434;
  display: block;
  font-size: 13px;
  font-weight: 900;
  margin-bottom: 8px;
}

.summary-grid strong {
  display: inline-block;
  font-size: 15px;
  font-weight: 900;
  max-width: 100%;
  overflow-wrap: anywhere;
  white-space: normal;
  word-break: break-word;
}

.ltr-text {
  direction: ltr;
}

@media (max-width: 720px) {
  .patient-avatar {
    height: 70px;
    width: 70px;
  }
}

@media (max-width: 560px) {
  .patient-summary-card {
    gap: 12px;
  }

  .summary-grid {
    gap: 8px;
  }

  .summary-grid article,
  .summary-grid article:first-child {
    flex: 1 1 145px;
    min-width: 132px;
  }
}

@media (max-width: 360px) {
  .patient-summary-card {
    flex-wrap: wrap;
  }
}
</style>

<template>
  <div class="doctor-report-details">
    <h2>{{ report.title }}</h2>
    <dl class="details-list doctor-report-details-list">
      <div><dt>رقم التقرير</dt><dd>{{ report.reportNumber || 'غير محدد' }}</dd></div>
      <div><dt>نوع التقرير</dt><dd>{{ report.type || 'تقرير طبي' }}</dd></div>
      <div><dt>اسم المريض</dt><dd>{{ patient.fullName || patient.name || 'غير محدد' }}</dd></div>
      <div><dt>رقم المريض</dt><dd>{{ patient.id || 'غير محدد' }}</dd></div>
      <div><dt>الطبيب</dt><dd>{{ report.doctor || 'غير محدد' }}</dd></div>
      <div><dt>التخصص</dt><dd>{{ report.specialty || 'غير محدد' }}</dd></div>
      <div><dt>التاريخ</dt><dd>{{ report.date || 'غير محدد' }}</dd></div>
      <div><dt>مرجع الوصفة</dt><dd>{{ prescriptionReference }}</dd></div>
    </dl>
    <div class="report-content doctor-report-content">
      <strong>التشخيص</strong>
      <p>{{ report.diagnosis || 'غير محدد' }}</p>
      <strong>وصف مختصر</strong>
      <p>{{ report.summary || 'لا يوجد وصف مختصر.' }}</p>
      <strong>محتوى التقرير</strong>
      <p>{{ report.content || 'لا يوجد محتوى للتقرير.' }}</p>
      <p v-if="report.fileName">مرفق: {{ report.fileName }}</p>
      <p v-if="report.externalUrl" class="ltr-text">{{ report.externalUrl }}</p>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  report: {
    type: Object,
    required: true
  },
  patient: {
    type: Object,
    required: true
  }
})

const prescriptionReference = computed(() => {
  if (Array.isArray(props.report.prescriptions) && props.report.prescriptions.length) {
    return props.report.prescriptions.join('، ')
  }

  return props.report.prescriptionReference || 'لا يوجد'
})
</script>

<style scoped>
.doctor-report-details h2 {
  font-size: 26px;
  font-weight: 900;
  margin: 0 0 18px;
}

.doctor-report-details-list {
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  margin: 0 0 18px;
}

.doctor-report-details-list div,
.doctor-report-content {
  background-color: #ffffff;
  border: 1px solid #8dbbfb;
  border-radius: 14px;
  min-width: 0;
  padding: 13px 16px;
}

.doctor-report-details-list dt {
  color: #343434;
  font-weight: 900;
  margin-bottom: 6px;
}

.doctor-report-details-list dd {
  font-weight: 800;
  margin: 0;
  overflow-wrap: anywhere;
}

.doctor-report-content {
  display: grid;
  gap: 10px;
}

.doctor-report-content strong {
  font-weight: 900;
}

.doctor-report-content p {
  color: #343434;
  font-weight: 700;
  line-height: 1.8;
  margin: 0;
  overflow-wrap: anywhere;
}

.ltr-text {
  direction: ltr;
  text-align: right;
}

@media (max-width: 560px) {
  .doctor-report-details-list {
    grid-template-columns: 1fr;
  }
}
</style>

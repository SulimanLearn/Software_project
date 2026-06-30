<template>
  <Teleport to="body">
    <section v-if="printItem" class="print-area prescription-print-zone" dir="rtl" aria-hidden="true">
      <header class="print-header">
        <div class="print-brand">
          <img src="/images/logo.png" alt="شعار مجمع الحياة الطبي" class="print-logo">
          <div>
            <h1>مجمع الحياة الطبي</h1>
            <p>وصفة طبية</p>
          </div>
        </div>

        <div class="print-header-details">
          <p>
            <span>الطبيب</span>
            <strong>{{ printItem.data.doctorName || 'غير متوفر' }}</strong>
          </p>
          <p>
            <span>التخصص</span>
            <strong>{{ printItem.data.specialty || 'غير متوفر' }}</strong>
          </p>
          <p>
            <span>تاريخ الطباعة</span>
            <strong>{{ printDateLabel }}</strong>
          </p>
        </div>
      </header>

      <article class="print-card">
        <h2>بيانات الوصفة</h2>
        <div class="print-grid">
          <p>
            <span>رقم الوصفة</span>
            <strong>{{ printItem.data.number || 'غير متوفر' }}</strong>
          </p>
          <p>
            <span>اسم المريض</span>
            <strong>{{ patient.fullName || patient.name || 'غير متوفر' }}</strong>
          </p>
          <p>
            <span>رقم الملف</span>
            <strong>{{ patient.fileNumber || patient.id || 'غير متوفر' }}</strong>
          </p>
          <p>
            <span>الطبيب</span>
            <strong>{{ printItem.data.doctorName || 'غير متوفر' }}</strong>
          </p>
          <p>
            <span>التخصص</span>
            <strong>{{ printItem.data.specialty || 'غير متوفر' }}</strong>
          </p>
          <p>
            <span>تاريخ الوصفة</span>
            <strong>{{ printItem.data.date || 'غير متوفر' }}</strong>
          </p>
          <p>
            <span>التشخيص المرتبط</span>
            <strong>{{ printItem.data.diagnosis || 'غير متوفر' }}</strong>
          </p>
          <p>
            <span>حالة الوصفة</span>
            <strong>{{ printItem.data.status || 'غير متوفر' }}</strong>
          </p>
        </div>
      </article>

      <article class="print-section">
        <h2>الأدوية</h2>
        <table class="prescription-print-table">
          <thead>
            <tr>
              <th>اسم الدواء</th>
              <th>الجرعة</th>
              <th>التكرار</th>
              <th>المدة</th>
              <th>التعليمات</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="medication in medications" :key="medication.name">
              <td>{{ medication.name || 'غير متوفر' }}</td>
              <td>{{ medication.dosage || 'غير متوفر' }}</td>
              <td>{{ medication.frequency || 'غير متوفر' }}</td>
              <td>{{ medication.duration || 'غير متوفر' }}</td>
              <td>{{ medication.instructions || 'لا توجد تعليمات إضافية' }}</td>
            </tr>
          </tbody>
        </table>
      </article>

      <article class="print-section">
        <h2>ملاحظات وتعليمات</h2>
        <p class="print-notes">{{ doctorInstructions }}</p>
        <p class="print-notes">مرجع طلب الصيدلية: {{ printItem.data.orderReference || 'لا يوجد طلب صيدلية مرتبط.' }}</p>
        <p class="print-notes">هذه الوصفة للاستخدام من قبل المريض المسجل فقط، ويجب الالتزام بتعليمات الطبيب والصيدلي.</p>
      </article>
    </section>
  </Teleport>
</template>

<script setup lang="ts">
const props = defineProps<{
  printItem: {
    kind: 'prescription'
    data: Record<string, any>
  } | null
  patient: Record<string, any>
  printDate?: Date | string | null
}>()

const medications = computed(() => props.printItem?.data.medications || [])

const doctorInstructions = computed(() => {
  const instructions = medications.value
    .map((medication: Record<string, any>) => medication.instructions)
    .filter(Boolean)

  return instructions.length ? instructions.join('، ') : 'يرجى الالتزام بالجرعات المحددة ومراجعة الطبيب عند ظهور أي أعراض غير متوقعة.'
})

const printDateLabel = computed(() => {
  const rawDate = props.printDate || new Date()
  const date = rawDate instanceof Date ? rawDate : new Date(rawDate)

  if (Number.isNaN(date.getTime())) {
    return 'غير متوفر'
  }

  return new Intl.DateTimeFormat('ar-u-nu-latn', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(date)
})
</script>

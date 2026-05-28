<template>
  <Teleport to="body">
    <section v-if="printItem" class="print-area print-zone" dir="rtl" aria-hidden="true">
      <header class="print-header">
        <div class="print-brand">
          <img src="/images/logo.png" alt="شعار مجمع الحياة الطبي" class="print-logo">
          <div>
            <h1>مجمع الحياة الطبي</h1>
            <p>ملخص الملف الطبي للمريض</p>
          </div>
        </div>

        <div class="print-header-details">
          <p>
            <span>الطبيب</span>
            <strong>{{ printItem.data.doctor || 'غير متوفر' }}</strong>
          </p>
          <p>
            <span>تاريخ الطباعة</span>
            <strong>{{ printDateLabel }}</strong>
          </p>
        </div>
      </header>

      <article class="print-card print-patient-info">
        <h2>بيانات المريض</h2>
        <div class="print-grid">
          <p>
            <span>اسم المريض</span>
            <strong>{{ patient.fullName || patient.name || 'غير متوفر' }}</strong>
          </p>
          <p>
            <span>رقم الملف</span>
            <strong>{{ patient.fileNumber || patient.id || 'غير متوفر' }}</strong>
          </p>
          <p>
            <span>العمر</span>
            <strong>{{ patient.age || 'غير متوفر' }}</strong>
          </p>
          <p>
            <span>الجنس</span>
            <strong>{{ patient.gender || 'غير متوفر' }}</strong>
          </p>
          <p>
            <span>رقم الهاتف</span>
            <strong>{{ patient.phone || 'غير متوفر' }}</strong>
          </p>
          <p>
            <span>البريد الإلكتروني</span>
            <strong>{{ patient.email || 'غير متوفر' }}</strong>
          </p>
          <p>
            <span>آخر زيارة</span>
            <strong>{{ patient.lastVisit || printItem.data.date || 'غير متوفر' }}</strong>
          </p>
          <p>
            <span>عدد الزيارات</span>
            <strong>{{ patient.visitCount || 0 }}</strong>
          </p>
          <p>
            <span>حالة المتابعة</span>
            <strong>{{ patient.followUpStatus || 'غير متوفر' }}</strong>
          </p>
          <p>
            <span>آخر تشخيص</span>
            <strong>{{ patient.latestDiagnosis || printItem.data.diagnosis || 'غير متوفر' }}</strong>
          </p>
        </div>
      </article>

      <article class="print-section">
        <h2>الوصفات الحالية</h2>
        <ul v-if="prescriptions.length" class="print-prescriptions-list">
          <li v-for="(item, index) in prescriptions" :key="item.number || index">
            <strong>{{ item.number || 'وصفة طبية' }}</strong>
            <span>{{ item.date || 'غير متوفر' }}</span>
            <span>{{ medicineNames(item).join('، ') || 'لا توجد أدوية مسجلة' }}</span>
          </li>
        </ul>
        <p v-else class="print-empty">لا توجد وصفات حالية مسجلة.</p>
      </article>

      <article class="print-section">
        <h2>ملخص التاريخ الطبي</h2>
        <ul v-if="medicalHistory.length" class="print-history-list">
          <li v-for="(item, index) in medicalHistory" :key="`${item}-${index}`">
            {{ item }}
          </li>
        </ul>
        <p v-else class="print-empty">لا يوجد تاريخ طبي مسجل.</p>
      </article>

      <article class="print-section">
        <h2>الملاحظات الطبية</h2>
        <p class="print-notes">{{ printItem.data.content || printItem.data.summary || 'لا توجد ملاحظات طبية مسجلة.' }}</p>
      </article>
    </section>
  </Teleport>
</template>

<script setup lang="ts">
const props = defineProps<{
  printItem: {
    kind: 'report'
    data: Record<string, any>
  } | null
  patient: Record<string, any>
  prescriptions?: Array<Record<string, any>>
  medicalHistory?: string[]
  printDate?: Date | string | null
}>()

const prescriptions = computed(() => props.prescriptions || [])
const medicalHistory = computed(() => props.medicalHistory || [])

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

const medicineNames = (prescription: Record<string, any>) => {
  if (!Array.isArray(prescription.medications)) {
    return []
  }

  return prescription.medications.map(medicine => medicine.name).filter(Boolean)
}
</script>

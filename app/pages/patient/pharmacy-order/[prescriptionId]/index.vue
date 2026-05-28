<template>
  <NavBar />

  <section class="booking-page" dir="rtl">
    <div class="ambient ambient-one" aria-hidden="true"></div>
    <div class="ambient ambient-two" aria-hidden="true"></div>

    <div v-if="hasValidPrescription" class="booking-shell">
      <NuxtLink class="back-button" to="/patient/prescriptions" aria-label="العودة للوصفات الطبية">
        <ArrowLeft class="back-icon" :size="16" stroke-width="2.2" />
        <span>العودة للوصفات الطبية</span>
      </NuxtLink>

      <header class="booking-header">
        <h1>إتمام طلب الدواء</h1>
        <span class="title-mark" aria-hidden="true"></span>
        <p>{{ prescription.number }} - {{ prescription.doctorName }}</p>
      </header>

      <nav class="stepper" aria-label="خطوات إتمام طلب الدواء">
        <div class="step-line" aria-hidden="true"></div>
        <div
          v-for="step in steps"
          :key="step.number"
          class="step"
          :class="{ active: step.number === 1 }"
        >
          <span class="step-circle">{{ step.number }}</span>
          <span class="step-label">{{ step.label }}</span>
        </div>
      </nav>

      <form class="form-card" @submit.prevent="goNext">
        <div class="card-header">
          <div class="header-title">
            <span class="header-icon" aria-hidden="true">
              <UserRound :size="22" stroke-width="2" />
            </span>
            <h2>بيانات المريض والوصفة</h2>
          </div>
        </div>

        <dl class="details-grid">
          <div v-for="item in informationItems" :key="item.label">
            <dt>{{ item.label }}</dt>
            <dd>{{ item.value }}</dd>
          </div>
        </dl>

        <div class="form-actions single-action">
          <button class="next-button" type="submit">
            <span>التالي</span>
            <ArrowLeft class="next-icon" :size="18" stroke-width="2.4" />
          </button>
        </div>
      </form>
    </div>

    <div v-else class="booking-shell empty-shell">
      <div class="empty-state">
        <span class="empty-icon" aria-hidden="true">
          <Pill :size="30" stroke-width="1.9" />
        </span>
        <h1>لم يتم العثور على وصفة صالحة</h1>
        <p>لا يمكن إنشاء طلب صيدلية دون وصفة تحتوي على أدوية.</p>
        <NuxtLink class="empty-button" to="/patient/prescriptions">العودة إلى الوصفات</NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { ArrowLeft, Pill, UserRound } from '@lucide/vue'
import { formatArabicDate } from '~/data/patientPortal'

definePageMeta({
  title: 'إتمام طلب الدواء - بيانات المريض والوصفة'
})

const route = useRoute()
const prescriptionId = computed(() => String(route.params.prescriptionId ?? ''))
const {
  hasValidPrescription,
  orderState,
  patientInfo,
  prescription,
  relatedRecord,
  specialty
} = usePatientPharmacyOrder(prescriptionId.value)

const steps = pharmacyOrderSteps

const informationItems = computed(() => [
  { label: 'اسم المريض', value: patientInfo.value.name },
  { label: 'رقم الهاتف', value: patientInfo.value.phone },
  { label: 'البريد الإلكتروني', value: patientInfo.value.email },
  { label: 'العمر', value: patientInfo.value.age },
  { label: 'الجنس', value: patientInfo.value.gender },
  { label: 'العنوان', value: patientInfo.value.address },
  { label: 'رقم الوصفة', value: prescription.value?.number },
  { label: 'اسم الطبيب', value: prescription.value?.doctorName },
  { label: 'التخصص', value: specialty.value },
  { label: 'تاريخ الوصفة', value: formatArabicDate(prescription.value?.date || '') },
  { label: 'التشخيص المرتبط', value: prescription.value?.diagnosis || relatedRecord.value?.diagnosis || 'غير متوفر' }
])

const goNext = async () => {
  if (!hasValidPrescription.value) {
    return
  }

  orderState.value = {
    ...orderState.value,
    patient: patientInfo.value,
    prescription: prescription.value,
    specialty: specialty.value,
    diagnosis: prescription.value?.diagnosis || relatedRecord.value?.diagnosis || '',
    medications: prescription.value?.medications || []
  }

  await navigateTo(`/patient/pharmacy-order/${prescription.value.number}/step2`)
}
</script>

<style scoped>
@import "./pharmacy-order.css";
</style>

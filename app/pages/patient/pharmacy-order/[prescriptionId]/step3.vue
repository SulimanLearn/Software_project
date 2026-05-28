<template>
  <NavBar />

  <section class="booking-page" dir="rtl">
    <div class="ambient ambient-one" aria-hidden="true"></div>
    <div class="ambient ambient-two" aria-hidden="true"></div>

    <Transition name="toast">
      <div v-if="showSuccessToast" class="success-toast" role="status">
        <CheckCircle2 :size="20" stroke-width="2.3" />
        <span>تم إرسال طلب الدواء بنجاح</span>
      </div>
    </Transition>

    <div v-if="hasValidPrescription" class="booking-shell">
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
          :class="{ active: step.number === 3, completed: step.number < 3 }"
        >
          <span class="step-circle">{{ step.number }}</span>
          <span class="step-label">{{ step.label }}</span>
        </div>
      </nav>

      <article v-if="hasOrderData" class="summary-card" aria-labelledby="summary-title">
        <div class="summary-head">
          <span class="summary-icon" aria-hidden="true">
            <ClipboardCheck :size="22" stroke-width="2.1" />
          </span>
          <h2 id="summary-title">مراجعة طلب الدواء</h2>
        </div>

        <dl class="summary-list">
          <div v-for="item in summaryItems" :key="item.label" class="summary-row">
            <dt>{{ item.label }}</dt>
            <dd>{{ item.value }}</dd>
          </div>
        </dl>

        <section class="subsection summary-medications" aria-labelledby="summary-medications-title">
          <h3 id="summary-medications-title">الأدوية المطلوبة</h3>
          <ul>
            <li v-for="medication in orderState.medications" :key="medication.name">
              <strong>{{ medication.name }}</strong>
              <span>{{ medication.dosage }} - {{ medication.frequency }} - {{ medication.duration }}</span>
            </li>
          </ul>
        </section>

        <p v-if="errorMessage" class="inline-error" role="alert">{{ errorMessage }}</p>

        <div class="form-actions">
          <NuxtLink class="secondary-button" :to="`/patient/pharmacy-order/${prescription.number}/step2`">
            <ArrowRight :size="18" stroke-width="2.4" />
            <span>السابق</span>
          </NuxtLink>

          <button
            class="confirm-button"
            type="button"
            :disabled="isSubmitting"
            @click="confirmOrder"
          >
            <LoaderCircle v-if="isSubmitting" class="spin-icon" :size="19" stroke-width="2.4" />
            <CheckCircle2 v-else :size="19" stroke-width="2.4" />
            <span>{{ isSubmitting ? 'جار إرسال الطلب...' : 'تأكيد طلب الدواء' }}</span>
          </button>
        </div>
      </article>

      <article v-else class="empty-state" role="alert">
        <span class="empty-icon" aria-hidden="true">
          <Pill :size="32" stroke-width="1.9" />
        </span>
        <h2>بيانات طلب الدواء غير مكتملة</h2>
        <p>يرجى الرجوع لإكمال عنوان التوصيل وطريقة الدفع قبل التأكيد.</p>
        <NuxtLink class="confirm-button" :to="`/patient/pharmacy-order/${prescription.number}/step2`">
          تفاصيل الطلب والتوصيل
        </NuxtLink>
      </article>
    </div>

    <div v-else class="booking-shell empty-shell">
      <article class="empty-state" role="alert">
        <span class="empty-icon" aria-hidden="true">
          <Pill :size="32" stroke-width="1.9" />
        </span>
        <h1>لم يتم العثور على وصفة صالحة</h1>
        <NuxtLink class="confirm-button" to="/patient/prescriptions">العودة إلى الوصفات</NuxtLink>
      </article>
    </div>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue'
import {
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  LoaderCircle,
  Pill
} from '@lucide/vue'

definePageMeta({
  title: 'إتمام طلب الدواء - التأكيد'
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
const { addMedicationOrder } = usePatientMedicationOrders()

const steps = pharmacyOrderSteps
const isSubmitting = ref(false)
const showSuccessToast = ref(false)
const errorMessage = ref('')

const paymentMethodLabels = {
  cash: 'الدفع نقداً عند الاستلام',
  card: 'الدفع بالبطاقة الآن'
}

const hasOrderData = computed(() => Boolean(
  hasValidPrescription.value
    && orderState.value?.deliveryAddress
    && orderState.value?.paymentMethod
    && Array.isArray(orderState.value?.medications)
    && orderState.value.medications.length
))

const summaryItems = computed(() => [
  { label: 'اسم المريض', value: orderState.value?.patient?.name || patientInfo.value.name },
  { label: 'رقم الهاتف', value: orderState.value?.patient?.phone || patientInfo.value.phone },
  { label: 'عنوان التوصيل', value: orderState.value?.deliveryAddress || 'غير متوفر' },
  { label: 'رقم الوصفة', value: prescription.value?.number },
  { label: 'اسم الطبيب', value: prescription.value?.doctorName },
  { label: 'التشخيص المرتبط', value: orderState.value?.diagnosis || prescription.value?.diagnosis || relatedRecord.value?.diagnosis || 'غير متوفر' },
  { label: 'طريقة الدفع', value: paymentMethodLabels[orderState.value?.paymentMethod] || 'غير متوفر' },
  { label: 'ملاحظات التوصيل', value: orderState.value?.notes || 'لا توجد ملاحظات' },
  { label: 'الحالة المتوقعة', value: 'قيد المراجعة' }
])

const wait = (duration) => new Promise((resolve) => {
  window.setTimeout(resolve, duration)
})

const createOrderNumber = () => {
  const dateStamp = new Date().toISOString().slice(2, 10).replaceAll('-', '')
  const randomSegment = Math.floor(1000 + Math.random() * 9000)

  return `ORD-${dateStamp}-${randomSegment}`
}

const confirmOrder = async () => {
  errorMessage.value = ''

  if (!hasOrderData.value) {
    errorMessage.value = 'بيانات طلب الدواء غير مكتملة، يرجى مراجعة الخطوات السابقة.'
    return
  }

  isSubmitting.value = true
  await wait(700)

  addMedicationOrder({
    id: Date.now(),
    number: orderState.value?.orderNumber || createOrderNumber(),
    prescriptionNumber: prescription.value.number,
    date: new Date().toISOString().slice(0, 10),
    medications: orderState.value.medications.map(item => item.name).join('، '),
    status: 'قيد المراجعة',
    address: orderState.value.deliveryAddress,
    timelineStep: 1,
    patientName: patientInfo.value.name,
    doctorName: prescription.value.doctorName,
    specialty: specialty.value,
    diagnosis: orderState.value.diagnosis,
    paymentMethod: orderState.value.paymentMethod,
    preferredTime: orderState.value.preferredTime,
    notes: orderState.value.notes,
    medicationsList: orderState.value.medications
  })

  showSuccessToast.value = true
  await wait(800)
  await navigateTo('/patient/orders')
}
</script>

<style scoped>
@import "./pharmacy-order.css";
</style>

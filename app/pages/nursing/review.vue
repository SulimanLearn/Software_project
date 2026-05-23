<template>
  <div>
    <NavBar />

    <main class="review-page" dir="rtl">
      <section class="review-shell">
        <div class="top-bar">
          <button class="back-button" type="button" @click="goBack">
            <ArrowRight :size="22" stroke-width="2.7" aria-hidden="true" />
            <span>الرجوع</span>
          </button>
        </div>

        <header class="page-hero">
          <h1>إتمام طلب ممرض</h1>
          <p>يرجى مراجعة تفاصيل طلبك قبل التأكيد</p>
        </header>

        <nav class="booking-stepper" aria-label="خطوات حجز خدمة التمريض">
          <div
            v-for="step in steps"
            :key="step.number"
            class="booking-step"
            :class="{
              active: step.number === currentStep,
              completed: step.number < currentStep,
            }"
          >
            <span class="step-circle">{{ step.number }}</span>
            <span class="step-label">{{ step.label }}</span>
          </div>
        </nav>

        <article class="summary-card" aria-labelledby="summary-title">
          <header class="summary-heading">
            <span class="heading-icon" aria-hidden="true">
              <ClipboardCheck :size="28" stroke-width="2.15" />
            </span>
            <h2 id="summary-title">ملخص الطلب</h2>
          </header>

          <dl class="summary-list">
            <div v-for="row in summaryRows" :key="row.label" class="summary-row">
              <dt>
                <component :is="row.icon" :size="24" stroke-width="2.25" aria-hidden="true" />
                <span>{{ row.label }}</span>
              </dt>
              <dd>{{ row.value }}</dd>
            </div>
          </dl>

          <div class="actions">
            <button class="confirm-button" type="button" :disabled="isSubmitting" @click="confirmOrder">
              <LoaderCircle v-if="isSubmitting" class="spin-icon" :size="22" stroke-width="2.4" />
              <CheckCircle2 v-else :size="22" stroke-width="2.4" />
              <span>{{ isSubmitting ? 'جاري تأكيد الطلب...' : 'تأكيد الطلب' }}</span>
            </button>
          </div>
        </article>

        <p class="footer-note">
          <LockKeyhole :size="16" stroke-width="2.4" aria-hidden="true" />
          <span>نضمن خصوصية بياناتك وأمان طلبك</span>
        </p>
      </section>
    </main>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import {
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  Clock,
  CreditCard,
  LoaderCircle,
  LockKeyhole,
  MapPin,
  Stethoscope,
  Tag,
  UserRound,
} from '@lucide/vue'

definePageMeta({
  title: 'إتمام طلب ممرض',
})

const bookingState = useState('nursingBooking', () => ({}))
const isSubmitting = ref(false)
const currentStep = 6
const defaultNurseRole = 'ممرض'

const steps = [
  { number: 1, label: 'اختيار الممرض' },
  { number: 2, label: 'الخدمة' },
  { number: 3, label: 'المعلومات' },
  { number: 4, label: 'موقع الخدمة' },
  { number: 5, label: 'الدفع' },
  { number: 6, label: 'مراجعة الطلب' },
]

const booking = computed(() => bookingState.value || {})
const nurse = computed(() => booking.value.nurse || null)
const service = computed(() => booking.value.service || null)
const patientInfo = computed(() => booking.value.patientInfo || null)
const location = computed(() => booking.value.location || booking.value.serviceLocation || null)
const paymentMethod = computed(() => booking.value.paymentMethod || booking.value.payment?.method || '')

const hasRequiredBooking = computed(() => Boolean(
  nurse.value
    && service.value
    && patientInfo.value
    && location.value
    && paymentMethod.value,
))

if (!hasRequiredBooking.value) {
  await navigateTo('/nursing/select-nurse')
}

const paymentMethodLabels = {
  cash: 'الدفع نقداً عند الزيارة',
  card: 'الدفع بالبطاقة',
}

const displayValue = (value) => {
  if (value === null || value === undefined || value === '') {
    return 'غير محدد'
  }

  return String(value)
}

const selectedDate = computed(() =>
  booking.value.selectedDate
    || booking.value.date
    || booking.value.visitDate
    || booking.value.appointmentDate
    || 'غير محدد',
)

const selectedTime = computed(() =>
  booking.value.selectedTime
    || booking.value.time
    || booking.value.visitTime
    || booking.value.appointmentTime
    || 'غير محدد',
)

const fullAddress = computed(() => {
  const value = location.value

  if (!value) {
    return 'غير محدد'
  }

  if (typeof value === 'string') {
    return value
  }

  const explicitAddress = value.fullAddress || value.address

  if (explicitAddress) {
    return explicitAddress
  }

  return [
    value.city,
    value.area,
    value.street,
    value.buildingNumber ? `مبنى ${value.buildingNumber}` : '',
    value.floorNumber ? `طابق ${value.floorNumber}` : '',
    value.extraDetails,
  ].filter(Boolean).join(' - ') || 'غير محدد'
})

const totalPrice = computed(() => {
  const price = service.value?.price

  if (price === null || price === undefined || price === '') {
    return 'غير محدد'
  }

  return `${price} شيكل`
})

const paymentMethodLabel = computed(() =>
  paymentMethodLabels[paymentMethod.value] || displayValue(paymentMethod.value),
)

const summaryRows = computed(() => [
  { label: 'الممرض', value: displayValue(nurse.value?.name), icon: UserRound },
  { label: 'الخدمة', value: displayValue(service.value?.title), icon: Stethoscope },
  { label: 'الوقت', value: displayValue(selectedTime.value), icon: Clock },
  { label: 'الموقع', value: fullAddress.value, icon: MapPin },
  { label: 'السعر الإجمالي', value: totalPrice.value, icon: Tag },
  { label: 'طريقة الدفع', value: paymentMethodLabel.value, icon: CreditCard },
])

const wait = (duration) => new Promise((resolve) => {
  window.setTimeout(resolve, duration)
})

const createOrderNumber = () => {
  const dateStamp = new Date().toISOString().slice(2, 10).replaceAll('-', '')
  const randomSegment = Math.floor(10000 + Math.random() * 90000)

  return `NR-${dateStamp}-${randomSegment}`
}

const goBack = async () => {
  await navigateTo('/nursing/payment')
}

const confirmOrder = async () => {
  if (isSubmitting.value) {
    return
  }

  isSubmitting.value = true
  await wait(850)

  const orderNumber = booking.value.orderNumber || createOrderNumber()

  bookingState.value = {
    ...booking.value,
    orderNumber,
    status: 'confirmed',
    confirmedAt: new Date().toISOString(),
    confirmation: {
      orderNumber,
      status: 'confirmed',
      confirmedAt: new Date().toISOString(),
      nurse: nurse.value,
      nurseRole: nurse.value?.role || nurse.value?.jobTitle || defaultNurseRole,
      service: service.value,
      patientInfo: patientInfo.value,
      location: location.value,
      paymentMethod: paymentMethod.value,
      date: selectedDate.value,
      time: selectedTime.value,
      totalPrice: service.value?.price,
    },
  }

  await navigateTo('/nursing/success')
}
</script>

<style scoped>
.review-page {
  min-height: 100vh;
  color: #061f4a;
  background:
    radial-gradient(circle at 15% 8%, rgba(37, 99, 235, 0.11), transparent 28%),
    radial-gradient(circle at 86% 18%, rgba(14, 165, 233, 0.12), transparent 26%),
    linear-gradient(180deg, #f8fbff 0%, #ffffff 48%, #f4f8ff 100%);
  font-family: "Tajawal", sans-serif;
}

.review-shell {
  display: grid;
  width: min(100%, 1040px);
  margin: 0 auto;
  padding: 24px 18px 40px;
}

.top-bar {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 14px;
}

.page-hero {
  margin-bottom: 22px;
  text-align: center;
}

.page-hero h1 {
  margin: 0;
  color: #061f4a;
  font-size: clamp(1.85rem, 3.8vw, 2.8rem);
  font-weight: 900;
  line-height: 1.16;
}

.page-hero p {
  margin: 8px 0 0;
  color: #65748d;
  font-size: clamp(0.9rem, 1.7vw, 1.02rem);
  font-weight: 800;
}

.booking-stepper {
  position: relative;
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 0;
  width: min(100%, 980px);
  margin: 0 auto 18px;
  padding: 0 8px;
}

.booking-step {
  position: relative;
  z-index: 1;
  display: grid;
  justify-items: center;
  gap: 8px;
  color: #6f7f9a;
  font-weight: 800;
}

.booking-step::before,
.booking-step::after {
  position: absolute;
  top: 18px;
  z-index: -1;
  width: 50%;
  height: 3px;
  content: "";
  background: #dbe6f6;
}

.booking-step::before {
  right: 0;
}

.booking-step::after {
  left: 0;
}

.booking-step:first-child::before,
.booking-step:last-child::after {
  display: none;
}

.booking-step.completed::before,
.booking-step.completed::after,
.booking-step.active::before {
  background: linear-gradient(90deg, #1d64f2, #4aa3ff);
}

.step-circle {
  display: grid;
  width: 38px;
  height: 38px;
  place-items: center;
  color: #64748b;
  font-size: 0.95rem;
  font-weight: 900;
  background: #ffffff;
  border: 2px solid #d8e4f5;
  border-radius: 999px;
  box-shadow: 0 10px 24px rgba(15, 31, 61, 0.06);
  transition: transform 0.25s ease, color 0.25s ease, background 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
}

.booking-step.active {
  color: #1d64f2;
}

.booking-step.completed .step-circle,
.booking-step.active .step-circle {
  color: #ffffff;
  background: linear-gradient(135deg, #0b63f6, #1688ff);
  border-color: #1d64f2;
  box-shadow: 0 14px 30px rgba(29, 100, 242, 0.24);
}

.booking-step.active .step-circle {
  transform: translateY(-2px) scale(1.04);
}

.step-label {
  color: inherit;
  font-size: 0.78rem;
  line-height: 1.35;
  text-align: center;
}

.summary-card {
  width: min(100%, 900px);
  margin: 0 auto;
  padding: 24px;
  background: rgba(255, 255, 255, 0.96);
  border: 1px solid #cfe0f8;
  border-radius: 22px;
  box-shadow: 0 24px 64px rgba(29, 78, 216, 0.1);
  animation: card-enter 0.5s ease both;
}

.summary-heading {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 14px;
  margin-bottom: 18px;
}

.heading-icon {
  display: grid;
  width: 42px;
  height: 42px;
  place-items: center;
  color: #0b63f6;
  background: #eef5ff;
  border: 1px solid #aacbff;
  border-radius: 16px;
}

.summary-heading h2 {
  margin: 0;
  color: #08265c;
  font-size: clamp(1.3rem, 2.5vw, 1.7rem);
  font-weight: 900;
}

.summary-list {
  display: grid;
  margin: 0;
  overflow: hidden;
  background: #ffffff;
  border: 1px solid #dce8f8;
  border-radius: 14px;
}

.summary-row {
  display: grid;
  grid-template-columns: minmax(170px, 0.9fr) minmax(0, 1.35fr);
  align-items: center;
  gap: 14px;
  min-height: 64px;
  padding: 0 18px;
  border-bottom: 1px solid #dce8f8;
}

.summary-row:last-child {
  border-bottom: 0;
}

.summary-row dt,
.summary-row dd {
  margin: 0;
}

.summary-row dt {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  color: #66748d;
  font-size: 0.98rem;
  font-weight: 900;
}

.summary-row dt svg {
  flex: 0 0 auto;
  color: #0b63f6;
}

.summary-row dd {
  color: #061f4a;
  font-size: 1rem;
  font-weight: 900;
  line-height: 1.65;
  text-align: left;
  overflow-wrap: anywhere;
}

.actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 22px;
}

.confirm-button,
.back-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  min-height: 50px;
  padding: 0 24px;
  font: inherit;
  font-size: 1.05rem;
  font-weight: 900;
  border-radius: 14px;
  cursor: pointer;
  transition: transform 0.24s ease, box-shadow 0.24s ease, opacity 0.24s ease, background 0.24s ease;
}

.confirm-button {
  min-width: 240px;
  color: #ffffff;
  background: linear-gradient(135deg, #145cf2 0%, #0ea5e9 100%);
  border: 0;
  box-shadow: 0 18px 30px rgba(37, 99, 235, 0.28);
}

.back-button {
  min-width: 112px;
  min-height: 46px;
  padding: 0 18px;
  color: #0b63f6;
  background: #ffffff;
  border: 1px solid #9fc2ff;
  font-size: 1rem;
}

.confirm-button:hover,
.back-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 22px 38px rgba(37, 99, 235, 0.18);
}

.confirm-button:disabled {
  cursor: wait;
  opacity: 0.78;
  transform: none;
}

.spin-icon {
  animation: spin 0.8s linear infinite;
}

.footer-note {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  margin: 14px 0 0;
  color: #6d7b92;
  font-size: 0.94rem;
  font-weight: 900;
  text-align: center;
}

.footer-note svg {
  color: #6d7b92;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes card-enter {
  from {
    opacity: 0;
    transform: translateY(22px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 720px) {
  .review-shell {
    padding: 26px 12px 36px;
  }

  .top-bar {
    margin-bottom: 18px;
  }

  .page-hero {
    margin-bottom: 22px;
  }

  .page-hero h1 {
    font-size: 2rem;
  }

  .page-hero p {
    margin-top: 10px;
    font-size: 0.98rem;
  }

  .booking-stepper {
    overflow-x: auto;
    grid-template-columns: repeat(6, minmax(76px, 1fr));
    margin-bottom: 16px;
    padding-bottom: 6px;
  }

  .step-circle {
    width: 34px;
    height: 34px;
    font-size: 0.82rem;
  }

  .booking-step::before,
  .booking-step::after {
    top: 16px;
  }

  .step-label {
    font-size: 0.68rem;
  }

  .summary-card {
    padding: 20px 14px;
    border-radius: 18px;
  }

  .summary-heading {
    margin-bottom: 18px;
  }

  .summary-row {
    grid-template-columns: 1fr;
    gap: 8px;
    min-height: auto;
    padding: 16px;
  }

  .summary-row dt {
    font-size: 0.98rem;
  }

  .summary-row dd {
    text-align: right;
    font-size: 1rem;
  }

  .actions {
    justify-content: stretch;
  }

  .confirm-button {
    width: 100%;
    min-width: 0;
    min-height: 54px;
    font-size: 1.08rem;
  }

  .back-button {
    width: 100%;
  }
}
</style>

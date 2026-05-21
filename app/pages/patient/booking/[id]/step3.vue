<template>
    <NavBar />

  <section class="booking-page" dir="rtl">
    <div class="ambient ambient-one" aria-hidden="true"></div>
    <div class="ambient ambient-two" aria-hidden="true"></div>

    <Transition name="toast">
      <div v-if="showSuccessToast" class="success-toast" role="status">
        <CheckCircle2 :size="20" stroke-width="2.3" />
        <span>تم تأكيد الحجز بنجاح</span>
      </div>
    </Transition>

    <div v-if="doctor" class="booking-shell">
      <header class="booking-header">
        <h1>إتمام الحجز</h1>
        <span class="title-mark" aria-hidden="true"></span>
        <p>{{ doctor.name }} - {{ doctor.specialtyName }}</p>
      </header>

      <nav class="stepper" aria-label="خطوات إتمام الحجز">
        <div class="step-line" aria-hidden="true"></div>
        <div
          v-for="step in steps"
          :key="step.number"
          class="step"
          :class="{ active: step.active, completed: step.completed }"
        >
          <span class="step-circle">{{ step.number }}</span>
          <span class="step-label">{{ step.label }}</span>
        </div>
      </nav>

      <article v-if="hasBookingData" class="summary-card" aria-labelledby="summary-title">
        <div class="summary-head">
          <span class="summary-icon" aria-hidden="true">
            <ClipboardCheck :size="22" stroke-width="2.1" />
          </span>
          <h2 id="summary-title">ملخص الحجز</h2>
        </div>

        <dl class="summary-list">
          <div v-for="item in summaryItems" :key="item.label" class="summary-row">
            <dt>{{ item.label }}</dt>
            <dd>{{ item.value }}</dd>
          </div>
        </dl>

        <p v-if="errorMessage" class="inline-error" role="alert">{{ errorMessage }}</p>

        <div class="form-actions">
          <NuxtLink class="secondary-button" :to="`/patient/booking/${doctorId}/step2`">
            <ArrowRight :size="18" stroke-width="2.4" />
            <span>السابق</span>
          </NuxtLink>

          <button
            class="confirm-button"
            type="button"
            :disabled="isSubmitting"
            @click="confirmBooking"
          >
            <LoaderCircle v-if="isSubmitting" class="spin-icon" :size="19" stroke-width="2.4" />
            <CheckCircle2 v-else :size="19" stroke-width="2.4" />
            <span>{{ isSubmitting ? 'جار تأكيد الحجز...' : 'تأكيد الحجز والدفع' }}</span>
          </button>
        </div>
      </article>

      <article v-else class="empty-state" role="alert">
        <span class="empty-icon" aria-hidden="true">
          <CalendarX2 :size="32" stroke-width="1.9" />
        </span>
        <h2>بيانات الحجز غير مكتملة</h2>
        <p>يرجى الرجوع لاختيار موعد الزيارة وإكمال تفاصيل الدفع قبل التأكيد.</p>
        <div class="empty-actions">
          <NuxtLink class="secondary-button" :to="`/patient/booking/${doctorId}/step2`">
            <ArrowRight :size="18" stroke-width="2.4" />
            <span>تفاصيل الزيارة</span>
          </NuxtLink>
          <NuxtLink class="confirm-button" :to="`/doctors/${doctorId}`">
            <CalendarCheck :size="18" stroke-width="2.4" />
            <span>اختيار الموعد</span>
          </NuxtLink>
        </div>
      </article>
    </div>

    <div v-else class="booking-shell empty-shell">
      <article class="empty-state" role="alert">
        <span class="empty-icon" aria-hidden="true">
          <UserRound :size="32" stroke-width="1.9" />
        </span>
        <h1>لم يتم العثور على الطبيب</h1>
        <NuxtLink class="confirm-button" to="/doctors">العودة إلى الأطباء</NuxtLink>
      </article>
    </div>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue'
import {
  ArrowRight,
  CalendarCheck,
  CalendarX2,
  CheckCircle2,
  ClipboardCheck,
  LoaderCircle,
  UserRound,
} from '@lucide/vue'
import { doctors } from '~/data/doctors'

definePageMeta({
  title: 'إتمام الحجز - التأكيد',
})

const route = useRoute()
const doctorId = computed(() => String(route.params.id ?? ''))
const bookingSummary = useState(`booking-summary-${doctorId.value}`, () => ({}))
const confirmedBooking = useState('confirmed-booking-summary', () => ({}))
const isSubmitting = ref(false)
const showSuccessToast = ref(false)
const errorMessage = ref('')

const doctor = computed(() =>
  doctors.find((item) => String(item.id) === doctorId.value),
)

const steps = [
  { number: 1, label: 'بيانات المريض', active: false, completed: true },
  { number: 2, label: 'تفاصيل الزيارة', active: false, completed: true },
  { number: 3, label: 'التأكيد', active: true, completed: false },
]

const visitTypeLabels = {
  clinic: 'زيارة في العيادة',
  remote: 'استشارة عن بعد',
}

const paymentMethodLabels = {
  cash: 'الدفع نقداً',
  card: 'الدفع بالبطاقة',
}

const summary = computed(() => ({
  doctorName: bookingSummary.value?.doctorName || doctor.value?.name || '',
  specialty: bookingSummary.value?.specialty || doctor.value?.specialtyName || '',
  date: bookingSummary.value?.date || '',
  time: bookingSummary.value?.time || '',
  visitType: bookingSummary.value?.visitType || '',
  paymentMethod: bookingSummary.value?.paymentMethod || '',
  fee: bookingSummary.value?.fee ?? doctor.value?.price ?? '',
  patientName: bookingSummary.value?.patientName || [bookingSummary.value?.firstName, bookingSummary.value?.lastName].filter(Boolean).join(' ').trim(),
}))

const hasBookingData = computed(() => Boolean(
  doctor.value
    && summary.value.doctorName
    && summary.value.specialty
    && summary.value.date
    && summary.value.time
    && summary.value.visitType
    && summary.value.paymentMethod
    && summary.value.fee !== '',
))

const summaryItems = computed(() => [
  { label: 'الطبيب', value: summary.value.doctorName },
  { label: 'التخصص', value: summary.value.specialty },
  { label: 'التاريخ', value: summary.value.date },
  { label: 'الوقت', value: summary.value.time },
  { label: 'نوع الزيارة', value: visitTypeLabels[summary.value.visitType] || summary.value.visitType },
  { label: 'طريقة الدفع', value: paymentMethodLabels[summary.value.paymentMethod] || summary.value.paymentMethod },
  { label: 'الرسوم', value: `${summary.value.fee} شيكل` },
])

const wait = (duration) => new Promise((resolve) => {
  window.setTimeout(resolve, duration)
})

const createBookingNumber = () => {
  const dateStamp = new Date().toISOString().slice(2, 10).replaceAll('-', '')
  const randomSegment = Math.floor(10000 + Math.random() * 90000)

  return `MC-${dateStamp}-${randomSegment}`
}

const confirmBooking = async () => {
  errorMessage.value = ''

  if (!hasBookingData.value) {
    errorMessage.value = 'بيانات الحجز غير مكتملة، يرجى مراجعة الخطوات السابقة.'
    return
  }

  isSubmitting.value = true
  await wait(800)
  const bookingNumber = bookingSummary.value?.bookingNumber || createBookingNumber()

  confirmedBooking.value = {
    ...bookingSummary.value,
    bookingNumber,
    doctorId: doctorId.value,
    doctorName: summary.value.doctorName,
    specialty: summary.value.specialty,
    date: summary.value.date,
    time: summary.value.time,
    visitType: summary.value.visitType,
    paymentMethod: summary.value.paymentMethod,
    amount: summary.value.fee,
    fee: summary.value.fee,
    patientName: summary.value.patientName,
    confirmedAt: new Date().toISOString(),
  }

  bookingSummary.value = {
    ...bookingSummary.value,
    ...confirmedBooking.value,
  }

  showSuccessToast.value = true
  await wait(900)
  await navigateTo('/patient/booking/success')
}
</script>

<style scoped>
.booking-page {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
  color: #0f1f3d;
  background:
    radial-gradient(circle at 18% 12%, rgba(59, 130, 246, 0.13), transparent 28%),
    radial-gradient(circle at 82% 22%, rgba(14, 165, 233, 0.12), transparent 30%),
    linear-gradient(180deg, #ffffff 0%, #f8fbff 48%, #ffffff 100%);
}

.booking-shell {
  position: relative;
  z-index: 1;
  width: min(100%, 980px);
  margin: 0 auto;
  padding: 34px 20px 76px;
}

.ambient {
  position: absolute;
  border-radius: 999px;
  filter: blur(18px);
  opacity: 0.65;
  pointer-events: none;
}

.ambient-one {
  top: 138px;
  right: -92px;
  width: 220px;
  height: 220px;
  background: rgba(59, 130, 246, 0.13);
}

.ambient-two {
  bottom: 80px;
  left: -112px;
  width: 270px;
  height: 270px;
  background: rgba(125, 211, 252, 0.2);
}

.booking-header {
  margin: 20px auto 34px;
  text-align: center;
}

.booking-header h1 {
  margin: 0;
  color: #10203f;
  font-size: clamp(2.1rem, 4vw, 3.15rem);
  font-weight: 800;
  line-height: 1.1;
}

.title-mark {
  display: block;
  width: 72px;
  height: 4px;
  margin: 16px auto 12px;
  background: linear-gradient(90deg, #60a5fa, #2563eb);
  border-radius: 999px;
  box-shadow: 0 8px 20px rgba(37, 99, 235, 0.26);
}

.booking-header p {
  margin: 0;
  color: #52627d;
  font-size: 1.08rem;
  font-weight: 600;
}

.stepper {
  position: relative;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  align-items: start;
  width: min(100%, 700px);
  margin: 0 auto 42px;
  direction: rtl;
}

.step-line {
  position: absolute;
  top: 23px;
  right: 16.5%;
  left: 16.5%;
  height: 2px;
  background: linear-gradient(90deg, rgba(59, 130, 246, 0.35), rgba(59, 130, 246, 0.78), rgba(59, 130, 246, 0.35));
  border-radius: 999px;
}

.step {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  color: #1f3a63;
}

.step-circle {
  display: grid;
  width: 48px;
  height: 48px;
  place-items: center;
  color: #1d4ed8;
  font-size: 1.12rem;
  font-weight: 800;
  background: rgba(255, 255, 255, 0.96);
  border: 2px solid rgba(59, 130, 246, 0.82);
  border-radius: 999px;
  box-shadow: 0 10px 24px rgba(37, 99, 235, 0.12);
  transition: transform 0.25s ease, background 0.25s ease, color 0.25s ease, box-shadow 0.25s ease;
}

.step.completed .step-circle {
  color: #1d4ed8;
  background: #ffffff;
}

.step.active .step-circle {
  color: #ffffff;
  background: linear-gradient(145deg, #2563eb, #0ea5e9);
  border-color: #2563eb;
  box-shadow: 0 14px 30px rgba(37, 99, 235, 0.28);
  transform: scale(1.04);
}

.step-label {
  font-size: 0.95rem;
  font-weight: 700;
}

.summary-card,
.empty-state {
  width: min(100%, 860px);
  margin: 0 auto;
  padding: clamp(24px, 4vw, 36px);
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.94), rgba(248, 251, 255, 0.84));
  border: 1px solid rgba(59, 130, 246, 0.3);
  border-radius: 24px;
  box-shadow: 0 24px 70px rgba(15, 31, 61, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.82);
  backdrop-filter: blur(18px);
}

.summary-card {
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.summary-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 30px 80px rgba(15, 31, 61, 0.13), inset 0 1px 0 rgba(255, 255, 255, 0.82);
}

.summary-head {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 18px;
}

.summary-icon,
.empty-icon {
  display: grid;
  width: 44px;
  height: 44px;
  place-items: center;
  color: #2563eb;
  background: rgba(239, 246, 255, 0.86);
  border: 1px solid rgba(59, 130, 246, 0.62);
  border-radius: 14px;
}

.summary-head h2 {
  margin: 0;
  color: #172b4d;
  font-size: clamp(1.35rem, 2.6vw, 1.75rem);
  font-weight: 800;
}

.summary-list {
  display: grid;
  margin: 0;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.68);
  border: 1px solid rgba(59, 130, 246, 0.16);
  border-radius: 18px;
}

.summary-row {
  display: grid;
  grid-template-columns: minmax(130px, 0.8fr) minmax(0, 1.2fr);
  gap: 18px;
  padding: 17px 20px;
  border-bottom: 1px solid rgba(59, 130, 246, 0.15);
}

.summary-row:last-child {
  border-bottom: 0;
}

.summary-row dt,
.summary-row dd {
  margin: 0;
}

.summary-row dt {
  color: #64748b;
  font-weight: 800;
}

.summary-row dd {
  color: #10203f;
  font-weight: 800;
  text-align: left;
}

.inline-error {
  margin: 18px 0 0;
  padding: 12px 14px;
  color: #b42318;
  font-weight: 800;
  background: #fff1f0;
  border: 1px solid rgba(244, 63, 94, 0.22);
  border-radius: 14px;
}

.form-actions,
.empty-actions {
  display: flex;
  justify-content: space-between;
  gap: 14px;
  margin-top: 30px;
}

.confirm-button,
.secondary-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 162px;
  min-height: 52px;
  gap: 10px;
  padding: 0 24px;
  font: inherit;
  font-weight: 800;
  text-decoration: none;
  border-radius: 16px;
  transition: transform 0.24s ease, box-shadow 0.24s ease, background 0.24s ease, border-color 0.24s ease, opacity 0.24s ease;
}

.confirm-button {
  color: #ffffff;
  cursor: pointer;
  background: linear-gradient(135deg, #2563eb 0%, #0ea5e9 100%);
  border: 0;
  box-shadow: 0 16px 30px rgba(37, 99, 235, 0.28);
}

.secondary-button {
  color: #1d4ed8;
  background: #ffffff;
  border: 1px solid rgba(59, 130, 246, 0.35);
}

.confirm-button:hover,
.secondary-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 22px 38px rgba(37, 99, 235, 0.24);
}

.confirm-button:disabled {
  cursor: wait;
  opacity: 0.78;
  transform: none;
}

.spin-icon {
  animation: spin 0.8s linear infinite;
}

.success-toast {
  position: fixed;
  top: 24px;
  left: 50%;
  z-index: 10;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  min-height: 48px;
  padding: 0 18px;
  color: #065f46;
  font-weight: 800;
  background: rgba(236, 253, 245, 0.96);
  border: 1px solid rgba(16, 185, 129, 0.25);
  border-radius: 16px;
  box-shadow: 0 18px 42px rgba(15, 31, 61, 0.14);
  transform: translateX(-50%);
}

.empty-shell {
  display: grid;
  min-height: 72vh;
  place-items: center;
}

.empty-state {
  display: grid;
  width: min(100%, 560px);
  justify-items: center;
  gap: 16px;
  text-align: center;
}

.empty-icon {
  width: 64px;
  height: 64px;
  border-radius: 20px;
}

.empty-state h1,
.empty-state h2 {
  margin: 0;
  color: #10203f;
  font-size: clamp(1.55rem, 4vw, 2.15rem);
  font-weight: 800;
}

.empty-state p {
  max-width: 430px;
  margin: 0;
  color: #52627d;
  font-weight: 700;
  line-height: 1.8;
}

.toast-enter-active,
.toast-leave-active {
  transition: opacity 0.24s ease, transform 0.24s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translate(-50%, -10px);
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 720px) {
  .booking-shell {
    padding: 22px 14px 54px;
  }

  .booking-header {
    margin-top: 10px;
  }

  .step-label {
    max-width: 92px;
    font-size: 0.82rem;
    line-height: 1.35;
    text-align: center;
  }

  .summary-row {
    grid-template-columns: 1fr;
    gap: 8px;
    padding: 15px 16px;
  }

  .summary-row dd {
    text-align: right;
  }

  .form-actions,
  .empty-actions {
    flex-direction: column-reverse;
  }

  .confirm-button,
  .secondary-button {
    width: 100%;
  }
}

.booking-shell {
  width: min(100%, 900px);
  padding: 24px 18px 48px;
}

.ambient-one {
  width: 180px;
  height: 180px;
}

.ambient-two {
  width: 220px;
  height: 220px;
}

.booking-header {
  margin: 10px auto 24px;
}

.booking-header h1 {
  font-size: clamp(1.75rem, 3.2vw, 2.55rem);
}

.title-mark {
  width: 58px;
  height: 3px;
  margin: 12px auto 9px;
}

.booking-header p {
  font-size: 0.96rem;
}

.stepper {
  width: min(100%, 620px);
  margin-bottom: 26px;
}

.step-line {
  top: 19px;
}

.step {
  gap: 8px;
}

.step-circle {
  width: 40px;
  height: 40px;
  font-size: 0.95rem;
}

.step-label {
  font-size: 0.84rem;
}

.summary-card,
.empty-state {
  width: min(100%, 760px);
  padding: clamp(18px, 3vw, 26px);
  border-radius: 18px;
  box-shadow: 0 18px 48px rgba(15, 31, 61, 0.09), inset 0 1px 0 rgba(255, 255, 255, 0.82);
}

.summary-head {
  gap: 9px;
  margin-bottom: 14px;
}

.summary-icon,
.empty-icon {
  width: 36px;
  height: 36px;
  border-radius: 12px;
}

.summary-head h2 {
  font-size: clamp(1.12rem, 2vw, 1.38rem);
}

.summary-list {
  border-radius: 14px;
}

.summary-row {
  gap: 14px;
  padding: 13px 16px;
}

.summary-row dt,
.summary-row dd {
  font-size: 0.92rem;
}

.inline-error {
  margin-top: 14px;
  padding: 10px 12px;
  border-radius: 12px;
}

.form-actions,
.empty-actions {
  gap: 12px;
  margin-top: 22px;
}

.confirm-button,
.secondary-button {
  min-width: 144px;
  min-height: 46px;
  gap: 8px;
  padding: 0 20px;
  border-radius: 13px;
}

.success-toast {
  top: 18px;
  min-height: 42px;
  padding: 0 15px;
  border-radius: 13px;
}

.empty-state {
  width: min(100%, 480px);
  gap: 13px;
}

.empty-state h1,
.empty-state h2 {
  font-size: clamp(1.28rem, 3vw, 1.75rem);
}

.empty-state p {
  font-size: 0.92rem;
}

@media (max-width: 720px) {
  .booking-shell {
    padding: 18px 12px 38px;
  }

  .booking-header {
    margin-top: 6px;
    margin-bottom: 22px;
  }

  .stepper {
    margin-bottom: 24px;
  }

  .step-circle {
    width: 36px;
    height: 36px;
  }

  .step-line {
    top: 18px;
  }

  .summary-row {
    padding: 12px 14px;
  }
}
</style>

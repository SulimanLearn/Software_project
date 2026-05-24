<template>
    <NavBar />

  <section class="payment-page" dir="rtl">
    <div class="payment-shell">
      <div class="top-bar">
        <button class="back-button" type="button" @click="goBack">
          <ArrowRight :size="22" stroke-width="2.7" aria-hidden="true" />
          <span>رجوع</span>
        </button>
      </div>

      <header class="page-hero">
        <h1>الدفع</h1>
        <p>اختر طريقة الدفع المناسبة لإكمال طلب خدمة التمريض.</p>
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

      <main class="payment-card">
        <header class="section-heading">
          <span class="heading-icon" aria-hidden="true">
            <CreditCard :size="24" stroke-width="2.4" />
          </span>
          <h1>تفاصيل الدفع</h1>
        </header>

        <div class="method-grid" aria-label="اختيار طريقة الدفع">
          <button
            v-for="method in paymentMethods"
            :key="method.value"
            class="method-card"
            :class="{ selected: paymentMethod === method.value }"
            type="button"
            @click="selectPaymentMethod(method.value)"
          >
            <component :is="method.icon" :size="28" stroke-width="2.35" aria-hidden="true" />
            <span>{{ method.label }}</span>
          </button>
        </div>

        <Transition name="payment-state" mode="out-in">
          <section v-if="paymentMethod === 'cash'" key="cash" class="state-card cash-state">
            <span class="state-icon" aria-hidden="true">
              <Banknote :size="34" stroke-width="2.25" />
            </span>
            <div>
              <h2>الدفع نقداً</h2>
              <p>سيتم دفع قيمة الخدمة عند وصول الممرض.</p>
            </div>
          </section>

          <section v-else key="card" class="state-card card-state">
            <div class="state-header">
              <span class="state-icon" aria-hidden="true">
                <CreditCard :size="34" stroke-width="2.25" />
              </span>
              <div>
                <h2>تفاصيل البطاقة</h2>
                <p>سيتم خصم قيمة الخدمة من البطاقة مباشرة.</p>
              </div>
            </div>

            <div class="card-fields">
              <div class="field-group wide">
                <label for="card-number">رقم البطاقة</label>
                <div class="input-wrap">
                  <CreditCard :size="18" stroke-width="2.2" aria-hidden="true" />
                  <input
                    id="card-number"
                    v-model="cardForm.cardNumber"
                    type="text"
                    inputmode="numeric"
                    autocomplete="cc-number"
                    placeholder="1234 5678 9012 3456"
                    maxlength="19"
                    :class="{ invalid: errors.cardNumber }"
                    @input="formatCardNumber"
                  >
                </div>
                <p v-if="errors.cardNumber" class="error-message">{{ errors.cardNumber }}</p>
              </div>

              <div class="field-group">
                <label for="expiry-date">تاريخ الانتهاء</label>
                <div class="input-wrap">
                  <CalendarDays :size="18" stroke-width="2.2" aria-hidden="true" />
                  <input
                    id="expiry-date"
                    v-model="cardForm.expiryDate"
                    type="text"
                    inputmode="numeric"
                    autocomplete="cc-exp"
                    placeholder="MM / YY"
                    maxlength="7"
                    :class="{ invalid: errors.expiryDate }"
                    @input="formatExpiryDate"
                  >
                </div>
                <p v-if="errors.expiryDate" class="error-message">{{ errors.expiryDate }}</p>
              </div>

              <div class="field-group">
                <label for="cvv">رمز الأمان (CVV)</label>
                <div class="input-wrap">
                  <LockKeyhole :size="18" stroke-width="2.2" aria-hidden="true" />
                  <input
                    id="cvv"
                    v-model="cardForm.cvv"
                    type="password"
                    inputmode="numeric"
                    autocomplete="cc-csc"
                    placeholder="123"
                    maxlength="3"
                    :class="{ invalid: errors.cvv }"
                    @input="formatCvv"
                  >
                </div>
                <p v-if="errors.cvv" class="error-message">{{ errors.cvv }}</p>
              </div>
            </div>
          </section>
        </Transition>

        <div class="page-actions">
          <button class="primary-action" type="button" @click="goNext">
            <span>مراجعة الحجز</span>
            <ArrowLeft :size="18" stroke-width="2.4" aria-hidden="true" />
          </button>
        </div>
      </main>
    </div>
  </section>
</template>

<script setup>
import { reactive, ref } from 'vue'
import {
  ArrowLeft,
  ArrowRight,
  Banknote,
  CalendarDays,
  CreditCard,
  LockKeyhole,
} from '@lucide/vue'

definePageMeta({
  title: 'تفاصيل الدفع',
})

const bookingState = useState('nursingBooking', () => ({}))
const existingPayment = bookingState.value?.payment || {}
const currentStep = 5

const steps = [
  { number: 1, label: 'اختيار الممرض' },
  { number: 2, label: 'الخدمة' },
  { number: 3, label: 'المعلومات' },
  { number: 4, label: 'موقع الخدمة' },
  { number: 5, label: 'الدفع' },
  { number: 6, label: 'مراجعة الطلب' },
]

const paymentMethod = ref(existingPayment.method || 'cash')

const paymentMethods = [
  { value: 'cash', label: 'الدفع نقداً', icon: Banknote },
  { value: 'card', label: 'الدفع بالبطاقة', icon: CreditCard },
]

const cardForm = reactive({
  cardNumber: existingPayment.cardNumber || '',
  expiryDate: existingPayment.expiryDate || '',
  cvv: existingPayment.cvv || '',
})

const errors = reactive({
  cardNumber: '',
  expiryDate: '',
  cvv: '',
})

const selectPaymentMethod = (method) => {
  paymentMethod.value = method
  clearErrors()
}

const formatCardNumber = () => {
  cardForm.cardNumber = cardForm.cardNumber
    .replace(/\D/g, '')
    .slice(0, 16)
    .replace(/(.{4})/g, '$1 ')
    .trim()
  errors.cardNumber = ''
}

const formatExpiryDate = () => {
  const digits = cardForm.expiryDate.replace(/\D/g, '').slice(0, 4)
  cardForm.expiryDate = digits.length > 2
    ? `${digits.slice(0, 2)} / ${digits.slice(2)}`
    : digits
  errors.expiryDate = ''
}

const formatCvv = () => {
  cardForm.cvv = cardForm.cvv.replace(/\D/g, '').slice(0, 4)
  errors.cvv = ''
}

const clearErrors = () => {
  Object.keys(errors).forEach((key) => {
    errors[key] = ''
  })
}

const validatePayment = () => {
  clearErrors()

  if (paymentMethod.value !== 'card') {
    return true
  }

  if (cardForm.cardNumber.replace(/\D/g, '').length < 16) {
    errors.cardNumber = 'يرجى إدخال رقم البطاقة كاملاً'
  }

  if (cardForm.expiryDate.replace(/\D/g, '').length < 4) {
    errors.expiryDate = 'يرجى إدخال تاريخ الانتهاء'
  }

  if (cardForm.cvv.replace(/\D/g, '').length < 3) {
    errors.cvv = 'يرجى إدخال رمز الأمان'
  }

  return !Object.values(errors).some(Boolean)
}

const savePayment = () => {
  bookingState.value = {
    ...bookingState.value,
    payment: {
      method: paymentMethod.value,
      cardNumber: paymentMethod.value === 'card' ? cardForm.cardNumber : '',
      expiryDate: paymentMethod.value === 'card' ? cardForm.expiryDate : '',
      cvv: paymentMethod.value === 'card' ? cardForm.cvv : '',
    },
  }
}

const goBack = async () => {
  savePayment()
  await navigateTo('/nursing/location')
}

const goNext = async () => {
  if (!validatePayment()) {
    return
  }

  savePayment()
  await navigateTo('/nursing/review')
}
</script>

<style scoped>
.payment-page {
  min-height: 100vh;
  color: #061f4a;
  background:
    radial-gradient(circle at 12% 8%, rgba(36, 99, 235, 0.08), transparent 27%),
    radial-gradient(circle at 92% 14%, rgba(14, 165, 233, 0.1), transparent 24%),
    linear-gradient(180deg, #fbfdff 0%, #ffffff 48%, #f6faff 100%);
  font-family: "Tajawal", sans-serif;
}

.payment-shell {
  display: grid;
  width: min(100%, 1080px);
  margin: 0 auto;
  padding: 22px 18px 40px;
}

.top-bar {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 14px;
}

.back-button {
  display: inline-flex;
  min-width: 112px;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 10px 18px;
  color: #0a2a67;
  font-family: inherit;
  font-size: 1rem;
  font-weight: 900;
  background: #ffffff;
  border: 1px solid #cdddf3;
  border-radius: 14px;
  box-shadow: 0 14px 34px rgba(15, 31, 61, 0.06);
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease, background 0.3s ease;
}

.back-button:hover {
  transform: translateY(-2px);
  background: #f4f8ff;
}

.page-hero {
  margin-bottom: 14px;
  text-align: center;
}

.page-hero h1 {
  margin: 0;
  color: #061f4a;
  font-size: clamp(1.55rem, 3vw, 2.2rem);
  font-weight: 900;
  line-height: 1.16;
}

.page-hero p {
  max-width: 560px;
  margin: 6px auto 0;
  color: #66748d;
  font-size: clamp(0.82rem, 1.4vw, 0.95rem);
  font-weight: 700;
  line-height: 1.65;
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
  box-shadow: 0 8px 18px rgba(15, 31, 61, 0.055);
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

.payment-card {
  width: min(100%, 900px);
  margin: 0 auto;
  padding: 24px;
  background: rgba(255, 255, 255, 0.96);
  border: 1px solid #dce8f8;
  border-radius: 22px;
  box-shadow: 0 18px 44px rgba(29, 78, 216, 0.09);
  animation: card-enter 0.6s ease both;
}

.section-heading {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 18px;
}

.heading-icon,
.state-icon {
  display: grid;
  flex: 0 0 auto;
  place-items: center;
  color: #1d64f2;
  background: linear-gradient(135deg, #eef5ff, #dcecff);
  border: 1px solid #bdd8ff;
}

.heading-icon {
  width: 40px;
  height: 40px;
  border-radius: 14px;
}

.section-heading h1 {
  margin: 0;
  color: #08265c;
  font-size: clamp(1.28rem, 2.4vw, 1.65rem);
  font-weight: 900;
}

.method-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
  margin-bottom: 18px;
}

.method-card {
  display: inline-flex;
  min-height: 62px;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: #233b60;
  font-family: inherit;
  font-size: 1.05rem;
  font-weight: 900;
  background: #ffffff;
  border: 1px solid #cdd9e8;
  border-radius: 14px;
  cursor: pointer;
  box-shadow: 0 12px 28px rgba(15, 31, 61, 0.04);
  transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease, background 0.3s ease, color 0.3s ease;
}

.method-card svg {
  color: #6c7d96;
  transition: color 0.3s ease, transform 0.3s ease;
}

.method-card:hover {
  transform: translateY(-2px);
  border-color: #8dbdff;
  box-shadow: 0 16px 34px rgba(29, 100, 242, 0.1);
}

.method-card.selected {
  color: #0a2a67;
  background: linear-gradient(180deg, #f4f9ff 0%, #ffffff 100%);
  border-color: #1d64f2;
  box-shadow: 0 0 0 4px rgba(29, 100, 242, 0.08), 0 18px 38px rgba(29, 100, 242, 0.12);
}

.method-card.selected svg {
  color: #1d64f2;
  transform: scale(1.04);
}

.state-card {
  min-height: 128px;
  padding: 22px;
  background: linear-gradient(135deg, #eff6ffd9, #fffffff5);
  border: 1px solid #cfe1f8;
  border-radius: 18px;
  box-shadow: 0 18px 42px rgba(29, 78, 216, 0.07);
}

.cash-state {
  display: flex;
  align-items: center;
  gap: 18px;
}

.state-icon {
  width: 54px;
  height: 54px;
  border-radius: 16px;
}

.state-card h2 {
  margin: 0;
  color: #08265c;
  font-size: 1.18rem;
  font-weight: 900;
}

.state-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 18px;
}

.state-header p {
  margin: 8px 0 0;
  color: #4a5c76;
  font-size: 0.98rem;
  font-weight: 800;
  line-height: 1.7;
}

.card-fields {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px 16px;
}

.field-group {
  display: grid;
  gap: 8px;
}

.field-group.wide {
  grid-column: 1 / -1;
}

label {
  color: #243858;
  font-size: 0.95rem;
  font-weight: 900;
}

.input-wrap {
  position: relative;
}

.input-wrap svg {
  position: absolute;
  top: 50%;
  right: 16px;
  color: #1d64f2;
  transform: translateY(-50%);
  pointer-events: none;
}

input {
  direction: ltr;
  width: 100%;
  min-height: 48px;
  padding: 0 48px 0 16px;
  color: #10264c;
  background: #ffffff;
  border: 1px solid #cdd9e8;
  border-radius: 12px;
  font-family: inherit;
  font-size: 0.98rem;
  font-weight: 800;
  outline: none;
  transition: border-color 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease;
}

input::placeholder {
  color: #7f8fa7;
}

input:focus {
  border-color: #69a7ff;
  box-shadow: 0 0 0 4px rgba(26, 115, 248, 0.12), 0 10px 24px rgba(26, 115, 248, 0.08);
  transform: scale(1.01);
}

input.invalid {
  border-color: #ef4444;
  box-shadow: none;
}

input.invalid:focus {
  border-color: #ef4444;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.08);
}

.error-message {
  margin: 0;
  color: #dc2626;
  font-size: 0.8rem;
  font-weight: 800;
  line-height: 1.4;
}

.page-actions {
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  margin-top: 22px;
}

.primary-action {
  display: inline-flex;
  min-width: 176px;
  min-height: 48px;
  align-items: center;
  justify-content: center;
  gap: 9px;
  border-radius: 14px;
  font-family: inherit;
  font-size: 1rem;
  font-weight: 900;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease, background 0.3s ease;
}

.primary-action {
  color: #ffffff;
  background: linear-gradient(135deg, #0c64ec 0%, #2294ff 100%);
  border: 0;
  box-shadow: 0 16px 28px rgba(26, 115, 248, 0.22);
}

.primary-action:hover {
  transform: translateY(-3px);
  box-shadow: 0 20px 34px rgba(26, 115, 248, 0.3);
}

.primary-action:active,
.back-button:active,
.method-card:active {
  transform: scale(0.98);
}

.payment-state-enter-active,
.payment-state-leave-active {
  transition: opacity 0.26s ease, transform 0.26s ease;
}

.payment-state-enter-from,
.payment-state-leave-to {
  opacity: 0;
  transform: translateY(14px);
}

@keyframes card-enter {
  from {
    opacity: 0;
    transform: translateY(24px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 720px) {
  .payment-shell {
    padding: 20px 14px 40px;
  }

  .top-bar {
    margin-bottom: 18px;
  }

  .back-button {
    width: 100%;
  }

  .page-hero {
    margin-bottom: 14px;
  }

  .page-hero h1 {
    font-size: 1.55rem;
  }

  .page-hero p {
    font-size: 0.82rem;
    line-height: 1.6;
  }

  .payment-card {
    padding: 22px 16px;
    border-radius: 18px;
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

  .method-grid,
  .card-fields {
    grid-template-columns: 1fr;
  }

  .cash-state,
  .state-header {
    align-items: flex-start;
  }

  .state-card {
    padding: 22px 16px;
  }

  .primary-action {
    width: 100%;
  }
}
</style>

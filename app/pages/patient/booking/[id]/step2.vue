<template>
    <NavBar />

  <section class="booking-page" >
    <div class="ambient ambient-one" aria-hidden="true"></div>
    <div class="ambient ambient-two" aria-hidden="true"></div>

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
          :class="{ active: step.active }"
        >
          <span class="step-circle">{{ step.number }}</span>
          <span class="step-label">{{ step.label }}</span>
        </div>
      </nav>

      <form class="form-card" novalidate @submit.prevent="reviewBooking">
        <div class="card-header">
          <div class="header-title">
            <span class="header-icon" aria-hidden="true">
              <CalendarDays :size="22" stroke-width="2" />
            </span>
            <h2>تفاصيل الزيارة</h2>
          </div>
        </div>

        <div class="payment-grid" aria-label="طريقة الدفع">
          <button
            type="button"
            class="payment-option"
            :class="{ selected: form.paymentMethod === 'cash', disabled: isCashDisabled }"
            :disabled="isCashDisabled"
            @click="selectPayment('cash')"
          >
            <Banknote :size="25" stroke-width="2.1" />
            <span>الدفع نقداً</span>
          </button>

          <button
            type="button"
            class="payment-option"
            :class="{ selected: form.paymentMethod === 'card' }"
            @click="selectPayment('card')"
          >
            <CreditCard :size="25" stroke-width="2.1" />
            <span>الدفع بالبطاقة</span>
          </button>
        </div>

        <Transition name="fade-slide">
          <p v-if="isCashDisabled" class="remote-warning">
            الدفع النقدي غير متاح للزيارة عن بعد
          </p>
        </Transition>

        <div class="form-grid">
          <label class="field field-input">
            <span>هل لديك أمراض مزمنة؟</span>
            <select
              v-model="form.chronicDisease"
              :class="{ invalid: errors.chronicDisease }"
              @change="clearError('chronicDisease')"
            >
              <option value="" disabled>اختر الإجابة</option>
              <option value="yes">نعم</option>
              <option value="no">لا</option>
            </select>
            <small v-if="errors.chronicDisease">{{ errors.chronicDisease }}</small>
          </label>

          <label class="field field-input">
            <span>نوع الزيارة</span>
            <select
              v-model="form.visitType"
              :class="{ invalid: errors.visitType }"
              @change="clearError('visitType')"
            >
              <option value="" disabled>اختر نوع الزيارة</option>
              <option value="clinic">عيادة (في العيادة)</option>
              <option value="remote">عن بعد (استشارة مرئية)</option>
            </select>
            <small v-if="errors.visitType">{{ errors.visitType }}</small>
          </label>

          <label v-if="form.chronicDisease === 'yes'" class="field field-input">
            <span>ما هي ؟</span>
            <input v-model="form.bloodPressure" type="text" placeholder="ارتفاع ضغط الدم ">
          </label>

          <label
            class="field field-input symptoms-field"
            :class="{ 'align-right': form.chronicDisease !== 'yes' }"
          >
            <span>أعراضك أو شكواك (اختياري)</span>
            <input
              v-model="form.symptoms"
              type="text"
              placeholder="أشعر بألم في الصدر وضيق في التنفس"
            >
          </label>
        </div>

        <Transition name="section-swap" mode="out-in">
          <div v-if="form.paymentMethod === 'cash'" key="cash" class="cash-info">
            <div>
              <h3>الدفع نقداً</h3>
              <p>سيتم دفع قيمة الكشف في العيادة عند موعد الزيارة</p>
            </div>
            <span class="cash-icon" aria-hidden="true">
              <Banknote :size="42" stroke-width="1.9" />
            </span>
          </div>

          <section v-else key="card" class="card-details" aria-labelledby="card-details-title">
            <div class="card-details-head">
              <div>
                <h3 id="card-details-title">تفاصيل البطاقة</h3>
                <p>سيتم خصم قيمة الكشف من البطاقة مباشرة</p>
              </div>
              <span class="card-large-icon" aria-hidden="true">
                <CreditCard :size="58" stroke-width="1.8" />
              </span>
            </div>

            <div class="card-fields">
              <label class="field full-field">
                <span>رقم البطاقة</span>
                <div class="input-with-icon">
                  <input
                    :value="form.cardNumber"
                    type="text"
                    inputmode="numeric"
                    autocomplete="cc-number"
                    placeholder="1234 5678 9012 3456"
                    :class="{ invalid: errors.cardNumber }"
                    maxlength="19"
                    @input="handleCardNumberInput"
                  >
                  <CreditCard :size="18" stroke-width="2" />
                </div>
                <small v-if="errors.cardNumber">{{ errors.cardNumber }}</small>
              </label>

              <label class="field">
                <span>رمز الأمان (CVV)</span>
                <div class="input-with-icon">
                  <input
                    v-model="form.cvv"
                    type="password"
                    inputmode="numeric"
                    autocomplete="cc-csc"
                    placeholder="123"
                    :class="{ invalid: errors.cvv }"
                    maxlength="3"
                    @input="handleNumericInput('cvv', $event, 3)"
                  >
                  <LockKeyhole :size="17" stroke-width="2" />
                </div>
                <small v-if="errors.cvv">{{ errors.cvv }}</small>
              </label>

              <label class="field">
                <span>تاريخ الانتهاء</span>
                <div class="input-with-icon">
                  <input
                    :value="form.expiryDate"
                    type="text"
                    inputmode="numeric"
                    autocomplete="cc-exp"
                    placeholder="MM / YY"
                    :class="{ invalid: errors.expiryDate }"
                    maxlength="5"
                    @input="handleExpiryInput"
                  >
                  <CalendarDays :size="17" stroke-width="2" />
                </div>
                <small v-if="errors.expiryDate">{{ errors.expiryDate }}</small>
              </label>
            </div>
          </section>
        </Transition>

        <div class="form-actions">
          <button class="next-button" type="submit">مراجعة الحجز</button>
          <NuxtLink class="secondary-button" :to="`/patient/booking/${doctorId}`">
            <span>السابق</span>
            <ArrowRight :size="18" stroke-width="2.4" />
          </NuxtLink>
        </div>
      </form>
    </div>

    <div v-else class="booking-shell empty-shell">
      <div class="empty-state">
        <span class="empty-icon" aria-hidden="true">
          <UserRound :size="30" stroke-width="1.9" />
        </span>
        <h1>لم يتم العثور على الطبيب</h1>
        <NuxtLink class="empty-button" to="/doctors">العودة إلى الأطباء</NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, reactive, watch } from 'vue'
import {
  ArrowRight,
  Banknote,
  CalendarDays,
  CreditCard,
  LockKeyhole,
  UserRound,
} from '@lucide/vue'
import { doctors } from '~/data/doctors'

definePageMeta({
  title: 'إتمام الحجز - تفاصيل الزيارة',
})

const route = useRoute()
const doctorId = route.params.id
const bookingSummary = useState(`booking-summary-${doctorId}`, () => ({}))
const doctor = computed(() =>
  doctors.find((item) => String(item.id) === String(doctorId)),
)

const steps = [
  { number: 1, label: 'بيانات المريض', active: false },
  { number: 2, label: 'تفاصيل الزيارة', active: true },
  { number: 3, label: 'التأكيد', active: false },
]

const form = reactive({
  paymentMethod: 'cash',
  visitType: '',
  chronicDisease: '',
  bloodPressure: '',
  symptoms: '',
  cardNumber: '',
  expiryDate: '',
  cvv: '',
})

const errors = reactive({
  chronicDisease: '',
  visitType: '',
  cardNumber: '',
  expiryDate: '',
  cvv: '',
})

const isCashDisabled = computed(() => form.visitType === 'remote')

const clearError = (field) => {
  errors[field] = ''
}

const normalizeDigits = (value) => String(value)
  .replace(/[٠-٩]/g, (digit) => String(digit.charCodeAt(0) - 1632))
  .replace(/[۰-۹]/g, (digit) => String(digit.charCodeAt(0) - 1776))

const onlyDigits = (value, maxLength) => normalizeDigits(value)
  .replace(/\D/g, '')
  .slice(0, maxLength)

const handleNumericInput = (field, event, maxLength) => {
  const value = onlyDigits(event.target.value, maxLength)

  form[field] = value
  event.target.value = value
  clearError(field)
}

const formatCardNumber = (value) => onlyDigits(value, 16).replace(/(\d{4})(?=\d)/g, '$1 ')

const handleCardNumberInput = (event) => {
  const input = event.target
  const cursorDigitCount = countDigitsBefore(input.value, input.selectionStart ?? input.value.length)
  const value = formatCardNumber(input.value)

  form.cardNumber = value
  input.value = value

  const cursorPosition = caretFromDigitCount(value, cursorDigitCount)
  input.setSelectionRange(cursorPosition, cursorPosition)
  clearError('cardNumber')
}

const countDigitsBefore = (value, index) => normalizeDigits(value.slice(0, index)).replace(/\D/g, '').length

const caretFromDigitCount = (value, digitCount) => {
  if (digitCount <= 0) {
    return 0
  }

  if (value.endsWith('/') && digitCount === 2) {
    return value.length
  }

  let seenDigits = 0

  for (let index = 0; index < value.length; index += 1) {
    if (/\d/.test(value[index])) {
      seenDigits += 1
    }

    if (seenDigits === digitCount) {
      return index + 1
    }
  }

  return value.length
}

const formatExpiryDate = (value) => {
  const digits = normalizeDigits(value).replace(/\D/g, '').slice(0, 4)

  if (digits.length >= 2 && Number(digits.slice(0, 2)) > 12) {
    return null
  }

  if (digits.length < 2) {
    return digits
  }

  return `${digits.slice(0, 2)}/${digits.slice(2)}`
}

const handleExpiryInput = (event) => {
  const input = event.target
  const previousValue = form.expiryDate
  const rawValue = normalizeDigits(input.value).replace(/[^\d/]/g, '').slice(0, 5)
  const isDeleting = event.inputType?.startsWith('delete')

  if (isDeleting && previousValue.endsWith('/') && rawValue === previousValue.slice(0, -1)) {
    form.expiryDate = rawValue
    input.value = rawValue
    input.setSelectionRange(rawValue.length, rawValue.length)
    clearError('expiryDate')
    return
  }

  const cursorDigitCount = countDigitsBefore(input.value, input.selectionStart ?? input.value.length)
  const value = formatExpiryDate(rawValue)

  if (value === null) {
    input.value = previousValue
    input.setSelectionRange(previousValue.length, previousValue.length)
    return
  }

  form.expiryDate = value
  input.value = value
  const cursorPosition = caretFromDigitCount(value, cursorDigitCount)
  input.setSelectionRange(cursorPosition, cursorPosition)
  clearError('expiryDate')
}

const selectPayment = (method) => {
  if (method === 'cash' && isCashDisabled.value) {
    return
  }

  form.paymentMethod = method
}

const validate = () => {
  errors.chronicDisease = form.chronicDisease ? '' : 'يرجى اختيار حالة الأمراض المزمنة'
  errors.visitType = form.visitType ? '' : 'يرجى اختيار نوع الزيارة'
  errors.cardNumber = ''
  errors.expiryDate = ''
  errors.cvv = ''

  if (form.paymentMethod === 'card') {
    errors.cardNumber = form.cardNumber.trim() ? '' : 'يرجى إدخال رقم البطاقة'
    errors.expiryDate = form.expiryDate.trim() ? '' : 'يرجى إدخال تاريخ الانتهاء'
    errors.cvv = form.cvv.trim() ? '' : 'يرجى إدخال رمز الأمان'
  }

  return !Object.values(errors).some(Boolean)
}

const reviewBooking = async () => {
  if (!validate()) {
    return
  }

  bookingSummary.value = {
    ...bookingSummary.value,
    doctorId: String(doctorId),
    doctorName: doctor.value?.name ?? '',
    specialty: bookingSummary.value?.specialty || doctor.value?.specialtyName || '',
    visitType: form.visitType,
    paymentMethod: form.paymentMethod,
    fee: doctor.value?.price ?? bookingSummary.value?.fee ?? '',
  }

  await navigateTo(`/patient/booking/${doctorId}/step3`)
}

watch(
  () => form.visitType,
  (visitType) => {
    if (visitType === 'remote') {
      form.paymentMethod = 'card'
    }
  },
)

watch(
  () => form.chronicDisease,
  (chronicDisease) => {
    if (chronicDisease !== 'yes') {
      form.bloodPressure = ''
    }
  },
)
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
  margin: 0 auto 34px;
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
  width: min(100%, 700px);
  margin: 0 auto 36px;
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
}

.step-circle {
  display: grid;
  width: 48px;
  height: 48px;
  place-items: center;
  color: #1d4ed8;
  font-size: 1.1rem;
  font-weight: 800;
  background: rgba(255, 255, 255, 0.96);
  border: 2px solid rgba(59, 130, 246, 0.82);
  border-radius: 999px;
  box-shadow: 0 10px 24px rgba(37, 99, 235, 0.12);
}

.step.active .step-circle {
  color: #ffffff;
  background: linear-gradient(145deg, #2563eb, #0ea5e9);
  border-color: #2563eb;
  box-shadow: 0 14px 30px rgba(37, 99, 235, 0.28);
}

.step-label {
  font-size: 0.95rem;
  font-weight: 700;
}

.form-card,
.empty-state {
  width: min(100%, 900px);
  margin: 0 auto;
  padding: clamp(24px, 4vw, 34px);
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.94), rgba(248, 251, 255, 0.82));
  border: 1px solid rgba(59, 130, 246, 0.28);
  border-radius: 24px;
  box-shadow: 0 24px 70px rgba(15, 31, 61, 0.1);
  backdrop-filter: blur(18px);
}

.card-header {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 28px;
}

.header-title {
  display: inline-flex;
  align-items: center;
  flex-direction: row-reverse;
  gap: 12px;
}

.header-title h2 {
  margin: 0;
  color: #172b4d;
  font-size: clamp(1.35rem, 2.6vw, 1.7rem);
  font-weight: 800;
}

.header-icon,
.empty-icon {
  display: grid;
  width: 42px;
  height: 42px;
  place-items: center;
  color: #2563eb;
  background: rgba(239, 246, 255, 0.82);
  border: 1px solid rgba(59, 130, 246, 0.62);
  border-radius: 14px;
}

.payment-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 22px;
  margin-bottom: 28px;
  direction: ltr;
}

.payment-option {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 18px;
  height: 74px;
  color: #1f2d45;
  font: inherit;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.84);
  border: 1px solid rgba(148, 163, 184, 0.42);
  border-radius: 14px;
  box-shadow: 0 10px 28px rgba(15, 31, 61, 0.04);
  transition: transform 0.22s ease, border-color 0.22s ease, box-shadow 0.22s ease, color 0.22s ease, background 0.22s ease, opacity 0.22s ease;
}

.payment-option:first-child {
  order: 2;
}

.payment-option:last-child {
  order: 1;
}

.payment-option svg {
  color: #738095;
  transition: color 0.22s ease, transform 0.22s ease;
}

.payment-option:hover {
  transform: translateY(-2px);
  border-color: rgba(59, 130, 246, 0.58);
  box-shadow: 0 16px 34px rgba(37, 99, 235, 0.12);
}

.payment-option.selected {
  color: #10203f;
  background: linear-gradient(145deg, #ffffff, #f8fbff);
  border-color: #2563eb;
  box-shadow: 0 16px 34px rgba(37, 99, 235, 0.13);
}

.payment-option.selected svg {
  color: #2563eb;
  transform: scale(1.06);
}

.payment-option.disabled {
  cursor: not-allowed;
  opacity: 0.48;
  filter: grayscale(0.25);
  box-shadow: none;
}

.payment-option.disabled:hover {
  transform: none;
  border-color: rgba(148, 163, 184, 0.42);
}

.remote-warning {
  margin: -12px 0 22px;
  color: #1d4ed8;
  font-size: 0.93rem;
  font-weight: 700;
  text-align: right;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 24px 28px;
}

.symptoms-field.align-right {
  grid-column: 2 / 3;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 9px;
}

.field span {
  color: #243b62;
  font-size: 0.95rem;
  font-weight: 700;
  text-align: right;
}

.field input,
.field select {
  width: 100%;
  height: 54px;
  padding: 0 16px;
  color: #172b4d;
  font: inherit;
  font-weight: 600;
  background: #ffffffd1;
  border: 1px solid #94a3b86b;
  border-radius: 14px;
  outline: none;
  box-shadow: inset 0 1px 0 #ffffffc7;
  transition: border-color 0.22s ease, box-shadow 0.22s ease, background 0.22s ease;
}

.field-input {
  direction: rtl;
  text-align: right;

}
.field select {
  cursor: pointer;
}

.field input::placeholder {
  color: #6f7d92;
  font-weight: 500;
}

.field input:focus,
.field select:focus {
  background: #ffffff;
  border-color: #3b82f6;
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.14), 0 12px 26px rgba(37, 99, 235, 0.08);
}

.field input.invalid,
.field select.invalid {
  border-color: #ef4444;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.field small {
  min-height: 16px;
  color: #dc2626;
  font-size: 0.8rem;
  font-weight: 700;
}

.cash-info,
.card-details {
  margin-top: 36px;
  padding: 28px 34px;
  background: linear-gradient(135deg, rgba(239, 246, 255, 0.84), rgba(255, 255, 255, 0.88));
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 18px;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.78), 0 16px 36px rgba(37, 99, 235, 0.08);
}

.cash-info {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 28px;
  min-height: 158px;
  text-align: right;
}

.cash-info h3,
.card-details h3 {
  margin: 0 0 10px;
  color: #10203f;
  font-size: 1.35rem;
  font-weight: 800;
}

.cash-info p,
.card-details p {
  margin: 0;
  color: #334155;
  font-weight: 600;
}

.cash-icon {
  display: grid;
  width: 72px;
  height: 72px;
  place-items: center;
  color: #2563eb;
  background: rgba(219, 234, 254, 0.8);
  border-radius: 18px;
}

.card-details-head {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 28px;
  margin-bottom: 24px;
  text-align: right;
}

.card-large-icon {
  color: #2563eb;
}

.card-fields {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px 24px;
}

.full-field {
  grid-column: 1 / -1;
}

.input-with-icon {
  position: relative;
}

.input-with-icon input {
  padding-inline-end: 46px;
}

.input-with-icon svg {
  position: absolute;
  top: 50%;
  right: 16px;
  color: #2563eb;
  transform: translateY(-50%);
  pointer-events: none;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 22px;
  margin-top: 34px;
}

.next-button,
.secondary-button,
.empty-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 190px;
  height: 56px;
  padding: 0 28px;
  font: inherit;
  font-weight: 800;
  text-decoration: none;
  border-radius: 14px;
  transition: transform 0.24s ease, box-shadow 0.24s ease, background 0.24s ease;
}

.next-button,
.empty-button {
  color: #ffffff;
  cursor: pointer;
  background: linear-gradient(135deg, #2563eb 0%, #0ea5e9 100%);
  border: 0;
  box-shadow: 0 16px 30px rgba(37, 99, 235, 0.28);
}

.secondary-button {
  gap: 12px;
  color: #10203f;
  background: rgba(255, 255, 255, 0.82);
  border: 1px solid rgba(59, 130, 246, 0.48);
}

.secondary-button svg {
  transition: transform 0.24s ease;
}

.next-button:hover,
.secondary-button:hover,
.empty-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 22px 38px rgba(37, 99, 235, 0.24);
}

.secondary-button:hover svg {
  transform: translateX(-4px);
}

.empty-shell {
  display: grid;
  min-height: 72vh;
  place-items: center;
}

.empty-state {
  display: grid;
  width: min(100%, 520px);
  justify-items: center;
  gap: 18px;
  text-align: center;
}

.empty-icon {
  width: 64px;
  height: 64px;
  border-radius: 20px;
}

.empty-state h1 {
  margin: 0;
  color: #10203f;
  font-size: clamp(1.6rem, 4vw, 2.25rem);
}

.fade-slide-enter-active,
.fade-slide-leave-active,
.section-swap-enter-active,
.section-swap-leave-active {
  transition: opacity 0.22s ease, transform 0.22s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to,
.section-swap-enter-from,
.section-swap-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

@media (max-width: 720px) {
  .booking-shell {
    padding: 24px 14px 54px;
  }

  .step-label {
    max-width: 92px;
    font-size: 0.82rem;
    line-height: 1.35;
    text-align: center;
  }

  .form-card {
    border-radius: 22px;
  }

  .payment-grid,
  .form-grid,
  .card-fields {
    grid-template-columns: 1fr;
  }

  .symptoms-field.align-right {
    grid-column: auto;
  }

  .payment-grid {
    direction: rtl;
  }

  .cash-info,
  .card-details-head {
    align-items: flex-start;
    flex-direction: column;
    gap: 16px;
  }

  .form-actions {
    flex-direction: column;
  }

  .next-button,
  .secondary-button {
    width: 100%;
  }
}

@media (max-width: 430px) {
  .booking-header h1 {
    font-size: 2rem;
  }

  .step-circle {
    width: 42px;
    height: 42px;
  }

  .step-line {
    top: 20px;
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
  margin: 0 auto 24px;
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

.form-card,
.empty-state {
  width: min(100%, 780px);
  padding: clamp(18px, 3vw, 26px);
  border-radius: 18px;
  box-shadow: 0 18px 48px rgba(15, 31, 61, 0.09);
}

.card-header {
  margin-bottom: 18px;
}

.header-title {
  gap: 9px;
}

.header-title h2 {
  font-size: clamp(1.1rem, 2vw, 1.36rem);
}

.header-icon,
.empty-icon {
  width: 36px;
  height: 36px;
  border-radius: 12px;
}

.payment-grid {
  gap: 16px;
  margin-bottom: 20px;
}

.payment-option {
  gap: 12px;
  height: 58px;
  font-size: 0.92rem;
  border-radius: 12px;
}

.remote-warning {
  margin: -8px 0 16px;
  font-size: 0.86rem;
}

.form-grid {
  gap: 16px 18px;
}

.field {
  gap: 7px;
}

.field span {
  font-size: 0.86rem;
}

.field input,
.field select {
  height: 44px;
  padding: 0 13px;
  border-radius: 11px;
}

.cash-info,
.card-details {
  margin-top: 24px;
  padding: 20px 24px;
  border-radius: 15px;
}

.cash-info {
  gap: 18px;
  min-height: 118px;
}

.cash-info h3,
.card-details h3 {
  margin-bottom: 7px;
  font-size: 1.12rem;
}

.cash-info p,
.card-details p {
  font-size: 0.9rem;
}

.cash-icon {
  width: 56px;
  height: 56px;
  border-radius: 15px;
}

.card-details-head {
  gap: 18px;
  margin-bottom: 18px;
}

.card-fields {
  gap: 16px 18px;
}

.form-actions {
  gap: 14px;
  margin-top: 24px;
}

.next-button,
.secondary-button,
.empty-button {
  min-width: 156px;
  height: 46px;
  padding: 0 22px;
  border-radius: 12px;
}

.empty-state {
  width: min(100%, 460px);
  gap: 14px;
}

@media (max-width: 720px) {
  .booking-shell {
    padding: 18px 12px 38px;
  }

  .booking-header {
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

  .payment-grid,
  .form-grid,
  .card-fields {
    gap: 14px;
  }

  .cash-info,
  .card-details-head {
    gap: 12px;
  }
}
</style>

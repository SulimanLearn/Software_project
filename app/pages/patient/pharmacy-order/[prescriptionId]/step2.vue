<template>
  <NavBar />

  <section class="booking-page" dir="rtl">
    <div class="ambient ambient-one" aria-hidden="true"></div>
    <div class="ambient ambient-two" aria-hidden="true"></div>

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
          :class="{ active: step.number === 2, completed: step.number < 2 }"
        >
          <span class="step-circle">{{ step.number }}</span>
          <span class="step-label">{{ step.label }}</span>
        </div>
      </nav>

      <form class="form-card" novalidate @submit.prevent="reviewOrder">
        <div class="card-header">
          <div class="header-title">
            <span class="header-icon" aria-hidden="true">
              <Truck :size="22" stroke-width="2" />
            </span>
            <h2>تفاصيل الطلب والتوصيل</h2>
          </div>
        </div>

        <section class="subsection" aria-labelledby="medications-title">
          <h3 id="medications-title">الأدوية من الوصفة</h3>
          <div class="medicine-list">
            <article v-for="medication in prescription.medications" :key="medication.name" class="medicine-item">
              <strong>{{ medication.name }}</strong>
              <dl>
                <div><dt>الجرعة</dt><dd>{{ medication.dosage }}</dd></div>
                <div><dt>التكرار</dt><dd>{{ medication.frequency }}</dd></div>
                <div><dt>المدة</dt><dd>{{ medication.duration }}</dd></div>
                <div><dt>التعليمات</dt><dd>{{ medication.instructions }}</dd></div>
                <div><dt>الكمية</dt><dd>{{ medication.quantity || 'حسب الوصفة' }}</dd></div>
              </dl>
            </article>
          </div>
        </section>

        <div class="payment-grid" aria-label="طريقة الدفع">
          <button
            type="button"
            class="payment-option"
            :class="{ selected: form.paymentMethod === 'cash' }"
            @click="selectPayment('cash')"
          >
            <Banknote :size="25" stroke-width="2.1" />
            <span>الدفع نقداً عند الاستلام</span>
          </button>

          <button
            type="button"
            class="payment-option"
            :class="{ selected: form.paymentMethod === 'card' }"
            @click="selectPayment('card')"
          >
            <CreditCard :size="25" stroke-width="2.1" />
            <span>الدفع بالبطاقة الآن</span>
          </button>
        </div>

        <div class="form-grid">
          <label class="field full-field">
            <span>عنوان التوصيل</span>
            <input
              v-model="form.deliveryAddress"
              type="text"
              :class="{ invalid: errors.deliveryAddress }"
              placeholder="غزة، الرمال، شارع عمر المختار"
              @input="clearError('deliveryAddress')"
            >
            <small v-if="errors.deliveryAddress">{{ errors.deliveryAddress }}</small>
          </label>

          <label class="field">
            <span>وقت التوصيل المفضل</span>
            <input v-model="form.preferredTime" type="text" placeholder="06:00 م">
          </label>

          <label class="field full-field">
            <span>ملاحظات للصيدلية</span>
            <textarea v-model="form.notes" rows="4" placeholder="أي ملاحظات حول التوصيل أو توفر الدواء"></textarea>
          </label>
        </div>

        <Transition name="section-swap" mode="out-in">
          <section v-if="form.paymentMethod === 'card'" class="card-details" aria-labelledby="card-details-title">
            <div class="card-details-head">
              <div>
                <h3 id="card-details-title">تفاصيل البطاقة</h3>
                <p>سيتم دفع قيمة الطلب بالبطاقة الآن قبل إرساله للصيدلية</p>
              </div>
              <span class="card-large-icon" aria-hidden="true">
                <CreditCard :size="58" stroke-width="1.8" />
              </span>
            </div>

            <div class="card-fields">
              <label class="field full-field">
                <span>اسم حامل البطاقة</span>
                <div class="input-with-icon">
                  <input
                    v-model="form.cardholderName"
                    type="text"
                    autocomplete="cc-name"
                    placeholder="محمد أبو حليمة"
                    :class="{ invalid: errors.cardholderName }"
                    @input="clearError('cardholderName')"
                  >
                  <UserRound :size="18" stroke-width="2" />
                </div>
                <small v-if="errors.cardholderName">{{ errors.cardholderName }}</small>
              </label>

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
            </div>
          </section>
        </Transition>

        <div class="form-actions">
          <NuxtLink class="secondary-button" :to="`/patient/pharmacy-order/${prescription.number}`">
            <span>السابق</span>
            <ArrowRight :size="18" stroke-width="2.4" />
          </NuxtLink>
          <button class="next-button" type="submit">مراجعة الطلب</button>
        </div>
      </form>
    </div>

    <div v-else class="booking-shell empty-shell">
      <div class="empty-state">
        <span class="empty-icon" aria-hidden="true">
          <Pill :size="30" stroke-width="1.9" />
        </span>
        <h1>لم يتم العثور على وصفة صالحة</h1>
        <NuxtLink class="empty-button" to="/patient/prescriptions">العودة إلى الوصفات</NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, reactive } from 'vue'
import {
  ArrowRight,
  Banknote,
  CalendarDays,
  CreditCard,
  LockKeyhole,
  Pill,
  Truck,
  UserRound
} from '@lucide/vue'

definePageMeta({
  title: 'إتمام طلب الدواء - تفاصيل الطلب والتوصيل'
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

const form = reactive({
  deliveryAddress: orderState.value?.deliveryAddress || patientInfo.value.address,
  preferredTime: orderState.value?.preferredTime || '',
  notes: orderState.value?.notes || '',
  paymentMethod: orderState.value?.paymentMethod || 'cash',
  cardholderName: orderState.value?.cardPayment?.cardholderName || '',
  cardNumber: orderState.value?.cardPayment?.cardNumber || '',
  expiryDate: orderState.value?.cardPayment?.expiryDate || '',
  cvv: ''
})

const errors = reactive({
  deliveryAddress: '',
  paymentMethod: '',
  cardholderName: '',
  cardNumber: '',
  expiryDate: '',
  cvv: ''
})

const clearError = (field) => {
  errors[field] = ''
}

const selectPayment = (method) => {
  form.paymentMethod = method
  clearError('paymentMethod')

  if (method === 'cash') {
    errors.cardholderName = ''
    errors.cardNumber = ''
    errors.expiryDate = ''
    errors.cvv = ''
  }
}

const normalizeDigits = (value) => String(value)
  .replace(/[٠-٩]/g, digit => String(digit.charCodeAt(0) - 1632))
  .replace(/[۰-۹]/g, digit => String(digit.charCodeAt(0) - 1776))

const onlyDigits = (value, maxLength) => normalizeDigits(value)
  .replace(/\D/g, '')
  .slice(0, maxLength)

const handleNumericInput = (field, event, maxLength) => {
  const value = onlyDigits(event.target.value, maxLength)

  form[field] = value
  event.target.value = value
  clearError(field)
}

const handleCardNumberInput = (event) => {
  const value = onlyDigits(event.target.value, 16).replace(/(\d{4})(?=\d)/g, '$1 ')

  form.cardNumber = value
  event.target.value = value
  clearError('cardNumber')
}

const handleExpiryInput = (event) => {
  const digits = onlyDigits(event.target.value, 4)
  const value = digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits

  form.expiryDate = value
  event.target.value = value
  clearError('expiryDate')
}

const validate = () => {
  errors.deliveryAddress = form.deliveryAddress.trim() ? '' : 'يرجى إدخال عنوان التوصيل'
  errors.paymentMethod = form.paymentMethod ? '' : 'يرجى اختيار طريقة الدفع'
  errors.cardholderName = ''
  errors.cardNumber = ''
  errors.expiryDate = ''
  errors.cvv = ''

  if (form.paymentMethod === 'card') {
    errors.cardholderName = form.cardholderName.trim() ? '' : 'يرجى إدخال اسم حامل البطاقة'
    errors.cardNumber = onlyDigits(form.cardNumber, 16).length === 16 ? '' : 'يرجى إدخال رقم بطاقة صحيح'
    errors.expiryDate = onlyDigits(form.expiryDate, 4).length === 4 ? '' : 'يرجى إدخال تاريخ الانتهاء'
    errors.cvv = form.cvv.trim().length === 3 ? '' : 'يرجى إدخال رمز الأمان'
  }

  return !Object.values(errors).some(Boolean)
}

const reviewOrder = async () => {
  if (!hasValidPrescription.value || !validate()) {
    return
  }

  orderState.value = {
    ...orderState.value,
    patient: patientInfo.value,
    prescription: prescription.value,
    specialty: specialty.value,
    diagnosis: prescription.value?.diagnosis || relatedRecord.value?.diagnosis || '',
    medications: prescription.value?.medications || [],
    deliveryAddress: form.deliveryAddress.trim(),
    preferredTime: form.preferredTime.trim(),
    notes: form.notes.trim(),
    paymentMethod: form.paymentMethod,
    cardPayment: form.paymentMethod === 'card'
      ? {
          cardholderName: form.cardholderName.trim(),
          cardNumber: form.cardNumber,
          expiryDate: form.expiryDate
        }
      : null
  }

  await navigateTo(`/patient/pharmacy-order/${prescription.value.number}/step3`)
}
</script>

<style scoped>
@import "./pharmacy-order.css";
</style>

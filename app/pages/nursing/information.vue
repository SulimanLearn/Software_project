<template>
  <div>
    <NavBar />

    <section class="information-page" dir="rtl">
      <div class="information-shell">
        <div class="top-bar">
          <button class="back-button" type="button" @click="goBack">
            <ArrowRight :size="22" stroke-width="2.7" aria-hidden="true" />
            <span>رجوع</span>
          </button>
        </div>

        <header class="page-hero">
          <h1>أدخل معلوماتك الشخصية</h1>
          <p>أكمل بياناتك الصحية والشخصية لنتمكن من تقديم الرعاية المناسبة لك</p>
        </header>

        <nav class="booking-stepper" aria-label="خطوات حجز خدمة التمريض">
          <div
            v-for="step in steps"
            :key="step.number"
            class="booking-step"
            :class="{
              active: step.number === 3,
              completed: step.number < 3,
            }"
          >
            <span class="step-circle">{{ step.number }}</span>
            <span class="step-label">{{ step.label }}</span>
          </div>
        </nav>

        <div class="information-layout">
          <main class="form-card">
            <form class="patient-form" novalidate @submit.prevent="submitForm">
              <div class="form-grid">
                <div class="field-group">
                  <label for="fullName">الاسم الكامل</label>
                  <input
                    id="fullName"
                    v-model.trim="form.fullName"
                    type="text"
                    placeholder="أدخل اسمك الكامل"
                    :class="{ invalid: errors.fullName }"
                  >
                  <p v-if="errors.fullName" class="error-message">{{ errors.fullName }}</p>
                </div>

                <div class="field-group">
                  <label for="phone">رقم الهاتف</label>
                  <input
                    id="phone"
                    v-model.trim="form.phone"
                    type="tel"
                    inputmode="tel"
                    :placeholder="phonePlaceholder"
                    :class="{ invalid: errors.phone }"
                  >
                  <p v-if="errors.phone" class="error-message">{{ errors.phone }}</p>
                </div>

                <div class="field-group">
                  <label for="gender">الجنس</label>
                  <select
                    id="gender"
                    v-model="form.gender"
                    :class="{ invalid: errors.gender }"
                  >
                    <option value="" disabled>اختر الجنس</option>
                    <option value="male">ذكر</option>
                    <option value="female">أنثى</option>
                  </select>
                  <p v-if="errors.gender" class="error-message">{{ errors.gender }}</p>
                </div>

                <div class="field-group">
                  <label for="preferredTime">وقت الزيارة</label>
                  <select
                    id="preferredTime"
                    v-model="form.preferredTime"
                    :class="{ invalid: errors.preferredTime }"
                  >
                    <option value="" disabled>اختر الوقت المناسب</option>
                    <option v-for="time in timeOptions" :key="time" :value="time">
                      {{ time }}
                    </option>
                  </select>
                  <p v-if="errors.preferredTime" class="error-message">{{ errors.preferredTime }}</p>
                </div>

                <div class="field-group">
                  <label for="conditionDescription">وصف الحالة</label>
                  <textarea
                    id="conditionDescription"
                    v-model.trim="form.conditionDescription"
                    rows="3"
                    placeholder="اكتب وصف الحالة باختصار"
                    :class="{ invalid: errors.conditionDescription }"
                  ></textarea>
                  <p v-if="errors.conditionDescription" class="error-message">
                    {{ errors.conditionDescription }}
                  </p>
                </div>

                <div class="field-group allergy-group">
                  <span class="field-label">
                    هل لديك حساسيات من أدوية أو مواد معينة؟
                    <CircleHelp :size="18" stroke-width="2.3" aria-hidden="true" />
                  </span>
                  <div class="radio-row" :class="{ invalid: errors.hasAllergy }">
                    <label>
                      <input v-model="form.hasAllergy" type="radio" value="yes">
                      <span>نعم</span>
                    </label>
                    <label>
                      <input v-model="form.hasAllergy" type="radio" value="no">
                      <span>لا</span>
                    </label>
                  </div>
                  <p v-if="errors.hasAllergy" class="error-message">{{ errors.hasAllergy }}</p>
                </div>

                <Transition name="allergy-details">
                  <div v-if="form.hasAllergy === 'yes'" class="field-group allergy-details-group">
                    <label for="allergyDetails">تفاصيل الحساسية</label>
                    <textarea
                      id="allergyDetails"
                      v-model.trim="form.allergyDetails"
                      rows="3"
                      placeholder="اكتب الأدوية أو المواد التي لديك حساسية منها"
                      :class="{ invalid: errors.allergyDetails }"
                    ></textarea>
                    <p v-if="errors.allergyDetails" class="error-message">{{ errors.allergyDetails }}</p>
                  </div>
                </Transition>

                <div class="field-group upload-group">
                  <label for="attachment">إرفاق تقارير أو صور (اختياري)</label>
                  <div class="upload-control">
                    <input
                      id="attachment"
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      @change="handleAttachment"
                    >
                    <span class="file-name">{{ form.attachmentName || 'لم يتم اختيار أي ملف' }}</span>
                    <span class="upload-button">
                      <Upload :size="17" stroke-width="2.4" aria-hidden="true" />
                      اختر ملف
                    </span>
                  </div>
                  <p class="helper-text">يمكنك رفع صور أو تقارير طبية (PDF, JPG, PNG)</p>
                </div>
              </div>

              <div class="form-actions">
                <button class="next-button" type="submit">
                  <span>التالي</span>
                  <ArrowLeft :size="22" stroke-width="2.7" aria-hidden="true" />
                </button>
              </div>
            </form>
          </main>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, reactive } from 'vue'
import {
  ArrowLeft,
  ArrowRight,
  CircleHelp,
  Upload,
} from '@lucide/vue'

definePageMeta({
  title: 'معلومات حجز التمريض',
})

const steps = [
  { number: 1, label: 'اختيار الممرض' },
  { number: 2, label: 'الخدمة' },
  { number: 3, label: 'المعلومات' },
  { number: 4, label: 'الموقع' },
  { number: 5, label: 'الدفع' },
  { number: 6, label: 'مراجعة الطلب' },
]

const bookingState = useState('nursingBooking', () => ({}))
const selectedNurse = computed(() => bookingState.value?.nurse || null)
const selectedService = computed(() => bookingState.value?.service || null)

if (!selectedNurse.value || !selectedService.value) {
  await navigateTo('/nursing/select-nurse')
}

const existingInfo = bookingState.value?.patientInfo || {}
const phonePlaceholder = '05xxxxxxxx'

const timeOptions = [
  '08:00',
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00',
  '19:00',
  '20:00',
  '21:00',
]

const form = reactive({
  fullName: existingInfo.fullName || '',
  phone: existingInfo.phone || '',
  gender: existingInfo.gender || '',
  preferredTime: existingInfo.preferredTime || bookingState.value?.selectedTime || '',
  conditionDescription: existingInfo.conditionDescription || '',
  hasAllergy: existingInfo.hasAllergy || '',
  allergyDetails: existingInfo.allergyDetails || '',
  attachmentName: existingInfo.attachmentName || '',
})

const errors = reactive({
  fullName: '',
  phone: '',
  gender: '',
  preferredTime: '',
  conditionDescription: '',
  hasAllergy: '',
  allergyDetails: '',
})

const clearErrors = () => {
  Object.keys(errors).forEach((key) => {
    errors[key] = ''
  })
}

const validateForm = () => {
  clearErrors()

  if (!form.fullName) {
    errors.fullName = 'الاسم الكامل مطلوب'
  }

  if (!form.phone) {
    errors.phone = 'رقم الهاتف مطلوب'
  }

  if (!form.gender) {
    errors.gender = 'يرجى اختيار الجنس'
  }

  if (!form.preferredTime) {
    errors.preferredTime = 'يرجى اختيار وقت الزيارة'
  }

  if (!form.conditionDescription) {
    errors.conditionDescription = 'وصف الحالة مطلوب'
  }

  if (!form.hasAllergy) {
    errors.hasAllergy = 'يرجى اختيار نعم أو لا'
  }

  if (form.hasAllergy === 'yes' && !form.allergyDetails) {
    errors.allergyDetails = 'يرجى كتابة تفاصيل الحساسية'
  }

  return !Object.values(errors).some(Boolean)
}

const handleAttachment = (event) => {
  const [file] = event.target.files || []
  form.attachmentName = file?.name || ''
}

const savePatientInfo = () => {
  bookingState.value = {
    ...bookingState.value,
    patientInfo: {
      fullName: form.fullName,
      phone: form.phone,
      gender: form.gender,
      preferredTime: form.preferredTime,
      conditionDescription: form.conditionDescription,
      hasAllergy: form.hasAllergy,
      allergyDetails: form.hasAllergy === 'yes' ? form.allergyDetails : '',
      attachmentName: form.attachmentName,
    },
    selectedTime: form.preferredTime,
    time: form.preferredTime,
  }
}

const submitForm = async () => {
  if (!validateForm()) {
    return
  }

  savePatientInfo()
  await navigateTo('/nursing/location')
}

const goBack = async () => {
  await navigateTo('/nursing/service')
}
</script>

<style scoped>
.information-page {
  min-height: 100vh;
  background:
    radial-gradient(circle at 12% 8%, #2463eb17, transparent 27%),
    radial-gradient(circle at 92% 14%, #0ea5e91c, transparent 24%),
    linear-gradient(180deg, #f8fbff 0%, #ffffff 48%, #f5f9ff 100%);
  color: #061f4a;
  font-family: "Tajawal", sans-serif;
}

.information-shell {
  width: min(100%, 1140px);
  margin: 0 auto;
  padding: 24px 20px 46px;
}

.top-bar {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 14px;
}

.back-button,
.next-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  border: 0;
  font-family: inherit;
  font-weight: 900;
  cursor: pointer;
  transition: transform 0.22s ease, box-shadow 0.22s ease, background 0.22s ease;
}

.back-button {
  min-width: 112px;
  padding: 10px 18px;
  color: #0a2a67;
  background: #ffffff;
  border: 1px solid #cdddf3;
  border-radius: 14px;
  box-shadow: 0 14px 34px rgba(15, 31, 61, 0.06);
  font-size: 1rem;
}

.back-button:hover {
  transform: translateY(-2px);
  background: #f4f8ff;
}

.page-hero {
  margin-bottom: 20px;
  text-align: center;
}

.page-hero h1 {
  margin: 0;
  color: #061f4a;
  font-size: clamp(1.85rem, 3.8vw, 2.8rem);
  font-weight: 900;
  line-height: 1.18;
}

.page-hero p {
  max-width: 640px;
  margin: 8px auto 0;
  color: #66748d;
  font-size: clamp(0.9rem, 1.7vw, 1.02rem);
  font-weight: 700;
  line-height: 1.8;
}

.booking-stepper {
  position: relative;
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 0;
  margin: 0 auto 24px;
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
  transition: background 0.25s ease;
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

.information-layout {
  display: flex;
  justify-content: center;
  direction: rtl;
}

.form-card {
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid #dce8f8;
  border-radius: 22px;
  box-shadow: 0 18px 44px rgba(29, 78, 216, 0.09);
}

.next-button {
  min-width: 160px;
  padding: 13px 20px;
  color: #ffffff;
  background: linear-gradient(135deg, #0c64ec 0%, #2294ff 100%);
  border-radius: 14px;
  box-shadow: 0 18px 32px rgba(26, 115, 248, 0.24);
  font-size: 1.1rem;
}

.next-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 22px 38px rgba(26, 115, 248, 0.3);
}

.form-card {
  width: min(100%, 900px);
  padding: 28px 30px;
}

.patient-form {
  display: grid;
  gap: 24px;
  margin: 0;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px 24px;
}

.field-group label,
.field-label {
  padding-bottom: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: flex-start;
  gap: 6px;
  color: #243858;
  font-size: 0.95rem;
  font-weight: 900;
  line-height: 1.25;
  text-align: right;
}

.field-label svg {
  color: #1267e8;
}

input,
select,
textarea {
  width: 100%;
  border: 1px solid #dce8f8;
  border-radius: 10px;
  background: #f8fbff;
  color: #10264c;
  font-family: inherit;
  font-size: 1rem;
  font-weight: 800;
  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
}

input {
  min-height: 56px;
  padding: 0 18px;
}

select {
  min-height: 52px;
  padding: 0 16px 0 48px;
  appearance: none;
  direction: rtl;
  line-height: 52px;
  text-align: right;
  text-align-last: right;
  background-color: #f8fbff;
  background-image: linear-gradient(45deg, transparent 50%, #2563eb 50%), linear-gradient(135deg, #2563eb 50%, transparent 50%);
  background-position: 27px 50%, 20px 50%;
  background-repeat: no-repeat;
  background-size: 7px 7px, 7px 7px;
}

textarea {
  min-height: 106px;
  padding: 16px 18px;
  resize: vertical;
}

input::placeholder,
textarea::placeholder {
  color: #8a9ab4;
}

input:focus,
select:focus,
textarea:focus {
  border-color: #1a73f8;
  background: #ffffff;
  box-shadow: 0 0 0 4px rgba(26, 115, 248, 0.11);
}

input.invalid,
select.invalid,
textarea.invalid,
.radio-row.invalid {
  border-color: #ef4444;
}

.allergy-group,
.allergy-details-group,
.upload-group {
  align-self: start;
}

.allergy-details-group {
  grid-column: 1 / -1;
}

.allergy-details-enter-active,
.allergy-details-leave-active {
  overflow: hidden;
  transition: opacity 0.24s ease, transform 0.24s ease, max-height 0.24s ease;
}

.allergy-details-enter-from,
.allergy-details-leave-to {
  max-height: 0;
  opacity: 0;
  transform: translateY(-8px);
}

.allergy-details-enter-to,
.allergy-details-leave-from {
  max-height: 180px;
  opacity: 1;
  transform: translateY(0);
}

.radio-row {
  display: flex;
  min-height: 56px;
  align-items: center;
  gap: 34px;
  padding: 0 4px;
  border: 1px solid transparent;
  border-radius: 10px;
}

.radio-row label {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: #2b3d5f;
  font-weight: 900;
}

.radio-row input {
  width: 20px;
  min-height: auto;
  height: 20px;
  accent-color: #1a73f8;
}

.upload-control {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  min-height: 56px;
  overflow: hidden;
  border: 1px solid #dce8f8;
  border-radius: 10px;
  background: #f8fbff;
}

.upload-control input {
  position: absolute;
  inset: 0;
  z-index: 2;
  opacity: 0;
  cursor: pointer;
}

.file-name {
  min-width: 0;
  padding: 0 18px;
  color: #66748d;
  font-weight: 800;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.upload-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 34px;
  margin-inline-end: 8px;
  padding: 0 16px;
  color: #1267e8;
  background: #eef5ff;
  border: 1px solid #dce8f8;
  border-radius: 9px;
  font-weight: 900;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  padding-top: 4px;
}

.helper-text,
.error-message {
  margin: 0;
  font-size: 0.78rem;
  font-weight: 800;
}

.helper-text {
  color: #7c8aa3;
}

.error-message {
  color: #dc2626;
}

@media (max-width: 980px) {
  .information-layout {
    display: block;
  }
}

@media (max-width: 720px) {
  .information-shell {
    padding: 22px 14px 42px;
  }

  .top-bar {
    margin-bottom: 18px;
  }

  .booking-stepper {
    overflow-x: auto;
    grid-template-columns: repeat(6, minmax(76px, 1fr));
    margin-bottom: 22px;
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

  .form-card {
    padding: 22px 16px;
    border-radius: 14px;
  }

  .form-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .field-group:nth-child(3) {
    justify-items: stretch;
  }

  .field-group:nth-child(3) label,
  .field-group:nth-child(3) .error-message,
  select {
    width: 100%;
  }

  .page-hero {
    margin-bottom: 18px;
  }

  .page-hero h1 {
    font-size: 1.8rem;
  }

  .back-button {
    width: 100%;
  }

  .form-actions {
    justify-content: stretch;
  }

  .next-button {
    width: 100%;
  }
}
</style>

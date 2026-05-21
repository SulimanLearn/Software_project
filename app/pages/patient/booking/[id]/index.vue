<template>
  <NavBar />
  <section class="booking-page" dir="rtl">
    <div class="ambient ambient-one" aria-hidden="true"></div>
    <div class="ambient ambient-two" aria-hidden="true"></div>

    <div v-if="doctor" class="booking-shell">
      <NuxtLink class="back-button" :to="`/doctors/${doctor.id}`" aria-label="العودة لصفحة الطبيب">
        <ArrowLeft class="back-icon" :size="16" stroke-width="2.2" />
        <span>العودة لصفحة الطبيب</span>
      </NuxtLink>

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

      <form class="form-card" @submit.prevent="goNext">
        <div class="card-header">
          <div class="header-title">
            <span class="header-icon" aria-hidden="true">
              <UserRound :size="22" stroke-width="2" />
            </span>
            <h2>البيانات الشخصية</h2>
          </div>
        </div>

        <div class="form-grid">
          <label class="field">
            <span>الاسم الكامل</span>
            <input
              v-model="form.firstName"
              type="text"
              placeholder="أحمد محمود"
              autocomplete="given-name"
            >
          </label>

          <label class="field">
            <span>اسم العائلة</span>
            <input
              v-model="form.lastName"
              type="text"
              placeholder="محمود"
              autocomplete="family-name"
            >
          </label>

          <label class="field">
            <span>رقم الهاتف</span>
            <input
              v-model="form.phone"
              type="tel"
              placeholder="0591234567"
              autocomplete="tel"
              inputmode="tel"
            >
          </label>

          <label class="field">
            <span>البريد الإلكتروني</span>
            <input
              v-model="form.email"
              type="email"
              placeholder="ahmed@example.com"
              autocomplete="email"
            >
          </label>

          <label class="field">
            <span>العمر</span>
            <input
              v-model.number="form.age"
              type="number"
              placeholder="20"
              min="1"
              max="120"
              inputmode="numeric"
            >
          </label>

          <label class="field select-field">
            <span>الجنس</span>
            <select v-model="form.gender" aria-label="الجنس">
              <option value="" disabled>اختر الجنس</option>
              <option value="male">ذكر</option>
              <option value="female">أنثى</option>
            </select>
          </label>
        </div>

        <div class="form-actions">
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
          <UserRound :size="30" stroke-width="1.9" />
        </span>
        <h1>لم يتم العثور على الطبيب</h1>
        <NuxtLink class="empty-button" to="/doctors">العودة إلى الأطباء</NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, reactive } from 'vue'
import { ArrowLeft, UserRound } from '@lucide/vue'
import { doctors } from '~/data/doctors'

definePageMeta({
  title: 'إتمام الحجز - بيانات المريض',
})

const steps = [
  { number: 1, label: 'بيانات المريض', active: true },
  { number: 2, label: 'تفاصيل الزيارة', active: false },
  { number: 3, label: 'التأكيد', active: false },
]

const route = useRoute()
const doctorId = computed(() => String(route.params.id ?? ''))
const bookingSummary = useState(`booking-summary-${doctorId.value}`, () => ({}))
const doctor = computed(() =>
  doctors.find((item) => String(item.id) === doctorId.value),
)

const form = reactive({
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
  age: null,
  gender: '',
})

const goNext = async () => {
  bookingSummary.value = {
    ...bookingSummary.value,
    doctorId: doctorId.value,
    doctorName: doctor.value?.name ?? bookingSummary.value?.doctorName ?? '',
    specialty: doctor.value?.specialtyName ?? bookingSummary.value?.specialty ?? '',
    patientName: [form.firstName, form.lastName].filter(Boolean).join(' ').trim(),
    firstName: form.firstName,
    lastName: form.lastName,
    phone: form.phone,
    email: form.email,
    age: form.age,
    gender: form.gender,
  }

  await navigateTo(`/patient/booking/${doctorId.value}/step2`)
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
  padding: 28px 20px 76px;
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

.back-button {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  direction: ltr;
  margin-inline-start: auto;
  padding: 10px 16px;
  color: #1d4ed8;
  text-decoration: none;
  background: rgba(255, 255, 255, 0.86);
  border: 1px solid rgba(59, 130, 246, 0.25);
  border-radius: 999px;
  box-shadow: 0 10px 30px rgba(37, 99, 235, 0.08);
  transition: transform 0.25s ease, background 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
}

.back-button span {
  direction: rtl;
  font-size: 0.92rem;
  font-weight: 700;
}

.back-icon {
  flex: 0 0 auto;
  transition: transform 0.25s ease;
}

.back-button:hover {
  transform: translateY(-2px);
  background: #eff6ff;
  border-color: rgba(59, 130, 246, 0.5);
  box-shadow: 0 16px 34px rgba(37, 99, 235, 0.13);
}

.back-button:hover .back-icon {
  transform: translateX(-4px);
}

.booking-header {
  margin: 46px auto 34px;
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

.step-label {
  font-size: 0.95rem;
  font-weight: 700;
}

.step.active .step-circle {
  color: #ffffff;
  background: linear-gradient(145deg, #2563eb, #0ea5e9);
  border-color: #2563eb;
  box-shadow: 0 14px 30px rgba(37, 99, 235, 0.28);
  transform: scale(1.04);
}

.form-card {
  width: min(100%, 860px);
  margin: 0 auto;
  padding: clamp(24px, 4vw, 36px);
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.92), rgba(248, 251, 255, 0.8));
  border: 1px solid rgba(59, 130, 246, 0.3);
  border-radius: 24px;
  box-shadow: 0 24px 70px rgba(15, 31, 61, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.82);
  backdrop-filter: blur(18px);
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
  padding: clamp(32px, 6vw, 54px);
  text-align: center;
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.94), rgba(248, 251, 255, 0.84));
  border: 1px solid rgba(59, 130, 246, 0.3);
  border-radius: 24px;
  box-shadow: 0 24px 70px rgba(15, 31, 61, 0.1);
  backdrop-filter: blur(18px);
}

.empty-icon {
  display: grid;
  width: 64px;
  height: 64px;
  place-items: center;
  color: #2563eb;
  background: #eff6ff;
  border: 1px solid rgba(59, 130, 246, 0.5);
  border-radius: 20px;
}

.empty-state h1 {
  margin: 0;
  color: #10203f;
  font-size: clamp(1.6rem, 4vw, 2.25rem);
  font-weight: 800;
}

.empty-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 48px;
  padding: 0 24px;
  color: #ffffff;
  font-weight: 800;
  text-decoration: none;
  background: linear-gradient(135deg, #2563eb 0%, #0ea5e9 100%);
  border-radius: 15px;
  box-shadow: 0 16px 30px rgba(37, 99, 235, 0.26);
  transition: transform 0.24s ease, box-shadow 0.24s ease;
}

.empty-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 22px 38px rgba(37, 99, 235, 0.34);
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 26px;
}

.header-title {
  display: inline-flex;
  align-items: center;
  gap: 12px;
}

.header-title h2 {
  margin: 0;
  color: #172b4d;
  font-size: clamp(1.25rem, 2.6vw, 1.6rem);
  font-weight: 800;
}

.header-icon {
  display: grid;
  width: 42px;
  height: 42px;
  place-items: center;
  color: #2563eb;
  background: rgba(239, 246, 255, 0.8);
  border: 1px solid rgba(59, 130, 246, 0.62);
  border-radius: 14px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 22px 24px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 9px;
}

.field span {
  color: #243b62;
  font-size: 0.94rem;
  font-weight: 700;
}

.field input,
.field select {
  width: 100%;
  height: 52px;
  padding: 0 16px;
  color: #172b4d;
  font: inherit;
  font-weight: 600;
  background: rgba(239, 246, 255, 0.62);
  border: 1px solid rgba(59, 130, 246, 0.23);
  border-radius: 14px;
  outline: none;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.75);
  transition: border-color 0.22s ease, box-shadow 0.22s ease, background 0.22s ease, transform 0.22s ease;
}

.field input::placeholder {
  color: #8a98ad;
  font-weight: 500;
}

.field input:focus,
.field select:focus {
  background: #ffffff;
  border-color: #3b82f6;
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.14), 0 12px 26px rgba(37, 99, 235, 0.08);
}

.field input:hover,
.field select:hover {
  border-color: rgba(59, 130, 246, 0.5);
  background: rgba(255, 255, 255, 0.86);
}

.select-field {
  position: relative;
}

.select-field select {
  appearance: none;
  cursor: pointer;
  padding-inline-end: 16px;
  padding-inline-start: 42px;
  background-image:
    linear-gradient(45deg, transparent 50%, #2563eb 50%),
    linear-gradient(135deg, #2563eb 50%, transparent 50%);
  background-position:
    left 22px center,
    left 16px center;
  background-size: 7px 7px, 7px 7px;
  background-repeat: no-repeat;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 30px;
}

.next-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  min-width: 148px;
  height: 52px;
  padding: 0 26px;
  color: #ffffff;
  font: inherit;
  font-weight: 800;
  cursor: pointer;
  background: linear-gradient(135deg, #2563eb 0%, #0ea5e9 100%);
  border: 0;
  border-radius: 16px;
  box-shadow: 0 16px 30px rgba(37, 99, 235, 0.28);
  transition: transform 0.24s ease, box-shadow 0.24s ease, filter 0.24s ease;
}

.next-icon {
  transition: transform 0.24s ease;
}

.next-button:hover {
  transform: translateY(-3px);
  filter: saturate(1.08);
  box-shadow: 0 22px 38px rgba(37, 99, 235, 0.36);
}

.next-button:hover .next-icon {
  transform: translateX(-5px);
}

.next-button:active {
  transform: translateY(-1px);
}

@media (max-width: 720px) {
  .booking-shell {
    padding: 20px 14px 54px;
  }

  .back-button {
    padding: 9px 13px;
  }

  .booking-header {
    margin: 38px auto 30px;
  }

  .stepper {
    margin-bottom: 32px;
  }

  .step-circle {
    width: 42px;
    height: 42px;
    font-size: 1rem;
  }

  .step-line {
    top: 20px;
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

  .form-grid {
    grid-template-columns: 1fr;
    gap: 18px;
  }

  .form-actions {
    justify-content: stretch;
  }

  .next-button {
    width: 100%;
  }
}

@media (max-width: 430px) {
  .booking-header h1 {
    font-size: 2rem;
  }

  .stepper {
    width: 100%;
  }

  .step-line {
    right: 17%;
    left: 17%;
  }

  .step-label {
    font-size: 0.76rem;
  }
}

.booking-shell {
  width: min(100%, 900px);
  padding: 22px 18px 48px;
}

.ambient-one {
  width: 180px;
  height: 180px;
}

.ambient-two {
  width: 220px;
  height: 220px;
}

.back-button {
  padding: 8px 13px;
}

.back-button span {
  font-size: 0.84rem;
}

.booking-header {
  margin: 28px auto 24px;
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

.form-card {
  width: min(100%, 760px);
  padding: clamp(18px, 3vw, 26px);
  border-radius: 18px;
  box-shadow: 0 18px 48px rgba(15, 31, 61, 0.09), inset 0 1px 0 rgba(255, 255, 255, 0.82);
}

.card-header {
  margin-bottom: 18px;
}

.header-title {
  gap: 9px;
}

.header-title h2 {
  font-size: clamp(1.08rem, 2vw, 1.32rem);
}

.header-icon {
  width: 36px;
  height: 36px;
  border-radius: 12px;
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

.form-actions {
  margin-top: 22px;
}

.next-button,
.empty-button {
  min-width: 128px;
  height: 46px;
  padding: 0 21px;
  border-radius: 13px;
}

.empty-state {
  width: min(100%, 460px);
  gap: 14px;
  padding: clamp(24px, 5vw, 38px);
  border-radius: 18px;
}

.empty-icon {
  width: 52px;
  height: 52px;
  border-radius: 16px;
}

@media (max-width: 720px) {
  .booking-shell {
    padding: 16px 12px 38px;
  }

  .booking-header {
    margin: 24px auto 22px;
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

  .form-grid {
    gap: 14px;
  }
}
</style>

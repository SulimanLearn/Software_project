<template>
  <div>
    <NavBar />

    <section class="select-nurse-page" dir="rtl">
      <div class="select-nurse-shell">
        <div class="top-bar">
          <button class="back-button" type="button" @click="goBack">
            <ArrowRight :size="22" stroke-width="2.7" aria-hidden="true" />
            <span>رجوع</span>
          </button>
        </div>

        <header class="page-hero">
          <h1>اختر الممرض المناسب لك</h1>
          <p>اختر من بين أفضل الممرضين المتاحين لتقديم أفضل رعاية لك</p>
        </header>

        <nav class="booking-stepper" aria-label="خطوات حجز خدمة التمريض">
          <div
            v-for="step in steps"
            :key="step.number"
            class="booking-step"
            :class="{ active: step.number === 1 }"
          >
            <span class="step-circle">{{ step.number }}</span>
            <span class="step-label">{{ step.label }}</span>
          </div>
        </nav>

        <div class="content-grid">
          <aside class="filters-panel" aria-label="فلترة البحث">
            <div class="filter-title">
              <span aria-hidden="true">
                <SlidersHorizontal :size="18" stroke-width="2.2" />
              </span>
              <h2> فلترة البحث</h2>
            </div>

            <fieldset class="filter-group">
              <legend>
                <UsersRound :size="17" stroke-width="2.2" aria-hidden="true" />
                <span>الجنس</span>
              </legend>
              <label
                v-for="option in genderOptions"
                :key="option.value"
                class="check-option"
              >
                <input v-model="filters.gender" type="radio" :value="option.value">
                <span>{{ option.label }}</span>
              </label>
            </fieldset>

            <button class="reset-button" type="button" @click="resetFilters">
              <RotateCcw :size="17" stroke-width="2.3" aria-hidden="true" />
              <span>إعادة تعيين الفلاتر</span>
            </button>
          </aside>

          <main class="nurses-area" aria-live="polite">
            <div class="nurses-list">
              <p v-if="activeNurses.length === 0" class="state-message">
                لا يوجد ممرضون متاحون حالياً
              </p>
              <p v-else-if="visibleNurses.length === 0" class="state-message">
                لا يوجد ممرضون مطابقون للفلاتر الحالية
              </p>

              <template v-else>
                <article
                  v-for="nurse in visibleNurses"
                  :key="nurse.id"
                  class="nurse-card"
                >
                  <div class="nurse-photo-wrap">
                    <img
                      class="nurse-image"
                      :src="nurse.image || fallbackImage"
                      :alt="`صورة ${nurse.name}`"
                      @error="handleImageError"
                    >
                  </div>

                  <div class="nurse-info">
                    <h2>{{ nurse.name }}</h2>

                    <span class="info-row">
                      <CalendarDays :size="16" stroke-width="2.2" aria-hidden="true" />
                      <span>خبرة {{ formatYears(nurse.experienceYears) }}</span>
                    </span>

                    <span class="shift-badge" :class="shiftBadgeClass(nurse.availabilityStatus)">
                      <Sun v-if="shiftBadgeClass(nurse.availabilityStatus) === 'morning'" :size="15" stroke-width="2.2" aria-hidden="true" />
                      <Moon v-else-if="shiftBadgeClass(nurse.availabilityStatus) === 'evening'" :size="15" stroke-width="2.2" aria-hidden="true" />
                      <Clock3 v-else :size="15" stroke-width="2.2" aria-hidden="true" />
                      <span>{{ nurse.availabilityStatus || 'غير محدد' }}</span>
                    </span>

                    <span class="available-row">
                      <span class="live-dot" aria-hidden="true"></span>
                      <span>متاح الآن</span>
                    </span>

                    <span class="arrival-row">
                      <Clock3 :size="15" stroke-width="2.2" aria-hidden="true" />
                      <span>الوصول خلال 20 دقيقة</span>
                    </span>
                  </div>

                  <div class="card-action-panel">
                    <button type="button" @click="selectNurse(nurse)">
                      <span>اختيار</span>
                      <ArrowLeft :size="18" stroke-width="2.4" aria-hidden="true" />
                    </button>
                    <small>
                      <ShieldCheck :size="15" stroke-width="2.2" aria-hidden="true" />
                      موثق ومعتمد
                    </small>
                  </div>
                </article>
              </template>
            </div>

            <section class="features-section" aria-label="مميزات خدمة التمريض">
              <article v-for="feature in features" :key="feature.title" class="feature-card">
                <span class="feature-icon" aria-hidden="true">
                  <component :is="feature.icon" :size="22" stroke-width="2.1" />
                </span>
                <div>
                  <h3>{{ feature.title }}</h3>
                  <p>{{ feature.description }}</p>
                </div>
              </article>
            </section>
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
  CalendarDays,
  Clock3,
  Headphones,
  HeartPulse,
  Moon,
  RotateCcw,
  ShieldCheck,
  SlidersHorizontal,
  Sun,
  UserCheck,
  UsersRound,
  Zap,
} from '@lucide/vue'

definePageMeta({
  title: 'اختيار الممرض',
})

const steps = [
  { number: 1, label: 'اختيار الممرض' },
  { number: 2, label: 'الخدمة' },
  { number: 3, label: 'المعلومات' },
  { number: 4, label: 'الموقع' },
  { number: 5, label: 'الدفع' },
  { number: 6, label: 'مراجعة الطلب' },
]

const genderOptions = [
  { value: 'all', label: 'الكل' },
  { value: 'male', label: 'ذكر' },
  { value: 'female', label: 'أنثى' },
]

const features = [
  {
    title: 'ممرضون موثوقون',
    description: 'فريق مؤهل ومعتمد بعناية',
    icon: UserCheck,
  },
  {
    title: 'خدمة سريعة',
    description: 'استجابة مرنة حسب احتياجك',
    icon: Zap,
  },
  {
    title: 'رعاية احترافية',
    description: 'متابعة صحية بمعايير عالية',
    icon: HeartPulse,
  },
  {
    title: 'دعم على مدار الساعة',
    description: 'مساندة مستمرة قبل وبعد الزيارة',
    icon: Headphones,
  },
]

const fallbackImage = '/images/doctor.png'
const { nurses } = useNurses()
const bookingState = useState('nursingBooking', () => ({}))

const filters = reactive({
  gender: 'all',
})

const activeNurses = computed(() =>
  nurses.value.filter((nurse) => nurse?.isActive === true),
)

const normalizeGender = (gender) => {
  const value = String(gender ?? '').trim().toLowerCase()

  if (['male', 'm', 'ذكر'].includes(value)) {
    return 'male'
  }

  if (['female', 'f', 'أنثى', 'انثى'].includes(value)) {
    return 'female'
  }

  return value
}

const filteredNurses = computed(() =>
  activeNurses.value.filter((nurse) => {
    const matchesGender = filters.gender === 'all' || normalizeGender(nurse.gender) === filters.gender

    return matchesGender
  }),
)

const visibleNurses = computed(() => filteredNurses.value.slice(0, 3))

const resetFilters = () => {
  filters.gender = 'all'
}

const goBack = async () => {
  await navigateTo('/')
}

const formatYears = (years) => {
  const value = Number(years)

  if (!Number.isFinite(value) || value <= 0) {
    return 'غير محددة'
  }

  if (value === 1) {
    return 'سنة واحدة'
  }

  if (value === 2) {
    return 'سنتان'
  }

  return `${value} سنوات`
}

const availabilityClass = (status) => {
  const value = String(status ?? '').trim().toLowerCase()

  if (['available', 'متاح', 'متاحة', 'متاح الآن', 'متاحة الآن', 'صباحية', 'مسائية', 'ليلية'].includes(value)) {
    return 'available'
  }

  if (['busy', 'مشغول', 'مشغولة'].includes(value)) {
    return 'busy'
  }

  return 'neutral'
}

const shiftBadgeClass = (status) => {
  const value = String(status ?? '').trim().toLowerCase()

  if (['صباحية', 'morning', 'available', 'متاح', 'متاحة'].includes(value)) {
    return 'morning'
  }

  if (['مسائية', 'evening', 'night', 'ليلية'].includes(value)) {
    return 'evening'
  }

  return 'neutral'
}

const handleImageError = (event) => {
  event.target.src = fallbackImage
}

const selectNurse = async (nurse) => {
  bookingState.value = {
    ...bookingState.value,
    nurseId: nurse.id,
    nurse: {
      id: nurse.id,
      name: nurse.name,
      gender: nurse.gender,
      experienceYears: nurse.experienceYears,
      availabilityStatus: nurse.availabilityStatus,
      image: nurse.image,
      isActive: nurse.isActive,
    },
  }

  await navigateTo('/nursing/service')
}
</script>

<style scoped>
.select-nurse-page {
  min-height: 100vh;
  color: #10264c;
  background:
    radial-gradient(circle at 12% 6%, rgba(37, 99, 235, 0.09), transparent 26%),
    radial-gradient(circle at 92% 12%, rgba(14, 165, 233, 0.11), transparent 24%),
    linear-gradient(180deg, #f8fbff 0%, #ffffff 46%, #f5f9ff 100%);
}

.select-nurse-shell {
  width: min(100%, 1140px);
  margin: 0 auto;
  padding: 24px 20px 46px;
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
  transition: transform 0.22s ease, box-shadow 0.22s ease, background 0.22s ease;
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
  color: #10264c;
  font-size: clamp(1.75rem, 3.5vw, 2.55rem);
  font-weight: 900;
  line-height: 1.15;
}

.page-hero p {
  max-width: 620px;
  margin: 8px auto 0;
  color: #62718e;
  font-size: clamp(0.9rem, 1.7vw, 1.02rem);
  font-weight: 600;
  line-height: 1.8;
}

.booking-stepper {
  position: relative;
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 0;
  margin: 0 auto 28px;
  padding: 0 8px;
}

.booking-step {
  position: relative;
  z-index: 1;
  display: grid;
  justify-items: center;
  gap: 8px;
  color: #6f7f9a;
  font-weight: 700;
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
  font-weight: 800;
  background: #ffffff;
  border: 2px solid #d8e4f5;
  border-radius: 999px;
  box-shadow: 0 10px 24px rgba(15, 31, 61, 0.06);
  transition: transform 0.25s ease, color 0.25s ease, background 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
}

.booking-step.active {
  color: #1d64f2;
}

.booking-step.active .step-circle {
  color: #ffffff;
  background: linear-gradient(135deg, #0b63f6, #1688ff);
  border-color: #1d64f2;
  box-shadow: 0 14px 30px rgba(29, 100, 242, 0.28);
  transform: translateY(-2px) scale(1.04);
}

.step-label {
  font-size: 0.78rem;
  line-height: 1.35;
  text-align: center;
}

.content-grid {
  display: grid;
  grid-template-columns: 250px minmax(0, 1fr);
  gap: 18px;
  align-items: start;
}

.filters-panel {
  position: sticky;
  top: 98px;
  min-height: 300px;
  padding: 20px;
  background: #ffffff;
  border: 1px solid rgba(197, 211, 232, 0.9);
  border-radius: 18px;
  box-shadow: 0 14px 34px rgba(15, 31, 61, 0.075);
}

.filter-title {
  display: flex;
  align-items: center;
  margin-bottom: 24px;
}

.filter-title span {
  display: grid;
  width: 32px;
  height: 32px;
  place-items: center;
  color: #0b63f6;
  background: #f2f7ff;
  border: 1px solid #d9e7fb;
  border-radius: 10px;
}

.filter-title h2 {
  margin: 0;
  color: #10264c;
  font-size: 1.02rem;
  font-weight: 800;
}

.filter-group {
  padding: 0;
  margin: 0 0 24px;
  border: 0;
}

.filter-group legend {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  margin-bottom: 12px;
  color: #18315b;
  font-size: 0.9rem;
  font-weight: 800;
}

.filter-group legend svg {
  color: #0b63f6;
}

.check-option {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 12px;
  color: #435574;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
}

.check-option input {
  width: 15px;
  height: 15px;
  accent-color: #1d64f2;
}

.reset-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  width: 100%;
  min-height: 44px;
  color: #1d64f2;
  font: inherit;
  font-weight: 800;
  cursor: pointer;
  background: linear-gradient(135deg, #eef5ff, #e7f0ff);
  border: 0;
  border-radius: 10px;
  transition: transform 0.22s ease, box-shadow 0.22s ease, background 0.22s ease;
}

.reset-button:hover {
  transform: translateY(-2px);
  background: linear-gradient(135deg, #e4efff, #dceaff);
  box-shadow: 0 12px 22px rgba(29, 100, 242, 0.1);
}

.nurses-area {
  display: grid;
  gap: 18px;
}

.nurses-list {
  display: grid;
  gap: 14px;
}

.nurse-card {
  display: grid;
  grid-template-columns: 146px minmax(0, 1fr) 150px;
  gap: 22px;
  align-items: center;
  min-height: 168px;
  padding: 16px 20px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.96);
  border: 1px solid rgba(207, 220, 239, 0.92);
  border-radius: 18px;
  box-shadow: 0 14px 34px rgba(15, 31, 61, 0.075);
  transition: transform 0.26s ease, box-shadow 0.26s ease, border-color 0.26s ease;
}

.nurse-card:hover {
  transform: translateY(-4px);
  border-color: rgba(29, 100, 242, 0.26);
  box-shadow: 0 20px 44px rgba(15, 31, 61, 0.11);
}

.nurse-photo-wrap {
  display: grid;
  place-items: center;
  height: 128px;
  overflow: hidden;
  background: linear-gradient(145deg, #edf5ff, #ffffff);
  border: 1px solid #e2edf9;
  border-radius: 14px;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.85), 0 14px 28px rgba(29, 100, 242, 0.08);
}

.nurse-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 12px;
  transform-origin: center;
  transition: transform 0.28s ease, box-shadow 0.28s ease, filter 0.28s ease;
}

.nurse-card:hover .nurse-image,
.nurse-card:focus-within .nurse-image {
  filter: saturate(1.08) contrast(1.03);
  transform: scale(1.055);
}

.nurse-info h2 {
  margin: 0 0 10px;
  color: #12264b;
  font-size: clamp(1.1rem, 1.7vw, 1.32rem);
  font-weight: 900;
  line-height: 1.25;
}

.info-row,
.available-row,
.arrival-row {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 7px;
  color: #425577;
  font-size: 0.82rem;
  font-weight: 700;
}

.info-row svg,
.arrival-row svg {
  color: #54749f;
}

.shift-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  width: fit-content;
  margin: 1px 0 9px;
  padding: 6px 11px;
  font-size: 0.8rem;
  font-weight: 800;
  border-radius: 10px;
}

.shift-badge.morning {
  color: #167447;
  background: linear-gradient(135deg, #dff9e8, #fff8cf);
}

.shift-badge.evening {
  color: #6d3cbd;
  background: linear-gradient(135deg, #eee6ff, #f5f0ff);
}

.shift-badge.neutral {
  color: #52627d;
  background: #edf2f8;
}

.live-dot {
  width: 8px;
  height: 8px;
  background: #16c784;
  border-radius: 999px;
  box-shadow: 0 0 0 5px rgba(22, 199, 132, 0.13);
}

.available-row {
  color: #128052;
}

.card-action-panel {
  display: grid;
  justify-items: center;
  gap: 6px;
  padding-inline-start: 22px;
  text-align: center;
  border-inline-start: 1px solid #e4edf8;
}

.card-action-panel button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  width: 100%;
  min-height: 46px;
  margin-top: 6px;
  color: #ffffff;
  font: inherit;
  font-weight: 900;
  cursor: pointer;
  background: linear-gradient(135deg, #0b63f6 0%, #1688ff 100%);
  border: 0;
  border-radius: 10px;
  box-shadow: 0 12px 22px rgba(11, 99, 246, 0.22);
  transition: transform 0.22s ease, box-shadow 0.22s ease, filter 0.22s ease;
}

.card-action-panel button svg {
  transition: transform 0.22s ease;
}

.card-action-panel button:hover {
  filter: saturate(1.08);
  transform: translateY(-3px);
  box-shadow: 0 18px 34px rgba(11, 99, 246, 0.32);
}

.card-action-panel button:hover svg {
  transform: translateX(-4px);
}

.card-action-panel small {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #0f8a5f;
  font-size: 0.74rem;
  font-weight: 800;
}

.state-message {
  margin: 0;
  padding: 26px 18px;
  color: #425577;
  font-weight: 800;
  text-align: center;
  background: #ffffff;
  border: 1px solid rgba(207, 220, 239, 0.92);
  border-radius: 16px;
  box-shadow: 0 18px 42px rgba(15, 31, 61, 0.08);
}

.features-section {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
}

.feature-card {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  min-height: 96px;
  padding: 14px;
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(207, 220, 239, 0.86);
  border-radius: 14px;
  box-shadow: 0 14px 32px rgba(15, 31, 61, 0.06);
  transition: transform 0.24s ease, box-shadow 0.24s ease;
}

.feature-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 18px 40px rgba(15, 31, 61, 0.1);
}

.feature-icon {
  display: grid;
  flex: 0 0 auto;
  width: 36px;
  height: 36px;
  place-items: center;
  color: #0b63f6;
  background: linear-gradient(135deg, #eff6ff, #e0efff);
  border-radius: 11px;
}

.feature-card h3 {
  margin: 0 0 6px;
  color: #14264a;
  font-size: 0.86rem;
  font-weight: 900;
}

.feature-card p {
  margin: 0;
  color: #6b7b96;
  font-size: 0.76rem;
  font-weight: 600;
  line-height: 1.6;
}

@media (max-width: 1030px) {
  .content-grid {
    grid-template-columns: 1fr;
  }

  .filters-panel {
    position: static;
    min-height: auto;
  }

  .nurse-card {
    grid-template-columns: 132px minmax(0, 1fr) 150px;
    gap: 16px;
    min-height: 160px;
  }

  .nurse-photo-wrap {
    width: 132px;
    height: 132px;
  }

  .features-section {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 720px) {
  .select-nurse-shell {
    padding: 20px 12px 38px;
  }

  .top-bar {
    margin-bottom: 12px;
  }

  .back-button {
    width: 100%;
  }

  .booking-stepper {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    row-gap: 18px;
  }

  .booking-step::before,
  .booking-step::after {
    display: none;
  }

  .step-circle {
    width: 36px;
    height: 36px;
  }

  .step-label {
    font-size: 0.78rem;
  }

  .nurse-card {
    grid-template-columns: 1fr;
    justify-items: center;
    gap: 14px;
    padding: 16px;
    text-align: center;
  }

  .nurse-photo-wrap {
    width: min(100%, 210px);
    height: 190px;
  }

  .nurse-info h2 {
    font-size: 1.15rem;
  }

  .info-row,
  .available-row,
  .arrival-row {
    justify-content: center;
  }

  .shift-badge {
    margin-inline: auto;
  }

  .card-action-panel {
    width: 100%;
    padding: 14px 0 0;
    border-inline-start: 0;
    border-top: 1px solid #e4edf8;
  }

  .card-action-panel button {
    width: 100%;
  }

  .features-section {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 430px) {
  .page-hero h1 {
    font-size: 1.65rem;
  }

  .filters-panel {
    padding: 18px;
  }

  .feature-card {
    min-height: auto;
  }
}
</style>

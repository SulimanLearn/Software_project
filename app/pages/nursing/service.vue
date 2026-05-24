<template>
  <div>
    <NavBar />

    <section v-if="selectedNurse" class="service-page" dir="rtl">
      <div class="service-shell">
        <div class="top-bar">
          <button class="back-button" type="button" @click="goBack">
            <ArrowRight :size="22" stroke-width="2.7" aria-hidden="true" />
            <span>رجوع</span>
          </button>
        </div>

        <header class="page-hero">
          <h1>اختر الخدمة المطلوبة</h1>
          <p>اختر الخدمة التي تناسب احتياجاتك للحصول على أفضل رعاية</p>
        </header>

        <nav class="booking-stepper" aria-label="خطوات حجز خدمة التمريض">
          <div
            v-for="step in steps"
            :key="step.number"
            class="booking-step"
            :class="{
              active: step.number === 2,
              completed: step.number < 2,
            }"
          >
            <span class="step-circle">{{ step.number }}</span>
            <span class="step-label">{{ step.label }}</span>
          </div>
        </nav>

        <div class="service-layout">
          <aside class="selected-nurse-card" aria-label="الممرض المختار">
            <div class="aside-heading">
              <UserRound :size="22" stroke-width="2.3" aria-hidden="true" />
              <h2>الممرض المختار</h2>
            </div>

            <div class="nurse-photo-wrap">
              <img
                class="nurse-image"
                :src="selectedNurse.image || fallbackImage"
                :alt="`صورة ${selectedNurse.name}`"
                @error="handleImageError"
              >
            </div>

            <div class="nurse-details">
              <h3>{{ selectedNurse.name }}</h3>

              <p class="shift-line">
                <Clock3 :size="17" stroke-width="2.2" aria-hidden="true" />
                <span>فترة العمل: {{ workingPeriod }}</span>
              </p>
            </div>

            <button class="change-nurse-button" type="button" @click="changeNurse">
              <RefreshCw :size="17" stroke-width="2.3" aria-hidden="true" />
              <span>تغيير الممرض</span>
            </button>
          </aside>

          <main class="services-panel">
            <div class="services-grid" aria-label="الخدمات المتاحة">
              <button
                v-for="service in services"
                :key="service.id"
                class="service-card"
                :class="{ selected: selectedServiceId === service.id }"
                type="button"
                @click="selectService(service)"
              >
                <span v-if="selectedServiceId === service.id" class="selected-badge">
                  <CheckCircle2 :size="18" stroke-width="2.5" aria-hidden="true" />
                </span>

                <span class="service-icon" aria-hidden="true">
                  <component :is="service.icon" :size="30" stroke-width="2" />
                </span>

                <span class="service-title">{{ service.title }}</span>
                <span class="service-price">{{ formatServicePrice(service.price) }}</span>
                <span class="service-description">{{ service.description }}</span>
              </button>
            </div>

            <div class="page-actions">
              <button
                class="primary-action"
                type="button"
                :disabled="!selectedService"
                @click="goNext"
              >
                <span>التالي</span>
                <ArrowLeft :size="18" stroke-width="2.4" aria-hidden="true" />
              </button>
            </div>
          </main>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import {
  Ambulance,
  ArrowLeft,
  ArrowRight,
  Baby,
  Bandage,
  CheckCircle2,
  ClipboardPlus,
  Clock3,
  RefreshCw,
  Syringe,
  Tag,
  TestTube,
  UserRound,
} from '@lucide/vue'

definePageMeta({
  title: 'اختيار خدمة التمريض',
})

const steps = [
  { number: 1, label: 'اختيار الممرض' },
  { number: 2, label: 'الخدمة' },
  { number: 3, label: 'المعلومات' },
  { number: 4, label: 'الموقع' },
  { number: 5, label: 'الدفع' },
  { number: 6, label: 'مراجعة الطلب' },
]

const fallbackImage = '/images/doctor.png'
const bookingState = useState('nursingBooking', () => ({}))
const selectedNurse = computed(() => bookingState.value?.nurse || null)

if (!selectedNurse.value) {
  await navigateTo('/nursing/select-nurse')
}

const services = [
  {
    id: 'home-injection',
    title: 'حقن منزلية',
    price: 60,
    description: 'حقن وريدي أو عضلية في المنزل',
    icon: Syringe,
  },
  {
    id: 'dressing-change',
    title: 'تغيير ضمادات',
    price: 50,
    description: 'تغيير وتنظيف الضمادات',
    icon: Bandage,
  },
  {
    id: 'iv-fluids',
    title: 'تركيب محاليل',
    price: 100,
    description: 'تركيب المحاليل الوريدية',
    icon: Ambulance,
  },
  {
    id: 'elderly-care',
    title: 'رعاية كبار السن',
    price: 120,
    description: 'رعاية ومتابعة كبار السن',
    icon: UserRound,
  },
  {
    id: 'post-op-follow-up',
    title: 'متابعة ما بعد العمليات',
    price: 150,
    description: 'متابعة الحالات بعد العمليات',
    icon: ClipboardPlus,
  },
  {
    id: 'child-care',
    title: 'رعاية أطفال',
    price: 120,
    description: 'رعاية الأطفال والمواليد',
    icon: Baby,
  },
  {
    id: 'sample-collection',
    title: 'سحب عينات',
    price: 80,
    description: 'سحب عينات الدم',
    icon: TestTube,
  },
  {
    id: 'other-service',
    title: 'خدمة أخرى',
    price: 'تواصل معنا',
    description: 'خدمة حسب الطلب',
    icon: Tag,
  },
]

const selectedServiceId = ref(bookingState.value?.serviceId || '')
const selectedService = computed(() =>
  services.find((service) => service.id === selectedServiceId.value) || null,
)

const workingPeriod = computed(() =>
  selectedNurse.value?.availabilityStatus || selectedNurse.value?.shift || 'غير محددة',
)

const formatServicePrice = (price) => (
  typeof price === 'number' ? `${price} ₪` : price
)

const selectService = (service) => {
  selectedServiceId.value = service.id

  bookingState.value = {
    ...bookingState.value,
    serviceId: service.id,
    service,
  }
}

const changeNurse = async () => {
  await navigateTo('/nursing/select-nurse')
}

const goBack = async () => {
  await navigateTo('/nursing/select-nurse')
}

const goNext = async () => {
  if (!selectedService.value) {
    return
  }

  await navigateTo('/nursing/information')
}

const handleImageError = (event) => {
  event.target.src = fallbackImage
}
</script>

<style scoped>
.service-page {
  min-height: 100vh;
  background:
    radial-gradient(circle at 12% 6%, #2463eb17, transparent 26%),
    radial-gradient(circle at 92% 12%, #0ea5e91c, transparent 24%),
    linear-gradient(180deg, #f8fbff 0%, #ffffff 46%, #f5f9ff 100%);
  color: #061f4a;
  font-family: "Tajawal", sans-serif;
  padding: 0;
}

.service-shell {
  width: 100%;
  max-width: 1140px;
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
  color: #061f4a;
  font-size: clamp(1.85rem, 3.8vw, 2.8rem);
  font-weight: 900;
  line-height: 1.18;
}

.page-hero p {
  max-width: 620px;
  margin: 8px auto 0;
  color: #66748d;
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

.service-layout {
  display: grid;
  grid-template-columns: 230px minmax(0, 1fr);
  gap: 18px;
  align-items: start;
  direction: rtl;
}

.selected-nurse-card,
.service-card {
  background: rgba(255, 255, 255, 0.94);
  border: 1px solid #dce8f6;
  box-shadow: 0 18px 48px rgba(29, 78, 216, 0.09);
}

.selected-nurse-card {
  position: sticky;
  top: 24px;
  grid-column: 1;
  width: 100%;
  max-width: 230px;
  overflow: hidden;
  border-radius: 12px;
  padding: 18px;
  text-align: center;
}

.aside-heading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 16px;
  color: #061f4a;
}

.aside-heading svg {
  color: #1a73f8;
}

.aside-heading h2 {
  margin: 0;
  font-size: 1rem;
  font-weight: 900;
}

.nurse-photo-wrap {
  position: relative;
  overflow: hidden;
  width: min(150px, 100%);
  aspect-ratio: 1 / 1.15;
  margin: 0 auto;
  border: 1px solid #e0ebf8;
  border-radius: 10px;
  background: linear-gradient(145deg, #edf5ff, #ffffff);
  box-shadow: inset 0 0 26px rgba(26, 115, 248, 0.07);
}

.nurse-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.35s ease, filter 0.35s ease;
}

.nurse-photo-wrap:hover .nurse-image {
  transform: scale(1.06);
  filter: saturate(1.08);
}

.nurse-details {
  margin-top: 18px;
}

.nurse-details h3 {
  margin: 0;
  color: #062051;
  font-size: 1.25rem;
  font-weight: 900;
}

.shift-line {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin: 10px 0 0;
  color: #65748d;
  font-size: 0.78rem;
  font-weight: 800;
}

.shift-line svg {
  color: #1a73f8;
}

.change-nurse-button,
.primary-action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  border: 0;
  border-radius: 14px;
  font-weight: 900;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease, background 0.3s ease, opacity 0.3s ease;
}

.change-nurse-button {
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

.change-nurse-button:hover {
  transform: translateY(-2px);
  background: #dfecff;
}

.services-panel {
  grid-column: 2;
  min-width: 0;
  direction: rtl;
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
  min-width: 0;
}

.service-card {
  position: relative;
  min-width: 0;
  min-height: 184px;
  overflow: hidden;
  border-radius: 10px;
  padding: 18px 14px;
  color: inherit;
  text-align: center;
  cursor: pointer;
  transition: transform 0.24s ease, box-shadow 0.24s ease, border-color 0.24s ease, background 0.24s ease;
}

.service-card:hover {
  transform: translateY(-4px);
  border-color: #78adff;
  box-shadow: 0 24px 58px rgba(29, 78, 216, 0.15);
}

.service-card.selected {
  border-color: #1a73f8;
  background: linear-gradient(180deg, #f3f8ff 0%, #ffffff 100%);
  box-shadow: 0 24px 60px rgba(26, 115, 248, 0.18);
}

.selected-badge {
  position: absolute;
  inset-block-start: 10px;
  inset-inline-start: 10px;
  display: inline-flex;
  width: 28px;
  height: 28px;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #1a73f8;
  color: #ffffff;
  box-shadow: 0 10px 24px rgba(26, 115, 248, 0.28);
}

.service-icon {
  display: inline-flex;
  width: 58px;
  height: 58px;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  border-radius: 50%;
  background: #eef5ff;
  color: #1a73f8;
  transition: transform 0.24s ease, background 0.24s ease, color 0.24s ease;
}

.service-card:hover .service-icon,
.service-card.selected .service-icon {
  transform: scale(1.04);
  background: #dcecff;
  color: #0962e7;
}

.service-title,
.service-price,
.service-description {
  display: block;
}

.service-title {
  color: #061f4a;
  font-size: 0.92rem;
  font-weight: 900;
  line-height: 1.35;
}

.service-price {
  margin-top: 8px;
  color: #1473f8;
  font-size: 1.08rem;
  font-weight: 900;
}

.service-description {
  margin-top: 10px;
  color: #65748d;
  font-size: 0.72rem;
  font-weight: 600;
  line-height: 1.7;
}

.page-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 18px;
}

.primary-action {
  min-width: 140px;
  padding: 11px 18px;
  font-size: 0.9rem;
}

.primary-action {
  background: linear-gradient(135deg, #0c64ec 0%, #2294ff 100%);
  color: #ffffff;
  box-shadow: 0 16px 28px rgba(26, 115, 248, 0.22);
}

.primary-action:not(:disabled):hover {
  transform: translateY(-3px);
  box-shadow: 0 20px 34px rgba(26, 115, 248, 0.3);
}

.primary-action:not(:disabled):active {
  transform: scale(0.98);
}

.primary-action:disabled {
  cursor: not-allowed;
  opacity: 0.5;
  box-shadow: none;
}

@media (max-width: 1030px) {
  .service-shell {
    padding: 30px 14px 42px;
  }

  .service-layout {
    grid-template-columns: 1fr;
  }

  .selected-nurse-card {
    position: static;
    grid-column: auto;
    max-width: none;
  } 

  .services-panel {
    grid-column: auto;
  }

  .services-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 720px) {
  .page-hero {
    margin-bottom: 24px;
  }

  .top-bar {
    margin-bottom: 12px;
  }

  .back-button {
    width: 100%;
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

  .services-grid {
    grid-template-columns: 1fr;
  }

  .service-card {
    min-height: 190px;
    padding: 20px 16px;
  }

  .page-actions {
    flex-direction: column-reverse;
  }

  .primary-action {
    width: 100%;
  }
}
</style>

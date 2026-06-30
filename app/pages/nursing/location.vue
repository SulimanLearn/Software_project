<template>
  <NavBar />
  <section class="location-page" dir="rtl">
    <div class="location-shell">
      <div class="top-bar">
        <button class="back-button" type="button" @click="goBack">
          <ArrowRight :size="22" stroke-width="2.7" aria-hidden="true" />
          <span>رجوع</span>
        </button>
      </div>

      <header class="page-hero">
        <h1>موقع الخدمة</h1>
        <p>أدخل عنوان موقع الخدمة بدقة ليتمكن فريق التمريض من الوصول إليك بسهولة.</p>
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

      <div class="location-layout">
        <main class="address-card">
          <div class="section-heading">
            <MapPin :size="22" stroke-width="2.4" aria-hidden="true" />
            <h2>أدخل عنوان موقع الخدمة</h2>
          </div>

          <form class="address-form" novalidate @submit.prevent="goNext">
            <div class="form-grid">
              <div
                v-for="field in fields"
                :key="field.name"
                class="field-group"
                :class="{ wide: field.type === 'textarea' }"
              >
                <label :for="field.name">{{ field.label }}</label>

                <textarea
                  v-if="field.type === 'textarea'"
                  :id="field.name"
                  v-model.trim="form[field.name]"
                  :placeholder="field.placeholder"
                  rows="3"
                ></textarea>

                <input
                  v-else
                  :id="field.name"
                  v-model.trim="form[field.name]"
                  :type="field.type"
                  :placeholder="field.placeholder"
                  :inputmode="field.inputmode"
                  :class="{ invalid: errors[field.name] }"
                >

                <p v-if="errors[field.name]" class="error-message">{{ errors[field.name] }}</p>
              </div>
            </div>

            <div class="form-actions">
              <button class="primary-action" type="submit">
                <span>متابعة</span>
                <ArrowLeft :size="18" stroke-width="2.4" aria-hidden="true" />
              </button>
            </div>
          </form>
        </main>

        <aside class="map-card" aria-label="خريطة موقع الخدمة">
          <div class="map-preview">
            <div ref="mapElement" class="google-map"></div>

            <div v-if="!isMapReady" class="map-state">
              <MapPin :size="30" stroke-width="2.8" aria-hidden="true" />
              <span>{{ mapError || 'جاري تحميل الخريطة...' }}</span>
            </div>

            <button
              class="current-location-button"
              type="button"
              :disabled="isLocating || !isMapReady"
              @click="useCurrentLocation"
            >
              <LocateFixed :size="18" stroke-width="2.5" aria-hidden="true" />
              <span>{{ isLocating ? 'جاري تحديد موقعك...' : 'استخدام موقعي الحالي' }}</span>
            </button>
          </div>

          <p v-if="locationError" class="map-error">{{ locationError }}</p>
        </aside>
      </div>
    </div>
  </section>
</template>

<script setup>
import { onMounted, reactive, ref, shallowRef } from 'vue'
import {
  ArrowLeft,
  ArrowRight,
  LocateFixed,
  MapPin,
} from '@lucide/vue'

definePageMeta({
  title: 'موقع خدمة التمريض',
})

const config = useRuntimeConfig()
const currentStep = 4

const steps = [
  { number: 1, label: 'اختيار الممرض' },
  { number: 2, label: 'الخدمة' },
  { number: 3, label: 'المعلومات' },
  { number: 4, label: 'موقع الخدمة' },
  { number: 5, label: 'الدفع' },
  { number: 6, label: 'مراجعة الطلب' },
]

const fields = [
  { name: 'city', label: 'المدينة', type: 'text', placeholder: 'أدخل المدينة' },
  { name: 'area', label: 'المنطقة', type: 'text', placeholder: 'أدخل المنطقة' },
  { name: 'street', label: 'الشارع', type: 'text', placeholder: 'أدخل اسم الشارع' },
  { name: 'buildingNumber', label: 'رقم المبنى', type: 'text', inputmode: 'numeric', placeholder: 'مثال: 24' },
  { name: 'floorNumber', label: 'رقم الطابق', type: 'text', inputmode: 'numeric', placeholder: 'مثال: 3' },
  { name: 'extraDetails', label: 'تفاصيل إضافية اختيارية', type: 'textarea', placeholder: 'مثل: بالقرب من الصيدلية، مقابل المسجد' },
]

const bookingState = useState('nursingBooking', () => ({}))
const existingAddress = bookingState.value?.serviceLocation || {}

const form = reactive({
  city: existingAddress.city || '',
  area: existingAddress.area || '',
  street: existingAddress.street || '',
  buildingNumber: existingAddress.buildingNumber || '',
  floorNumber: existingAddress.floorNumber || '',
  extraDetails: existingAddress.extraDetails || '',
})

const errors = reactive({
  city: '',
  area: '',
  street: '',
  buildingNumber: '',
  floorNumber: '',
  extraDetails: '',
})

const latitude = ref(existingAddress.latitude || null)
const longitude = ref(existingAddress.longitude || null)
const isLocating = ref(false)
const isMapReady = ref(false)
const locationError = ref('')
const mapError = ref('')
const mapElement = ref(null)
const mapInstance = shallowRef(null)
const markerInstance = shallowRef(null)

const defaultCenter = {
  lat: Number(latitude.value) || 24.7136,
  lng: Number(longitude.value) || 46.6753,
}

const requiredFields = ['city', 'area', 'street', 'buildingNumber', 'floorNumber']

const clearErrors = () => {
  Object.keys(errors).forEach((key) => {
    errors[key] = ''
  })
}

const validateForm = () => {
  clearErrors()

  requiredFields.forEach((fieldName) => {
    if (!form[fieldName]) {
      const field = fields.find((item) => item.name === fieldName)
      errors[fieldName] = `${field.label} مطلوب`
    }
  })

  return !Object.values(errors).some(Boolean)
}

const saveAddress = () => {
  bookingState.value = {
    ...bookingState.value,
    serviceLocation: {
      ...form,
      latitude: latitude.value,
      longitude: longitude.value,
    },
  }
}

const loadGoogleMaps = () => {
  if (!import.meta.client) {
    return Promise.resolve()
  }

  if (window.google?.maps) {
    return Promise.resolve()
  }

  const apiKey = config.public.googleMapsApiKey

  if (!apiKey) {
    return Promise.reject(new Error('مفتاح Google Maps غير مضاف'))
  }

  const existingScript = document.querySelector('script[data-google-maps-api]')

  if (existingScript) {
    return new Promise((resolve, reject) => {
      existingScript.addEventListener('load', resolve, { once: true })
      existingScript.addEventListener('error', reject, { once: true })
    })
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&language=ar&region=SA`
    script.async = true
    script.defer = true
    script.dataset.googleMapsApi = 'true'
    script.addEventListener('load', resolve, { once: true })
    script.addEventListener('error', reject, { once: true })
    document.head.appendChild(script)
  })
}

const updateMapLocation = (lat, lng) => {
  const position = { lat, lng }

  latitude.value = lat
  longitude.value = lng

  if (!mapInstance.value || !window.google?.maps) {
    return
  }

  mapInstance.value.setCenter(position)
  mapInstance.value.setZoom(16)

  if (!markerInstance.value) {
    markerInstance.value = new window.google.maps.Marker({
      position,
      map: mapInstance.value,
      title: 'موقع الخدمة',
    })
    return
  }

  markerInstance.value.setPosition(position)
}

const initMap = async () => {
  try {
    await loadGoogleMaps()

    if (!mapElement.value || !window.google?.maps) {
      throw new Error('تعذر تهيئة الخريطة')
    }

    mapInstance.value = new window.google.maps.Map(mapElement.value, {
      center: defaultCenter,
      zoom: latitude.value && longitude.value ? 15 : 12,
      disableDefaultUI: true,
      fullscreenControl: true,
      gestureHandling: 'greedy',
      zoomControl: true,
      styles: [
        { featureType: 'water', stylers: [{ color: '#dbeeff' }] },
        { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#ffffff' }] },
        { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#7890ad' }] },
        { featureType: 'landscape', stylers: [{ color: '#f5f9ff' }] },
        { featureType: 'poi.medical', stylers: [{ visibility: 'on' }, { color: '#dff1ff' }] },
      ],
    })

    if (latitude.value && longitude.value) {
      updateMapLocation(Number(latitude.value), Number(longitude.value))
    }

    isMapReady.value = true
    mapError.value = ''
  } catch (error) {
    mapError.value = error?.message || 'تعذر تحميل الخريطة'
  }
}

const useCurrentLocation = () => {
  locationError.value = ''

  if (!navigator.geolocation) {
    locationError.value = 'تحديد الموقع غير مدعوم في هذا المتصفح'
    return
  }

  isLocating.value = true

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude: lat, longitude: lng } = position.coords
      updateMapLocation(lat, lng)
      saveAddress()
      isLocating.value = false
    },
    (error) => {
      locationError.value = error.code === error.PERMISSION_DENIED
        ? 'تم رفض إذن الوصول إلى الموقع'
        : 'تعذر تحديد موقعك الحالي'
      isLocating.value = false
    },
    {
      enableHighAccuracy: true,
      timeout: 12000,
      maximumAge: 0,
    },
  )
}

const goBack = async () => {
  await navigateTo('/nursing/information')
}

const goNext = async () => {
  if (!validateForm()) {
    return
  }

  saveAddress()
  await navigateTo('/nursing/payment')
}

onMounted(() => {
  initMap()
})
</script>

<style scoped>
.location-page {
  min-height: 100vh;
  color: #061f4a;
  background:
    radial-gradient(circle at 12% 8%, rgba(36, 99, 235, 0.08), transparent 27%),
    radial-gradient(circle at 92% 14%, rgba(14, 165, 233, 0.1), transparent 24%),
    linear-gradient(180deg, #fbfdff 0%, #ffffff 48%, #f6faff 100%);
  font-family: "Tajawal", sans-serif;
}

.location-shell {
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
  transition: transform 0.3s ease, box-shadow 0.3s ease, background 0.3s ease;
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
  max-width: 660px;
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

.location-layout {
  display: grid;
  grid-template-columns: minmax(320px, 0.9fr) minmax(0, 1fr);
  gap: 18px;
  align-items: stretch;
  direction: rtl;
  animation: page-enter 0.65s ease both;
}

.address-card,
.map-card {
  background: rgba(255, 255, 255, 0.96);
  border: 1px solid #dce8f8;
  border-radius: 22px;
  box-shadow: 0 18px 44px rgba(29, 78, 216, 0.09);
}

.address-card {
  grid-column: 1;
  padding: 24px 28px;
}

.map-card {
  grid-column: 2;
  display: grid;
  gap: 10px;
  padding: 16px;
}

.section-heading {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 18px;
  color: #08265c;
}

.section-heading svg {
  color: #1a73f8;
}

.section-heading h2 {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 900;
}

.address-form {
  display: grid;
  gap: 22px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px 18px;
}

.field-group {
  display: grid;
  gap: 7px;
}

.field-group.wide {
  grid-column: 1 / -1;
}

label {
  color: #243858;
  font-size: 0.95rem;
  font-weight: 900;
}

input,
textarea {
  width: 100%;
  border: 1px solid #d6deea;
  border-radius: 12px;
  background: #ffffff;
  color: #10264c;
  font-family: inherit;
  font-size: 0.98rem;
  font-weight: 800;
  outline: none;
  transform-origin: center;
  transition: border-color 0.3s ease, box-shadow 0.3s ease, background 0.3s ease, transform 0.3s ease;
}

input {
  min-height: 52px;
  padding: 0 16px;
}

textarea {
  min-height: 96px;
  padding: 15px 16px;
  resize: vertical;
}

input::placeholder,
textarea::placeholder {
  color: #8a9ab4;
  opacity: 1;
  transition: opacity 0.3s ease;
}

input:focus::placeholder,
textarea:focus::placeholder,
input:not(:placeholder-shown)::placeholder,
textarea:not(:placeholder-shown)::placeholder {
  opacity: 0.35;
}

input:focus,
textarea:focus {
  border-color: #69a7ff;
  background: #ffffff;
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

.error-message,
.map-error {
  margin: 0;
  color: #dc2626;
  font-size: 0.8rem;
  font-weight: 800;
  line-height: 1.4;
}

.map-preview {
  position: relative;
  min-height: 520px;
  overflow: hidden;
  border: 1px solid #dce8f8;
  border-radius: 18px;
  background: #edf5ff;
}

.google-map {
  position: absolute;
  inset: 0;
}

.map-state {
  position: absolute;
  inset: 0;
  z-index: 2;
  display: grid;
  place-items: center;
  gap: 10px;
  color: #1d64f2;
  background:
    radial-gradient(circle at center, rgba(37, 99, 235, 0.12), transparent 24%),
    linear-gradient(180deg, rgba(248, 251, 255, 0.94), rgba(238, 245, 255, 0.94));
  font-weight: 900;
  text-align: center;
}

.current-location-button,
.primary-action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  min-height: 46px;
  border-radius: 13px;
  font-family: inherit;
  font-weight: 900;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease, background 0.3s ease, opacity 0.3s ease;
}

.current-location-button {
  position: absolute;
  right: 18px;
  bottom: 18px;
  z-index: 3;
  padding: 0 18px;
  color: #1d64f2;
  background: rgba(255, 255, 255, 0.94);
  border: 1px solid #dce8f8;
  box-shadow: 0 14px 30px rgba(15, 31, 61, 0.14);
  backdrop-filter: blur(10px);
}

.current-location-button:hover,
.back-button:hover {
  transform: translateY(-2px);
  background: #eef5ff;
  box-shadow: 0 16px 30px rgba(29, 100, 242, 0.14);
}

.current-location-button:disabled {
  cursor: not-allowed;
  opacity: 0.68;
  transform: none;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.primary-action {
  min-width: 134px;
  padding: 0 18px;
}

.primary-action {
  color: #ffffff;
  background: linear-gradient(135deg, #0b63f6 0%, #1688ff 100%);
  border: 0;
  box-shadow: 0 14px 26px rgba(26, 115, 248, 0.2);
}

.primary-action:hover {
  transform: translateY(-3px);
  box-shadow: 0 20px 36px rgba(26, 115, 248, 0.3);
}

.primary-action:active,
.back-button:active,
.current-location-button:active {
  transform: scale(0.98);
}

@keyframes page-enter {
  from {
    opacity: 0;
    transform: translateY(24px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 980px) {
  .location-layout {
    grid-template-columns: 1fr;
  }

  .address-card,
  .map-card {
    grid-column: auto;
  }

  .map-card {
    order: 2;
  }

  .map-preview {
    min-height: 420px;
  }
}

@media (max-width: 720px) {
  .location-shell {
    padding: 22px 14px 42px;
  }

  .top-bar {
    margin-bottom: 18px;
  }

  .back-button {
    width: 100%;
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

  .address-card,
  .map-card {
    padding: 18px 16px;
    border-radius: 16px;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .map-preview {
    min-height: 320px;
  }

  .current-location-button {
    right: 12px;
    bottom: 12px;
    max-width: calc(100% - 24px);
  }

  .primary-action {
    width: 100%;
  }
}
</style>

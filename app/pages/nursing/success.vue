<template>
  <div>
    <NavBar />

    <main class="success-page" dir="rtl">
      <section class="success-shell">
        <header class="success-hero">
          <div class="success-mark" aria-hidden="true">
            <span class="glow-ring ring-one"></span>
            <span class="glow-ring ring-two"></span>
            <span class="success-circle">
              <Check :size="70" stroke-width="3.4" />
            </span>
            <span class="float-mark plus plus-one">+</span>
            <span class="float-mark plus plus-two">+</span>
            <span class="float-mark plus plus-three">+</span>
            <span class="float-mark dot dot-one"></span>
            <span class="float-mark dot dot-two"></span>
            <span class="float-mark dot dot-three"></span>
          </div>

          <h1>تم تأكيد طلب ممرض بنجاح</h1>
          <span class="title-line" aria-hidden="true"></span>
          <p>
            تم تأكيد موعد وصول الممرض بنجاح.<br>
            سنقوم بإرسال تفاصيل الطلب إلى بريدك الإلكتروني ورقم هاتفك.
          </p>
        </header>

        <article class="summary-card" aria-labelledby="summary-title">
          <header class="card-heading">
            <span class="heading-icon" aria-hidden="true">
              <ClipboardList :size="32" stroke-width="2.1" />
            </span>
            <h2 id="summary-title">ملخص الطلب</h2>
          </header>

          <section class="nurse-strip" aria-label="بيانات الممرض">
            <span class="nurse-avatar" aria-hidden="true">
              <img v-if="nurseImage" :src="nurseImage" :alt="`صورة ${nurseName}`">
              <UserRound v-else :size="58" stroke-width="1.75" />
            </span>
            <div>
              <h3>{{ nurseName }}</h3>
              <p>{{ nurseRole }}</p>
            </div>
          </section>

          <div class="divider"></div>

          <dl class="details-grid">
            <div v-for="item in detailItems" :key="item.label" class="detail-item">
              <dt>
                <component :is="item.icon" :size="30" stroke-width="2.25" aria-hidden="true" />
                <span>{{ item.label }}</span>
              </dt>
              <dd :class="{ accent: item.accent }">{{ item.value }}</dd>
            </div>
          </dl>
        </article>

        <aside class="security-box">
          <span class="security-icon" aria-hidden="true">
            <ShieldCheck :size="42" stroke-width="2.15" />
          </span>
          <div>
            <h2>حجزك مؤمن ومضمون</h2>
            <p>يمكنك إلغاء أو تعديل طلبك من خلال صفحة مواعيدي.</p>
          </div>
        </aside>

        <div class="actions">
          <NuxtLink class="primary-button" to="/patient/appointments">
            <CalendarCheck :size="26" stroke-width="2.25" aria-hidden="true" />
            <span>الذهاب إلى مواعيدي</span>
          </NuxtLink>

          <button class="secondary-button" type="button" @click="downloadDetails">
            <Download :size="26" stroke-width="2.25" aria-hidden="true" />
            <span>تحميل التفاصيل</span>
          </button>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import {
  CalendarCheck,
  Check,
  ClipboardList,
  Clock,
  CreditCard,
  Download,
  Hash,
  MapPin,
  NotebookText,
  Phone,
  ShieldCheck,
  Stethoscope,
  Tag,
  UserRound,
} from '@lucide/vue'

definePageMeta({
  title: 'تم تأكيد طلب ممرض بنجاح',
})

const bookingState = useState('nursingBooking', () => ({}))
const booking = computed(() => bookingState.value || {})
const defaultNurseRole = 'ممرض'

const hasBooking = computed(() => Boolean(
  booking.value.nurse
    || booking.value.service
    || booking.value.confirmation
    || booking.value.orderNumber,
))

if (!hasBooking.value) {
  await navigateTo('/nursing/select-nurse')
}

const paymentMethodLabels = {
  cash: 'الدفع نقداً',
  card: 'دفع بالبطاقة',
}

const displayValue = (value, fallback = 'غير محدد') => {
  if (value === null || value === undefined || value === '') {
    return fallback
  }

  return String(value)
}

const formatArabicDate = (value) => {
  if (!value) {
    return 'غير محدد'
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return String(value)
  }

  return new Intl.DateTimeFormat('ar', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

const formatTime = (value) => {
  if (!value) {
    return 'غير محدد'
  }

  const [hourValue, minuteValue = '00'] = String(value).split(':')
  const hour = Number(hourValue)

  if (!Number.isFinite(hour)) {
    return String(value)
  }

  const period = hour >= 12 ? 'مساءً' : 'صباحاً'
  const displayHour = hour % 12 || 12

  return `${displayHour.toString().padStart(2, '0')}:${minuteValue} ${period}`
}

const createOrderNumber = () => {
  const dateStamp = new Date().toISOString().slice(2, 10).replaceAll('-', '')
  const randomSegment = Math.floor(10000 + Math.random() * 90000)

  return `NR-${dateStamp}-${randomSegment}`
}

if (!booking.value.orderNumber) {
  bookingState.value = {
    ...booking.value,
    orderNumber: booking.value.confirmation?.orderNumber || createOrderNumber(),
  }
}

const nurseName = computed(() =>
  displayValue(booking.value.nurse?.name || booking.value.confirmation?.nurse?.name),
)

const nurseImage = computed(() =>
  booking.value.nurse?.image || booking.value.confirmation?.nurse?.image || '',
)

const nurseRole = computed(() =>
  displayValue(
    booking.value.nurse?.role
      || booking.value.nurse?.jobTitle
      || booking.value.confirmation?.nurse?.role
      || booking.value.confirmation?.nurse?.jobTitle,
    defaultNurseRole,
  )
)

const serviceName = computed(() =>
  displayValue(booking.value.service?.title || booking.value.confirmation?.service?.title),
)

const servicePrice = computed(() => {
  const price = booking.value.service?.price ?? booking.value.confirmation?.totalPrice

  if (price === null || price === undefined || price === '') {
    return 'غير محدد'
  }

  return `${price} شيكل`
})

const location = computed(() =>
  booking.value.location || booking.value.serviceLocation || booking.value.confirmation?.location || {},
)

const fullAddress = computed(() => {
  const value = location.value

  if (typeof value === 'string') {
    return value
  }

  return value.fullAddress
    || value.address
    || [value.city, value.area, value.street].filter(Boolean).join(' - ')
    || 'غير محدد'
})

const paymentMethod = computed(() =>
  booking.value.paymentMethod || booking.value.payment?.method || booking.value.confirmation?.paymentMethod,
)

const phoneNumber = computed(() =>
  displayValue(booking.value.patientInfo?.phone || booking.value.confirmation?.patientInfo?.phone),
)

const notes = computed(() =>
  displayValue(
    booking.value.notes
      || booking.value.patientInfo?.notes
      || booking.value.confirmation?.notes,
    'لا توجد ملاحظات',
  )
)

const orderNumber = computed(() =>
  displayValue(booking.value.orderNumber || booking.value.confirmation?.orderNumber),
)

const appointmentDate = computed(() =>
  formatArabicDate(booking.value.selectedDate || booking.value.date || booking.value.confirmation?.date),
)

const appointmentTime = computed(() =>
  formatTime(booking.value.selectedTime || booking.value.time || booking.value.confirmation?.time),
)

const detailItems = computed(() => [
  { label: 'السعر', value: servicePrice.value, icon: Tag },
  { label: 'الوقت', value: appointmentTime.value, icon: Clock },
  { label: 'نوع الخدمة', value: serviceName.value, icon: Stethoscope },
  { label: 'الموقع', value: fullAddress.value, icon: MapPin },
  { label: 'طريقة الدفع', value: paymentMethodLabels[paymentMethod.value] || displayValue(paymentMethod.value), icon: CreditCard },
  { label: 'رقم الطلب', value: orderNumber.value, icon: Hash, accent: true },
  { label: 'رقم الهاتف', value: phoneNumber.value, icon: Phone },
  { label: 'ملاحظات إضافية', value: notes.value, icon: NotebookText },
])

const escapeHtml = (value) =>
  displayValue(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')

const downloadDetails = () => {
  if (!import.meta.client) {
    return
  }

  const printWindow = window.open('', '_blank', 'width=900,height=900')

  if (!printWindow) {
    return
  }

  const paymentLabel = paymentMethodLabels[paymentMethod.value] || displayValue(paymentMethod.value)
  const summaryItems = [
    { label: 'رقم الطلب', value: orderNumber.value },
    { label: 'اسم الممرض', value: nurseName.value },
    { label: 'نوع الخدمة', value: serviceName.value },
    { label: 'السعر', value: servicePrice.value },
    { label: 'الوقت', value: appointmentTime.value },
    { label: 'الموقع', value: fullAddress.value },
    { label: 'طريقة الدفع', value: paymentLabel },
    { label: 'رقم الهاتف', value: phoneNumber.value },
    { label: 'ملاحظات إضافية', value: notes.value },
  ]

  printWindow.document.write(`
    <!doctype html>
    <html lang="ar" dir="rtl">
      <head>
        <title>nursing-request-details.pdf</title>
        <style>
          @page {
            size: A4 portrait;
            margin: 12mm;
          }

          * {
            box-sizing: border-box;
          }

          html,
          body {
            margin: 0;
            padding: 0;
            width: 100%;
            color: #10203f;
            background: #ffffff;
            direction: rtl;
            font-family: Tajawal, Arial, sans-serif;
          }

          .summary-card {
            width: 100%;
            margin: 0;
            padding: 22px;
            background: #ffffff;
            border: 1.5px solid #0b63f6;
            border-radius: 16px;
            box-shadow: none;
          }

          .summary-head {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 16px;
            margin-bottom: 20px;
          }

          .summary-head h2 {
            margin: 0;
            font-size: 22px;
            font-weight: 900;
          }

          .summary-head p {
            margin: 6px 0 0;
            color: #115bd2;
            font-weight: 900;
            direction: ltr;
            text-align: right;
          }

          .summary-icon {
            display: grid;
            width: 50px;
            height: 50px;
            place-items: center;
            color: #115bd2;
            background: #eaf2fd;
            border: 1px solid #8dbbfb;
            border-radius: 14px;
            font-size: 24px;
            font-weight: 900;
          }

          .doctor-strip {
            display: flex;
            align-items: center;
            gap: 16px;
            padding-bottom: 20px;
            margin-bottom: 20px;
            border-bottom: 1px solid #8dbbfb;
          }

          .doctor-icon {
            display: grid;
            width: 74px;
            height: 74px;
            place-items: center;
            color: #115bd2;
            background: #eaf2fd;
            border-radius: 999px;
            font-size: 34px;
            font-weight: 900;
            overflow: hidden;
          }

          .doctor-icon img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }

          .doctor-strip h3 {
            margin: 0 0 8px;
            font-size: 21px;
            font-weight: 900;
          }

          .doctor-strip p {
            margin: 0;
            color: #52627d;
            font-weight: 800;
          }

          .summary-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 0 22px;
            margin: 0;
          }

          .summary-item {
            padding: 15px 0;
            border-bottom: 1px dashed #8dbbfb;
          }

          .summary-item dt,
          .summary-item dd {
            margin: 0;
          }

          .summary-item dt {
            display: flex;
            align-items: center;
            gap: 8px;
            color: #52627d;
            font-weight: 800;
            justify-content: flex-start;
          }

          .summary-item dt::before {
            width: 8px;
            height: 8px;
            content: "";
            background: #115bd2;
            border-radius: 999px;
          }

          .summary-item dd {
            margin-top: 8px;
            color: #10203f;
            font-size: 16px;
            font-weight: 900;
            line-height: 1.5;
            overflow-wrap: anywhere;
          }

          @media print {
            html,
            body {
              print-color-adjust: exact;
              -webkit-print-color-adjust: exact;
            }
          }
        </style>
      </head>
      <body>
        <article class="summary-card" aria-labelledby="summary-title">
          <div class="summary-head">
            <div>
              <h2 id="summary-title">تفاصيل طلب الممرض</h2>
              <p>${escapeHtml(orderNumber.value)}</p>
            </div>
            <span class="summary-icon" aria-hidden="true">✓</span>
          </div>

          <div class="doctor-strip">
            <span class="doctor-icon" aria-hidden="true">
              ${nurseImage.value ? `<img src="${escapeHtml(nurseImage.value)}" alt="">` : '+'}
            </span>
            <div>
              <h3>${escapeHtml(nurseName.value)}</h3>
              <p>${escapeHtml(nurseRole.value)}</p>
            </div>
          </div>

          <dl class="summary-grid">
            ${summaryItems.map((item) => `
              <div class="summary-item">
                <dt>${escapeHtml(item.label)}</dt>
                <dd>${escapeHtml(item.value)}</dd>
              </div>
            `).join('')}
          </dl>
        </article>
      </body>
    </html>
  `)
  printWindow.document.close()
  printWindow.focus()

  window.setTimeout(() => {
    printWindow.print()
    printWindow.close()
  }, 250)
}
</script>

<style scoped>
.success-page {
  min-height: 100vh;
  color: #061f4a;
  background: linear-gradient(180deg, #f8fbff 0%, #eef5ff 100%);
  font-family: "Tajawal", sans-serif;
}

.success-shell {
  width: min(100%, 1040px);
  margin: 0 auto;
  padding: 24px 18px 40px;
}

.success-hero {
  display: grid;
  justify-items: center;
  text-align: center;
}

.success-mark {
  position: relative;
  display: grid;
  width: 150px;
  height: 150px;
  place-items: center;
  margin-bottom: 6px;
}

.glow-ring,
.success-circle,
.float-mark {
  position: absolute;
}

.ring-one {
  width: 132px;
  height: 132px;
  background: rgba(16, 185, 129, 0.08);
  border-radius: 999px;
}

.ring-two {
  width: 102px;
  height: 102px;
  background: rgba(16, 185, 129, 0.14);
  border-radius: 999px;
}

.success-circle {
  display: grid;
  width: 76px;
  height: 76px;
  place-items: center;
  color: #0bae59;
  background: #ffffff;
  border-radius: 999px;
  box-shadow: 0 24px 48px rgba(16, 185, 129, 0.2);
}

.success-circle svg {
  width: 48px;
  height: 48px;
}

.float-mark {
  color: #0aae58;
  font-size: 1.08rem;
  font-weight: 900;
  line-height: 1;
}

.plus-one {
  top: 28px;
  right: 4px;
}

.plus-two {
  top: 40px;
  left: 10px;
}

.plus-three {
  bottom: 32px;
  right: 24px;
}

.dot {
  width: 8px;
  height: 8px;
  border: 2px solid rgba(16, 185, 129, 0.42);
  border-radius: 999px;
}

.dot-one {
  top: 58px;
  right: 34px;
}

.dot-two {
  bottom: 44px;
  left: 38px;
}

.dot-three {
  bottom: 58px;
  right: 62px;
  width: 5px;
  height: 5px;
  border: 0;
  background: rgba(16, 185, 129, 0.32);
}

.success-hero h1 {
  margin: 0;
  color: #061f4a;
  font-size: clamp(1.85rem, 3.8vw, 2.8rem);
  font-weight: 900;
  line-height: 1.2;
}

.title-line {
  width: 72px;
  height: 4px;
  margin: 14px 0 16px;
  background: linear-gradient(90deg, #0a63ff, #0b79ff);
  border-radius: 999px;
}

.success-hero p {
  margin: 0;
  color: #132c59;
  font-size: clamp(0.94rem, 1.7vw, 1.08rem);
  font-weight: 800;
  line-height: 1.75;
}

.summary-card {
  width: min(100%, 900px);
  margin: 24px auto 0;
  padding: 26px 28px 28px;
  background: rgba(255, 255, 255, 0.96);
  border: 1px solid #cfe0f8;
  border-radius: 24px;
  box-shadow: 0 22px 58px rgba(29, 78, 216, 0.1);
}

.card-heading {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 18px;
}

.heading-icon {
  display: grid;
  width: 42px;
  height: 42px;
  place-items: center;
  color: #0b68ff;
}

.card-heading h2 {
  margin: 0;
  color: #071f4d;
  font-size: clamp(1.3rem, 2.5vw, 1.7rem);
  font-weight: 900;
}

.nurse-strip {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 18px;
  padding: 4px 8px 20px;
}

.nurse-avatar {
  display: grid;
  flex: 0 0 auto;
  width: 82px;
  height: 82px;
  place-items: center;
  color: #0b68ff;
  background: linear-gradient(145deg, #e7efff, #dbe8ff);
  border-radius: 999px;
  overflow: hidden;
}

.nurse-avatar svg {
  width: 44px;
  height: 44px;
}

.nurse-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.nurse-strip h3 {
  margin: 0 0 5px;
  color: #061f4a;
  font-size: clamp(1.18rem, 2.4vw, 1.45rem);
  font-weight: 900;
}

.nurse-strip p {
  margin: 0;
  color: #62718e;
  font-size: 0.95rem;
  font-weight: 800;
}

.divider {
  height: 1px;
  margin-bottom: 2px;
  background: #d8e4f3;
}

.details-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  margin: 0;
}

.detail-item {
  position: relative;
  display: grid;
  min-height: 92px;
  align-content: center;
  justify-items: start;
  gap: 7px;
  padding: 16px 22px;
  border-bottom: 1px dashed #d5e3f5;
}

.detail-item:nth-child(odd)::after {
  position: absolute;
  top: 18px;
  bottom: 18px;
  left: 0;
  width: 1px;
  content: "";
  background: #d8e4f3;
}

.detail-item:nth-last-child(-n + 2) {
  border-bottom: 0;
}

.detail-item dt,
.detail-item dd {
  margin: 0;
}

.detail-item dt {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: #6a7892;
  font-size: 0.92rem;
  font-weight: 900;
}

.detail-item dt svg {
  color: #0b68ff;
  width: 24px;
  height: 24px;
}

.detail-item dd {
  color: #0c2658;
  font-size: 0.92rem;
  font-weight: 800;
  line-height: 1.6;
  text-align: right;
  overflow-wrap: anywhere;
}

.detail-item dd.accent {
  color: #0866ff;
}

.security-box {
  display: flex;
  align-items: center;
  gap: 20px;
  width: min(100%, 900px);
  margin: 18px auto 0;
  padding: 18px 26px;
  color: #079b55;
  background: linear-gradient(135deg, rgba(236, 253, 245, 0.94), rgba(255, 255, 255, 0.9));
  border: 1px solid rgba(16, 185, 129, 0.24);
  border-radius: 16px;
  box-shadow: 0 16px 36px rgba(16, 185, 129, 0.07);
}

.security-icon {
  display: grid;
  flex: 0 0 auto;
  width: 56px;
  height: 56px;
  place-items: center;
  color: #ffffff;
  background: linear-gradient(145deg, #18b466, #069a4f);
  border-radius: 999px;
  box-shadow: 0 0 0 14px rgba(16, 185, 129, 0.1);
}

.security-icon svg {
  width: 32px;
  height: 32px;
}

.security-box h2 {
  margin: 0 0 5px;
  color: #059452;
  font-size: 1.12rem;
  font-weight: 900;
}

.security-box p {
  margin: 0;
  color: #6b7894;
  font-size: 0.96rem;
  font-weight: 800;
  line-height: 1.7;
}

.actions {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 22px;
  width: min(100%, 900px);
  margin: 22px auto 0;
}

.primary-button,
.secondary-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  min-height: 52px;
  padding: 0 22px;
  font: inherit;
  font-size: 1.06rem;
  font-weight: 900;
  text-decoration: none;
  border-radius: 12px;
  cursor: pointer;
  transition: transform 0.24s ease, box-shadow 0.24s ease, background 0.24s ease;
}

.primary-button {
  color: #ffffff;
  background: linear-gradient(135deg, #0861f4 0%, #047cff 100%);
  border: 0;
  box-shadow: 0 18px 34px rgba(8, 97, 244, 0.26);
}

.secondary-button {
  color: #0866ff;
  background: #ffffff;
  border: 2px solid #0866ff;
}

.primary-button:hover,
.secondary-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 22px 40px rgba(8, 97, 244, 0.2);
}

@media (max-width: 760px) {
  .success-shell {
    padding: 22px 12px 34px;
  }

  .success-mark {
    width: 132px;
    height: 132px;
  }

  .ring-one {
    width: 120px;
    height: 120px;
  }

  .ring-two {
    width: 94px;
    height: 94px;
  }

  .success-circle {
    width: 70px;
    height: 70px;
  }

  .success-hero h1 {
    font-size: 1.8rem;
  }

  .success-hero p {
    font-size: 0.98rem;
  }

  .title-line {
    margin: 18px 0 20px;
  }

  .summary-card {
    margin-top: 22px;
    padding: 20px 14px;
    border-radius: 18px;
  }

  .nurse-strip {
    gap: 16px;
    padding-inline: 0;
  }

  .nurse-avatar {
    width: 76px;
    height: 76px;
  }

  .details-grid,
  .actions {
    grid-template-columns: 1fr;
  }

  .detail-item {
    min-height: auto;
    padding: 15px 12px;
  }

  .detail-item:nth-child(odd)::after {
    display: none;
  }

  .detail-item:nth-last-child(2) {
    border-bottom: 1px dashed #d5e3f5;
  }

  .security-box {
    flex-direction: column;
    align-items: center;
    padding: 18px 16px;
    text-align: center;
  }

  .primary-button,
  .secondary-button {
    min-height: 50px;
    font-size: 1rem;
  }
}
</style>

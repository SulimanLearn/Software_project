<template>
    <NavBar />

  <main class="success-page" dir="rtl">
    <div class="ambient ambient-one" aria-hidden="true"></div>
    <div class="ambient ambient-two" aria-hidden="true"></div>

    <section class="success-shell">
      <header class="success-header">
        <div class="success-icon-wrap" aria-hidden="true">
          <span class="success-glow"></span>
          <span class="success-icon">
            <CheckCircle2 :size="72" stroke-width="2.1" />
          </span>
        </div>

        <h1>تم تأكيد الحجز بنجاح</h1>
        <span class="title-mark" aria-hidden="true"></span>
        <p>تم تأكيد موعدك لدى الطبيب بنجاح.</p>
        <p>سنقوم بإرسال تفاصيل الحجز إلى بريدك الإلكتروني ورقم هاتفك.</p>
      </header>

      <article v-if="hasBooking" ref="receiptCard" class="summary-card" aria-labelledby="summary-title">
        <div class="receipt-brand">
          <img src="/images/logo.png" alt="MediConnect" loading="eager">
          <div>
            <strong>MediConnect</strong>
            <span>إيصال حجز موعد</span>
          </div>
        </div>

        <div class="summary-head">
          <div>
            <h2 id="summary-title">ملخص الحجز</h2>
            <p v-if="booking.bookingNumber">{{ booking.bookingNumber }}</p>
          </div>
          <span class="summary-icon" aria-hidden="true">
            <ClipboardCheck :size="26" stroke-width="2" />
          </span>
        </div>

        <div class="doctor-strip">
          <span class="doctor-icon" aria-hidden="true">
            <Stethoscope :size="46" stroke-width="1.8" />
          </span>
          <div>
            <h3>{{ displayValue(booking.doctorName) }}</h3>
            <p>{{ displayValue(booking.specialty) }}</p>
          </div>
        </div>

        <dl class="summary-grid">
          <div v-for="item in summaryItems" :key="item.label" class="summary-item">
            <dt>
              <component :is="item.icon" :size="22" stroke-width="2.1" />
              <span>{{ item.label }}</span>
            </dt>
            <dd>{{ item.value }}</dd>
          </div>
        </dl>
      </article>

      <article v-else class="empty-card" role="alert">
        <span class="summary-icon" aria-hidden="true">
          <ClipboardCheck :size="30" stroke-width="1.9" />
        </span>
        <h2>لا توجد بيانات حجز مؤكدة</h2>
        <p>يرجى إكمال عملية الحجز والدفع أولاً لعرض ملخص الموعد.</p>
      </article>

      <aside v-if="hasBooking" class="security-box">
        <span aria-hidden="true">
          <ShieldCheck :size="34" stroke-width="2" />
        </span>
        <div>
          <h2>حجزك مؤمن و مضمون</h2>
          <p>يمكنك إلغاء أو تعديل موعدك من خلال صفحة مواعيدي</p>
        </div>
      </aside>

      <div class="actions">
        <NuxtLink class="primary-button" to="/patient/appointments">
          <CalendarCheck :size="22" stroke-width="2.2" />
          <span>الذهاب إلى مواعيدي</span>
        </NuxtLink>

        <button
          class="secondary-button"
          type="button"
          :disabled="isGeneratingPdf || !hasBooking"
          @click="downloadReceipt"
        >
          <LoaderCircle v-if="isGeneratingPdf" class="spin-icon" :size="22" stroke-width="2.2" />
          <Printer v-else :size="22" stroke-width="2.2" />
          <span>{{ isGeneratingPdf ? 'جاري تجهيز الإيصال...' : 'طباعة الإيصال' }}</span>
        </button>
      </div>
    </section>
  </main>
</template>

<script setup>
import { computed, ref } from 'vue'
import {
  CalendarCheck,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  Clock,
  CreditCard,
  Hash,
  LoaderCircle,
  Printer,
  ShieldCheck,
  Stethoscope,
  UserRound,
  Video,
  WalletCards,
} from '@lucide/vue'

definePageMeta({
  title: 'تم تأكيد الحجز بنجاح',
})

const bookingState = useState('confirmed-booking-summary', () => ({}))
const receiptCard = ref(null)
const isGeneratingPdf = ref(false)

const visitTypeLabels = {
  clinic: 'عيادة (في العيادة)',
  remote: 'عن بعد (استشارة مرئية)',
}

const paymentMethodLabels = {
  cash: 'الدفع نقداً',
  card: 'الدفع بالبطاقة',
}

const booking = computed(() => bookingState.value || {})

const hasBooking = computed(() => Boolean(
  booking.value.bookingNumber
    || booking.value.doctorName
    || booking.value.date
    || booking.value.time,
))

const displayValue = (value) => {
  if (value === null || value === undefined || value === '') {
    return 'غير متوفر'
  }

  return String(value)
}

const formatVisitType = (value) => visitTypeLabels[value] || displayValue(value)
const formatPaymentMethod = (value) => paymentMethodLabels[value] || displayValue(value)

const formatAmount = (value) => {
  if (value === null || value === undefined || value === '') {
    return 'غير متوفر'
  }

  const numericAmount = Number(value)

  if (Number.isFinite(numericAmount)) {
    return `${numericAmount.toLocaleString('ar')} ر.س`
  }

  return String(value)
}

const summaryItems = computed(() => [
  { label: 'اسم المريض', value: displayValue(booking.value.patientName), icon: UserRound },
  { label: 'تاريخ الزيارة', value: displayValue(booking.value.date), icon: CalendarDays },
  { label: 'وقت الزيارة', value: displayValue(booking.value.time), icon: Clock },
  { label: 'نوع الزيارة', value: formatVisitType(booking.value.visitType), icon: Video },
  { label: 'طريقة الدفع', value: formatPaymentMethod(booking.value.paymentMethod), icon: CreditCard },
  { label: 'المبلغ', value: formatAmount(booking.value.amount ?? booking.value.fee), icon: WalletCards },
  { label: 'رقم الحجز', value: displayValue(booking.value.bookingNumber), icon: Hash },
])

const downloadReceipt = () => {
  if (!receiptCard.value || isGeneratingPdf.value) {
    return
  }

  isGeneratingPdf.value = true

  const printWindow = window.open('', '_blank', 'width=900,height=900')

  if (!printWindow) {
    isGeneratingPdf.value = false
    return
  }

  printWindow.document.write(`
    <!doctype html>
    <html lang="ar" dir="rtl">
      <head>
        <title>booking-receipt-${displayValue(booking.value.bookingNumber)}</title>
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

          body {
            padding: 0;
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

          .receipt-brand {
            display: flex !important;
            align-items: center;
            gap: 12px;
            margin-bottom: 22px;
          }

          .receipt-brand img {
            width: 42px;
            height: 42px;
            object-fit: contain;
          }

          .receipt-brand strong,
          .receipt-brand span {
            display: block;
          }

          .receipt-brand strong {
            font-size: 18px;
          }

          .receipt-brand span {
            color: #52627d;
            font-weight: 800;
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
          }

          .doctor-strip {
            display: flex;
            align-items: center;
            gap: 16px;
            margin-bottom: 20px;
            padding-bottom: 20px;
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
          }

          .summary-item dt svg {
            color: #115bd2;
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
      <body>${receiptCard.value.outerHTML}</body>
    </html>
  `)
  printWindow.document.close()
  printWindow.focus()

  window.setTimeout(() => {
    printWindow.print()
    printWindow.close()
    isGeneratingPdf.value = false
  }, 250)
}
</script>

<style scoped>
.success-page {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
  color: #0f1f3d;
  background:
    radial-gradient(circle at 16% 12%, rgba(59, 130, 246, 0.13), transparent 28%),
    radial-gradient(circle at 82% 18%, rgba(14, 165, 233, 0.12), transparent 30%),
    linear-gradient(180deg, #ffffff 0%, #f8fbff 50%, #ffffff 100%);
}

.success-shell {
  position: relative;
  z-index: 1;
  width: min(100%, 980px);
  margin: 0 auto;
  padding: clamp(34px, 6vw, 72px) 20px 76px;
}

.ambient {
  position: absolute;
  border-radius: 999px;
  filter: blur(18px);
  opacity: 0.65;
  pointer-events: none;
}

.ambient-one {
  top: 130px;
  right: -96px;
  width: 230px;
  height: 230px;
  background: rgba(59, 130, 246, 0.13);
}

.ambient-two {
  bottom: 80px;
  left: -118px;
  width: 280px;
  height: 280px;
  background: rgba(125, 211, 252, 0.2);
}

.success-header {
  text-align: center;
}

.success-icon-wrap {
  position: relative;
  display: grid;
  width: 154px;
  height: 154px;
  place-items: center;
  margin: 0 auto 22px;
}

.success-glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle, rgba(34, 197, 94, 0.24) 0 34%, rgba(34, 197, 94, 0.12) 35% 51%, rgba(34, 197, 94, 0.05) 52% 70%, transparent 71%);
  border-radius: 999px;
}

.success-icon {
  position: relative;
  display: grid;
  width: 100px;
  height: 100px;
  place-items: center;
  color: #16a34a;
  background: rgba(255, 255, 255, 0.96);
  border-radius: 999px;
  box-shadow: 0 18px 38px rgba(22, 163, 74, 0.22);
}

.success-header h1 {
  margin: 0;
  color: #10203f;
  font-size: clamp(2.05rem, 5vw, 3.2rem);
  font-weight: 900;
  line-height: 1.18;
}

.title-mark {
  display: block;
  width: 78px;
  height: 4px;
  margin: 17px auto 26px;
  background: linear-gradient(90deg, #60a5fa, #2563eb);
  border-radius: 999px;
  box-shadow: 0 8px 20px rgba(37, 99, 235, 0.26);
}

.success-header p {
  margin: 0;
  color: #52627d;
  font-size: clamp(1rem, 2vw, 1.18rem);
  font-weight: 700;
  line-height: 1.85;
}

.summary-card,
.empty-card,
.security-box {
  width: min(100%, 860px);
  margin: 38px auto 0;
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.96), rgba(248, 251, 255, 0.9));
  border: 1px solid rgba(59, 130, 246, 0.25);
  border-radius: 24px;
  box-shadow: 0 24px 70px rgba(15, 31, 61, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.85);
}

.summary-card {
  padding: clamp(24px, 4vw, 36px);
}

.receipt-brand {
  display: none;
  align-items: center;
  gap: 12px;
  margin-bottom: 22px;
  color: #10203f;
}

.receipt-brand img {
  width: 42px;
  height: 42px;
  object-fit: contain;
}

.receipt-brand strong,
.receipt-brand span {
  display: block;
}

.receipt-brand span {
  color: #52627d;
  font-weight: 700;
}

.summary-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  margin-bottom: 26px;
}

.summary-head h2,
.security-box h2,
.empty-card h2 {
  margin: 0;
  color: #172b4d;
  font-size: clamp(1.35rem, 2.6vw, 1.8rem);
  font-weight: 900;
}

.summary-head p {
  margin: 7px 0 0;
  color: #2563eb;
  font-weight: 900;
  direction: ltr;
  text-align: right;
}

.summary-icon,
.doctor-icon {
  display: grid;
  place-items: center;
  color: #2563eb;
  background: rgba(239, 246, 255, 0.9);
  border: 1px solid rgba(59, 130, 246, 0.42);
}

.summary-icon {
  width: 54px;
  height: 54px;
  border-radius: 16px;
}

.doctor-strip {
  display: flex;
  align-items: center;
  gap: 18px;
  padding: 0 0 28px;
  margin-bottom: 28px;
  border-bottom: 1px solid rgba(148, 163, 184, 0.28);
}

.doctor-icon {
  flex: 0 0 auto;
  width: 82px;
  height: 82px;
  color: #2563eb;
  background: #eaf2ff;
  border: 0;
  border-radius: 999px;
}

.doctor-strip h3 {
  margin: 0 0 8px;
  color: #10203f;
  font-size: clamp(1.35rem, 3vw, 1.75rem);
  font-weight: 900;
}

.doctor-strip p {
  margin: 0;
  color: #66758d;
  font-weight: 800;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0 28px;
  margin: 0;
}

.summary-item {
  min-width: 0;
  padding: 20px 0;
  border-bottom: 1px dashed rgba(148, 163, 184, 0.35);
}

.summary-item dt,
.summary-item dd {
  margin: 0;
}

.summary-item dt {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #65758f;
  font-weight: 800;
}

.summary-item dt svg {
  flex: 0 0 auto;
  color: #2563eb;
}

.summary-item dd {
  margin-top: 10px;
  color: #10203f;
  font-size: 1.05rem;
  font-weight: 900;
  line-height: 1.6;
  overflow-wrap: anywhere;
}

.security-box {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 24px 28px;
  color: #047857;
  background: linear-gradient(135deg, rgba(240, 253, 244, 0.96), rgba(255, 255, 255, 0.94));
  border-color: rgba(16, 185, 129, 0.24);
  box-shadow: 0 18px 42px rgba(16, 185, 129, 0.08);
}

.security-box > span {
  display: grid;
  flex: 0 0 auto;
  width: 62px;
  height: 62px;
  place-items: center;
  background: rgba(22, 163, 74, 0.1);
  border-radius: 999px;
}

.security-box p,
.empty-card p {
  margin: 7px 0 0;
  color: #52627d;
  font-weight: 700;
  line-height: 1.8;
}

.actions {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;
  width: min(100%, 860px);
  margin: 34px auto 0;
}

.primary-button,
.secondary-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  min-height: 58px;
  padding: 0 24px;
  font: inherit;
  font-size: 1.05rem;
  font-weight: 900;
  text-decoration: none;
  border-radius: 16px;
  transition: transform 0.24s ease, box-shadow 0.24s ease, border-color 0.24s ease, opacity 0.24s ease;
}

.primary-button {
  color: #ffffff;
  background: linear-gradient(135deg, #2563eb 0%, #0ea5e9 100%);
  border: 0;
  box-shadow: 0 16px 30px rgba(37, 99, 235, 0.28);
}

.secondary-button {
  color: #1d4ed8;
  cursor: pointer;
  background: #ffffff;
  border: 1px solid rgba(37, 99, 235, 0.55);
}

.primary-button:hover,
.secondary-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 22px 38px rgba(37, 99, 235, 0.22);
}

.secondary-button:disabled {
  cursor: wait;
  opacity: 0.65;
  transform: none;
  box-shadow: none;
}

.empty-card {
  display: grid;
  justify-items: center;
  gap: 14px;
  padding: clamp(28px, 5vw, 46px);
  text-align: center;
}

.spin-icon {
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media print {
  .success-page {
    background: #ffffff;
  }

  .success-header,
  .security-box,
  .actions,
  .ambient {
    display: none;
  }

  .success-shell {
    padding: 0;
  }

  .summary-card {
    width: 100%;
    margin: 0;
    border: 0;
    box-shadow: none;
  }

  .receipt-brand {
    display: flex;
  }
}

@media (max-width: 720px) {
  .success-shell {
    padding-inline: 14px;
  }

  .success-icon-wrap {
    width: 132px;
    height: 132px;
  }

  .success-icon {
    width: 86px;
    height: 86px;
  }

  .summary-card {
    border-radius: 22px;
  }

  .summary-head,
  .doctor-strip,
  .security-box {
    align-items: flex-start;
  }

  .summary-grid,
  .actions {
    grid-template-columns: 1fr;
  }

  .doctor-strip,
  .security-box {
    flex-direction: column;
  }

  .primary-button,
  .secondary-button {
    width: 100%;
  }
}

.success-shell {
  width: min(100%, 900px);
  padding: clamp(24px, 4vw, 46px) 18px 48px;
}

.ambient-one {
  width: 185px;
  height: 185px;
}

.ambient-two {
  width: 225px;
  height: 225px;
}

.success-icon-wrap {
  width: 122px;
  height: 122px;
  margin-bottom: 16px;
}

.success-icon {
  width: 78px;
  height: 78px;
}

.success-icon svg {
  width: 56px;
  height: 56px;
}

.success-header h1 {
  font-size: clamp(1.75rem, 4vw, 2.55rem);
}

.title-mark {
  width: 62px;
  height: 3px;
  margin: 12px auto 18px;
}

.success-header p {
  font-size: clamp(0.92rem, 1.8vw, 1.03rem);
  line-height: 1.65;
}

.summary-card,
.empty-card,
.security-box {
  width: min(100%, 760px);
  margin-top: 28px;
  border-radius: 18px;
  box-shadow: 0 18px 48px rgba(15, 31, 61, 0.09), inset 0 1px 0 rgba(255, 255, 255, 0.85);
}

.summary-card {
  padding: clamp(18px, 3vw, 26px);
}

.summary-head {
  gap: 14px;
  margin-bottom: 18px;
}

.summary-head h2,
.security-box h2,
.empty-card h2 {
  font-size: clamp(1.12rem, 2.1vw, 1.42rem);
}

.summary-head p {
  margin-top: 5px;
  font-size: 0.9rem;
}

.summary-icon {
  width: 44px;
  height: 44px;
  border-radius: 13px;
}

.doctor-strip {
  gap: 14px;
  padding-bottom: 20px;
  margin-bottom: 18px;
}

.doctor-icon {
  width: 64px;
  height: 64px;
}

.doctor-icon svg {
  width: 36px;
  height: 36px;
}

.doctor-strip h3 {
  margin-bottom: 5px;
  font-size: clamp(1.12rem, 2.4vw, 1.42rem);
}

.doctor-strip p {
  font-size: 0.92rem;
}

.summary-grid {
  gap: 0 20px;
}

.summary-item {
  padding: 14px 0;
}

.summary-item dt {
  gap: 8px;
  font-size: 0.88rem;
}

.summary-item dt svg {
  width: 18px;
  height: 18px;
}

.summary-item dd {
  margin-top: 7px;
  font-size: 0.94rem;
  line-height: 1.45;
}

.security-box {
  gap: 15px;
  padding: 18px 22px;
}

.security-box > span {
  width: 50px;
  height: 50px;
}

.security-box p,
.empty-card p {
  margin-top: 5px;
  font-size: 0.9rem;
  line-height: 1.6;
}

.actions {
  width: min(100%, 760px);
  gap: 16px;
  margin-top: 24px;
}

.primary-button,
.secondary-button {
  min-height: 48px;
  gap: 9px;
  padding: 0 20px;
  font-size: 0.96rem;
  border-radius: 13px;
}

.empty-card {
  gap: 12px;
  padding: clamp(22px, 4vw, 34px);
}

@media (max-width: 720px) {
  .success-shell {
    padding: 22px 12px 38px;
  }

  .success-icon-wrap {
    width: 104px;
    height: 104px;
  }

  .success-icon {
    width: 68px;
    height: 68px;
  }

  .success-icon svg {
    width: 48px;
    height: 48px;
  }

  .summary-card,
  .empty-card,
  .security-box {
    margin-top: 22px;
    border-radius: 16px;
  }

  .doctor-strip,
  .security-box {
    gap: 12px;
  }
}
</style>

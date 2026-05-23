<template>
  <div class="doctor-schedule-page" dir="rtl">
    <NavBar />

    <div class="doctor-schedule-shell">
      <DoctorSidebar :doctor="doctor" @logout="showLogoutModal = true" />

      <main class="doctor-schedule-content">
        <header class="schedule-header">
          <div class="header-copy">
            <h1>جدول العمل</h1>
            <p>إدارة فترات التوفر الأسبوعية ومتابعة حالة كل فترة خلال أيام الأسبوع.</p>
          </div>

          <div class="header-actions">
            <div class="week-controls" aria-label="التنقل بين الأسابيع">
              <button type="button" aria-label="الأسبوع السابق" @click="goToPreviousWeek">
                <ChevronRight :size="19" :stroke-width="2.4" aria-hidden="true" />
              </button>
              <strong class="week-range" :class="{ 'is-week-changing': isWeekChanging }">
                {{ weekDateRange }}
              </strong>
              <button type="button" aria-label="الأسبوع التالي" @click="goToNextWeek">
                <ChevronLeft :size="19" :stroke-width="2.4" aria-hidden="true" />
              </button>
            </div>

            <button class="add-period-button" type="button" @click="openAddPeriodModal">
              <Plus :size="18" :stroke-width="2.5" aria-hidden="true" />
              إضافة فترة
            </button>
          </div>
        </header>

        <section class="schedule-card" aria-labelledby="schedule-calendar-title">
          <div class="section-header">
            <div>
              <h2 id="schedule-calendar-title">التوفر الأسبوعي</h2>
              <span>{{ visiblePeriodsCount }} فترة مجدولة</span>
            </div>

            <div class="status-legend" aria-label="دليل الحالات">
              <span v-for="status in legendStatuses" :key="status.value" class="legend-item">
                <i :class="status.value" aria-hidden="true" />
                {{ status.label }}
              </span>
            </div>
          </div>

          <div class="calendar-scroll">
            <div class="schedule-grid" role="table" aria-label="جدول العمل الأسبوعي">
              <div class="grid-cell corner-cell" role="columnheader">
                الفترة
              </div>

              <div
                v-for="day in days"
                :key="day.key"
                class="grid-cell day-cell"
                :class="{ 'is-week-changing': isWeekChanging }"
                role="columnheader"
              >
                <strong>{{ day.label }}</strong>
                <span>{{ dayDateLabel(day.index) }}</span>
              </div>

              <template v-for="period in periods" :key="period.key">
                <div class="grid-cell period-cell" role="rowheader">
                  <strong>{{ period.label }}</strong>
                  <span>{{ period.time }}</span>
                </div>

                <button
                  v-for="day in days"
                  :key="`${period.key}-${day.key}`"
                  class="grid-cell schedule-slot"
                  :class="scheduleClassFor(slotFor(day.key, period.key))"
                  type="button"
                  role="cell"
                  @click="openCellEditor(day.key, period.key)"
                >
                  <span class="slot-status">
                    {{ statusLabelFor(slotFor(day.key, period.key).status) }}
                  </span>
                  <span class="slot-time">
                    {{ slotFor(day.key, period.key).startTime }} - {{ slotFor(day.key, period.key).endTime }}
                  </span>
                  <small v-if="slotFor(day.key, period.key).notes">
                    {{ slotFor(day.key, period.key).notes }}
                  </small>
                </button>
              </template>
            </div>
          </div>
        </section>
      </main>
    </div>

    <div
      v-if="activeModal"
      class="modal-overlay"
      dir="rtl"
      @click.self="closeScheduleModal"
    >
      <form
        class="schedule-modal"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="activeModal === 'add' ? 'add-period-title' : 'edit-period-title'"
        @submit.prevent="saveScheduleForm"
      >
        <div class="modal-header">
          <div>
            <h2 :id="activeModal === 'add' ? 'add-period-title' : 'edit-period-title'">
              {{ activeModal === 'add' ? 'إضافة فترة' : 'تعديل الفترة' }}
            </h2>
            <p>{{ modalSubtitle }}</p>
          </div>
          <button type="button" aria-label="إغلاق" @click="closeScheduleModal">
            <X :size="20" :stroke-width="2.5" aria-hidden="true" />
          </button>
        </div>

        <div class="modal-fields">
          <label class="form-field">
            <span>اليوم</span>
            <select v-model="scheduleForm.dayKey" :disabled="activeModal === 'edit'">
              <option v-for="day in days" :key="day.key" :value="day.key">
                {{ day.label }}
              </option>
            </select>
          </label>

          <label class="form-field">
            <span>الفترة</span>
            <select v-model="scheduleForm.periodKey" :disabled="activeModal === 'edit'">
              <option v-for="period in periods" :key="period.key" :value="period.key">
                {{ period.label }} - {{ period.time }}
              </option>
            </select>
          </label>

          <label class="form-field">
            <span>وقت البداية</span>
            <input v-model="scheduleForm.startTime" type="time">
          </label>

          <label class="form-field">
            <span>وقت النهاية</span>
            <input v-model="scheduleForm.endTime" type="time">
          </label>

          <label class="form-field">
            <span>الحالة</span>
            <select v-model="scheduleForm.status">
              <option v-for="status in statusOptions" :key="status.value" :value="status.value">
                {{ status.label }}
              </option>
            </select>
          </label>

          <label class="toggle-field">
            <input v-model="scheduleForm.isVacation" type="checkbox">
            <span>إجازة / يوم عطلة</span>
          </label>

          <label v-if="activeModal === 'add'" class="toggle-field">
            <input v-model="scheduleForm.repeatWeekly" type="checkbox">
            <span>تكرار أسبوعياً</span>
          </label>

          <label class="form-field notes-field">
            <span>ملاحظات</span>
            <textarea v-model.trim="scheduleForm.notes" rows="4" placeholder="مثال: مواعيد متابعة فقط" />
          </label>
        </div>

        <div class="modal-actions">
          <button class="save-button" type="submit">
            حفظ
          </button>
          <button class="cancel-button" type="button" @click="closeScheduleModal">
            إلغاء
          </button>
        </div>
      </form>
    </div>

    <div
      v-if="showLogoutModal"
      class="modal-overlay"
      dir="rtl"
      @click.self="showLogoutModal = false"
    >
      <div
        class="confirmation-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="logout-modal-title"
      >
        <h2 id="logout-modal-title">تسجيل الخروج</h2>
        <p>هل انت متاكد انك تريد تسجيل الخروج؟</p>

        <div class="modal-actions">
          <button class="save-button" type="button" @click="confirmLogout">
            نعم
          </button>
          <button class="cancel-button" type="button" @click="showLogoutModal = false">
            لا
          </button>
        </div>
      </div>
    </div>

    <div v-if="toastMessage" class="toast-message" role="status">
      {{ toastMessage }}
    </div>
  </div>
</template>

<script setup>
import { ChevronLeft, ChevronRight, Plus, X } from '@lucide/vue'
import DoctorSidebar from '~/components/doctor/DoctorSidebar.vue'

const showLogoutModal = ref(false)
const activeModal = ref(null)
const toastMessage = ref('')
const isWeekChanging = ref(false)
let toastTimer
let weekFeedbackTimer

const isLoggedIn = useState('isLoggedIn', () => false)
const user = useState('user', () => ({ name: '' }))

const doctor = {
  name: 'د. خالد السيد',
  specialization: 'أمراض القلب',
  avatar: '/images/doctor.png'
}

const days = [
  { key: 'sunday', label: 'الأحد', index: 0 },
  { key: 'monday', label: 'الاثنين', index: 1 },
  { key: 'tuesday', label: 'الثلاثاء', index: 2 },
  { key: 'wednesday', label: 'الأربعاء', index: 3 },
  { key: 'thursday', label: 'الخميس', index: 4 },
  { key: 'friday', label: 'الجمعة', index: 5 },
  { key: 'saturday', label: 'السبت', index: 6 }
]

const periods = [
  { key: 'morning', label: 'صباحاً', time: '08:00 - 12:00', startTime: '08:00', endTime: '12:00' },
  { key: 'afternoon', label: 'مساءً', time: '01:00 - 05:00', startTime: '13:00', endTime: '17:00' },
  { key: 'evening', label: 'مساءً', time: '05:00 - 09:00', startTime: '17:00', endTime: '21:00' }
]

const statusOptions = [
  { value: 'available', label: 'متاح' },
  { value: 'unavailable', label: 'غير متاح' },
  { value: 'vacation', label: 'إجازة' },
  { value: 'fullyBooked', label: 'محجوز بالكامل' },
  { value: 'empty', label: 'لا يوجد فترة' }
]

const legendStatuses = statusOptions

const currentWeekStart = ref(getStartOfWeek(new Date(2026, 3, 20)))

const scheduleSlots = ref([
  { dayKey: 'sunday', periodKey: 'morning', startTime: '08:00', endTime: '12:00', status: 'available', notes: 'عيادة عامة' },
  { dayKey: 'sunday', periodKey: 'afternoon', startTime: '13:00', endTime: '17:00', status: 'unavailable', notes: 'اجتماع داخلي' },
  { dayKey: 'sunday', periodKey: 'evening', startTime: '17:00', endTime: '21:00', status: 'empty', notes: '' },
  { dayKey: 'monday', periodKey: 'morning', startTime: '08:00', endTime: '12:00', status: 'available', notes: '' },
  { dayKey: 'monday', periodKey: 'afternoon', startTime: '13:00', endTime: '17:00', status: 'empty', notes: '' },
  { dayKey: 'monday', periodKey: 'evening', startTime: '17:00', endTime: '21:00', status: 'empty', notes: '' },
  { dayKey: 'tuesday', periodKey: 'morning', startTime: '08:00', endTime: '12:00', status: 'available', notes: '' },
  { dayKey: 'tuesday', periodKey: 'afternoon', startTime: '13:00', endTime: '17:00', status: 'empty', notes: '' },
  { dayKey: 'tuesday', periodKey: 'evening', startTime: '17:00', endTime: '21:00', status: 'empty', notes: '' },
  { dayKey: 'wednesday', periodKey: 'morning', startTime: '08:00', endTime: '12:00', status: 'available', notes: '' },
  { dayKey: 'wednesday', periodKey: 'afternoon', startTime: '13:00', endTime: '17:00', status: 'empty', notes: '' },
  { dayKey: 'wednesday', periodKey: 'evening', startTime: '17:00', endTime: '21:00', status: 'empty', notes: '' },
  { dayKey: 'thursday', periodKey: 'morning', startTime: '08:00', endTime: '12:00', status: 'available', notes: '' },
  { dayKey: 'thursday', periodKey: 'afternoon', startTime: '13:00', endTime: '17:00', status: 'unavailable', notes: 'غير متاح' },
  { dayKey: 'thursday', periodKey: 'evening', startTime: '17:00', endTime: '21:00', status: 'available', notes: '' },
  { dayKey: 'friday', periodKey: 'morning', startTime: '08:00', endTime: '12:00', status: 'vacation', notes: 'إجازة أسبوعية' },
  { dayKey: 'friday', periodKey: 'afternoon', startTime: '13:00', endTime: '17:00', status: 'fullyBooked', notes: 'متابعة حالات' },
  { dayKey: 'friday', periodKey: 'evening', startTime: '17:00', endTime: '21:00', status: 'available', notes: '' },
  { dayKey: 'saturday', periodKey: 'morning', startTime: '08:00', endTime: '12:00', status: 'empty', notes: '' },
  { dayKey: 'saturday', periodKey: 'afternoon', startTime: '13:00', endTime: '17:00', status: 'available', notes: '' },
  { dayKey: 'saturday', periodKey: 'evening', startTime: '17:00', endTime: '21:00', status: 'empty', notes: '' }
])

const scheduleForm = reactive({
  dayKey: 'sunday',
  periodKey: 'morning',
  startTime: '08:00',
  endTime: '12:00',
  status: 'available',
  isVacation: false,
  repeatWeekly: true,
  notes: ''
})

const visiblePeriodsCount = computed(() => {
  return scheduleSlots.value.filter((slot) => slot.status !== 'empty').length
})

const weekDateRange = computed(() => {
  const start = currentWeekStart.value
  const end = addDays(start, 6)
  return `${formatDate(start)} - ${formatDate(end)}`
})

const modalSubtitle = computed(() => {
  const day = days.find((item) => item.key === scheduleForm.dayKey)
  const period = periods.find((item) => item.key === scheduleForm.periodKey)
  return `${day?.label || ''}، ${period?.label || ''} ${period?.time || ''}`
})

watch(
  () => scheduleForm.isVacation,
  (isVacation) => {
    if (isVacation) {
      scheduleForm.status = 'vacation'
    }
  }
)

watch(
  () => scheduleForm.periodKey,
  (periodKey) => {
    if (activeModal.value !== 'add') {
      return
    }

    const period = periods.find((item) => item.key === periodKey)
    if (period) {
      scheduleForm.startTime = period.startTime
      scheduleForm.endTime = period.endTime
    }
  }
)

function getStartOfWeek(date) {
  const start = new Date(date)
  start.setHours(0, 0, 0, 0)
  start.setDate(start.getDate() - start.getDay())
  return start
}

function addDays(date, amount) {
  const nextDate = new Date(date)
  nextDate.setDate(nextDate.getDate() + amount)
  return nextDate
}

function formatDate(date) {
  return new Intl.DateTimeFormat('ar-u-nu-latn', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(date)
}

function dayDateLabel(dayIndex) {
  return new Intl.DateTimeFormat('ar-u-nu-latn', {
    day: 'numeric',
    month: 'short'
  }).format(addDays(currentWeekStart.value, dayIndex))
}

function triggerWeekChangeFeedback() {
  isWeekChanging.value = false
  clearTimeout(weekFeedbackTimer)

  requestAnimationFrame(() => {
    isWeekChanging.value = true
    weekFeedbackTimer = setTimeout(() => {
      isWeekChanging.value = false
    }, 720)
  })
}

function goToPreviousWeek() {
  currentWeekStart.value = addDays(currentWeekStart.value, -7)
  triggerWeekChangeFeedback()
}

function goToNextWeek() {
  currentWeekStart.value = addDays(currentWeekStart.value, 7)
  triggerWeekChangeFeedback()
}

function slotFor(dayKey, periodKey) {
  return scheduleSlots.value.find((slot) => slot.dayKey === dayKey && slot.periodKey === periodKey) || {
    dayKey,
    periodKey,
    startTime: periods.find((period) => period.key === periodKey)?.startTime || '08:00',
    endTime: periods.find((period) => period.key === periodKey)?.endTime || '12:00',
    status: 'empty',
    notes: ''
  }
}

function statusLabelFor(status) {
  return statusOptions.find((item) => item.value === status)?.label || 'لا يوجد فترة'
}

function scheduleClassFor(slot) {
  return `slot-${slot.status}`
}

function openCellEditor(dayKey, periodKey) {
  const slot = slotFor(dayKey, periodKey)
  Object.assign(scheduleForm, {
    dayKey,
    periodKey,
    startTime: slot.startTime,
    endTime: slot.endTime,
    status: slot.status,
    isVacation: slot.status === 'vacation',
    repeatWeekly: true,
    notes: slot.notes
  })
  activeModal.value = 'edit'
}

function openAddPeriodModal() {
  Object.assign(scheduleForm, {
    dayKey: 'sunday',
    periodKey: 'morning',
    startTime: '08:00',
    endTime: '12:00',
    status: 'available',
    isVacation: false,
    repeatWeekly: true,
    notes: ''
  })
  activeModal.value = 'add'
}

function closeScheduleModal() {
  activeModal.value = null
}

function saveScheduleForm() {
  const nextSlot = {
    dayKey: scheduleForm.dayKey,
    periodKey: scheduleForm.periodKey,
    startTime: scheduleForm.startTime,
    endTime: scheduleForm.endTime,
    status: scheduleForm.isVacation ? 'vacation' : scheduleForm.status,
    notes: scheduleForm.notes
  }

  const existingIndex = scheduleSlots.value.findIndex((slot) => {
    return slot.dayKey === nextSlot.dayKey && slot.periodKey === nextSlot.periodKey
  })

  if (existingIndex >= 0) {
    scheduleSlots.value.splice(existingIndex, 1, nextSlot)
  } else {
    scheduleSlots.value.push(nextSlot)
  }

  // Future API integration point: persist nextSlot and repeatWeekly to the backend.
  showToast(activeModal.value === 'add' ? 'تمت إضافة الفترة بنجاح' : 'تم تحديث الفترة بنجاح')
  closeScheduleModal()
}

function showToast(message) {
  toastMessage.value = message
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => {
    toastMessage.value = ''
  }, 2600)
}

const confirmLogout = async () => {
  isLoggedIn.value = false
  user.value = { name: '' }
  showLogoutModal.value = false
  await navigateTo('/login')
}

onBeforeUnmount(() => {
  clearTimeout(toastTimer)
  clearTimeout(weekFeedbackTimer)
})
</script>

<style scoped>
.doctor-schedule-page {
  min-height: 100vh;
  background-color: #ffffff;
  color: #101010;
}

.doctor-schedule-shell {
  display: grid;
  grid-template-columns: 290px minmax(0, 1fr);
  min-height: calc(100vh - 85px);
}

.doctor-schedule-content {
  grid-column: 2;
  grid-row: 1;
  padding: 36px 40px 44px;
}

.schedule-header {
  align-items: flex-start;
  display: flex;
  justify-content: space-between;
  gap: 22px;
  margin-bottom: 24px;
}

.header-copy h1 {
  font-size: 30px;
  font-weight: 900;
  margin: 0 0 8px;
}

.header-copy p {
  color: #343434;
  font-size: 16px;
  font-weight: 700;
  margin: 0;
}

.header-actions {
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  justify-content: flex-start;
}

.week-controls {
  align-items: center;
  background-color: #f3f8ff;
  border: 1.5px solid #9bc3ff;
  border-radius: 22px;
  box-shadow: 0 10px 24px rgba(17, 91, 210, 0.08);
  display: inline-flex;
  gap: 10px;
  min-height: 50px;
  padding: 6px 10px;
}

.week-range {
  background-color: #ffffff;
  border: 1px solid #cfe1fb;
  border-radius: 16px;
  color: #101010;
  font-size: 16px;
  font-weight: 900;
  min-width: 258px;
  padding: 9px 18px;
  text-align: center;
  transition: background-color 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease, color 0.25s ease;
}

.week-range.is-week-changing {
  animation: weekRangeFlash 720ms ease;
}

.week-controls button,
.modal-header button {
  align-items: center;
  background-color: #ffffff;
  border: 1px solid #8dbbfb;
  border-radius: 14px;
  color: #115bd2;
  cursor: pointer;
  display: inline-flex;
  height: 36px;
  justify-content: center;
  padding: 0;
  transition: background-color 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
  width: 38px;
}

.week-controls button:hover {
  box-shadow: 0 8px 16px rgba(17, 91, 210, 0.16);
}

.week-controls button:hover,
.modal-header button:hover {
  background-color: #5a99ef;
  border-color: #0b63f6;
  color: #ffffff;
  transform: translateY(-1px);
}

.add-period-button,
.save-button,
.cancel-button {
  align-items: center;
  border-radius: 18px;
  cursor: pointer;
  display: inline-flex;
  font-family: inherit;
  font-weight: 900;
  justify-content: center;
  transition: background-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
}

.add-period-button,
.save-button {
  background-color: #115bd2;
  border: 1px solid #115bd2;
  color: #ffffff;
}

.add-period-button {
  gap: 8px;
  min-height: 50px;
  min-width: 146px;
  padding: 10px 18px;
}

.add-period-button:hover,
.save-button:hover {
  background-color: #0b4db8;
  box-shadow: 0 8px 18px rgba(17, 91, 210, 0.22);
  transform: translateY(-1px);
}

.schedule-card {
  background-color: #eaf2fd;
  border: 1.5px solid #0b63f6;
  border-radius: 24px;
  padding: 24px;
}

.section-header {
  align-items: flex-start;
  display: flex;
  justify-content: space-between;
  gap: 18px;
  margin-bottom: 20px;
}

.section-header h2 {
  font-size: 22px;
  font-weight: 900;
  margin: 0 0 6px;
}

.section-header span {
  color: #343434;
  font-size: 15px;
  font-weight: 800;
}

.status-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: flex-start;
}

.legend-item {
  align-items: center;
  background-color: #ffffff;
  border: 1px solid #d4e3f8;
  border-radius: 999px;
  color: #343434;
  display: inline-flex;
  font-size: 13px;
  font-weight: 900;
  gap: 7px;
  padding: 7px 11px;
}

.legend-item i {
  border-radius: 999px;
  display: inline-block;
  height: 9px;
  width: 9px;
}

.legend-item i.available {
  background-color: #1f9d63;
}

.legend-item i.unavailable {
  background-color: #d92d20;
}

.legend-item i.vacation,
.legend-item i.empty {
  background-color: #8b96a7;
}

.legend-item i.fullyBooked {
  background-color: #d99009;
}

.calendar-scroll {
  overflow-x: auto;
  padding: 2px 2px 6px;
}

.schedule-grid {
  background-color: #dceaff;
  border: 1px solid #dceaff;
  border-radius: 20px;
  display: grid;
  gap: 1px;
  grid-auto-rows: minmax(94px, auto);
  grid-template-columns: repeat(8, minmax(136px, 1fr));
  min-width: 1120px;
  overflow: hidden;
}

.grid-cell {
  align-items: center;
  background-color: #ffffff;
  border: 0;
  display: flex;
  justify-content: center;
  min-height: 94px;
  padding: 14px 12px;
  transition: background-color 0.25s ease, box-shadow 0.25s ease, color 0.25s ease;
}

.corner-cell {
  background-color: #f7fbff;
  color: #343434;
  font-weight: 900;
}

.day-cell {
  background-color: #f9fcff;
  flex-direction: column;
  gap: 5px;
}

.day-cell strong {
  font-size: 16px;
  font-weight: 900;
}

.day-cell.is-week-changing {
  animation: dayHeaderFlash 720ms ease;
}

.day-cell.is-week-changing span {
  color: #115bd2;
}

.day-cell span,
.period-cell span,
.slot-time,
.schedule-slot small {
  color: #5e6776;
  font-size: 13px;
  font-weight: 800;
}

.period-cell {
  align-items: flex-start;
  background-color: #f7fbff;
  flex-direction: column;
  gap: 6px;
}

.period-cell strong {
  font-size: 17px;
  font-weight: 900;
}

.schedule-slot {
  cursor: pointer;
  flex-direction: column;
  font-family: inherit;
  gap: 8px;
  outline: none;
  text-align: center;
  transition: background-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
}

.schedule-slot:hover,
.schedule-slot:focus-visible {
  box-shadow: inset 0 0 0 2px #0b63f6, 0 8px 18px rgba(17, 91, 210, 0.13);
  transform: translateY(-1px);
  z-index: 1;
}

.slot-status {
  align-items: center;
  border-radius: 999px;
  display: inline-flex;
  font-size: 13px;
  font-weight: 900;
  justify-content: center;
  min-width: 86px;
  padding: 7px 12px;
  white-space: nowrap;
}

.slot-available .slot-status {
  background-color: #dff3e7;
  color: #137446;
}

.slot-unavailable .slot-status {
  background-color: #ffe4e4;
  color: #b42318;
}

.slot-vacation .slot-status,
.slot-empty .slot-status {
  background-color: #eef2f7;
  color: #667085;
}

.slot-fullyBooked .slot-status {
  background-color: #fff2d8;
  color: #9a6507;
}

.slot-empty .slot-time {
  color: #9aa4b2;
}

@keyframes dayHeaderFlash {
  0% {
    background-color: #f9fcff;
    box-shadow: inset 0 0 0 0 rgba(17, 91, 210, 0);
  }

  28% {
    background-color: #dcecff;
    box-shadow: inset 0 -3px 0 rgba(17, 91, 210, 0.16);
  }

  100% {
    background-color: #f9fcff;
    box-shadow: inset 0 0 0 0 rgba(17, 91, 210, 0);
  }
}

@keyframes weekRangeFlash {
  0% {
    background-color: #ffffff;
    border-color: #cfe1fb;
    box-shadow: none;
  }

  30% {
    background-color: #e3f0ff;
    border-color: #7fb2ff;
    box-shadow: 0 8px 18px rgba(17, 91, 210, 0.12);
  }

  100% {
    background-color: #ffffff;
    border-color: #cfe1fb;
    box-shadow: none;
  }
}

.modal-overlay {
  align-items: center;
  background-color: rgba(68, 139, 239, 0.38);
  display: flex;
  inset: 0;
  justify-content: center;
  padding: 24px;
  position: fixed;
  z-index: 2000;
}

.schedule-modal,
.confirmation-modal {
  background-color: #eaf2fd;
  border: 1.5px solid #0b63f6;
  border-radius: 24px;
  box-shadow: 0 18px 45px rgba(0, 0, 0, 0.12);
  max-width: 100%;
}

.schedule-modal {
  padding: 28px;
  width: 720px;
}

.modal-header {
  align-items: flex-start;
  display: flex;
  gap: 16px;
  justify-content: space-between;
  margin-bottom: 22px;
}

.modal-header h2,
.confirmation-modal h2 {
  font-size: 26px;
  font-weight: 900;
  margin: 0 0 8px;
}

.modal-header p {
  color: #343434;
  font-size: 15px;
  font-weight: 800;
  margin: 0;
}

.modal-fields {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.form-field {
  display: grid;
  gap: 8px;
}

.form-field span,
.toggle-field span {
  color: #343434;
  font-size: 14px;
  font-weight: 900;
}

.form-field input,
.form-field select,
.form-field textarea {
  background-color: #ffffff;
  border: 1px solid #8dbbfb;
  border-radius: 16px;
  color: #101010;
  font-family: inherit;
  font-size: 15px;
  font-weight: 800;
  min-height: 44px;
  outline: none;
  padding: 0 14px;
}

.form-field textarea {
  padding: 12px 14px;
  resize: vertical;
}

.form-field input:focus,
.form-field select:focus,
.form-field textarea:focus {
  border-color: #0b63f6;
  box-shadow: 0 0 0 3px rgba(90, 153, 239, 0.2);
}

.form-field input[type='time'] {
  direction: ltr;
  text-align: right;
}

.form-field select:disabled {
  color: #667085;
  opacity: 0.75;
}

.notes-field {
  grid-column: 1 / -1;
}

.toggle-field {
  align-items: center;
  background-color: #ffffff;
  border: 1px solid #d4e3f8;
  border-radius: 16px;
  display: flex;
  gap: 10px;
  min-height: 44px;
  padding: 0 14px;
}

.toggle-field input {
  accent-color: #115bd2;
  height: 18px;
  width: 18px;
}

.modal-actions {
  display: flex;
  gap: 14px;
  justify-content: flex-start;
  margin-top: 24px;
}

.modal-actions button {
  font-size: 17px;
  min-width: 110px;
  padding: 10px 22px;
}

.cancel-button {
  background-color: #ffffff;
  border: 1px solid #0b63f6;
  color: #115bd2;
}

.cancel-button:hover {
  background-color: #dcecff;
  transform: translateY(-1px);
}

.confirmation-modal {
  padding: 42px 44px 34px;
  text-align: center;
  width: 560px;
}

.confirmation-modal p {
  font-size: 22px;
  font-weight: 800;
  margin: 0 0 30px;
}

.confirmation-modal .modal-actions {
  justify-content: center;
}

.toast-message {
  background-color: #115bd2;
  border-radius: 14px;
  bottom: 24px;
  color: #ffffff;
  font-weight: 900;
  left: 24px;
  padding: 12px 18px;
  position: fixed;
  z-index: 3000;
}

@media (max-width: 1100px) {
  .doctor-schedule-shell {
    grid-template-columns: 240px minmax(0, 1fr);
  }

  .doctor-schedule-content {
    padding: 32px 24px 48px;
  }

  .schedule-header,
  .section-header {
    align-items: stretch;
    flex-direction: column;
  }
}

@media (max-width: 720px) {
  .doctor-schedule-shell {
    display: flex;
    flex-direction: column;
  }

  .doctor-schedule-content {
    padding: 32px 18px 44px;
  }

  .header-copy h1 {
    font-size: 26px;
  }

  .header-actions {
    align-items: stretch;
    flex-direction: column;
  }

  .week-controls {
    justify-content: space-between;
    width: 100%;
  }

  .week-range {
    min-width: 0;
    width: 100%;
  }

  .add-period-button {
    width: 100%;
  }

  .schedule-card {
    border-radius: 20px;
    padding: 18px;
  }

  .modal-fields {
    grid-template-columns: 1fr;
  }

  .schedule-modal {
    border-radius: 20px;
    max-height: calc(100vh - 48px);
    overflow-y: auto;
    padding: 24px 20px;
  }
}

@media (max-width: 560px) {
  .doctor-schedule-content {
    padding: 28px 14px 36px;
  }

  .status-legend {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .legend-item {
    justify-content: center;
  }

  .modal-actions {
    flex-direction: column;
  }

  .modal-actions button {
    width: 100%;
  }

  .confirmation-modal {
    border-radius: 20px;
    padding: 32px 22px 28px;
  }

  .confirmation-modal p {
    font-size: 20px;
  }
}
</style>

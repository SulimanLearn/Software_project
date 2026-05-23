<template>
  <div class="doctor-patients-page" dir="rtl">
    <NavBar />

    <div class="doctor-patients-shell">
      <DoctorSidebar :doctor="doctor" @logout="showLogoutModal = true" />

      <main class="doctor-patients-content">
        <header class="patients-header">
          <div class="header-copy">
            <h1>مرضاي</h1>
            <p>قائمة المرضى الذين تم علاجهم سابقاً أو لديهم مواعيد مع الطبيب.</p>
          </div>

          <div class="stats-grid" aria-label="إحصائيات المرضى">
            <article class="stat-card">
              <span>إجمالي المرضى</span>
              <strong>{{ patientsCount }}</strong>
            </article>
            <article class="stat-card">
              <span>زيارات هذا الشهر</span>
              <strong>{{ visitsThisMonth }}</strong>
            </article>
            <article class="stat-card warning">
              <span>مرضى بحاجة لمتابعة</span>
              <strong>{{ followUpCount }}</strong>
            </article>
          </div>
        </header>

        <section class="filters-card" aria-label="بحث وتصفية المرضى">
          <label class="search-field">
            <span>بحث</span>
            <input
              v-model.trim="filters.search"
              type="search"
              placeholder="ابحث باسم المريض أو رقم الملف أو رقم الهاتف"
              @input="currentPage = 1"
            >
          </label>

          <label>
            <span>آخر زيارة</span>
            <select v-model="filters.lastVisit" @change="currentPage = 1">
              <option value="all">الكل</option>
              <option value="week">هذا الأسبوع</option>
              <option value="month">هذا الشهر</option>
              <option value="older">أقدم من شهر</option>
            </select>
          </label>

          <label>
            <span>حالة المتابعة</span>
            <select v-model="filters.followUpStatus" @change="currentPage = 1">
              <option value="all">الكل</option>
              <option value="stable">مستقر</option>
              <option value="follow-up">بحاجة لمتابعة</option>
              <option value="critical">حالة حرجة</option>
            </select>
          </label>

          <label>
            <span>الجنس</span>
            <select v-model="filters.gender" @change="currentPage = 1">
              <option value="all">الكل</option>
              <option value="ذكر">ذكر</option>
              <option value="أنثى">أنثى</option>
            </select>
          </label>
        </section>

        <section class="patients-card">
          <div class="table-wrap">
            <table class="patients-table">
              <colgroup>
                <col class="col-file">
                <col class="col-patient">
                <col class="col-visit">
                <col class="col-count">
                <col class="col-diagnosis">
                <col class="col-status">
                <col class="col-actions">
              </colgroup>
              <thead>
                <tr>
                  <th>رقم الملف</th>
                  <th>اسم المريض</th>
                  <th>آخر زيارة</th>
                  <th>عدد الزيارات</th>
                  <th>آخر تشخيص</th>
                  <th>حالة المتابعة</th>
                  <th>الإجراءات</th>
                </tr>
              </thead>
              <tbody v-if="paginatedPatientsCount">
                <tr v-for="patient in paginatedPatients" :key="patient.id">
                  <td class="file-number">{{ patient.fileNumber || 'غير متوفر' }}</td>
                  <td>
                    <div class="patient-cell">
                      <strong>{{ patient.fullName || 'مريض غير محدد' }}</strong>
                      <span>{{ patient.email || 'غير متوفر' }}</span>
                    </div>
                  </td>
                  <td>{{ formatDate(patient.lastVisit) }}</td>
                  <td>{{ patient.visitCount || 0 }}</td>
                  <td class="diagnosis-cell">{{ patient.latestDiagnosis || 'غير متوفر' }}</td>
                  <td>
                    <span class="status-badge" :class="statusClass(patient.followUpStatus || 'مستقر')">
                      {{ patient.followUpStatus || 'مستقر' }}
                    </span>
                  </td>
                  <td class="actions-column">
                    <div class="actions-cell">
                      <button class="action-btn primary" type="button" @click="viewPatient(patient)">
                        عرض الملف
                      </button>
                      <button class="action-btn light" type="button" @click="printPatient(patient)">
                        طباعة الملف
                      </button>
                      <button class="action-btn outline" type="button" @click="openScheduleModal(patient)">
                        جدولة موعد
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>

            <div v-if="!paginatedPatientsCount" class="empty-state">
              لا توجد نتائج مطابقة
            </div>
          </div>

          <nav v-if="totalPages > 1" class="pagination" aria-label="ترقيم الصفحات">
            <button type="button" :disabled="currentPage === 1" @click="currentPage--">
              السابق
            </button>
            <button
              v-for="page in totalPages"
              :key="page"
              type="button"
              :class="{ active: currentPage === page }"
              @click="currentPage = page"
            >
              {{ page }}
            </button>
            <button type="button" :disabled="currentPage === totalPages" @click="currentPage++">
              التالي
            </button>
          </nav>
        </section>
      </main>
    </div>

    <section v-if="selectedPrintPatient" class="print-zone" dir="rtl" aria-hidden="true">
      <header class="print-header">
        <div class="print-brand">
          <img src="/images/logo.png" alt="شعار مجمع الحياة الطبي" class="print-logo">
          <div>
            <h1>مجمع الحياة الطبي</h1>
            <p>ملخص الملف الطبي للمريض</p>
          </div>
        </div>

        <div class="print-header-details">
          <p>
            <span>الطبيب</span>
            <strong>{{ doctor.name || 'غير متوفر' }}</strong>
          </p>
          <p>
            <span>تاريخ الطباعة</span>
            <strong>{{ formatDate(printDate) }}</strong>
          </p>
        </div>
      </header>

      <article class="print-card print-patient-info">
        <h2>بيانات المريض</h2>
        <div class="print-grid">
          <p>
            <span>اسم المريض</span>
            <strong>{{ selectedPrintPatient.fullName || 'غير متوفر' }}</strong>
          </p>
          <p>
            <span>رقم الملف</span>
            <strong>{{ selectedPrintPatient.fileNumber || 'غير متوفر' }}</strong>
          </p>
          <p>
            <span>العمر</span>
            <strong>{{ selectedPrintPatient.age || 'غير متوفر' }}</strong>
          </p>
          <p>
            <span>الجنس</span>
            <strong>{{ selectedPrintPatient.gender || 'غير متوفر' }}</strong>
          </p>
          <p>
            <span>رقم الهاتف</span>
            <strong>{{ selectedPrintPatient.phone || 'غير متوفر' }}</strong>
          </p>
          <p>
            <span>البريد الإلكتروني</span>
            <strong>{{ selectedPrintPatient.email || 'غير متوفر' }}</strong>
          </p>
          <p>
            <span>آخر زيارة</span>
            <strong>{{ formatDate(selectedPrintPatient.lastVisit) }}</strong>
          </p>
          <p>
            <span>عدد الزيارات</span>
            <strong>{{ selectedPrintPatient.visitCount || 0 }}</strong>
          </p>
          <p>
            <span>حالة المتابعة</span>
            <strong>{{ selectedPrintPatient.followUpStatus || 'غير متوفر' }}</strong>
          </p>
          <p>
            <span>آخر تشخيص</span>
            <strong>{{ selectedPrintPatient.latestDiagnosis || 'غير متوفر' }}</strong>
          </p>
        </div>
      </article>

      <article class="print-section">
        <h2>الوصفات الحالية</h2>
        <ul v-if="selectedPrintPrescriptions.length" class="print-prescriptions-list">
          <li v-for="(item, index) in selectedPrintPrescriptions" :key="item.number || index">
            <strong>{{ item.number || 'وصفة طبية' }}</strong>
            <span>{{ formatDate(item.date) }}</span>
            <span>{{ medicineNames(item).join('، ') || 'لا توجد أدوية مسجلة' }}</span>
          </li>
        </ul>
        <p v-else class="print-empty">لا توجد وصفات حالية مسجلة.</p>
      </article>

      <article class="print-section">
        <h2>ملخص التاريخ الطبي</h2>
        <ul v-if="selectedPrintMedicalHistory.length" class="print-history-list">
          <li v-for="(item, index) in selectedPrintMedicalHistory" :key="`${item}-${index}`">
            {{ item }}
          </li>
        </ul>
        <p v-else class="print-empty">لا يوجد تاريخ طبي مسجل.</p>
      </article>

      <article class="print-section">
        <h2>الملاحظات الطبية</h2>
        <p class="print-notes">{{ selectedPrintPatient.notes || 'لا توجد ملاحظات طبية مسجلة.' }}</p>
      </article>
    </section>

    <div
      v-if="scheduledPatient"
      class="modal-overlay"
      dir="rtl"
      @click.self="closeScheduleModal"
    >
      <form class="schedule-modal" @submit.prevent="saveAppointment">
        <header>
          <div>
            <span>جدولة موعد</span>
            <h2>{{ scheduledPatient.fullName || 'مريض غير محدد' }}</h2>
          </div>
          <button type="button" class="close-button" aria-label="إغلاق" @click="closeScheduleModal">
            ×
          </button>
        </header>

        <div class="modal-grid">
          <label>
            <span>التاريخ</span>
            <input v-model="appointmentForm.date" type="date" required>
          </label>

          <label>
            <span>الوقت</span>
            <input v-model="appointmentForm.time" type="time" required>
          </label>

          <label>
            <span>نوع الموعد</span>
            <select v-model="appointmentForm.type">
              <option value="في العيادة">في العيادة</option>
              <option value="أونلاين">أونلاين</option>
            </select>
          </label>

          <label>
            <span>سبب الزيارة</span>
            <input v-model.trim="appointmentForm.reason" type="text" required>
          </label>

          <label v-if="appointmentForm.type === 'أونلاين'" class="meeting-field">
            <span>رابط الاجتماع</span>
            <div class="meeting-row">
              <input v-model.trim="appointmentForm.meetingLink" type="url" placeholder="https://">
              <button type="button" @click="generateMeetingLink">توليد رابط</button>
            </div>
          </label>

          <label class="notes-field">
            <span>ملاحظات</span>
            <textarea v-model.trim="appointmentForm.notes" rows="4" />
          </label>
        </div>

        <div class="modal-actions">
          <button class="save-button" type="submit">حفظ الموعد</button>
          <button class="cancel-button" type="button" @click="closeScheduleModal">إلغاء</button>
        </div>
      </form>
    </div>

    <div
      v-if="showLogoutModal"
      class="modal-overlay"
      dir="rtl"
      @click.self="showLogoutModal = false"
    >
      <div class="confirmation-modal" role="dialog" aria-modal="true">
        <h2>تسجيل الخروج</h2>
        <p>هل انت متاكد انك تريد تسجيل الخروج؟</p>

        <div class="modal-actions">
          <button class="save-button" type="button" @click="confirmLogout">نعم</button>
          <button class="cancel-button" type="button" @click="showLogoutModal = false">لا</button>
        </div>
      </div>
    </div>

    <transition name="toast">
      <div v-if="toastMessage" class="toast-message" role="status">
        {{ toastMessage }}
      </div>
    </transition>
  </div>
</template>

<script setup>
import DoctorSidebar from '~/components/doctor/DoctorSidebar.vue'
import { useDoctorPatients } from '~/composables/doctor/useDoctorPatients'

const showLogoutModal = ref(false)
const scheduledPatient = ref(null)
const selectedPrintPatient = ref(null)
const toastMessage = ref('')
const currentPage = ref(1)
const pageSize = 5
const printDate = ref(new Date())
let toastTimer

const isLoggedIn = useState('isLoggedIn', () => false)
const user = useState('user', () => ({ name: '' }))

const doctor = {
  name: 'د. خالد السيد',
  specialization: 'أمراض القلب',
  avatar: '/images/doctor.png'
}

const { patientsList } = useDoctorPatients()

const filters = reactive({
  search: '',
  lastVisit: 'all',
  followUpStatus: 'all',
  gender: 'all'
})

const appointmentForm = reactive({
  date: '',
  time: '',
  type: 'في العيادة',
  reason: '',
  notes: '',
  meetingLink: ''
})

const currentDate = new Date(2026, 4, 20)

const patientsCount = computed(() => patientsList.value.length)

const selectedPrintPrescriptions = computed(() => {
  return Array.isArray(selectedPrintPatient.value?.prescriptions)
    ? selectedPrintPatient.value.prescriptions
    : []
})

const selectedPrintMedicalHistory = computed(() => {
  return Array.isArray(selectedPrintPatient.value?.medicalHistory)
    ? selectedPrintPatient.value.medicalHistory
    : []
})

const filteredPatients = computed(() => {
  return patientsList.value.filter((patient) => {
    if (!patient || typeof patient !== 'object') {
      return false
    }

    const query = String(filters.search || '').toLowerCase()
    const matchesSearch = !query
      || String(patient.fullName || '').toLowerCase().includes(query)
      || String(patient.fileNumber || '').toLowerCase().includes(query)
      || String(patient.phone || '').includes(query)

    const matchesVisit = matchesLastVisitFilter(patient.lastVisit)
    const matchesStatus = filters.followUpStatus === 'all'
      || statusValue(patient.followUpStatus) === filters.followUpStatus
    const matchesGender = filters.gender === 'all'
      || patient.gender === filters.gender

    return matchesSearch && matchesVisit && matchesStatus && matchesGender
  })
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredPatients.value.length / pageSize)))

const paginatedPatients = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredPatients.value.slice(start, start + pageSize)
})

const paginatedPatientsCount = computed(() => paginatedPatients.value.length)

const visitsThisMonth = computed(() => {
  return patientsList.value.filter((patient) => {
    const date = parseDate(patient?.lastVisit)
    if (Number.isNaN(date.getTime())) {
      return false
    }

    return date.getMonth() === currentDate.getMonth() && date.getFullYear() === currentDate.getFullYear()
  }).length
})

const followUpCount = computed(() => {
  return patientsList.value.filter((patient) => patient.followUpStatus === 'بحاجة لمتابعة').length
})

watch(totalPages, (pages) => {
  if (currentPage.value > pages) {
    currentPage.value = pages
  }
})

function parseDate(value) {
  if (!value) {
    return new Date(Number.NaN)
  }

  const [year, month, day] = String(value).split('-').map(Number)
  return new Date(year, month - 1, day)
}

function startOfWeek(date) {
  const start = new Date(date)
  start.setDate(date.getDate() - date.getDay())
  start.setHours(0, 0, 0, 0)
  return start
}

function matchesLastVisitFilter(lastVisit) {
  if (filters.lastVisit === 'all') return true

  const visitDate = parseDate(lastVisit)
  if (Number.isNaN(visitDate.getTime())) {
    return false
  }

  if (filters.lastVisit === 'week') {
    const weekStart = startOfWeek(currentDate)
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekStart.getDate() + 7)
    return visitDate >= weekStart && visitDate < weekEnd
  }

  if (filters.lastVisit === 'month') {
    return visitDate.getMonth() === currentDate.getMonth()
      && visitDate.getFullYear() === currentDate.getFullYear()
  }

  const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
  return visitDate < monthStart
}

function statusValue(status) {
  return ({
    'مستقر': 'stable',
    'بحاجة لمتابعة': 'follow-up',
    'حالة حرجة': 'critical'
  })[status] || 'stable'
}

function statusClass(status) {
  return statusValue(status)
}

function formatDate(value) {
  const date = value instanceof Date ? value : parseDate(value)
  if (Number.isNaN(date.getTime())) {
    return 'غير متوفر'
  }

  return new Intl.DateTimeFormat('ar', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(date)
}

const resetAppointmentForm = () => {
  appointmentForm.date = ''
  appointmentForm.time = ''
  appointmentForm.type = 'في العيادة'
  appointmentForm.reason = ''
  appointmentForm.notes = ''
  appointmentForm.meetingLink = ''
}

const viewPatient = async (patient) => {
  if (!patient?.id) {
    return
  }

  await navigateTo(`/doctor/patients/${patient.id}`)
}

const printPatient = (patient) => {
  if (!patient) {
    return
  }

  printDate.value = new Date()
  selectedPrintPatient.value = patient
  setTimeout(() => window.print(), 80)
}

const openScheduleModal = (patient) => {
  if (!patient) {
    return
  }

  scheduledPatient.value = patient
  resetAppointmentForm()
}

const closeScheduleModal = () => {
  scheduledPatient.value = null
  resetAppointmentForm()
}

const generateMeetingLink = () => {
  if (!scheduledPatient.value?.fileNumber) {
    return
  }

  const suffix = Math.random().toString(36).slice(2, 8)
  appointmentForm.meetingLink = `https://meet.mediconnect.local/${scheduledPatient.value.fileNumber.toLowerCase()}-${suffix}`
}

const saveAppointment = () => {
  if (!scheduledPatient.value?.id) {
    return
  }

  const patient = patientsList.value.find((item) => item.id === scheduledPatient.value.id)
  if (patient) {
    patient.appointments = patient.appointments || []
    patient.appointments.unshift({
      id: `apt-${Date.now()}`,
      date: appointmentForm.date,
      time: appointmentForm.time,
      type: appointmentForm.type,
      reason: appointmentForm.reason,
      notes: appointmentForm.notes,
      meetingLink: appointmentForm.type === 'أونلاين' ? appointmentForm.meetingLink : ''
    })
  }

  closeScheduleModal()
  showToast('تم جدولة الموعد بنجاح')
}

const medicineNames = (prescription) => {
  return Array.isArray(prescription?.medicines) ? prescription.medicines : []
}

const showToast = (message) => {
  clearTimeout(toastTimer)
  toastMessage.value = message
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
})
</script>

<style scoped>
.doctor-patients-page {
  min-height: 100vh;
  background-color: #ffffff;
  color: #101010;
}

.doctor-patients-shell {
  display: grid;
  grid-template-columns: 290px minmax(0, 1fr);
  min-height: calc(100vh - 85px);
}

.doctor-patients-content {
  min-width: 0;
  padding: 34px 38px 44px;
}

.patients-header {
  align-items: stretch;
  display: flex;
  gap: 22px;
  justify-content: space-between;
  margin-bottom: 22px;
}

.header-copy {
  min-width: 0;
}

.header-copy h1 {
  font-size: 32px;
  font-weight: 900;
  margin: 0 0 8px;
}

.header-copy p {
  color: #4c5f7b;
  font-size: 16px;
  font-weight: 800;
  line-height: 1.8;
  margin: 0;
}

.stats-grid {
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(3, minmax(130px, 1fr));
  min-width: min(100%, 470px);
}

.stat-card {
  background: linear-gradient(180deg, #f5f9ff 0%, #eaf3ff 100%);
  border: 1.5px solid #9bc3ff;
  border-radius: 20px;
  box-shadow: 0 12px 24px rgba(17, 91, 210, 0.08);
  padding: 16px;
}

.stat-card span {
  color: #506986;
  display: block;
  font-size: 13px;
  font-weight: 800;
  margin-bottom: 8px;
}

.stat-card strong {
  color: #115bd2;
  font-size: 28px;
  font-weight: 900;
}

.stat-card.warning strong {
  color: #d97706;
}

.filters-card,
.patients-card {
  background-color: #eaf2fd;
  border: 1.5px solid #0b63f6;
  border-radius: 24px;
  box-shadow: 0 14px 34px rgba(11, 99, 246, 0.08);
}

.filters-card {
  display: grid;
  gap: 16px;
  grid-template-columns: minmax(260px, 1.55fr) repeat(3, minmax(170px, 1fr));
  margin-bottom: 20px;
  padding: 20px;
}

.filters-card label,
.modal-grid label {
  color: #4b5f7c;
  display: flex;
  flex-direction: column;
  font-size: 13px;
  font-weight: 900;
  gap: 8px;
  min-width: 0;
}

.filters-card input,
.filters-card select,
.modal-grid input,
.modal-grid select,
.modal-grid textarea {
  background-color: #ffffff;
  border: 1.5px solid #9bc3ff;
  border-radius: 16px;
  color: #101010;
  font-family: inherit;
  font-size: 15px;
  font-weight: 800;
  min-height: 46px;
  outline: none;
  padding: 10px 14px;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  width: 100%;
}

.filters-card input:focus,
.filters-card select:focus,
.modal-grid input:focus,
.modal-grid select:focus,
.modal-grid textarea:focus {
  border-color: #0b63f6;
  box-shadow: 0 0 0 4px rgba(11, 99, 246, 0.12);
}

.patients-card {
  padding: 18px;
}

.table-wrap {
  overflow-x: auto;
  padding-bottom: 4px;
}

.patients-table {
  border-collapse: separate;
  border-spacing: 0 10px;
  min-width: 1280px;
  table-layout: fixed;
  width: 100%;
}

.col-file {
  width: 120px;
}

.col-patient {
  width: 240px;
}

.col-visit {
  width: 135px;
}

.col-count {
  width: 110px;
}

.col-diagnosis {
  width: auto;
}

.col-status {
  width: 155px;
}

.col-actions {
  width: 320px;
}

.patients-table th {
  color: #465e7c;
  font-size: 13px;
  font-weight: 900;
  padding: 0 12px 8px;
  text-align: right;
  white-space: nowrap;
}

.patients-table td {
  background-color: #ffffff;
  border-bottom: 1px solid #cfe1fb;
  border-top: 1px solid #cfe1fb;
  color: #172033;
  font-size: 14px;
  font-weight: 800;
  line-height: 1.55;
  padding: 14px 12px;
  vertical-align: middle;
}

.patients-table td:first-child {
  border-radius: 0 18px 18px 0;
  border-right: 1px solid #cfe1fb;
}

.patients-table td:last-child {
  border-left: 1px solid #cfe1fb;
  border-radius: 18px 0 0 18px;
}

.file-number {
  color: #115bd2;
  white-space: nowrap;
}

.patient-cell {
  display: flex;
  flex-direction: column;
  gap: 5px;
  min-width: 0;
}

.patient-cell strong,
.diagnosis-cell {
  overflow-wrap: anywhere;
  white-space: normal;
  word-break: break-word;
}

.patient-cell span {
  color: #6b7b91;
  font-size: 12px;
  overflow-wrap: anywhere;
  word-break: break-word;
}

.diagnosis-cell {
  line-height: 1.65;
  max-width: 100%;
}

.status-badge {
  border-radius: 999px;
  display: inline-flex;
  font-size: 12px;
  font-weight: 900;
  justify-content: center;
  min-width: 104px;
  padding: 8px 12px;
  white-space: nowrap;
}

.status-badge.stable {
  background-color: #dcfce7;
  color: #15803d;
}

.status-badge.follow-up {
  background-color: #fef3c7;
  color: #b45309;
}

.status-badge.critical {
  background-color: #fee2e2;
  color: #b91c1c;
}

.actions-cell {
  align-items: center;
  display: flex;
  flex-wrap: nowrap;
  gap: 10px;
  justify-content: flex-start;
  min-width: max-content;
  white-space: nowrap;
  width: 100%;
}

.action-btn,
.pagination button,
.modal-actions button,
.meeting-row button {
  border-radius: 15px;
  cursor: pointer;
  font-family: inherit;
  font-size: 13px;
  font-weight: 900;
  min-height: 38px;
  min-width: 74px;
  padding: 8px 12px;
  transition: transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease;
}

.action-btn {
  flex: 0 0 auto;
  min-width: 100px;
  padding: 8px 14px;
  white-space: nowrap;
}

.action-btn:hover,
.pagination button:not(:disabled):hover,
.modal-actions button:hover,
.meeting-row button:hover {
  transform: translateY(-1px);
}

.action-btn.primary,
.save-button {
  background-color: #115bd2;
  border: 1px solid #115bd2;
  color: #ffffff;
}

.action-btn.light {
  background-color: #e8f1ff;
  border: 1px solid #7fb2ff;
  color: #115bd2;
}

.action-btn.outline,
.cancel-button,
.meeting-row button {
  background-color: #ffffff;
  border: 1px solid #0b63f6;
  color: #115bd2;
}

.empty-state {
  align-items: center;
  background-color: #ffffff;
  border: 1.5px dashed #9bc3ff;
  border-radius: 20px;
  color: #506986;
  display: flex;
  font-size: 17px;
  font-weight: 900;
  justify-content: center;
  min-height: 150px;
  text-align: center;
}

.pagination {
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
  margin-top: 18px;
}

.pagination button {
  background-color: #ffffff;
  border: 1px solid #9bc3ff;
  color: #115bd2;
  min-width: 44px;
}

.pagination button.active {
  background-color: #115bd2;
  border-color: #115bd2;
  color: #ffffff;
}

.pagination button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
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
  max-height: 86vh;
  max-width: 100%;
  overflow-y: auto;
  padding: 28px;
  width: 720px;
}

.schedule-modal header {
  align-items: center;
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.schedule-modal header span {
  color: #115bd2;
  font-size: 14px;
  font-weight: 900;
}

.schedule-modal h2,
.confirmation-modal h2 {
  font-size: 24px;
  font-weight: 900;
  margin: 6px 0 0;
}

.close-button {
  align-items: center;
  background-color: #ffffff;
  border: 1px solid #9bc3ff;
  border-radius: 14px;
  color: #115bd2;
  cursor: pointer;
  display: inline-flex;
  font-size: 28px;
  font-weight: 700;
  height: 42px;
  justify-content: center;
  line-height: 1;
  width: 42px;
}

.modal-grid {
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.meeting-field,
.notes-field {
  grid-column: 1 / -1;
}

.meeting-row {
  display: flex;
  gap: 10px;
}

.meeting-row input {
  min-width: 0;
}

.meeting-row button {
  flex: 0 0 auto;
}

.modal-grid textarea {
  min-height: 110px;
  resize: vertical;
}

.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-top: 22px;
}

.modal-actions button {
  min-width: 120px;
}

.confirmation-modal {
  padding: 42px 44px 34px;
  text-align: center;
  width: 560px;
}

.confirmation-modal p {
  font-size: 22px;
  font-weight: 800;
  margin: 14px 0 30px;
}

.toast-message {
  background-color: #115bd2;
  border-radius: 18px;
  bottom: 28px;
  box-shadow: 0 16px 35px rgba(17, 91, 210, 0.25);
  color: #ffffff;
  font-size: 15px;
  font-weight: 900;
  inset-inline-start: 28px;
  padding: 14px 20px;
  position: fixed;
  z-index: 2500;
}

.toast-enter-active,
.toast-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

.print-zone {
  display: none;
}

@media (max-width: 1180px) {
  .patients-header {
    flex-direction: column;
  }

  .stats-grid {
    min-width: 0;
  }

  .filters-card {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .search-field {
    grid-column: 1 / -1;
  }
}

@media (max-width: 1030px) {
  .doctor-patients-shell {
    grid-template-columns: 240px minmax(0, 1fr);
  }

  .doctor-patients-content {
    padding: 30px 22px 46px;
  }
}

@media (max-width: 760px) {
  .doctor-patients-shell {
    display: flex;
    flex-direction: column;
  }

  .doctor-patients-content {
    padding: 30px 16px 42px;
  }

  .stats-grid,
  .filters-card,
  .modal-grid {
    grid-template-columns: 1fr;
  }

  .patients-card,
  .filters-card {
    border-radius: 20px;
  }

  .patients-table {
    min-width: 980px;
  }

  .col-actions {
    width: 170px;
  }

  .actions-column {
    vertical-align: top;
  }

  .actions-cell {
    align-items: stretch;
    flex-direction: column;
    gap: 8px;
    min-width: 0;
    white-space: normal;
  }

  .actions-cell .action-btn {
    justify-content: center;
    min-width: 0;
    width: 100%;
  }

  .meeting-row,
  .modal-actions {
    flex-direction: column;
  }

  .meeting-row button,
  .modal-actions button {
    width: 100%;
  }
}

@media (max-width: 560px) {
  .doctor-patients-content {
    padding-inline: 12px;
  }

  .header-copy h1 {
    font-size: 28px;
  }

  .schedule-modal,
  .confirmation-modal {
    padding: 22px;
  }

  .toast-message {
    inset-inline: 16px;
    text-align: center;
  }
}

@media print {
  @page {
    size: A4;
    margin: 12mm;
  }

  :global(html),
  :global(body) {
    background: #ffffff !important;
    color: #111827 !important;
    margin: 0 !important;
    padding: 0 !important;
    print-color-adjust: exact;
    -webkit-print-color-adjust: exact;
    width: 100% !important;
  }

  :global(.site-footer),
  :global(footer),
  :global(.navbar),
  :global(nav),
  :global(aside),
  :global(button),
  :global(.doctor-patients-shell),
  :global(.filters-card),
  :global(.patients-card),
  :global(.pagination),
  :global(.modal-overlay),
  :global(.toast-message) {
    display: none !important;
  }

  :global(.app-shell),
  :global(.page-stage) {
    background: #ffffff !important;
    display: block !important;
    min-height: auto !important;
  }

  .doctor-patients-page {
    background: #ffffff !important;
    min-height: auto !important;
    padding: 0 !important;
  }

  .doctor-patients-page > :not(.print-zone) {
    display: none !important;
  }

  .print-zone {
    background: #ffffff !important;
    box-sizing: border-box;
    color: #111827;
    display: block !important;
    direction: rtl;
    font-family: Arial, Tahoma, sans-serif;
    font-size: 11.2pt;
    line-height: 1.5;
    margin: 0 !important;
    max-width: 100% !important;
    padding: 0 !important;
    width: 100% !important;
  }

  .print-zone *,
  .print-zone *::before,
  .print-zone *::after {
    box-sizing: border-box;
  }

  .print-header {
    align-items: center;
    background: linear-gradient(135deg, #eef6ff 0%, #ffffff 68%);
    border: 1.3pt solid #9bc3ff;
    border-radius: 5mm;
    break-inside: avoid;
    display: flex;
    gap: 8mm;
    justify-content: space-between;
    margin-bottom: 4mm;
    page-break-inside: avoid;
    padding: 4mm 5mm;
  }

  .print-brand {
    align-items: center;
    display: flex;
    flex: 1;
    gap: 4mm;
    min-width: 0;
  }

  .print-logo {
    background: #ffffff;
    border: 1px solid #bfdbfe;
    border-radius: 4mm;
    flex: 0 0 auto;
    height: 18mm;
    object-fit: contain;
    padding: 2mm;
    width: 18mm;
  }

  .print-brand h1 {
    color: #0b63f6;
    font-size: 22pt;
    font-weight: 900;
    letter-spacing: 0;
    line-height: 1.1;
    margin: 0;
  }

  .print-brand p {
    color: #172033;
    font-size: 14pt;
    font-weight: 800;
    margin: 1.5mm 0 0;
  }

  .print-header-details {
    display: grid;
    gap: 1.7mm;
    min-width: 55mm;
  }

  .print-header-details p {
    align-items: center;
    background: #ffffff;
    border: 1px solid #bfdbfe;
    border-radius: 3mm;
    display: flex;
    gap: 4mm;
    justify-content: space-between;
    margin: 0;
    padding: 2.2mm 3mm;
  }

  .print-header-details span,
  .print-grid span {
    color: #475569;
    display: block;
    font-size: 9.6pt;
    font-weight: 800;
    line-height: 1.25;
  }

  .print-header-details strong,
  .print-grid strong {
    color: #111827;
    display: block;
    font-size: 11.2pt;
    font-weight: 900;
    line-height: 1.4;
    margin-top: 1mm;
    overflow-wrap: anywhere;
    word-break: break-word;
  }

  .print-card,
  .print-section {
    background: #ffffff !important;
    border: 1px solid #bfdbfe;
    border-radius: 4mm;
    break-inside: avoid;
    margin-bottom: 3mm;
    page-break-inside: avoid;
    padding: 3.5mm;
  }

  .print-card h2,
  .print-section h2 {
    background: #eaf3ff;
    border: 1px solid #d7e8ff;
    border-radius: 3mm;
    color: #0b63f6;
    font-size: 13pt;
    font-weight: 900;
    margin: 0 0 3mm;
    padding: 2mm 3mm;
  }

  .print-grid {
    display: grid;
    gap: 2mm 3mm;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .print-grid p {
    background: #ffffff;
    border: 1px solid #e0edff;
    border-radius: 3mm;
    margin: 0;
    min-height: 11mm;
    overflow-wrap: anywhere;
    padding: 2mm 3mm;
    word-break: break-word;
  }

  .print-section ul {
    display: grid;
    gap: 2mm;
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .print-section li,
  .print-empty,
  .print-notes {
    color: #111827;
    font-size: 10.8pt;
    margin: 0;
    overflow-wrap: anywhere;
    word-break: break-word;
  }

  .print-section li {
    background: #ffffff;
    border: 1px solid #e0edff;
    border-radius: 3mm;
    break-inside: avoid;
    page-break-inside: avoid;
    padding: 2.2mm 3mm;
  }

  .print-prescriptions-list li {
    align-items: start;
    display: grid;
    gap: 2mm 4mm;
    grid-template-columns: 32mm 28mm minmax(0, 1fr);
  }

  .print-prescriptions-list strong {
    font-weight: 900;
  }

  .print-empty,
  .print-notes {
    background: #ffffff;
    border: 1px solid #e0edff;
    border-radius: 3mm;
    line-height: 1.65;
    padding: 2.5mm 3mm;
  }
}
</style>

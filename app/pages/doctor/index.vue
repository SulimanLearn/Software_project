<template>
  <div class="doctor-dashboard-page" dir="rtl">
    <NavBar />

    <div class="doctor-dashboard-shell">
      <DoctorSidebar :doctor="doctor" @logout="showLogoutModal = true" />

      <main class="doctor-dashboard-content">
        <header class="page-header">
          <p>{{ currentArabicDate }}</p>
          <h1>لوحة البيانات - الطبيب</h1>
        </header>

        <section class="stats-grid" aria-label="إحصائيات الطبيب">
          <article
            v-for="stat in statsCards"
            :key="stat.label"
            class="stat-card"
          >
            <div class="stat-copy">
              <strong>{{ stat.value }}</strong>
              <span>{{ stat.label }}</span>
            </div>
            <component
              :is="stat.icon"
              class="stat-icon"
              :size="26"
              :stroke-width="2"
              aria-hidden="true"
            />
          </article>
        </section>

        <section class="dashboard-section appointments-section" aria-labelledby="today-appointments-title">
          <div class="section-header">
            <h2 id="today-appointments-title">مواعيد اليوم</h2>
            <span>{{ appointments.length }} موعد</span>
          </div>

          <div v-if="appointments.length" class="table-wrap">
            <table class="appointments-table">
              <thead>
                <tr>
                  <th>رقم الموعد</th>
                  <th>اسم المريض</th>
                  <th>الوقت</th>
                  <th>نوع الموعد</th>
                  <th>الحالة</th>
                  <th>اجتماع</th>
                  <th>إجراء</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="appointment in appointments" :key="appointment.id">
                  <td data-label="رقم الموعد">{{ appointment.code }}</td>
                  <td data-label="اسم المريض">{{ appointment.patientName }}</td>
                  <td data-label="الوقت">{{ appointment.time }}</td>
                  <td data-label="نوع الموعد">
                    <span class="type-badge" :class="appointment.appointmentType === 'أونلاين' ? 'online' : 'clinic'">
                      {{ appointment.appointmentType }}
                    </span>
                  </td>
                  <td data-label="الحالة">
                    <select
                      v-if="editingStatusId === appointment.id"
                      v-model="appointment.status"
                      class="status-select"
                      :class="statusClassFor(appointment.status)"
                      @change="updateAppointmentStatus(appointment)"
                      @blur="editingStatusId = null"
                    >
                      <option
                        v-for="status in appointmentStatuses"
                        :key="status"
                        :value="status"
                      >
                        {{ status }}
                      </option>
                    </select>
                    <button
                      v-else
                      class="status-badge status-button"
                      :class="statusClassFor(appointment.status)"
                      type="button"
                      @click="editingStatusId = appointment.id"
                    >
                      {{ appointment.status }}
                    </button>
                  </td>
                  <td data-label="اجتماع">
                    <div class="meeting-cell">
                      <a
                        v-if="appointment.appointmentType === 'أونلاين' && appointment.meetingLink"
                        class="meeting-button"
                        :href="appointment.meetingLink"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Video class="meeting-button-icon" :size="15" :stroke-width="2.2" aria-hidden="true" />
                        دخول الاجتماع
                      </a>
                      <button
                        v-else-if="appointment.appointmentType === 'أونلاين'"
                        class="meeting-missing"
                        type="button"
                        disabled
                      >
                        لا يوجد رابط
                      </button>
                      <span v-else class="meeting-empty" aria-label="لا يوجد اجتماع">
                        —
                      </span>
                    </div>
                  </td>
                  <td data-label="إجراء">
                    <div class="appointment-actions">
                      <NuxtLink
                        class="view-button"
                        :class="{ disabled: !appointment.patientId }"
                        :to="patientDetailsPathForAppointment(appointment)"
                        :aria-disabled="!appointment.patientId"
                        :tabindex="appointment.patientId ? 0 : -1"
                      >
                        عرض
                      </NuxtLink>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div v-else class="empty-state" aria-live="polite">
            <h2>لا توجد مواعيد اليوم</h2>
            <p>ستظهر المواعيد هنا عند إضافتها من النظام.</p>
          </div>
        </section>

        <div class="quick-sections">
          <section class="dashboard-section" aria-labelledby="recent-diagnoses-title">
            <div class="section-header">
              <h2 id="recent-diagnoses-title">آخر التشخيصات</h2>
            </div>

            <div class="quick-list">
              <article
                v-for="diagnosis in recentDiagnoses"
                :key="diagnosis.id"
                class="quick-item"
              >
                <strong>{{ diagnosis.patientName }}</strong>
                <span>{{ diagnosis.summary }}</span>
              </article>
            </div>
          </section>

          <section class="dashboard-section" aria-labelledby="recent-prescriptions-title">
            <div class="section-header">
              <h2 id="recent-prescriptions-title">آخر الوصفات الطبية</h2>
            </div>

            <div class="quick-list">
              <article
                v-for="prescription in recentPrescriptions"
                :key="prescription.id"
                class="quick-item"
              >
                <strong>{{ prescription.patientName }}</strong>
                <span>{{ prescription.medicine }}</span>
              </article>
            </div>
          </section>
        </div>
      </main>
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
import { CalendarDays, ClipboardList, Pill, UserPlus, Video } from '@lucide/vue'
import { markRaw } from 'vue'
import DoctorSidebar from '~/components/doctor/DoctorSidebar.vue'

const showLogoutModal = ref(false)
const currentArabicDate = ref('')
const editingStatusId = ref(null)
const toastMessage = ref('')
const isLoggedIn = useState('isLoggedIn', () => false)
const user = useState('user', () => ({ name: '' }))

const doctor = {
  name: 'د. خالد السيد',
  specialization: 'أمراض القلب',
  avatar: '/images/doctor.png'
}

const appointments = ref([
  {
    id: 1,
    appointmentId: 'apt-1024',
    patientId: 'p-2056',
    code: 'D-1024',
    patientName: 'أحمد محمود السيد',
    time: '10:00 ص',
    status: 'مكتمل',
    appointmentType: 'في العيادة',
    meetingLink: '',
    reason: 'كشف دوري - ضغط الدم',
    notes: 'تمت مراجعة القياسات الأخيرة وتسجيل الخطة العلاجية.'
  },
  {
    id: 2,
    appointmentId: 'apt-1025',
    patientId: 'p-2057',
    code: 'D-1025',
    patientName: 'نور عبد الرحمن',
    time: '11:30 ص',
    status: 'قيد الانتظار',
    appointmentType: 'أونلاين',
    meetingLink: 'https://meet.google.com/demo-link',
    reason: 'فحص القلب - تخطيط كهربي',
    notes: 'بانتظار دخول المريضة إلى غرفة الكشف.'
  },
  {
    id: 3,
    appointmentId: 'apt-1026',
    patientId: 'p-2058',
    code: 'D-1026',
    patientName: 'محمد عبد الله',
    time: '01:00 م',
    status: 'مؤكد',
    appointmentType: 'في العيادة',
    meetingLink: '',
    reason: 'استشارة - ألم الصدر',
    notes: 'تم تأكيد الحضور عبر الاستقبال.'
  },
  {
    id: 4,
    appointmentId: 'apt-1027',
    patientId: 'p-2059',
    code: 'D-1027',
    patientName: 'سارة يوسف',
    time: '03:30 م',
    status: 'مؤكد',
    appointmentType: 'أونلاين',
    meetingLink: '',
    reason: 'متابعة بعد العملية',
    notes: 'يرجى مراجعة تقرير العملية قبل الموعد.'
  },
  {
    id: 5,
    appointmentId: 'apt-1028',
    patientId: 'p-2060',
    code: 'D-1028',
    patientName: 'ليان محمود ناصر',
    time: '04:30 م',
    status: 'ملغي',
    appointmentType: 'في العيادة',
    meetingLink: '',
    reason: 'فحص دوري',
    notes: 'تم إلغاء الموعد بناء على طلب المريض.'
  }
])

const recentDiagnoses = ref([
  { id: 1, patientName: 'نور عبد الرحمن', summary: 'اضطراب بسيط في نبضات القلب' },
  { id: 2, patientName: 'أحمد محمود السيد', summary: 'متابعة ضغط الدم وتحسين الجرعة' },
  { id: 3, patientName: 'سارة يوسف', summary: 'حالة مستقرة بعد العملية' }
])

const recentPrescriptions = ref([
  { id: 1, patientName: 'أحمد محمود السيد', medicine: 'دواء ضغط الدم - مرة يوميا' },
  { id: 2, patientName: 'محمد عبد الله', medicine: 'مسكن خفيف عند الحاجة' },
  { id: 3, patientName: 'سارة يوسف', medicine: 'مضاد حيوي لمدة 5 أيام' }
])

const appointmentStatuses = ['مؤكد', 'قيد الانتظار', 'مكتمل', 'ملغي']

const statusClassFor = (status) => {
  return {
    مكتمل: 'completed',
    'قيد الانتظار': 'waiting',
    مؤكد: 'confirmed',
    ملغي: 'cancelled'
  }[status] || 'confirmed'
}

const showToast = (message) => {
  toastMessage.value = message
  window.setTimeout(() => {
    toastMessage.value = ''
  }, 2400)
}

const updateAppointmentStatus = (appointment) => {
  appointment.statusClass = statusClassFor(appointment.status)
  editingStatusId.value = null
  showToast('تم تحديث حالة الموعد بنجاح')
}

const patientDetailsPathForAppointment = (appointment) => {
  const patientId = String(appointment?.patientId || '').trim()
  return patientId ? `/doctor/patients/${encodeURIComponent(patientId)}` : ''
}

const statsCards = computed(() => [
  { label: 'مواعيد اليوم', value: appointments.value.length, icon: markRaw(CalendarDays) },
  { label: 'المرضى الجدد', value: 8, icon: markRaw(UserPlus) },
  { label: 'التشخيصات اليوم', value: 15, icon: markRaw(ClipboardList) },
  { label: 'الوصفات اليوم', value: 10, icon: markRaw(Pill) }
])

const confirmLogout = async () => {
  isLoggedIn.value = false
  user.value = { name: '' }
  showLogoutModal.value = false
  await navigateTo('/login')
}

const loadAppointments = async () => {
  // Future API integration point: replace the static array with fetched appointments.
}

onMounted(async () => {
  currentArabicDate.value = new Intl.DateTimeFormat('ar-u-nu-latn', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(new Date())

  await loadAppointments()
})
</script>

<style scoped>
.doctor-dashboard-page {
  min-height: 100vh;
  background-color: #ffffff;
  color: #101010;
}

.doctor-dashboard-shell {
  display: grid;
  grid-template-columns: 290px minmax(0, 1fr);
  min-height: calc(100vh - 85px);
}

.doctor-sidebar {
  grid-column: 1;
  grid-row: 1;
  background-color: #eaf2fd;
  border-left: 1.5px solid #0b63f6;
  padding: 32px 32px;
}

.sidebar-header {
  align-items: center;
  display: flex;
  justify-content: center;
  gap: 16px;
}

.doctor-profile-card {
  align-items: center;
  background-color: #eaf2fd;
  border: 1.5px solid #0b63f6;
  border-radius: 24px;
  display: flex;
  flex-direction: column;
  margin-bottom: 26px;
  min-height: 164px;
  padding: 18px 16px;
  text-align: center;
  width: 100%;
}

.doctor-profile-card img {
  background-color: #ffffff;
  border: 1px solid #8dbbfb;
  border-radius: 18px;
  height: 70px;
  margin-bottom: 12px;
  object-fit: contain;
  padding: 8px;
  width: 82px;
}

.doctor-profile-card strong {
  font-size: 17px;
  font-weight: 900;
}

.doctor-profile-card span {
  color: #343434;
  font-size: 15px;
  margin-top: 4px;
}

.sidebar-toggle {
  display: none;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.sidebar-link {
  min-height: 34px;
  border-radius: 8px;
  color: #0a0a0a;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 800;
  text-decoration: none;
  transition: background-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
}

.sidebar-link:hover,
.sidebar-link.active {
  background-color: #5a99ef;
  box-shadow: inset 0 0 0 1px #0b63f6;
}

.sidebar-link:hover {
  transform: translateY(-1px);
}

.logout-link {
  background-color: transparent;
  border: 0;
  cursor: pointer;
  font-family: inherit;
  width: 100%;
}

.doctor-dashboard-content {
  grid-column: 2;
  grid-row: 1;
  padding: 36px 40px 44px;
}

.page-header {
  margin-bottom: 28px;
  text-align: right;
}

.page-header p {
  font-size: 18px;
  margin: 0 0 8px;
}

.page-header h1 {
  font-size: 30px;
  font-weight: 900;
  margin: 0;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 18px;
  margin-bottom: 24px;
}

.stat-card,
.dashboard-section {
  background-color: #eaf2fd;
  border: 1.5px solid #0b63f6;
  border-radius: 24px;
}

.stat-card {
  align-items: center;
  display: flex;
  gap: 18px;
  justify-content: space-between;
  min-height: 126px;
  padding: 24px;
  transition: box-shadow 0.2s ease, transform 0.2s ease;
}

.stat-card:hover,
.dashboard-section:hover {
  box-shadow: 0 12px 26px rgba(17, 91, 210, 0.12);
}

.stat-card:hover {
  transform: translateY(-2px);
}

.stat-copy {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.stat-copy strong {
  font-size: 28px;
  font-weight: 900;
}

.stat-copy span {
  font-size: 17px;
  font-weight: 800;
}

.stat-card :deep(.stat-icon) {
  background-color: #ffffff;
  border: 1px solid #8dbbfb;
  border-radius: 16px;
  box-sizing: border-box;
  color: #115bd2;
  display: block;
  fill: none;
  flex: 0 0 auto;
  height: 54px;
  padding: 12px;
  stroke: #115bd2;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.9;
  width: 54px;
}

.dashboard-section {
  padding: 26px;
}

.appointments-section {
  margin-bottom: 24px;
}

.section-header {
  align-items: center;
  display: flex;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 20px;
}

.section-header h2 {
  font-size: 22px;
  font-weight: 900;
  margin: 0;
}

.section-header span {
  color: #343434;
  font-size: 15px;
  font-weight: 800;
}

.table-wrap {
  overflow-x: auto;
}

.appointments-table {
  border-collapse: separate;
  border-spacing: 0 10px;
  min-width: 1040px;
  width: 100%;
}

.appointments-table th,
.appointments-table td {
  padding: 14px 16px;
  text-align: right;
  white-space: nowrap;
}

.appointments-table th {
  color: #343434;
  font-size: 15px;
  font-weight: 900;
}

.appointments-table td {
  background-color: #ffffff;
  border-bottom: 1px solid #8dbbfb;
  border-top: 1px solid #8dbbfb;
  font-size: 15px;
  font-weight: 800;
}

.appointments-table td:first-child {
  border-right: 1px solid #8dbbfb;
  border-radius: 0 14px 14px 0;
  direction: ltr;
  text-align: right;
}

.appointments-table td:last-child {
  border-left: 1px solid #8dbbfb;
  border-radius: 14px 0 0 14px;
}

.status-badge,
.type-badge {
  align-items: center;
  border: 0;
  border-radius: 999px;
  display: inline-flex;
  font-size: 13px;
  font-weight: 900;
  justify-content: center;
  min-width: 92px;
  padding: 6px 12px;
}

.status-button {
  cursor: pointer;
  font-family: inherit;
}

.status-select {
  border: 1px solid #8dbbfb;
  border-radius: 999px;
  cursor: pointer;
  font-family: inherit;
  font-size: 13px;
  font-weight: 900;
  min-width: 118px;
  outline: none;
  padding: 6px 12px;
}

.status-badge.completed {
  background-color: #dff3e7;
  color: #137446;
}

.status-badge.waiting {
  background-color: #fff2d8;
  color: #9a6507;
}

.status-badge.confirmed {
  background-color: #dcecff;
  color: #115bd2;
}

.status-badge.cancelled {
  background-color: #ffe4e4;
  color: #b42318;
}

.status-select.completed {
  background-color: #dff3e7;
  color: #137446;
}

.status-select.waiting {
  background-color: #fff2d8;
  color: #9a6507;
}

.status-select.confirmed {
  background-color: #dcecff;
  color: #115bd2;
}

.status-select.cancelled {
  background-color: #ffe4e4;
  color: #b42318;
}

.type-badge.online {
  background-color: #dcecff;
  color: #115bd2;
}

.type-badge.clinic {
  background-color: #e9f7ef;
  color: #137446;
}

.view-button,
.meeting-button,
.meeting-missing,
.save-button,
.cancel-button {
  border-radius: 18px;
  cursor: pointer;
  font-family: inherit;
  font-weight: 800;
  transition: background-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
}

.view-button {
  display: inline-flex;
  justify-content: center;
  text-decoration: none;
  background-color: #5a99ef;
  border: 1px solid #0b63f6;
  color: #ffffff;
  min-width: 76px;
  padding: 8px 16px;
}

.appointment-actions {
  align-items: center;
  display: flex;
  justify-content: flex-start;
}

.meeting-cell {
  align-items: center;
  display: inline-flex;
  justify-content: flex-start;
  min-width: 126px;
}

.meeting-button {
  align-items: center;
  background-color: #ffffff;
  border: 1px solid #8dbbfb;
  border-radius: 16px;
  color: #115bd2;
  display: inline-flex;
  gap: 6px;
  justify-content: center;
  min-height: 34px;
  min-width: 118px;
  padding: 6px 12px;
  text-decoration: none;
}

.meeting-button-icon {
  flex: 0 0 auto;
}

.meeting-missing {
  align-items: center;
  background-color: #f6f8fb;
  border: 1px solid #d4e3f8;
  border-radius: 16px;
  color: #707070;
  cursor: not-allowed;
  display: inline-flex;
  font-size: 13px;
  font-weight: 900;
  justify-content: center;
  min-height: 34px;
  min-width: 104px;
  padding: 6px 12px;
}

.meeting-empty {
  color: #8b8b8b;
  display: inline-flex;
  font-size: 18px;
  font-weight: 900;
  justify-content: center;
  min-width: 104px;
}

.view-button:hover,
.meeting-button:hover,
.save-button:hover {
  box-shadow: 0 5px 12px rgba(17, 91, 210, 0.2);
  transform: translateY(-1px);
}

.view-button:hover,
.save-button:hover {
  background-color: #115bd2;
}

.view-button:disabled,
.view-button:disabled:hover,
.view-button.disabled,
.view-button.disabled:hover {
  background-color: #5a99ef;
  box-shadow: none;
  cursor: not-allowed;
  opacity: 0.58;
  transform: none;
}

.meeting-button:hover {
  background-color: #eaf2fd;
  border-color: #0b63f6;
}

.toast-message {
  background-color: #115bd2;
  border: 1px solid #0b63f6;
  border-radius: 18px;
  bottom: 24px;
  box-shadow: 0 14px 32px rgba(17, 91, 210, 0.24);
  color: #ffffff;
  font-weight: 900;
  inset-inline-start: 24px;
  padding: 12px 18px;
  position: fixed;
  z-index: 3000;
}

.quick-sections {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 24px;
}

.quick-list {
  display: grid;
  gap: 12px;
}

.quick-item {
  background-color: #ffffff;
  border: 1px solid #8dbbfb;
  border-radius: 16px;
  display: grid;
  gap: 6px;
  padding: 16px 18px;
}

.quick-item strong {
  font-size: 16px;
  font-weight: 900;
}

.quick-item span {
  color: #343434;
  font-size: 15px;
  font-weight: 700;
}

.empty-state {
  background-color: #ffffff;
  border: 1px solid #8dbbfb;
  border-radius: 18px;
  padding: 46px 24px;
  text-align: center;
}

.empty-state h2 {
  font-size: 24px;
  font-weight: 900;
  margin: 0 0 10px;
}

.empty-state p {
  font-size: 17px;
  margin: 0;
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

.confirmation-modal {
  background-color: #eaf2fd;
  border: 1.5px solid #0b63f6;
  border-radius: 24px;
  box-shadow: 0 18px 45px rgba(0, 0, 0, 0.12);
  max-width: 100%;
  padding: 42px 44px 34px;
  text-align: center;
  width: 560px;
}

.appointment-modal {
  text-align: right;
}

.confirmation-modal h2 {
  font-size: 26px;
  font-weight: 900;
  margin: 0 0 14px;
  text-align: center;
}

.confirmation-modal p {
  font-size: 22px;
  font-weight: 800;
  margin: 0 0 30px;
}

.appointment-details {
  display: grid;
  gap: 12px;
  margin: 26px 0 30px;
}

.appointment-details div {
  align-items: center;
  background-color: #ffffff;
  border: 1px solid #8dbbfb;
  border-radius: 14px;
  display: grid;
  gap: 10px;
  grid-template-columns: 130px minmax(0, 1fr);
  padding: 13px 16px;
}

.appointment-details dt {
  color: #343434;
  font-weight: 900;
}

.appointment-details dd {
  font-weight: 800;
  margin: 0;
}

.modal-actions {
  display: flex;
  gap: 14px;
  justify-content: center;
}

.modal-actions button {
  font-size: 17px;
  min-width: 110px;
  padding: 10px 22px;
}

.save-button {
  background-color: #115bd2;
  border: 1px solid #115bd2;
  color: #ffffff;
}

.cancel-button {
  background-color: #ffffff;
  border: 1px solid #0b63f6;
  color: #115bd2;
}

@media (max-width: 1160px) {
  .stats-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 1030px) {
  .doctor-dashboard-shell {
    grid-template-columns: 240px minmax(0, 1fr);
  }

  .doctor-dashboard-content {
    padding: 32px 24px 48px;
  }

  .quick-sections {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 720px) {
  .doctor-dashboard-shell {
    display: flex;
    flex-direction: column;
  }

  .doctor-sidebar {
    border-left: 0;
    border-bottom: 1.5px solid #0b63f6;
    padding: 18px;
  }

  .sidebar-header {
    justify-content: space-between;
  }

  .doctor-profile-card {
    align-items: center;
    flex: 1;
    flex-direction: row;
    gap: 12px;
    margin-bottom: 0;
    min-height: 76px;
    padding: 12px;
    text-align: right;
  }

  .doctor-profile-card img {
    height: 52px;
    margin-bottom: 0;
    width: 58px;
  }

  .doctor-profile-card span {
    display: block;
  }

  .sidebar-toggle {
    align-items: center;
    background-color: #5a99ef;
    border: 1px solid #0b63f6;
    border-radius: 8px;
    cursor: pointer;
    display: inline-flex;
    flex-direction: column;
    flex: 0 0 auto;
    gap: 5px;
    height: 40px;
    justify-content: center;
    padding: 0;
    width: 44px;
  }

  .sidebar-toggle span {
    background-color: #ffffff;
    border-radius: 999px;
    display: block;
    height: 2px;
    width: 22px;
  }

  .sidebar-nav {
    display: grid;
    grid-template-columns: repeat(2, minmax(120px, 1fr));
    gap: 10px;
    max-height: 0;
    margin-top: 0;
    opacity: 0;
    overflow: hidden;
    transition: max-height 0.25s ease, margin-top 0.25s ease, opacity 0.2s ease;
  }

  .sidebar-nav.is-open {
    max-height: 360px;
    margin-top: 18px;
    opacity: 1;
  }

  .doctor-dashboard-content {
    padding: 32px 18px 44px;
  }

  .page-header h1 {
    font-size: 26px;
  }

  .page-header p {
    font-size: 17px;
  }

  .stats-grid {
    gap: 14px;
  }

  .stat-card,
  .dashboard-section {
    border-radius: 20px;
  }

  .stat-card {
    min-height: 112px;
    padding: 18px;
  }

  .dashboard-section {
    padding: 22px;
  }

  .appointments-table {
    border-spacing: 0;
    min-width: 0;
  }

  .appointments-table thead {
    display: none;
  }

  .appointments-table,
  .appointments-table tbody,
  .appointments-table tr,
  .appointments-table td {
    display: block;
    width: 100%;
  }

  .appointments-table tr {
    background-color: #ffffff;
    border: 1px solid #8dbbfb;
    border-radius: 18px;
    margin-bottom: 12px;
    padding: 10px 14px;
  }

  .appointments-table td,
  .appointments-table td:first-child,
  .appointments-table td:last-child {
    align-items: center;
    background-color: transparent;
    border: 0;
    border-radius: 0;
    display: flex;
    justify-content: space-between;
    gap: 18px;
    padding: 10px 0;
    white-space: normal;
  }

  .appointments-table td::before {
    color: #343434;
    content: attr(data-label);
    flex: 0 0 auto;
    font-weight: 900;
  }

  .appointment-actions,
  .meeting-cell {
    justify-content: flex-end;
    min-width: 0;
  }

  .appointment-details div {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 560px) {
  .doctor-dashboard-content {
    padding: 28px 14px 36px;
  }

  .sidebar-nav,
  .stats-grid {
    grid-template-columns: 1fr;
  }

  .section-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .confirmation-modal {
    border-radius: 20px;
    padding: 32px 22px 28px;
  }

  .confirmation-modal p {
    font-size: 20px;
  }

  .modal-actions {
    flex-direction: column;
  }

  .modal-actions button {
    width: 100%;
  }

  .meeting-cell {
    align-items: stretch;
  }

  .meeting-cell .meeting-button,
  .meeting-cell .meeting-missing,
  .meeting-cell .meeting-empty {
    width: 100%;
  }
}
</style>

<style>
.doctor-dashboard-page .doctor-dashboard-shell {
  display: grid;
  grid-template-columns: 290px minmax(0, 1fr);
  min-height: calc(100vh - 85px);
}

.doctor-dashboard-page .doctor-dashboard-content {
  padding: 36px 40px 44px;
}

.doctor-dashboard-page .stats-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 18px;
  margin-bottom: 24px;
}

.doctor-dashboard-page .stat-card,
.doctor-dashboard-page .dashboard-section {
  background-color: #eaf2fd;
  border: 1.5px solid #0b63f6;
  border-radius: 24px;
}

.doctor-dashboard-page .stat-card {
  align-items: center;
  display: flex;
  gap: 18px;
  justify-content: space-between;
  min-height: 126px;
  padding: 24px;
}

.doctor-dashboard-page .stat-copy {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.doctor-dashboard-page .stat-copy strong {
  font-size: 28px;
  font-weight: 900;
}

.doctor-dashboard-page .stat-copy span {
  font-size: 17px;
  font-weight: 800;
}

.doctor-dashboard-page .stat-icon {
  background-color: #ffffff;
  border: 1px solid #8dbbfb;
  border-radius: 16px;
  box-sizing: border-box;
  color: #115bd2;
  display: block;
  flex: 0 0 auto;
  height: 54px;
  padding: 12px;
  stroke: #115bd2;
  width: 54px;
}

.doctor-dashboard-page .dashboard-section {
  padding: 26px;
}

.doctor-dashboard-page .appointments-section {
  margin-bottom: 24px;
}

.doctor-dashboard-page .section-header {
  align-items: center;
  display: flex;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 20px;
}

.doctor-dashboard-page .section-header h2 {
  font-size: 22px;
  font-weight: 900;
  margin: 0;
}

.doctor-dashboard-page .table-wrap {
  overflow-x: auto;
}

.doctor-dashboard-page .appointments-table {
  border-collapse: separate;
  border-spacing: 0 10px;
  min-width: 1040px;
  width: 100%;
}

.doctor-dashboard-page .appointments-table th,
.doctor-dashboard-page .appointments-table td {
  padding: 14px 16px;
  text-align: right;
  white-space: nowrap;
}

.doctor-dashboard-page .appointments-table td {
  background-color: #ffffff;
  border-bottom: 1px solid #8dbbfb;
  border-top: 1px solid #8dbbfb;
  font-size: 15px;
  font-weight: 800;
}

.doctor-dashboard-page .status-badge {
  align-items: center;
  border-radius: 999px;
  display: inline-flex;
  font-size: 13px;
  font-weight: 900;
  justify-content: center;
  min-width: 92px;
  padding: 6px 12px;
}

.doctor-dashboard-page .view-button,
.doctor-dashboard-page .save-button,
.doctor-dashboard-page .cancel-button {
  border-radius: 18px;
  cursor: pointer;
  font-family: inherit;
  font-weight: 800;
}

.doctor-dashboard-page .view-button {
  display: inline-flex;
  justify-content: center;
  text-decoration: none;
  background-color: #5a99ef;
  border: 1px solid #0b63f6;
  color: #ffffff;
  min-width: 76px;
  padding: 8px 16px;
}

.doctor-dashboard-page .quick-sections {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 24px;
}

.doctor-dashboard-page .quick-item {
  background-color: #ffffff;
  border: 1px solid #8dbbfb;
  border-radius: 16px;
  display: grid;
  gap: 6px;
  padding: 16px 18px;
}

@media (max-width: 1160px) {
  .doctor-dashboard-page .stats-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 1030px) {
  .doctor-dashboard-page .doctor-dashboard-shell {
    grid-template-columns: 240px minmax(0, 1fr);
  }

  .doctor-dashboard-page .quick-sections {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 720px) {
  .doctor-dashboard-page .doctor-dashboard-shell {
    display: flex;
    flex-direction: column;
  }

  .doctor-dashboard-page .doctor-dashboard-content {
    padding: 32px 18px 44px;
  }

  .doctor-dashboard-page .appointments-table {
    border-spacing: 0;
    min-width: 0;
  }

  .doctor-dashboard-page .appointments-table thead {
    display: none;
  }

  .doctor-dashboard-page .appointments-table,
  .doctor-dashboard-page .appointments-table tbody,
  .doctor-dashboard-page .appointments-table tr,
  .doctor-dashboard-page .appointments-table td {
    display: block;
    width: 100%;
  }

  .doctor-dashboard-page .appointments-table tr {
    background-color: #ffffff;
    border: 1px solid #8dbbfb;
    border-radius: 18px;
    margin-bottom: 12px;
    padding: 10px 14px;
  }

  .doctor-dashboard-page .appointments-table td {
    align-items: center;
    background-color: transparent;
    border: 0;
    display: flex;
    justify-content: space-between;
    gap: 18px;
    padding: 10px 0;
    white-space: normal;
  }

  .doctor-dashboard-page .appointments-table td::before {
    color: #343434;
    content: attr(data-label);
    flex: 0 0 auto;
    font-weight: 900;
  }
}

@media (max-width: 560px) {
  .doctor-dashboard-page .stats-grid {
    grid-template-columns: 1fr;
  }

  .doctor-dashboard-page .doctor-dashboard-content {
    padding: 28px 14px 36px;
  }
}
</style>

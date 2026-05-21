<template>
  <div class="doctor-appointments-page" dir="rtl">
    <NavBar />

    <div class="doctor-appointments-shell">
      <DoctorSidebar :doctor="doctor" @logout="showLogoutModal = true" />

      <main class="doctor-appointments-content">
        <header class="page-header">
          <h1>المواعيد</h1>
          <p>إدارة مواعيد الطبيب السابقة والقادمة حسب الفترة والحالة ونوع الموعد.</p>
        </header>

        <section class="period-filter-card" aria-label="تصفية المواعيد حسب الفترة">
          <button
            v-for="period in periodFilters"
            :key="period.value"
            class="period-button"
            :class="{ active: activePeriod === period.value }"
            type="button"
            @click="setActivePeriod(period.value)"
          >
            {{ period.label }}
          </button>
        </section>

        <section class="filters-card" aria-label="بحث وتصفية المواعيد">
          <label class="filter-field search-field">
            <span>بحث</span>
            <input
              v-model.trim="filters.search"
              type="search"
              placeholder="ابحث باسم المريض أو رقم الموعد"
              @input="currentPage = 1"
            >
          </label>

          <label class="filter-field">
            <span>التاريخ</span>
            <input v-model="filters.date" type="date" @change="currentPage = 1">
          </label>

          <label class="filter-field">
            <span>الحالة</span>
            <select v-model="filters.status" @change="currentPage = 1">
              <option v-for="status in statusOptions" :key="status" :value="status">
                {{ status }}
              </option>
            </select>
          </label>

          <label class="filter-field">
            <span>نوع الموعد</span>
            <select v-model="filters.appointmentType" @change="currentPage = 1">
              <option v-for="type in appointmentTypeOptions" :key="type" :value="type">
                {{ type }}
              </option>
            </select>
          </label>
        </section>

        <section class="appointments-card" aria-labelledby="appointments-table-title">
          <div class="section-header">
            <h2 id="appointments-table-title">قائمة المواعيد</h2>
            <span>{{ filteredAppointments.length }} موعد</span>
          </div>

          <div v-if="paginatedAppointments.length" class="table-wrap">
            <table class="appointments-table">
              <thead>
                <tr>
                  <th>رقم الموعد</th>
                  <th>اسم المريض</th>
                  <th>التاريخ</th>
                  <th>الوقت</th>
                  <th>نوع الموعد</th>
                  <th>الحالة</th>
                  <th>اجتماع</th>
                  <th>إجراء</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="appointment in paginatedAppointments" :key="appointment.id">
                  <td data-label="رقم الموعد">{{ appointment.code }}</td>
                  <td data-label="اسم المريض">{{ appointment.patientName }}</td>
                  <td data-label="التاريخ">{{ formatArabicDate(appointment.date) }}</td>
                  <td data-label="الوقت">{{ appointment.time }}</td>
                  <td data-label="نوع الموعد">
                    <span class="type-badge" :class="appointment.appointmentType === 'أونلاين' ? 'online' : 'clinic'">
                      {{ appointment.appointmentType }}
                    </span>
                  </td>
                  <td data-label="الحالة">
                    <span class="status-badge" :class="statusClassFor(appointment.status)">
                      {{ appointment.status }}
                    </span>
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
                      <span v-else class="meeting-empty" aria-label="لا يوجد اجتماع">—</span>
                    </div>
                  </td>
                  <td data-label="إجراء">
                    <NuxtLink
                      class="view-button"
                      :class="{ disabled: !appointment.patientId }"
                      :to="patientDetailsPathForAppointment(appointment)"
                      :aria-disabled="!appointment.patientId"
                      :tabindex="appointment.patientId ? 0 : -1"
                    >
                      عرض
                    </NuxtLink>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div v-else class="empty-state" aria-live="polite">
            <h2>لا توجد مواعيد مطابقة</h2>
            <p>جرّب تعديل البحث أو الفلاتر لعرض نتائج أخرى.</p>
          </div>

          <nav v-if="totalPages > 1" class="pagination" aria-label="صفحات المواعيد">
            <button type="button" :disabled="currentPage === 1" @click="currentPage -= 1">
              السابق
            </button>
            <button
              v-for="page in totalPages"
              :key="page"
              class="page-button"
              :class="{ active: currentPage === page }"
              type="button"
              @click="currentPage = page"
            >
              {{ page }}
            </button>
            <button type="button" :disabled="currentPage === totalPages" @click="currentPage += 1">
              التالي
            </button>
          </nav>
        </section>
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
  </div>
</template>

<script setup>
import { Video } from '@lucide/vue'
import DoctorSidebar from '~/components/doctor/DoctorSidebar.vue'

const showLogoutModal = ref(false)
const activePeriod = ref('all')
const currentPage = ref(1)
const pageSize = 6
const isLoggedIn = useState('isLoggedIn', () => false)
const user = useState('user', () => ({ name: '' }))

const doctor = {
  name: 'د. خالد السيد',
  specialization: 'أمراض القلب',
  avatar: '/images/doctor.png'
}

const periodFilters = [
  { label: 'الكل', value: 'all' },
  { label: 'اليوم', value: 'today' },
  { label: 'هذا الأسبوع', value: 'week' },
  { label: 'هذا الشهر', value: 'month' }
]

const statusOptions = ['الكل', 'مؤكد', 'قيد الانتظار', 'مكتمل', 'ملغي']
const appointmentTypeOptions = ['الكل', 'في العيادة', 'أونلاين']

const filters = reactive({
  search: '',
  date: '',
  status: 'الكل',
  appointmentType: 'الكل'
})

const appointments = ref([
  {
    id: 1,
    appointmentId: 'apt-1024',
    patientId: 'p-2056',
    code: 'D-1024',
    patientName: 'أحمد محمود السيد',
    date: '2026-05-19',
    time: '10:00 ص',
    status: 'مؤكد',
    appointmentType: 'في العيادة',
    meetingLink: ''
  },
  {
    id: 2,
    appointmentId: 'apt-1025',
    patientId: 'p-2057',
    code: 'D-1025',
    patientName: 'نور عبد الرحمن',
    date: '2026-05-19',
    time: '11:30 ص',
    status: 'قيد الانتظار',
    appointmentType: 'أونلاين',
    meetingLink: 'https://meet.google.com/demo-link'
  },
  {
    id: 3,
    appointmentId: 'apt-1026',
    patientId: 'p-2058',
    code: 'D-1026',
    patientName: 'محمد عبد الله',
    date: '2026-05-20',
    time: '01:00 م',
    status: 'مكتمل',
    appointmentType: 'في العيادة',
    meetingLink: ''
  },
  {
    id: 4,
    appointmentId: 'apt-1027',
    patientId: 'p-2059',
    code: 'D-1027',
    patientName: 'سارة يوسف',
    date: '2026-05-21',
    time: '03:30 م',
    status: 'مؤكد',
    appointmentType: 'أونلاين',
    meetingLink: ''
  },
  {
    id: 5,
    appointmentId: 'apt-1028',
    patientId: 'p-2060',
    code: 'D-1028',
    patientName: 'ليان محمود ناصر',
    date: '2026-05-13',
    time: '04:30 م',
    status: 'ملغي',
    appointmentType: 'في العيادة',
    meetingLink: ''
  },
  {
    id: 6,
    appointmentId: 'apt-1029',
    patientId: 'p-2061',
    code: 'D-1029',
    patientName: 'عمر فراس حماد',
    date: '2026-05-22',
    time: '10:30 ص',
    status: 'مؤكد',
    appointmentType: 'أونلاين',
    meetingLink: 'https://meet.google.com/follow-up-demo'
  },
  {
    id: 7,
    appointmentId: 'apt-1030',
    patientId: 'p-2062',
    code: 'D-1030',
    patientName: 'ياسر خالد عيسى',
    date: '2026-06-02',
    time: '09:30 ص',
    status: 'قيد الانتظار',
    appointmentType: 'في العيادة',
    meetingLink: ''
  },
  {
    id: 8,
    appointmentId: 'apt-1031',
    patientId: 'p-2063',
    code: 'D-1031',
    patientName: 'خالد علي',
    date: '2026-04-28',
    time: '02:00 م',
    status: 'مكتمل',
    appointmentType: 'أونلاين',
    meetingLink: 'https://meet.google.com/old-demo'
  }
])

const today = computed(() => {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth(), now.getDate())
})

const filteredAppointments = computed(() => {
  const searchTerm = String(filters.search || '').toLowerCase()

  return (Array.isArray(appointments.value) ? appointments.value : []).filter((appointment) => {
    if (!appointment || typeof appointment !== 'object') {
      return false
    }

    const appointmentDate = parseDate(appointment.date)
    const matchesSearch =
      String(appointment.patientName || '').toLowerCase().includes(searchTerm) ||
      String(appointment.code || '').toLowerCase().includes(searchTerm)
    const matchesDate = !filters.date || appointment.date === filters.date
    const matchesStatus = filters.status === 'الكل' || appointment.status === filters.status
    const matchesType =
      filters.appointmentType === 'الكل' ||
      appointment.appointmentType === filters.appointmentType
    const matchesPeriod = matchesPeriodFilter(appointmentDate)

    return matchesSearch && matchesDate && matchesStatus && matchesType && matchesPeriod
  })
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredAppointments.value.length / pageSize)))

const paginatedAppointments = computed(() => {
  if (currentPage.value > totalPages.value) {
    currentPage.value = totalPages.value
  }

  const start = (currentPage.value - 1) * pageSize
  return filteredAppointments.value.slice(start, start + pageSize)
})

const setActivePeriod = (period) => {
  activePeriod.value = period
  currentPage.value = 1
}

function parseDate(dateValue) {
  if (!dateValue) {
    return new Date(Number.NaN)
  }

  const [year, month, day] = String(dateValue).split('-').map(Number)
  return new Date(year, month - 1, day)
}

function matchesPeriodFilter(appointmentDate) {
  if (Number.isNaN(appointmentDate.getTime())) {
    return false
  }

  const current = today.value

  if (activePeriod.value === 'today') {
    return appointmentDate.toDateString() === current.toDateString()
  }

  if (activePeriod.value === 'week') {
    const startOfWeek = new Date(current)
    startOfWeek.setDate(current.getDate() - current.getDay())
    const endOfWeek = new Date(startOfWeek)
    endOfWeek.setDate(startOfWeek.getDate() + 6)
    return appointmentDate >= startOfWeek && appointmentDate <= endOfWeek
  }

  if (activePeriod.value === 'month') {
    return (
      appointmentDate.getMonth() === current.getMonth() &&
      appointmentDate.getFullYear() === current.getFullYear()
    )
  }

  return true
}

function formatArabicDate(dateValue) {
  const date = parseDate(dateValue)
  if (Number.isNaN(date.getTime())) {
    return 'غير متوفر'
  }

  return new Intl.DateTimeFormat('ar-u-nu-latn', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(date)
}

const statusClassFor = (status) => {
  return {
    مكتمل: 'completed',
    'قيد الانتظار': 'waiting',
    مؤكد: 'confirmed',
    ملغي: 'cancelled'
  }[status] || 'confirmed'
}

const patientDetailsPathForAppointment = (appointment) => {
  const patientId = String(appointment?.patientId || '').trim()
  return patientId ? `/doctor/patients/${encodeURIComponent(patientId)}` : ''
}

const confirmLogout = async () => {
  isLoggedIn.value = false
  user.value = { name: '' }
  showLogoutModal.value = false
  await navigateTo('/login')
}
</script>

<style scoped>
.doctor-appointments-page {
  min-height: 100vh;
  background-color: #ffffff;
  color: #101010;
}

.doctor-appointments-shell {
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

.doctor-appointments-content {
  grid-column: 2;
  grid-row: 1;
  padding: 36px 40px 44px;
}

.page-header {
  margin-bottom: 24px;
}

.page-header h1 {
  font-size: 30px;
  font-weight: 900;
  margin: 0 0 8px;
}

.page-header p {
  color: #343434;
  font-size: 16px;
  font-weight: 700;
  margin: 0;
}

.period-filter-card,
.filters-card,
.appointments-card {
  background-color: #eaf2fd;
  border: 1.5px solid #0b63f6;
  border-radius: 24px;
}

.period-filter-card {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 18px;
  padding: 18px;
}

.period-button,
.view-button,
.meeting-button,
.meeting-missing,
.pagination button,
.save-button,
.cancel-button {
  border-radius: 18px;
  cursor: pointer;
  font-family: inherit;
  font-weight: 800;
  transition: background-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
}

.period-button {
  background-color: #ffffff;
  border: 1px solid #8dbbfb;
  color: #115bd2;
  min-width: 120px;
  padding: 10px 18px;
}

.period-button.active,
.period-button:hover {
  background-color: #5a99ef;
  border-color: #0b63f6;
  color: #ffffff;
}

.filters-card {
  display: grid;
  grid-template-columns: minmax(260px, 1.4fr) repeat(3, minmax(170px, 1fr));
  gap: 16px;
  margin-bottom: 22px;
  padding: 22px;
}

.filter-field {
  display: grid;
  gap: 8px;
}

.filter-field span {
  color: #343434;
  font-size: 14px;
  font-weight: 900;
}

.filter-field input,
.filter-field select {
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

.filter-field input:focus,
.filter-field select:focus {
  border-color: #0b63f6;
  box-shadow: 0 0 0 3px rgba(90, 153, 239, 0.2);
}

.appointments-card {
  padding: 26px;
}

.section-header {
  align-items: center;
  display: flex;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 18px;
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
  min-width: 1120px;
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
  border-radius: 999px;
  display: inline-flex;
  font-size: 13px;
  font-weight: 900;
  justify-content: center;
  min-width: 92px;
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

.status-badge.confirmed,
.type-badge.online {
  background-color: #dcecff;
  color: #115bd2;
}

.status-badge.cancelled {
  background-color: #ffe4e4;
  color: #b42318;
}

.type-badge.clinic {
  background-color: #e9f7ef;
  color: #137446;
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

.meeting-button:hover {
  background-color: #eaf2fd;
  border-color: #0b63f6;
  box-shadow: 0 5px 12px rgba(17, 91, 210, 0.16);
  transform: translateY(-1px);
}

.meeting-missing {
  align-items: center;
  background-color: #f6f8fb;
  border: 1px solid #d4e3f8;
  color: #707070;
  cursor: not-allowed;
  display: inline-flex;
  font-size: 13px;
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

.view-button {
  background-color: #5a99ef;
  border: 1px solid #0b63f6;
  color: #ffffff;
  display: inline-flex;
  justify-content: center;
  min-width: 76px;
  padding: 8px 16px;
  text-decoration: none;
}

.view-button:hover,
.save-button:hover {
  background-color: #115bd2;
  box-shadow: 0 5px 12px rgba(17, 91, 210, 0.2);
  transform: translateY(-1px);
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

.empty-state {
  background-color: #ffffff;
  border: 1px solid #8dbbfb;
  border-radius: 18px;
  padding: 42px 24px;
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

.pagination {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
  margin-top: 20px;
}

.pagination button {
  background-color: #ffffff;
  border: 1px solid #8dbbfb;
  color: #115bd2;
  min-width: 44px;
  padding: 9px 14px;
}

.pagination button.active,
.pagination button:hover:not(:disabled) {
  background-color: #5a99ef;
  border-color: #0b63f6;
  color: #ffffff;
}

.pagination button:disabled {
  color: #8b8b8b;
  cursor: not-allowed;
  opacity: 0.65;
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

.confirmation-modal h2 {
  font-size: 26px;
  font-weight: 900;
  margin: 0 0 14px;
}

.confirmation-modal p {
  font-size: 22px;
  font-weight: 800;
  margin: 0 0 30px;
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

@media (max-width: 1100px) {
  .doctor-appointments-shell {
    grid-template-columns: 240px minmax(0, 1fr);
  }

  .doctor-appointments-content {
    padding: 32px 24px 48px;
  }

  .filters-card {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 720px) {
  .doctor-appointments-shell {
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
    max-height: 420px;
    margin-top: 18px;
    opacity: 1;
  }

  .doctor-appointments-content {
    padding: 32px 18px 44px;
  }

  .page-header h1 {
    font-size: 26px;
  }

  .filters-card {
    grid-template-columns: 1fr;
  }

  .appointments-card,
  .period-filter-card,
  .filters-card {
    border-radius: 20px;
  }
}

@media (max-width: 560px) {
  .doctor-appointments-content {
    padding: 28px 14px 36px;
  }

  .sidebar-nav {
    grid-template-columns: 1fr;
  }

  .period-filter-card {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .period-button {
    min-width: 0;
  }

  .section-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .appointments-card {
    padding: 20px 14px;
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
}
</style>

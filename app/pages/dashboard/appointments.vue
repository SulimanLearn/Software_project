<template>
  <div class="dashboard-page" dir="rtl">
    <NavBar />

    <div class="dashboard-shell">
      <aside class="admin-sidebar" aria-label="لوحة تحكم المدير">
        <div class="sidebar-header">
          <span class="logo-text">
         <h2>مجمع الحياة الطبي</h2>
          </span>

          <button
            class="sidebar-toggle"
            type="button"
            :aria-expanded="isSidebarOpen"
            aria-controls="admin-sidebar-nav"
            aria-label="فتح وإغلاق قائمة لوحة التحكم"
            @click="isSidebarOpen = !isSidebarOpen"
          >
            <span />
            <span />
            <span />
          </button>
        </div>

        <nav
          id="admin-sidebar-nav"
          class="sidebar-nav"
          :class="{ 'is-open': isSidebarOpen }"
        >
          <span class="nav-caption">الرئيسي</span>
          <NuxtLink to="/dashboard" class="sidebar-link">
            لوحة البيانات
          </NuxtLink>
          <NuxtLink to="/dashboard/appointments" class="sidebar-link active">
            المواعيد
          </NuxtLink>
          <NuxtLink to="/dashboard/staff" class="sidebar-link">
            الكادر الطبي
          </NuxtLink>
          <NuxtLink to="/dashboard/patients" class="sidebar-link">
            المرضى
          </NuxtLink>

          <span class="nav-caption">التقارير</span>
          <NuxtLink to="/dashboard/reports" class="sidebar-link">
            التقارير
          </NuxtLink>
          <NuxtLink to="/dashboard/articles" class="sidebar-link">
            إدارة المقالات
          </NuxtLink>
          <NuxtLink to="/dashboard/inventory" class="sidebar-link">
            مراقبة المخزون
          </NuxtLink>
          <NuxtLink to="/dashboard/settings" class="sidebar-link">
            الإعدادات
          </NuxtLink>
          <NuxtLink to="/dashboard/activity" class="sidebar-link">
            سجل النشاطات
          </NuxtLink>
          <button
            class="sidebar-link logout-link"
            type="button"
            @click="showLogoutModal = true"
          >
            خروج
          </button>
        </nav>
      </aside>

      <main class="dashboard-content">
        <header class="page-header">
          <div class="header-row">
            <h1>إدارة المواعيد</h1>
          </div>

          <div class="filter-buttons" aria-label="تصفية المواعيد حسب الحالة">
            <button
              v-for="filter in filters"
              :key="filter.value"
              class="filter-button"
              :class="{ active: selectedFilter === filter.value }"
              type="button"
              @click="selectedFilter = filter.value"
            >
              {{ filter.label }}
            </button>
          </div>
        </header>

        <section class="appointments-card" aria-label="جدول إدارة المواعيد">
          <div class="table-tools">
            <label>
              <span>بحث</span>
              <input
                v-model.trim="searchQuery"
                type="search"
                placeholder="ابحث بالمريض أو الطبيب أو رقم الحجز"
              >
            </label>

            <label>
              <span>التاريخ</span>
              <input v-model="selectedDate" type="date">
            </label>
          </div>

          <div v-if="isTableLoading" class="loading-state">
            <span class="spinner" />
            <p>جاري تحميل البيانات...</p>
          </div>

          <div class="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>رقم الحجز</th>
                  <th>المريض</th>
                  <th>الطبيب</th>
                  <th>التاريخ</th>
                  <th>نوع الموعد</th>
                  <th>الحالة</th>
                  <th>إجراء</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="appointment in paginatedAppointments"
                  :key="appointment.bookingNumber"
                >
                  <td>{{ appointment.bookingNumber }}</td>
                  <td>{{ appointment.patient }}</td>
                  <td>{{ appointment.doctor }}</td>
                  <td>{{ appointment.date }}</td>
                  <td>
                    <span class="type-pill" :class="appointment.appointmentType === 'أونلاين' ? 'online' : 'clinic'">
                      {{ appointment.appointmentType }}
                    </span>
                  </td>
                  <td>
                    <span class="status-pill" :class="appointment.statusKey">
                      {{ appointment.status }}
                    </span>
                  </td>
                  <td>
                    <div class="action-buttons">
                      <button type="button" @click="openDetailsModal(appointment)">
                        عرض
                      </button>
                      <button type="button" @click="openEditModal(appointment)">
                        تعديل
                      </button>
                    </div>
                  </td>
                </tr>
                <tr v-if="!isTableLoading && filteredAppointments.length === 0">
                  <td colspan="7">{{ appointments.length ? 'لا توجد نتائج مطابقة للبحث' : 'لا توجد بيانات متاحة' }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <AdminPagination
            v-if="filteredAppointments.length > pageSize"
            v-model:page="currentPage"
            :total-pages="totalPages"
          />
        </section>
      </main>
    </div>

    <div v-if="toastMessage" class="toast-message">
      {{ toastMessage }}
    </div>

    <div
      v-if="selectedAppointment"
      class="modal-overlay"
      dir="rtl"
      @click.self="closeAppointmentModals"
    >
      <div
        class="appointment-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="details-modal-title"
      >
        <h2 id="details-modal-title">تفاصيل الموعد</h2>

        <dl class="details-list">
          <div
            v-for="detail in appointmentDetails"
            :key="detail.label"
            class="details-row"
          >
            <dt>{{ detail.label }}</dt>
            <dd>{{ detail.value }}</dd>
          </div>
        </dl>

        <div class="modal-actions single-action">
          <button type="button" @click="closeAppointmentModals">
            إغلاق
          </button>
        </div>
      </div>
    </div>

    <div
      v-if="editingAppointment"
      class="modal-overlay"
      dir="rtl"
      @click.self="closeAppointmentModals"
    >
      <div
        class="appointment-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-modal-title"
      >
        <h2 id="edit-modal-title">تعديل الموعد</h2>

        <form class="edit-form" @submit.prevent="saveAppointmentEdit">
          <label for="edit-date">
            <span>التاريخ</span>
            <input
              id="edit-date"
              v-model="editForm.date"
              type="text"
            >
          </label>

          <label for="edit-time">
            <span>الوقت</span>
            <input
              id="edit-time"
              v-model="editForm.time"
              type="text"
            >
          </label>

          <label for="edit-status">
            <span>الحالة</span>
            <select id="edit-status" v-model="editForm.statusKey">
              <option
                v-for="status in statusOptions"
                :key="status.value"
                :value="status.value"
              >
                {{ status.label }}
              </option>
            </select>
          </label>

          <label for="edit-type">
            <span>نوع الموعد</span>
            <select id="edit-type" v-model="editForm.appointmentType">
              <option
                v-for="type in appointmentTypeOptions"
                :key="type"
                :value="type"
              >
                {{ type }}
              </option>
            </select>
          </label>

          <label v-if="editForm.appointmentType === 'أونلاين'" for="edit-meeting">
            <span>رابط الاجتماع</span>
            <input
              id="edit-meeting"
              v-model.trim="editForm.meetingLink"
              type="url"
            >
          </label>

          <div class="modal-actions">
            <button type="submit">
              حفظ التعديل
            </button>
            <button type="button" class="secondary-action" @click="closeAppointmentModals">
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>

    <div
      v-if="showLogoutModal"
      class="logout-overlay"
      dir="rtl"
      @click.self="showLogoutModal = false"
    >
      <div
        class="logout-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="logout-modal-title"
      >
        <p id="logout-modal-title">
          هل انت متاكد انك تريد تسجيل الخروج؟
        </p>

        <div class="logout-actions">
          <button class="confirm-logout" type="button" @click="confirmLogout">
            نعم
          </button>
          <button class="cancel-logout" type="button" @click="showLogoutModal = false">
            لا
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const isSidebarOpen = ref(false)
const showLogoutModal = ref(false)
const isLoggedIn = useState('isLoggedIn', () => false)
const user = useState('user', () => ({ name: '' }))
const selectedFilter = ref('all')
const selectedDate = ref('')
const searchQuery = ref('')
const currentPage = ref(1)
const pageSize = 3
const isTableLoading = ref(false)
const toastMessage = ref('')
const selectedAppointment = ref(null)
const editingAppointment = ref(null)
const editForm = reactive({
  date: '',
  time: '',
  statusKey: 'confirmed',
  appointmentType: 'في العيادة',
  meetingLink: ''
})

const confirmLogout = async () => {
  isLoggedIn.value = false
  user.value = { name: '' }
  showLogoutModal.value = false
  await navigateTo('/login')
}

const filters = [
  { label: 'الكل', value: 'all' },
  { label: 'مؤكدة', value: 'confirmed' },
  { label: 'انتظار', value: 'waiting' },
  { label: 'ملغية', value: 'cancelled' }
]

const statusOptions = [
  { label: 'مؤكدة', value: 'confirmed' },
  { label: 'انتظار', value: 'waiting' },
  { label: 'ملغية', value: 'cancelled' },
  { label: 'مكتملة', value: 'completed' }
]

const appointmentTypeOptions = ['في العيادة', 'أونلاين']

const appointments = reactive([
  {
    bookingNumber: 'A-1024',
    patient: 'أحمد علي',
    doctor: 'د. سارة خالد',
    specialty: 'القلب',
    date: '22 أبريل 2026',
    sortDate: '2026-04-22',
    time: '09:30 ص',
    status: 'مؤكدة',
    statusKey: 'confirmed',
    appointmentType: 'في العيادة',
    meetingLink: ''
  },
  {
    bookingNumber: 'A-1025',
    patient: 'ليان محمود',
    doctor: 'د. عمر حسن',
    specialty: 'الأطفال',
    date: '22 أبريل 2026',
    sortDate: '2026-04-22',
    time: '10:15 ص',
    status: 'انتظار',
    statusKey: 'waiting',
    appointmentType: 'أونلاين',
    meetingLink: 'https://meet.google.com/demo-link'
  },
  {
    bookingNumber: 'A-1026',
    patient: 'محمد ناصر',
    doctor: 'د. ريم يوسف',
    specialty: 'الجلدية',
    date: '23 أبريل 2026',
    sortDate: '2026-04-23',
    time: '12:00 م',
    status: 'ملغية',
    statusKey: 'cancelled',
    appointmentType: 'أونلاين',
    meetingLink: ''
  },
  {
    bookingNumber: 'A-1027',
    patient: 'نور إبراهيم',
    doctor: 'د. خالد سمير',
    specialty: 'العظام',
    date: '24 أبريل 2026',
    sortDate: '2026-04-24',
    time: '01:30 م',
    status: 'مؤكدة',
    statusKey: 'confirmed',
    appointmentType: 'في العيادة',
    meetingLink: ''
  }
])

const filteredAppointments = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()

  return appointments.filter((appointment) => {
    const matchesStatus = selectedFilter.value === 'all' || appointment.statusKey === selectedFilter.value
    const matchesDate = !selectedDate.value || appointment.sortDate === selectedDate.value
    const matchesSearch = !query || [
      appointment.bookingNumber,
      appointment.patient,
      appointment.doctor
    ].some((value) => String(value).toLowerCase().includes(query))

    return matchesStatus && matchesDate && matchesSearch
  })
})

const totalPages = computed(() => {
  return Math.max(1, Math.ceil(filteredAppointments.value.length / pageSize))
})

const paginatedAppointments = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredAppointments.value.slice(start, start + pageSize)
})

watch([selectedFilter, selectedDate, searchQuery], () => {
  currentPage.value = 1
  isTableLoading.value = true
  window.setTimeout(() => {
    isTableLoading.value = false
  }, 250)
})

const showToast = (message) => {
  toastMessage.value = message
  window.setTimeout(() => {
    toastMessage.value = ''
  }, 2200)
}

const appointmentDetails = computed(() => {
  if (!selectedAppointment.value) {
    return []
  }

  return [
    { label: 'رقم الحجز', value: selectedAppointment.value.bookingNumber },
    { label: 'اسم المريض', value: selectedAppointment.value.patient },
    { label: 'اسم الطبيب', value: selectedAppointment.value.doctor },
    { label: 'التخصص', value: selectedAppointment.value.specialty },
    { label: 'التاريخ', value: selectedAppointment.value.date },
    { label: 'الوقت', value: selectedAppointment.value.time },
    { label: 'نوع الموعد', value: selectedAppointment.value.appointmentType },
    {
      label: 'رابط الاجتماع',
      value: selectedAppointment.value.appointmentType === 'أونلاين'
        ? selectedAppointment.value.meetingLink || 'لا يوجد رابط'
        : 'غير مطلوب'
    },
    { label: 'الحالة', value: selectedAppointment.value.status }
  ]
})

const openDetailsModal = (appointment) => {
  selectedAppointment.value = appointment
}

const openEditModal = (appointment) => {
  editingAppointment.value = appointment
  editForm.date = appointment.date
  editForm.time = appointment.time
  editForm.statusKey = appointment.statusKey
  editForm.appointmentType = appointment.appointmentType
  editForm.meetingLink = appointment.meetingLink || ''
}

const closeAppointmentModals = () => {
  selectedAppointment.value = null
  editingAppointment.value = null
}

const saveAppointmentEdit = () => {
  if (!editingAppointment.value) {
    return
  }

  const selectedStatus = statusOptions.find((status) => {
    return status.value === editForm.statusKey
  })

  editingAppointment.value.date = editForm.date
  editingAppointment.value.time = editForm.time
  editingAppointment.value.statusKey = editForm.statusKey
  editingAppointment.value.status = selectedStatus?.label || editingAppointment.value.status
  editingAppointment.value.appointmentType = editForm.appointmentType
  editingAppointment.value.meetingLink = editForm.appointmentType === 'أونلاين' ? editForm.meetingLink : ''
  closeAppointmentModals()
  showToast('تم حفظ التعديلات بنجاح')
}
</script>

<style scoped>
.dashboard-page {
  min-height: 100vh;
  background-color: #ffffff;
  color: #101010;
}

.dashboard-shell {
  display: grid;
  grid-template-columns: 290px minmax(0, 1fr);
  min-height: calc(100vh - 85px);
}

.admin-sidebar {
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

.admin-sidebar h2 {
  margin: 0 0 30px;
  text-align: center;
  font-size: 20px;
  font-weight: 800;
}

.sidebar-toggle {
  display: none;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.nav-caption {
  margin-top: 6px;
  color: #343434;
  font-size: 13px;
  font-weight: 400;
  text-align: right;
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
  transition: background-color 0.2s ease, color 0.2s ease;
}

.sidebar-link:hover,
.sidebar-link.active {
  background-color: #5a99ef;
  box-shadow: inset 0 0 0 1px #0b63f6;
}

.logout-link {
  background-color: transparent;
  border: 0;
  cursor: pointer;
  font-family: inherit;
  width: 100%;
}

.dashboard-content {
  grid-column: 2;
  grid-row: 1;
  padding: 48px 40px 64px;
}

.page-header {
  align-items: flex-start;
  display: flex;
  flex-direction: column;
  gap: 22px;
  margin-bottom: 40px;
}

.header-row {
  align-items: center;
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.page-header h1 {
  margin: 0;
  font-size: 30px;
  font-weight: 900;
}

.filter-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
}

.filter-button {
  background-color: #ffffff;
  border: 1.5px solid #0b63f6;
  border-radius: 18px;
  color: #101010;
  cursor: pointer;
  font-family: inherit;
  font-size: 15px;
  min-width: 86px;
  padding: 11px 24px;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.filter-button:hover,
.filter-button.active {
  background-color: #115bd2;
  color: #ffffff;
}

.appointments-card {
  background-color: #eaf2fd;
  border: 1.5px solid #0b63f6;
  border-radius: 24px;
  min-height: 365px;
  padding: 42px 56px 38px;
}

.table-tools {
  display: grid;
  grid-template-columns: minmax(220px, 1fr) minmax(180px, 260px);
  gap: 16px;
  margin-bottom: 26px;
}

.table-tools label {
  display: grid;
  gap: 8px;
}

.table-tools span {
  font-weight: 900;
}

.table-tools input {
  background-color: #ffffff;
  border: 1.5px solid #0b63f6;
  border-radius: 14px;
  color: #101010;
  font-family: inherit;
  min-height: 44px;
  padding: 0 14px;
}

.loading-state {
  align-items: center;
  color: #115bd2;
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-bottom: 18px;
}

.loading-state p {
  font-weight: 900;
  margin: 0;
}

.spinner {
  animation: spin 0.8s linear infinite;
  border: 3px solid #d9e9ff;
  border-top-color: #115bd2;
  border-radius: 50%;
  height: 24px;
  width: 24px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.table-wrap {
  overflow-x: auto;
}

table {
  border-collapse: collapse;
  min-width: 980px;
  width: 100%;
}

th,
td {
  border-bottom: 2px solid #8dbbfb;
  font-size: 16px;
  padding: 17px 16px;
  text-align: center;
  white-space: nowrap;
}

th {
  font-weight: 800;
}

td {
  height: 66px;
}

.status-pill {
  background-color: #d9e9ff;
  border-radius: 999px;
  color: #115bd2;
  display: inline-flex;
  font-weight: 800;
  justify-content: center;
  min-width: 78px;
  padding: 5px 12px;
}

.status-pill.completed {
  background-color: #dff3e7;
  color: #137446;
}

.type-pill {
  border-radius: 999px;
  display: inline-flex;
  font-size: 13px;
  font-weight: 900;
  justify-content: center;
  min-width: 86px;
  padding: 5px 12px;
}

.type-pill.online {
  background-color: #dcecff;
  color: #115bd2;
}

.type-pill.clinic {
  background-color: #e9f7ef;
  color: #137446;
}

.status-pill.waiting {
  background-color: #fff2d8;
  color: #9a6507;
}

.status-pill.cancelled {
  background-color: #ffe4e4;
  color: #b42318;
}

.action-buttons {
  display: inline-flex;
  gap: 8px;
}

.action-buttons button {
  background-color: #ffffff;
  border: 1px solid #0b63f6;
  border-radius: 8px;
  color: #115bd2;
  cursor: pointer;
  font-family: inherit;
  font-weight: 800;
  min-width: 58px;
  padding: 7px 12px;
}

.action-buttons button:hover {
  background-color: #115bd2;
  color: #ffffff;
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

.appointment-modal {
  background-color: #eaf2fd;
  border: 1.5px solid #0b63f6;
  border-radius: 24px;
  box-shadow: 0 18px 45px rgba(0, 0, 0, 0.12);
  max-width: 100%;
  padding: 34px 44px 36px;
  width: 620px;
}

.appointment-modal h2 {
  font-size: 24px;
  font-weight: 900;
  margin: 0 0 28px;
}

.details-list {
  display: grid;
  gap: 12px;
  margin: 0;
}

.details-row {
  align-items: center;
  border-bottom: 1px solid #8dbbfb;
  display: grid;
  grid-template-columns: 150px minmax(0, 1fr);
  gap: 16px;
  padding: 10px 0;
}

.details-row dt {
  color: #101010;
  font-weight: 900;
}

.details-row dd {
  margin: 0;
}

.edit-form {
  display: grid;
  gap: 20px;
}

.edit-form label {
  display: grid;
  gap: 10px;
}

.edit-form span {
  font-size: 18px;
  font-weight: 800;
}

.edit-form input,
.edit-form select {
  background-color: #dceafa;
  border: 1.5px solid #0b63f6;
  border-radius: 14px;
  color: #101010;
  font-family: inherit;
  font-size: 18px;
  height: 54px;
  outline: none;
  padding: 0 16px;
  text-align: right;
  width: 100%;
}

.edit-form input:focus,
.edit-form select:focus {
  box-shadow: 0 0 0 3px rgba(11, 99, 246, 0.12);
}

.modal-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: flex-start;
  margin-top: 26px;
}

.modal-actions button {
  background-color: #115bd2;
  border: 1px solid #115bd2;
  border-radius: 18px;
  color: #ffffff;
  cursor: pointer;
  font-family: inherit;
  font-size: 16px;
  font-weight: 800;
  min-width: 126px;
  padding: 10px 22px;
}

.modal-actions button:hover {
  background-color: #0b4db8;
}

.modal-actions .secondary-action {
  background-color: #ffffff;
  color: #115bd2;
}

.modal-actions .secondary-action:hover {
  background-color: #dceafa;
}

.single-action {
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

.logout-overlay {
  align-items: center;
  background-color: rgba(68, 139, 239, 0.38);
  display: flex;
  inset: 0;
  justify-content: center;
  padding: 24px;
  position: fixed;
  z-index: 2000;
}

.logout-modal {
  background-color: #eaf2fd;
  border: 1.5px solid #0b63f6;
  border-radius: 24px;
  box-shadow: 0 18px 45px rgba(0, 0, 0, 0.12);
  max-width: 100%;
  padding: 78px 64px 52px;
  text-align: center;
  width: 620px;
}

.logout-modal p {
  font-size: 28px;
  font-weight: 900;
  margin: 0;
}

.logout-actions {
  display: flex;
  gap: 120px;
  justify-content: center;
  margin-top: 34px;
}

.logout-actions button {
  background: none;
  border: 0;
  cursor: pointer;
  font-family: inherit;
  font-size: 28px;
  font-weight: 900;
  padding: 8px 18px;
}

.confirm-logout {
  color: #115bd2;
}

.cancel-logout {
  color: #d92d2d;
}

@media (max-width: 1030px) {
  .dashboard-shell {
    grid-template-columns: 240px minmax(0, 1fr);
  }

  .dashboard-content {
    padding: 36px 24px 48px;
  }
}

@media (max-width: 720px) {
  .dashboard-shell {
    display: flex;
    flex-direction: column;
  }

  .admin-sidebar {
    border-left: 0;
    border-bottom: 1.5px solid #0b63f6;
    padding: 18px;
  }

  .sidebar-header {
    justify-content: space-between;
  }

  .admin-sidebar h2 {
    margin-bottom: 0;
  }

  .sidebar-toggle {
    align-items: center;
    background-color: #5a99ef;
    border: 1px solid #0b63f6;
    border-radius: 8px;
    cursor: pointer;
    display: inline-flex;
    flex-direction: column;
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
    max-height: 640px;
    margin-top: 18px;
    opacity: 1;
  }

  .nav-caption {
    grid-column: 1 / -1;
    text-align: center;
  }

  .dashboard-content {
    padding: 32px 18px 44px;
  }

  .page-header {
    margin-bottom: 28px;
  }

  .page-header h1 {
    font-size: 26px;
  }

  .appointments-card {
    border-radius: 20px;
    padding: 28px 22px;
  }

  .table-tools {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 560px) {
  .dashboard-content {
    padding: 28px 14px 36px;
  }

  .sidebar-nav {
    grid-template-columns: 1fr;
  }

  .filter-buttons {
    display: grid;
    grid-template-columns: repeat(2, minmax(120px, 1fr));
    width: 100%;
  }

  .filter-button {
    width: 100%;
  }

  .appointment-modal {
    padding: 28px 22px;
  }

  .appointment-modal h2 {
    font-size: 22px;
  }

  .details-row {
    grid-template-columns: 1fr;
    gap: 6px;
  }

  .modal-actions,
  .single-action {
    justify-content: stretch;
  }

  .modal-actions button {
    flex: 1;
  }
}
</style>

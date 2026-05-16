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
          <NuxtLink to="/dashboard/appointments" class="sidebar-link">
            المواعيد
          </NuxtLink>
          <NuxtLink to="/dashboard/staff" class="sidebar-link">
            الكادر الطبي
          </NuxtLink>
          <NuxtLink to="/dashboard/patients" class="sidebar-link active">
            المرضى
          </NuxtLink>

          <span class="nav-caption">التقارير</span>
          <NuxtLink to="/dashboard/reports" class="sidebar-link">
            التقارير
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
            <h1>إدارة المرضى</h1>
            <AdminNotifications />
          </div>
        </header>

        <section class="patients-card" aria-label="جدول إدارة المرضى">
          <div class="table-tools">
            <div class="patients-total">
              إجمالي المرضى: {{ patients.length }}
            </div>

            <div class="toolbar-search">
              <span class="toolbar-label">البحث عن مريض</span>

              <label class="search-field">
                <div class="search-input-wrap">
                  <span class="search-icon" aria-hidden="true">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <circle cx="11" cy="11" r="8" />
                      <path d="m21 21-4.35-4.35" />
                    </svg>
                  </span>

                  <input
                    v-model.trim="searchQuery"
                    type="search"
                    placeholder="ابحث باسم المريض أو البريد الإلكتروني أو رقم الهاتف"
                    aria-label="البحث في المرضى"
                  >

                  <button
                    v-if="searchQuery"
                    class="clear-search"
                    type="button"
                    aria-label="مسح البحث"
                    @click="searchQuery = ''"
                  >
                    ×
                  </button>
                </div>
              </label>
            </div>
          </div>

          <div v-if="isTableLoading" class="loading-state">
            <span class="spinner" />
            <p>جاري تحميل البيانات...</p>
          </div>

          <div class="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>المريض</th>
                  <th>الهاتف</th>
                  <th>المواعيد</th>
                  <th>آخر زيارة</th>
                  <th>إجراء</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="patient in paginatedPatients"
                  :key="patient.id"
                >
                  <td>{{ patient.name }}</td>
                  <td>{{ patient.phone }}</td>
                  <td>{{ patient.appointments }}</td>
                  <td>{{ patient.lastVisit }}</td>
                  <td>
                    <div class="action-buttons">
                      <button type="button" @click="openDetailsModal(patient)">
                        عرض
                      </button>
                      <button type="button" @click="openEditModal(patient)">
                        تعديل
                      </button>
                      <button
                        type="button"
                        class="delete-button"
                        @click="openDeleteModal(patient)"
                      >
                        حذف
                      </button>
                    </div>
                  </td>
                </tr>
                <tr v-if="!isTableLoading && filteredPatients.length === 0">
                  <td colspan="5">{{ patients.length ? 'لا توجد نتائج مطابقة للبحث' : 'لا توجد بيانات متاحة' }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <AdminPagination
            v-if="filteredPatients.length > pageSize"
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
      v-if="selectedPatientDetails"
      class="patient-modal-overlay"
      dir="rtl"
      @click.self="selectedPatientDetails = null"
    >
      <div
        class="patient-modal details-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="patient-details-title"
      >
        <h2 id="patient-details-title">تفاصيل المريض</h2>

        <dl class="details-list">
          <div
            v-for="detail in selectedPatientDetails"
            :key="detail.label"
            class="details-row"
          >
            <dt>{{ detail.label }}</dt>
            <dd>{{ detail.value }}</dd>
          </div>
        </dl>

        <div class="modal-actions">
          <button class="save-button" type="button" @click="selectedPatientDetails = null">
            إغلاق
          </button>
        </div>
      </div>
    </div>

    <div
      v-if="selectedEditPatient"
      class="patient-modal-overlay"
      dir="rtl"
      @click.self="closeEditModal"
    >
      <div
        class="patient-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="patient-edit-title"
      >
        <form class="patient-form" @submit.prevent="savePatientEdit">
          <h2 id="patient-edit-title">تعديل بيانات المريض</h2>

          <div class="form-grid">
            <label>
              <span>الاسم الكامل</span>
              <input v-model.trim="editPatientForm.name" type="text">
            </label>

            <label>
              <span>رقم الهاتف</span>
              <input v-model.trim="editPatientForm.phone" type="tel">
            </label>

            <label>
              <span>البريد الإلكتروني</span>
              <input v-model.trim="editPatientForm.email" type="email">
            </label>

            <label>
              <span>الجنس</span>
              <select v-model="editPatientForm.gender">
                <option value="ذكر">ذكر</option>
                <option value="أنثى">أنثى</option>
              </select>
            </label>

            <label class="full-field">
              <span>العنوان</span>
              <input v-model.trim="editPatientForm.address" type="text">
            </label>
          </div>

          <p v-if="formError" class="form-error">{{ formError }}</p>

          <div class="modal-actions">
            <button class="save-button" type="submit">حفظ التعديل</button>
            <button class="cancel-button" type="button" @click="closeEditModal">
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>

    <div
      v-if="deleteTarget"
      class="patient-modal-overlay"
      dir="rtl"
      @click.self="deleteTarget = null"
    >
      <div
        class="patient-modal delete-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="patient-delete-title"
      >
        <p id="patient-delete-title">
          هل أنت متأكد أنك تريد حذف هذا المريض؟
        </p>

        <div class="modal-actions">
          <button class="save-button" type="button" @click="confirmDelete">
            نعم
          </button>
          <button class="cancel-button" type="button" @click="deleteTarget = null">
            لا
          </button>
        </div>
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
const selectedPatientDetails = ref(null)
const selectedEditPatient = ref(null)
const deleteTarget = ref(null)
const formError = ref('')
const searchQuery = ref('')
const currentPage = ref(1)
const pageSize = 3
const isTableLoading = ref(false)
const toastMessage = ref('')
const isLoggedIn = useState('isLoggedIn', () => false)
const user = useState('user', () => ({ name: '' }))

const confirmLogout = async () => {
  isLoggedIn.value = false
  user.value = { name: '' }
  showLogoutModal.value = false
  await navigateTo('/login')
}

const editPatientForm = reactive({
  name: '',
  phone: '',
  email: '',
  gender: 'ذكر',
  address: ''
})

const patients = reactive([
  {
    id: 'patient-1',
    name: 'أحمد علي',
    phone: '059-123-4567',
    email: 'ahmad.ali@example.com',
    gender: 'ذكر',
    address: 'رام الله - المصايف',
    appointments: 6,
    lastVisit: '22 أبريل 2026',
    registeredAt: '4 يناير 2026'
  },
  {
    id: 'patient-2',
    name: 'ليان محمود',
    phone: '056-987-4432',
    email: 'layan.mahmoud@example.com',
    gender: 'أنثى',
    address: 'البيرة - البالوع',
    appointments: 3,
    lastVisit: '18 أبريل 2026',
    registeredAt: '16 فبراير 2026'
  },
  {
    id: 'patient-3',
    name: 'محمد ناصر',
    phone: '059-774-2210',
    email: 'mohammad.nasser@example.com',
    gender: 'ذكر',
    address: 'نابلس - رفيديا',
    appointments: 8,
    lastVisit: '12 أبريل 2026',
    registeredAt: '20 ديسمبر 2025'
  },
  {
    id: 'patient-4',
    name: 'نور إبراهيم',
    phone: '056-332-9081',
    email: 'noor.ibrahim@example.com',
    gender: 'أنثى',
    address: 'الخليل - عين سارة',
    appointments: 2,
    lastVisit: '9 أبريل 2026',
    registeredAt: '11 مارس 2026'
  }
])

const filteredPatients = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()

  if (!query) {
    return patients
  }

  return patients.filter((patient) => {
    return [patient.name, patient.email, patient.phone].some((value) => {
      return String(value).toLowerCase().includes(query)
    })
  })
})

const totalPages = computed(() => {
  return Math.max(1, Math.ceil(filteredPatients.value.length / pageSize))
})

const paginatedPatients = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredPatients.value.slice(start, start + pageSize)
})

watch(searchQuery, () => {
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

const getPatientDetails = (patient) => [
  { label: 'الاسم الكامل', value: patient.name },
  { label: 'رقم الهاتف', value: patient.phone },
  { label: 'البريد الإلكتروني', value: patient.email },
  { label: 'الجنس', value: patient.gender },
  { label: 'العنوان', value: patient.address },
  { label: 'عدد المواعيد', value: patient.appointments },
  { label: 'آخر زيارة', value: patient.lastVisit },
  { label: 'تاريخ التسجيل', value: patient.registeredAt }
]

const openDetailsModal = (patient) => {
  selectedPatientDetails.value = getPatientDetails(patient)
}

const openEditModal = (patient) => {
  selectedEditPatient.value = patient
  formError.value = ''
  Object.assign(editPatientForm, {
    name: patient.name,
    phone: patient.phone,
    email: patient.email,
    gender: patient.gender,
    address: patient.address
  })
}

const closeEditModal = () => {
  selectedEditPatient.value = null
  formError.value = ''
}

const hasRequiredPatientFields = () => {
  return ['name', 'phone', 'email', 'gender', 'address'].every((field) => {
    const value = editPatientForm[field]
    return value !== null && value !== undefined && String(value).trim() !== ''
  })
}

const savePatientEdit = () => {
  if (!hasRequiredPatientFields()) {
    formError.value = 'يرجى تعبئة جميع الحقول المطلوبة'
    return
  }

  if (!selectedEditPatient.value) {
    return
  }

  Object.assign(selectedEditPatient.value, {
    name: editPatientForm.name,
    phone: editPatientForm.phone,
    email: editPatientForm.email,
    gender: editPatientForm.gender,
    address: editPatientForm.address
  })

  closeEditModal()
  showToast('تم حفظ التعديلات بنجاح')
}

const openDeleteModal = (patient) => {
  deleteTarget.value = patient
}

const confirmDelete = () => {
  if (!deleteTarget.value) {
    return
  }

  const index = patients.findIndex((patient) => patient.id === deleteTarget.value.id)

  if (index !== -1) {
    patients.splice(index, 1)
  }

  deleteTarget.value = null
  currentPage.value = Math.min(currentPage.value, totalPages.value)
  showToast('تم الحذف بنجاح')
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
  margin-bottom: 70px;
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

.patients-card {
  background-color: #eaf2fd;
  border: 1.5px solid #0b63f6;
  border-radius: 24px;
  min-height: 365px;
  padding: 42px 56px 38px;
}

.table-tools {
  align-items: center;
  display: flex;
  gap: 18px;
  justify-content: space-between;
  margin-bottom: 22px;
}

.patients-total {
  background-color: #d9e9ff;
  border: 1.5px solid #8dbbfb;
  border-radius: 14px;
  color: #115bd2;
  flex: 0 0 auto;
  font-size: 15px;
  font-weight: 900;
  padding: 10px 16px;
}

.toolbar-search {
  align-items: center;
  display: flex;
  gap: 12px;
  justify-content: flex-start;
  min-width: 0;
}

.toolbar-label {
  color: #101010;
  flex: 0 0 auto;
  font-size: 15px;
  font-weight: 900;
}

.search-field {
  width: min(100%, 440px);
}

.search-input-wrap {
  align-items: center;
  background-color: #ffffff;
  border: 1.5px solid #0b63f6;
  border-radius: 14px;
  display: flex;
  gap: 10px;
  min-height: 42px;
  padding: 0 14px;
  transition: box-shadow 0.2s ease, border-color 0.2s ease;
}

.search-input-wrap:focus-within {
  box-shadow: 0 0 0 3px rgba(11, 99, 246, 0.12);
}

.search-icon {
  align-items: center;
  color: #115bd2;
  display: inline-flex;
  flex: 0 0 auto;
  height: 22px;
  justify-content: center;
  width: 22px;
}

.search-icon svg {
  height: 20px;
  width: 20px;
}

.search-input-wrap input {
  appearance: none;
  background-color: transparent;
  border: 0;
  color: #101010;
  direction: rtl;
  flex: 1;
  font-family: inherit;
  font-size: 16px;
  min-width: 0;
  outline: 0;
}

.search-input-wrap input::placeholder {
  color: #707070;
}

.search-input-wrap input::-webkit-search-cancel-button {
  appearance: none;
}

.clear-search {
  align-items: center;
  background-color: #ffffff;
  border: 1px solid #8dbbfb;
  border-radius: 50%;
  color: #115bd2;
  cursor: pointer;
  display: inline-flex;
  flex: 0 0 auto;
  font-family: inherit;
  font-size: 20px;
  font-weight: 900;
  height: 26px;
  justify-content: center;
  line-height: 1;
  padding: 0;
  width: 26px;
}

.clear-search:hover {
  background-color: #115bd2;
  color: #ffffff;
}

.table-wrap {
  overflow-x: auto;
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

table {
  border-collapse: collapse;
  min-width: 820px;
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
  transition: background-color 0.2s ease;
}

tbody tr {
  transition: background-color 0.2s ease;
}

tbody tr:hover td {
  background-color: rgba(141, 187, 251, 0.16);
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
  min-width: 54px;
  padding: 7px 12px;
  transition: background-color 0.2s ease, color 0.2s ease, transform 0.2s ease;
}

.action-buttons button:hover {
  background-color: #115bd2;
  color: #ffffff;
  transform: translateY(-1px);
}

.action-buttons .delete-button {
  border-color: #5a99ef;
  color: #707070;
}

.patient-modal-overlay,
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

.patient-modal {
  background-color: #eaf2fd;
  border: 1.5px solid #0b63f6;
  border-radius: 24px;
  box-shadow: 0 18px 45px rgba(0, 0, 0, 0.12);
  max-height: min(760px, 88vh);
  max-width: 100%;
  overflow-y: auto;
  padding: 34px 44px 36px;
  width: 680px;
}

.patient-modal h2 {
  font-size: 26px;
  font-weight: 900;
  margin: 0 0 26px;
}

.details-list {
  display: grid;
  gap: 10px;
  margin: 0;
}

.details-row {
  align-items: start;
  border-bottom: 1px solid #8dbbfb;
  display: grid;
  grid-template-columns: 180px minmax(0, 1fr);
  gap: 16px;
  padding: 12px 0;
}

.details-row dt {
  font-weight: 900;
}

.details-row dd {
  margin: 0;
  overflow-wrap: anywhere;
}

.patient-form {
  display: grid;
  gap: 24px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px 20px;
}

.form-grid label {
  display: grid;
  gap: 8px;
}

.form-grid span {
  font-size: 16px;
  font-weight: 800;
}

.form-grid input,
.form-grid select {
  background-color: #ffffff;
  border: 1.5px solid #0b63f6;
  border-radius: 12px;
  color: #101010;
  font-family: inherit;
  font-size: 16px;
  min-height: 44px;
  padding: 8px 12px;
}

.full-field {
  grid-column: 1 / -1;
}

.form-error {
  color: #d92d2d;
  font-weight: 800;
  margin: -6px 0 0;
  text-align: center;
}

.modal-actions {
  display: flex;
  gap: 14px;
  justify-content: center;
  margin-top: 26px;
}

.patient-form .modal-actions {
  margin-top: 0;
}

.modal-actions button {
  border-radius: 18px;
  cursor: pointer;
  font-family: inherit;
  font-size: 17px;
  font-weight: 800;
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

.delete-modal {
  padding: 64px 48px 44px;
  text-align: center;
  width: 560px;
}

.delete-modal p {
  font-size: 24px;
  font-weight: 900;
  margin: 0 0 30px;
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
    max-height: 560px;
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
    margin-bottom: 36px;
  }

  .page-header h1 {
    font-size: 26px;
  }

  .patients-card {
    border-radius: 20px;
    padding: 28px 22px;
  }

  .table-tools {
    align-items: stretch;
    flex-direction: column;
    gap: 14px;
  }

  .toolbar-search {
    align-items: stretch;
    flex-direction: column;
    gap: 8px;
  }

  .search-field {
    width: 100%;
  }

  .patients-total {
    text-align: center;
  }

  .patient-modal {
    padding: 28px 24px;
  }

  .form-grid {
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

  .patient-modal-overlay {
    padding: 16px;
  }

  .patient-modal {
    border-radius: 20px;
    padding: 24px 18px;
  }

  .patient-modal h2 {
    font-size: 23px;
  }

  .details-row {
    grid-template-columns: 1fr;
    gap: 6px;
  }

  .modal-actions {
    flex-direction: column;
  }

  .modal-actions button {
    width: 100%;
  }

  .delete-modal {
    padding: 42px 22px 28px;
  }

  .delete-modal p {
    font-size: 21px;
  }
}
</style>

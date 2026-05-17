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
          <NuxtLink to="/dashboard/staff" class="sidebar-link active">
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
        <section
          v-for="section in staffSections"
          :key="section.title"
          class="staff-section"
        >
          <div class="section-header">
            <h1>{{ section.title }}</h1>

            <div class="section-actions">
              <button
                class="add-staff-button"
                type="button"
                @click="openAddModal(section.role)"
              >
                {{ section.buttonText }}
              </button>
            </div>
          </div>

          <article class="staff-card" :aria-label="section.title">
            <div class="table-tools">
              <label>
                <span>بحث</span>
                <input
                  v-model.trim="section.search"
                  type="search"
                  placeholder="ابحث بالاسم أو البريد أو الهاتف أو التخصص/الدور"
                  @input="handleSectionFilterChange(section)"
                >
              </label>

              <label>
                <span>الحالة</span>
                <select
                  v-model="section.statusFilter"
                  @change="handleSectionFilterChange(section)"
                >
                  <option value="all">الكل</option>
                  <option value="active">نشط</option>
                  <option value="inactive">غير نشط</option>
                </select>
              </label>
            </div>

            <div v-if="section.loading" class="loading-state">
              <span class="spinner" />
              <p>جاري تحميل البيانات...</p>
            </div>

            <div class="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th
                      v-for="column in section.columns"
                      :key="column.key"
                    >
                      {{ column.label }}
                    </th>
                    <th>إجراء</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="member in getPaginatedStaff(section)"
                    :key="member.id"
                  >
                    <td
                      v-for="column in section.columns"
                      :key="column.key"
                    >
                      <span
                        v-if="column.type === 'rating'"
                        class="rating"
                      >
                        {{ member[column.key] }}
                      </span>
                      <span
                        v-else-if="column.type === 'status'"
                        class="status-pill"
                        :class="{ inactive: !member.active }"
                      >
                        {{ member.active ? 'نشط' : 'غير نشط' }}
                      </span>
                      <span v-else>
                        {{ member[column.key] }}
                      </span>
                    </td>
                    <td>
                      <div class="action-buttons">
                        <button
                          type="button"
                          @click="openDetailsModal(section.role, member)"
                        >
                          عرض
                        </button>
                        <button
                          type="button"
                          @click="openEditModal(section.role, member)"
                        >
                          تعديل
                        </button>
                        <button
                          type="button"
                          class="delete-button"
                          @click="openDeleteModal(section.role, member)"
                        >
                          حذف
                        </button>
                      </div>
                    </td>
                  </tr>
                  <tr v-if="!section.loading && getFilteredStaff(section).length === 0">
                    <td :colspan="section.columns.length + 1">
                      {{ section.rows.length ? 'لا توجد نتائج مطابقة للبحث' : 'لا توجد بيانات متاحة' }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <AdminPagination
              v-if="getFilteredStaff(section).length > pageSize"
              v-model:page="section.page"
              :total-pages="getTotalPages(section)"
            />
          </article>
        </section>
      </main>
    </div>

    <div v-if="toastMessage" class="toast-message">
      {{ toastMessage }}
    </div>

    <div
      v-if="activeStaffModal"
      class="staff-modal-overlay"
      dir="rtl"
      @click.self="closeAddModal"
    >
      <div
        class="staff-modal"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="`${activeStaffModal}-modal-title`"
      >
        <form
          v-if="activeStaffModal === 'doctor'"
          class="staff-form"
          @submit.prevent="saveDoctor"
        >
          <div class="modal-header">
            <h2 id="doctor-modal-title">إضافة طبيب</h2>
          </div>

          <div class="form-grid">
            <label>
              <span>الاسم الكامل</span>
              <input v-model.trim="doctorForm.fullName" type="text">
            </label>

            <label>
              <span>البريد الإلكتروني</span>
              <input v-model.trim="doctorForm.email" type="email">
            </label>

            <label>
              <span>كلمة المرور</span>
              <input v-model="doctorForm.password" type="password">
            </label>

            <label>
              <span>رقم الهاتف</span>
              <input v-model.trim="doctorForm.phone" type="tel">
            </label>

            <label>
              <span>الدور</span>
              <input type="text" value="طبيب" disabled>
            </label>

            <label>
              <span>التخصص</span>
              <input v-model.trim="doctorForm.specialty" type="text">
            </label>

            <label>
              <span>رسوم الكشف</span>
              <input v-model.number="doctorForm.consultationFee" min="0" type="number">
            </label>

            <label>
              <span>نوع الاستشارة</span>
              <select v-model="doctorForm.consultationType">
                <option value="في العيادة">في العيادة</option>
                <option value="أونلاين">أونلاين</option>
                <option value="كلاهما">كلاهما</option>
              </select>
            </label>

            <label>
              <span>الحالة</span>
              <select v-model="doctorForm.status">
                <option value="نشط">نشط</option>
                <option value="غير نشط">غير نشط</option>
              </select>
            </label>

            <label class="full-field">
              <span>السيرة المختصرة</span>
              <textarea v-model.trim="doctorForm.bio" rows="3" />
            </label>
          </div>

          <p v-if="formError" class="form-error">{{ formError }}</p>

          <div class="modal-actions">
            <button class="save-button" type="submit">حفظ</button>
            <button class="cancel-button" type="button" @click="closeAddModal">
              إلغاء
            </button>
          </div>
        </form>

        <form
          v-else-if="activeStaffModal === 'nurse'"
          class="staff-form"
          @submit.prevent="saveNurse"
        >
          <div class="modal-header">
            <h2 id="nurse-modal-title">إضافة ممرض</h2>
          </div>

          <div class="form-grid">
            <label>
              <span>الاسم الكامل</span>
              <input v-model.trim="nurseForm.fullName" type="text">
            </label>

            <label>
              <span>البريد الإلكتروني</span>
              <input v-model.trim="nurseForm.email" type="email">
            </label>

            <label>
              <span>كلمة المرور</span>
              <input v-model="nurseForm.password" type="password">
            </label>

            <label>
              <span>رقم الهاتف</span>
              <input v-model.trim="nurseForm.phone" type="tel">
            </label>

            <label>
              <span>الدور</span>
              <input type="text" value="ممرض" disabled>
            </label>

            <label>
              <span>العنوان</span>
              <input v-model.trim="nurseForm.address" type="text">
            </label>

            <label>
              <span>الحالة</span>
              <select v-model="nurseForm.status">
                <option value="نشط">نشط</option>
                <option value="غير نشط">غير نشط</option>
              </select>
            </label>
          </div>

          <p v-if="formError" class="form-error">{{ formError }}</p>

          <div class="modal-actions">
            <button class="save-button" type="submit">حفظ</button>
            <button class="cancel-button" type="button" @click="closeAddModal">
              إلغاء
            </button>
          </div>
        </form>

        <form
          v-else
          class="staff-form"
          @submit.prevent="savePharmacist"
        >
          <div class="modal-header">
            <h2 id="pharmacist-modal-title">إضافة صيدلي</h2>
          </div>

          <div class="form-grid">
            <label>
              <span>الاسم الكامل</span>
              <input v-model.trim="pharmacistForm.fullName" type="text">
            </label>

            <label>
              <span>البريد الإلكتروني</span>
              <input v-model.trim="pharmacistForm.email" type="email">
            </label>

            <label>
              <span>كلمة المرور</span>
              <input v-model="pharmacistForm.password" type="password">
            </label>

            <label>
              <span>رقم الهاتف</span>
              <input v-model.trim="pharmacistForm.phone" type="tel">
            </label>

            <label>
              <span>الدور</span>
              <input type="text" value="صيدلي" disabled>
            </label>

            <label>
              <span>الحالة</span>
              <select v-model="pharmacistForm.status">
                <option value="نشط">نشط</option>
                <option value="غير نشط">غير نشط</option>
              </select>
            </label>
          </div>

          <p v-if="formError" class="form-error">{{ formError }}</p>

          <div class="modal-actions">
            <button class="save-button" type="submit">حفظ</button>
            <button class="cancel-button" type="button" @click="closeAddModal">
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>

    <div
      v-if="selectedStaffDetails"
      class="staff-modal-overlay"
      dir="rtl"
      @click.self="selectedStaffDetails = null"
    >
      <div
        class="staff-modal details-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="details-modal-title"
      >
        <div class="modal-header">
          <h2 id="details-modal-title">{{ selectedStaffDetails.title }}</h2>
        </div>

        <dl class="details-list">
          <div
            v-for="detail in selectedStaffDetails.details"
            :key="detail.label"
            class="details-row"
          >
            <dt>{{ detail.label }}</dt>
            <dd>{{ detail.value }}</dd>
          </div>
        </dl>

        <div class="modal-actions">
          <button
            class="save-button"
            type="button"
            @click="selectedStaffDetails = null"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>

    <div
      v-if="activeEditRole"
      class="staff-modal-overlay"
      dir="rtl"
      @click.self="closeEditModal"
    >
      <div
        class="staff-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-modal-title"
      >
        <form class="staff-form" @submit.prevent="saveStaffEdit">
          <div class="modal-header">
            <h2 id="edit-modal-title">{{ editModalTitle }}</h2>
          </div>

          <div class="form-grid">
            <label>
              <span>الاسم الكامل</span>
              <input v-model.trim="editForm.fullName" type="text">
            </label>

            <label>
              <span>البريد الإلكتروني</span>
              <input v-model.trim="editForm.email" type="email">
            </label>

            <label>
              <span>كلمة مرور جديدة</span>
              <input v-model="editForm.newPassword" type="password">
            </label>

            <label>
              <span>رقم الهاتف</span>
              <input v-model.trim="editForm.phone" type="tel">
            </label>

            <label>
              <span>الدور</span>
              <input type="text" :value="roleLabels[activeEditRole]" disabled>
            </label>

            <template v-if="activeEditRole === 'doctor'">
              <label>
                <span>التخصص</span>
                <input v-model.trim="editForm.specialty" type="text">
              </label>

              <label>
                <span>رسوم الكشف</span>
                <input v-model.number="editForm.consultationFee" min="0" type="number">
              </label>

              <label>
                <span>نوع الاستشارة</span>
                <select v-model="editForm.consultationType">
                  <option value="في العيادة">في العيادة</option>
                  <option value="أونلاين">أونلاين</option>
                  <option value="كلاهما">كلاهما</option>
                </select>
              </label>
            </template>

            <label v-if="activeEditRole === 'nurse'">
              <span>العنوان</span>
              <input v-model.trim="editForm.address" type="text">
            </label>

            <label>
              <span>الحالة</span>
              <select v-model="editForm.status">
                <option value="نشط">نشط</option>
                <option value="غير نشط">غير نشط</option>
              </select>
            </label>

            <label
              v-if="activeEditRole === 'doctor'"
              class="full-field"
            >
              <span>السيرة المختصرة</span>
              <textarea v-model.trim="editForm.bio" rows="3" />
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
      class="staff-modal-overlay"
      dir="rtl"
      @click.self="deleteTarget = null"
    >
      <div
        class="staff-modal delete-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-modal-title"
      >
        <p id="delete-modal-title">
          هل أنت متأكد أنك تريد حذف هذا المستخدم؟
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
const activeStaffModal = ref(null)
const activeEditRole = ref(null)
const selectedEditMember = ref(null)
const selectedStaffDetails = ref(null)
const deleteTarget = ref(null)
const formError = ref('')
const toastMessage = ref('')
const pageSize = 3
const isLoggedIn = useState('isLoggedIn', () => false)
const user = useState('user', () => ({ name: '' }))

const roleLabels = {
  doctor: 'طبيب',
  nurse: 'ممرض',
  pharmacist: 'صيدلي'
}

const editModalTitle = computed(() => {
  if (!activeEditRole.value) {
    return 'تعديل المستخدم'
  }

  return `تعديل ${roleLabels[activeEditRole.value]}`
})

const confirmLogout = async () => {
  isLoggedIn.value = false
  user.value = { name: '' }
  showLogoutModal.value = false
  await navigateTo('/login')
}

const createDoctorForm = () => ({
  fullName: '',
  email: '',
  password: '',
  phone: '',
  role: 'doctor',
  specialty: '',
  bio: '',
  consultationFee: 100,
  consultationType: 'في العيادة',
  status: 'نشط'
})

const createNurseForm = () => ({
  fullName: '',
  email: '',
  password: '',
  phone: '',
  role: 'nurse',
  address: '',
  status: 'نشط'
})

const createPharmacistForm = () => ({
  fullName: '',
  email: '',
  password: '',
  phone: '',
  role: 'pharmacist',
  status: 'نشط'
})

const doctorForm = reactive(createDoctorForm())
const nurseForm = reactive(createNurseForm())
const pharmacistForm = reactive(createPharmacistForm())
const editForm = reactive({
  fullName: '',
  email: '',
  newPassword: '',
  phone: '',
  role: '',
  specialty: '',
  bio: '',
  consultationFee: 0,
  consultationType: 'في العيادة',
  address: '',
  status: 'نشط'
})

const resetForm = (target, source) => {
  Object.assign(target, source())
}

const openAddModal = (role) => {
  activeStaffModal.value = role
  formError.value = ''
}

const resetActiveForm = () => {
  if (activeStaffModal.value === 'doctor') {
    resetForm(doctorForm, createDoctorForm)
  } else if (activeStaffModal.value === 'nurse') {
    resetForm(nurseForm, createNurseForm)
  } else if (activeStaffModal.value === 'pharmacist') {
    resetForm(pharmacistForm, createPharmacistForm)
  }
}

const closeAddModal = () => {
  resetActiveForm()
  activeStaffModal.value = null
  formError.value = ''
}

const hasRequiredFields = (form, fields) => {
  return fields.every((field) => {
    const value = form[field]
    return value !== null && value !== undefined && String(value).trim() !== ''
  })
}

const validateForm = (form, fields) => {
  if (!hasRequiredFields(form, fields)) {
    formError.value = 'يرجى تعبئة جميع الحقول المطلوبة'
    return false
  }

  formError.value = ''
  return true
}

const getNextId = (prefix, rows) => `${prefix}-${Date.now()}-${rows.length + 1}`

const showToast = (message) => {
  toastMessage.value = message
  window.setTimeout(() => {
    toastMessage.value = ''
  }, 2200)
}

const handleSectionFilterChange = (section) => {
  section.page = 1
  section.loading = true
  window.setTimeout(() => {
    section.loading = false
  }, 250)
}

const getSearchValues = (role, member) => {
  const staffUser = getUserData(member, role)

  return [
    member.name,
    staffUser.email,
    staffUser.phone,
    roleLabels[role],
    member.specialty,
    member.address,
    member.branch
  ]
}

const getFilteredStaff = (section) => {
  const query = section.search.trim().toLowerCase()

  return section.rows.filter((member) => {
    const matchesStatus =
      section.statusFilter === 'all' ||
      (section.statusFilter === 'active' && member.active) ||
      (section.statusFilter === 'inactive' && !member.active)

    const matchesSearch = !query || getSearchValues(section.role, member).some((value) => {
      return String(value || '').toLowerCase().includes(query)
    })

    return matchesStatus && matchesSearch
  })
}

const getTotalPages = (section) => {
  return Math.max(1, Math.ceil(getFilteredStaff(section).length / pageSize))
}

const getPaginatedStaff = (section) => {
  const start = (section.page - 1) * pageSize
  return getFilteredStaff(section).slice(start, start + pageSize)
}

const getRowsByRole = (role) => {
  if (role === 'doctor') {
    return doctors
  }

  if (role === 'nurse') {
    return nurses
  }

  return pharmacists
}

const getUserData = (member, role) => ({
  fullName: member.user?.fullName || member.name,
  email: member.user?.email || '',
  password: member.user?.password || '',
  phone: member.user?.phone || '',
  role: member.user?.role || role
})

const getStatusText = (member) => member.active ? 'نشط' : 'غير نشط'

const getStaffDetails = (role, member) => {
  const staffUser = getUserData(member, role)
  const baseDetails = [
    { label: 'الاسم الكامل', value: staffUser.fullName },
    { label: 'البريد الإلكتروني', value: staffUser.email },
    { label: 'رقم الهاتف', value: staffUser.phone }
  ]

  if (role === 'doctor') {
    return [
      ...baseDetails,
      { label: 'التخصص', value: member.specialty },
      { label: 'السيرة المختصرة', value: member.bio || 'غير محددة' },
      { label: 'رسوم الكشف', value: member.consultationFee ? `₪${member.consultationFee}` : 'غير محددة' },
      { label: 'نوع الاستشارة', value: member.consultationType || 'غير محددة' },
      { label: 'الحالة', value: getStatusText(member) }
    ]
  }

  if (role === 'nurse') {
    return [
      ...baseDetails,
      { label: 'العنوان', value: member.address || 'غير محدد' },
      { label: 'الحالة', value: getStatusText(member) }
    ]
  }

  return [
    ...baseDetails,
    { label: 'الحالة', value: getStatusText(member) }
  ]
}

const openDetailsModal = (role, member) => {
  selectedStaffDetails.value = {
    title: `عرض ${roleLabels[role]}`,
    details: getStaffDetails(role, member)
  }
}

const openEditModal = (role, member) => {
  const staffUser = getUserData(member, role)

  activeEditRole.value = role
  selectedEditMember.value = member
  formError.value = ''

  Object.assign(editForm, {
    fullName: staffUser.fullName,
    email: staffUser.email,
    newPassword: '',
    phone: staffUser.phone,
    role,
    specialty: member.specialty || '',
    bio: member.bio || '',
    consultationFee: member.consultationFee || 0,
    consultationType: member.consultationType || 'في العيادة',
    address: member.address || '',
    status: getStatusText(member)
  })
}

const closeEditModal = () => {
  activeEditRole.value = null
  selectedEditMember.value = null
  formError.value = ''
}

const openDeleteModal = (role, member) => {
  deleteTarget.value = { role, member }
}

const doctorsColumns = [
  { key: 'name', label: 'الطبيب' },
  { key: 'specialty', label: 'التخصص' },
  { key: 'appointments', label: 'المواعيد' },
  { key: 'rating', label: 'التقييم', type: 'rating' },
  { key: 'active', label: 'الحالة', type: 'status' }
]

const nursesColumns = [
  { key: 'name', label: 'الممرض' },
  { key: 'address', label: 'العنوان' },
  { key: 'shift', label: 'الوردية' },
  { key: 'patients', label: 'المرضى' },
  { key: 'active', label: 'الحالة', type: 'status' }
]

const pharmacistsColumns = [
  { key: 'name', label: 'الصيدلي' },
  { key: 'branch', label: 'الفرع' },
  { key: 'orders', label: 'الطلبات' },
  { key: 'shift', label: 'الوردية' },
  { key: 'active', label: 'الحالة', type: 'status' }
]

const doctors = reactive([
  {
    id: 'doctor-1',
    user: {
      fullName: 'د. سارة خالد',
      email: 'sarah.khaled@mediconnect.test',
      password: 'demo-password',
      phone: '059-111-2040',
      role: 'doctor'
    },
    name: 'د. سارة خالد',
    specialty: 'القلب',
    bio: 'استشارية أمراض القلب ومتابعة ضغط الدم.',
    consultationFee: 100,
    consultationType: 'كلاهما',
    appointments: 32,
    rating: '4.9 / 5',
    active: true
  },
  {
    id: 'doctor-2',
    user: {
      fullName: 'د. عمر حسن',
      email: 'omar.hassan@mediconnect.test',
      password: 'demo-password',
      phone: '056-222-9140',
      role: 'doctor'
    },
    name: 'د. عمر حسن',
    specialty: 'الأطفال',
    bio: 'طبيب أطفال مختص بمتابعة النمو واللقاحات.',
    consultationFee: 80,
    consultationType: 'في العيادة',
    appointments: 27,
    rating: '4.7 / 5',
    active: true
  },
  {
    id: 'doctor-3',
    user: {
      fullName: 'د. ريم يوسف',
      email: 'reem.yousef@mediconnect.test',
      password: 'demo-password',
      phone: '059-333-7810',
      role: 'doctor'
    },
    name: 'د. ريم يوسف',
    specialty: 'الجلدية',
    bio: 'طبيبة جلدية لعلاج الحساسية ومشاكل البشرة.',
    consultationFee: 120,
    consultationType: 'أونلاين',
    appointments: 18,
    rating: '4.6 / 5',
    active: false
  },
  {
    id: 'doctor-4',
    user: {
      fullName: 'د. خالد سمير',
      email: 'khaled.sameer@mediconnect.test',
      password: 'demo-password',
      phone: '056-444-3301',
      role: 'doctor'
    },
    name: 'د. خالد سمير',
    specialty: 'العظام',
    bio: 'طبيب عظام ومفاصل وإصابات رياضية.',
    consultationFee: 110,
    consultationType: 'في العيادة',
    appointments: 24,
    rating: '4.8 / 5',
    active: true
  }
])

const nurses = reactive([
  {
    id: 'nurse-1',
    user: {
      fullName: 'أمل يوسف',
      email: 'amal.yousef@mediconnect.test',
      password: 'demo-password',
      phone: '056-332-9081',
      role: 'nurse'
    },
    name: 'أمل يوسف',
    address: 'رام الله - الماصيون',
    shift: 'صباحية',
    patients: 18,
    active: true
  },
  {
    id: 'nurse-2',
    user: {
      fullName: 'مريم ناصر',
      email: 'mariam.nasser@mediconnect.test',
      password: 'demo-password',
      phone: '059-654-2210',
      role: 'nurse'
    },
    name: 'مريم ناصر',
    address: 'البيرة - البالوع',
    shift: 'مسائية',
    patients: 12,
    active: true
  },
  {
    id: 'nurse-3',
    user: {
      fullName: 'سامي محمود',
      email: 'sami.mahmoud@mediconnect.test',
      password: 'demo-password',
      phone: '056-111-7832',
      role: 'nurse'
    },
    name: 'سامي محمود',
    address: 'نابلس - رفيديا',
    shift: 'ليلية',
    patients: 15,
    active: false
  }
])

const pharmacists = reactive([
  {
    id: 'pharmacist-1',
    user: {
      fullName: 'هبة علي',
      email: 'heba.ali@mediconnect.test',
      password: 'demo-password',
      phone: '059-880-1120',
      role: 'pharmacist'
    },
    name: 'هبة علي',
    branch: 'الصيدلية الرئيسية',
    orders: 42,
    shift: 'صباحية',
    active: true
  },
  {
    id: 'pharmacist-2',
    user: {
      fullName: 'كريم حسن',
      email: 'kareem.hassan@mediconnect.test',
      password: 'demo-password',
      phone: '056-771-0094',
      role: 'pharmacist'
    },
    name: 'كريم حسن',
    branch: 'العيادات الخارجية',
    orders: 31,
    shift: 'مسائية',
    active: true
  },
  {
    id: 'pharmacist-3',
    user: {
      fullName: 'رنا سمير',
      email: 'rana.sameer@mediconnect.test',
      password: 'demo-password',
      phone: '059-443-5121',
      role: 'pharmacist'
    },
    name: 'رنا سمير',
    branch: 'قسم الطوارئ',
    orders: 24,
    shift: 'ليلية',
    active: false
  }
])

const saveDoctor = () => {
  const requiredFields = [
    'fullName',
    'email',
    'password',
    'phone',
    'specialty',
    'bio',
    'consultationFee',
    'consultationType',
    'status'
  ]

  if (!validateForm(doctorForm, requiredFields)) {
    return
  }

  doctors.push({
    id: getNextId('doctor', doctors),
    user: {
      fullName: doctorForm.fullName,
      email: doctorForm.email,
      password: doctorForm.password,
      phone: doctorForm.phone,
      role: doctorForm.role
    },
    name: doctorForm.fullName,
    specialty: doctorForm.specialty,
    bio: doctorForm.bio,
    consultationFee: doctorForm.consultationFee,
    consultationType: doctorForm.consultationType,
    appointments: 0,
    rating: '0 / 5',
    active: doctorForm.status === 'نشط'
  })

  closeAddModal()
  showToast('تمت الإضافة بنجاح')
}

const saveNurse = () => {
  const requiredFields = [
    'fullName',
    'email',
    'password',
    'phone',
    'address',
    'status'
  ]

  if (!validateForm(nurseForm, requiredFields)) {
    return
  }

  nurses.push({
    id: getNextId('nurse', nurses),
    user: {
      fullName: nurseForm.fullName,
      email: nurseForm.email,
      password: nurseForm.password,
      phone: nurseForm.phone,
      role: nurseForm.role
    },
    name: nurseForm.fullName,
    address: nurseForm.address,
    shift: 'غير محددة',
    patients: 0,
    active: nurseForm.status === 'نشط'
  })

  closeAddModal()
  showToast('تمت الإضافة بنجاح')
}

const savePharmacist = () => {
  const requiredFields = [
    'fullName',
    'email',
    'password',
    'phone',
    'status'
  ]

  if (!validateForm(pharmacistForm, requiredFields)) {
    return
  }

  pharmacists.push({
    id: getNextId('pharmacist', pharmacists),
    user: {
      fullName: pharmacistForm.fullName,
      email: pharmacistForm.email,
      password: pharmacistForm.password,
      phone: pharmacistForm.phone,
      role: pharmacistForm.role
    },
    name: pharmacistForm.fullName,
    branch: 'غير محدد',
    orders: 0,
    shift: 'غير محددة',
    active: pharmacistForm.status === 'نشط'
  })

  closeAddModal()
  showToast('تمت الإضافة بنجاح')
}

const saveStaffEdit = () => {
  const requiredFields = ['fullName', 'email', 'phone', 'status']

  if (activeEditRole.value === 'doctor') {
    requiredFields.push('specialty', 'bio', 'consultationFee', 'consultationType')
  }

  if (activeEditRole.value === 'nurse') {
    requiredFields.push('address')
  }

  if (!validateForm(editForm, requiredFields) || !selectedEditMember.value) {
    return
  }

  const member = selectedEditMember.value
  const currentUser = getUserData(member, activeEditRole.value)

  member.user = {
    fullName: editForm.fullName,
    email: editForm.email,
    password: editForm.newPassword || currentUser.password,
    phone: editForm.phone,
    role: activeEditRole.value
  }
  member.name = editForm.fullName
  member.active = editForm.status === 'نشط'

  if (activeEditRole.value === 'doctor') {
    member.specialty = editForm.specialty
    member.bio = editForm.bio
    member.consultationFee = editForm.consultationFee
    member.consultationType = editForm.consultationType
  } else if (activeEditRole.value === 'nurse') {
    member.address = editForm.address
  }

  closeEditModal()
  showToast('تم حفظ التعديلات بنجاح')
}

const confirmDelete = () => {
  if (!deleteTarget.value) {
    return
  }

  const rows = getRowsByRole(deleteTarget.value.role)
  const index = rows.findIndex((member) => member.id === deleteTarget.value.member.id)

  if (index !== -1) {
    rows.splice(index, 1)
  }

  deleteTarget.value = null
  showToast('تم الحذف بنجاح')
}

const staffSections = reactive([
  {
    role: 'doctor',
    title: 'إدارة الأطباء',
    buttonText: 'إضافة طبيب',
    columns: doctorsColumns,
    rows: doctors,
    search: '',
    statusFilter: 'all',
    page: 1,
    loading: false
  },
  {
    role: 'nurse',
    title: 'إدارة الممرضين',
    buttonText: 'إضافة ممرض',
    columns: nursesColumns,
    rows: nurses,
    search: '',
    statusFilter: 'all',
    page: 1,
    loading: false
  },
  {
    role: 'pharmacist',
    title: 'إدارة الصيادلة',
    buttonText: 'إضافة صيدلي',
    columns: pharmacistsColumns,
    rows: pharmacists,
    search: '',
    statusFilter: 'all',
    page: 1,
    loading: false
  }
])
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

.staff-section {
  margin-bottom: 56px;
}

.staff-section:last-child {
  margin-bottom: 0;
}

.section-header {
  align-items: center;
  display: flex;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 32px;
}

.section-header h1 {
  margin: 0;
  font-size: 30px;
  font-weight: 900;
}

.section-actions {
  align-items: center;
  display: flex;
  gap: 14px;
}

.add-staff-button {
  background-color: #115bd2;
  border: 1px solid #115bd2;
  border-radius: 24px;
  color: #ffffff;
  cursor: pointer;
  font-family: inherit;
  font-size: 17px;
  min-width: 160px;
  padding: 13px 28px;
  transition: background-color 0.2s ease, box-shadow 0.2s ease;
}

.add-staff-button:hover {
  background-color: #0b4db8;
  box-shadow: 0 6px 16px rgba(17, 91, 210, 0.2);
}

.staff-card {
  background-color: #eaf2fd;
  border: 1.5px solid #0b63f6;
  border-radius: 24px;
  min-height: 365px;
  padding: 42px 56px 38px;
}

.table-tools {
  display: grid;
  grid-template-columns: minmax(220px, 1fr) minmax(160px, 220px);
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

.table-tools input,
.table-tools select {
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
  min-width: 900px;
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

.rating {
  color: #115bd2;
  font-weight: 800;
}

.status-pill {
  background-color: #d9e9ff;
  border-radius: 999px;
  color: #115bd2;
  display: inline-flex;
  font-weight: 800;
  justify-content: center;
  min-width: 82px;
  padding: 5px 12px;
}

.status-pill.inactive {
  color: #707070;
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
}

.action-buttons button:hover {
  background-color: #115bd2;
  color: #ffffff;
}

.action-buttons .delete-button {
  border-color: #5a99ef;
  color: #707070;
}

.staff-modal-overlay,
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

.staff-modal {
  background-color: #eaf2fd;
  border: 1.5px solid #0b63f6;
  border-radius: 24px;
  box-shadow: 0 18px 45px rgba(0, 0, 0, 0.12);
  max-height: min(820px, 88vh);
  max-width: 100%;
  overflow-y: auto;
  padding: 34px 44px 36px;
  width: 760px;
}

.staff-form {
  display: grid;
  gap: 24px;
}

.modal-header h2 {
  font-size: 26px;
  font-weight: 900;
  margin: 0;
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
.form-grid select,
.form-grid textarea {
  background-color: #ffffff;
  border: 1.5px solid #0b63f6;
  border-radius: 12px;
  color: #101010;
  font-family: inherit;
  font-size: 16px;
  min-height: 44px;
  padding: 8px 12px;
}

.form-grid textarea {
  resize: vertical;
}

.form-grid input:disabled {
  background-color: #d9e9ff;
  color: #343434;
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

.details-modal {
  width: 640px;
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

.modal-actions {
  display: flex;
  gap: 14px;
  justify-content: center;
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

  .staff-section {
    margin-bottom: 44px;
  }

  .section-header {
    margin-bottom: 28px;
  }

  .section-actions {
    gap: 10px;
  }

  .section-header h1 {
    font-size: 26px;
  }

  .staff-card {
    border-radius: 20px;
    padding: 28px 22px;
  }

  .table-tools {
    grid-template-columns: 1fr;
  }

  .staff-modal {
    padding: 28px 24px;
    width: min(100%, 680px);
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

  .section-header {
    align-items: center;
    flex-direction: row;
    gap: 12px;
  }

  .section-actions {
    flex: 0 0 auto;
  }

  .section-header h1 {
    font-size: 22px;
    white-space: nowrap;
  }

  .add-staff-button {
    flex: 0 0 auto;
    font-size: 14px;
    min-width: 112px;
    padding: 10px 14px;
  }

  .staff-modal-overlay {
    padding: 16px;
  }

  .staff-modal {
    border-radius: 20px;
    padding: 24px 18px;
  }

  .modal-header h2 {
    font-size: 23px;
  }

  .modal-actions {
    flex-direction: column;
  }

  .modal-actions button {
    width: 100%;
  }

  .details-row {
    grid-template-columns: 1fr;
    gap: 6px;
  }

  .delete-modal {
    padding: 42px 22px 28px;
  }

  .delete-modal p {
    font-size: 21px;
  }
}
</style>

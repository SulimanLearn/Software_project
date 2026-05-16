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
          <NuxtLink to="/dashboard/patients" class="sidebar-link">
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
          <NuxtLink to="/dashboard/activity" class="sidebar-link active">
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
            <h1>سجل النشاطات</h1>
            <AdminNotifications />
          </div>
        </header>

        <section class="activity-card" aria-label="سجل النشاطات">
          <div class="table-tools">
            <label>
              <span>بحث</span>
              <input
                v-model.trim="searchQuery"
                type="search"
                placeholder="ابحث بالمستخدم أو العملية أو القسم"
              >
            </label>

            <label>
              <span>الدور</span>
              <select v-model="roleFilter">
                <option value="all">الكل</option>
                <option value="مدير">مدير</option>
                <option value="طبيب">طبيب</option>
                <option value="ممرض">ممرض</option>
                <option value="صيدلي">صيدلي</option>
              </select>
            </label>

            <label>
              <span>العملية</span>
              <select v-model="actionFilter">
                <option value="all">الكل</option>
                <option value="إضافة">إضافة</option>
                <option value="تعديل">تعديل</option>
                <option value="حذف">حذف</option>
                <option value="تسجيل دخول">تسجيل دخول</option>
              </select>
            </label>

            <label>
              <span>التاريخ</span>
              <input v-model="dateFilter" type="date">
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
                  <th>المستخدم</th>
                  <th>الدور</th>
                  <th>العملية</th>
                  <th>القسم</th>
                  <th>التاريخ</th>
                  <th>الوقت</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="log in paginatedLogs" :key="log.id">
                  <td>{{ log.user }}</td>
                  <td>{{ log.role }}</td>
                  <td>{{ log.action }}</td>
                  <td>{{ log.section }}</td>
                  <td>{{ log.date }}</td>
                  <td>{{ log.time }}</td>
                </tr>
                <tr v-if="!isTableLoading && filteredLogs.length === 0">
                  <td colspan="6">
                    {{ activityLogs.length ? 'لا توجد نتائج مطابقة للبحث' : 'لا توجد بيانات متاحة' }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <AdminPagination
            v-if="filteredLogs.length > pageSize"
            v-model:page="currentPage"
            :total-pages="totalPages"
          />
        </section>
      </main>
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
const searchQuery = ref('')
const roleFilter = ref('all')
const actionFilter = ref('all')
const dateFilter = ref('')
const currentPage = ref(1)
const pageSize = 4
const isTableLoading = ref(false)
const isLoggedIn = useState('isLoggedIn', () => false)
const user = useState('user', () => ({ name: '' }))

const confirmLogout = async () => {
  isLoggedIn.value = false
  user.value = { name: '' }
  showLogoutModal.value = false
  await navigateTo('/login')
}

const activityLogs = reactive([
  {
    id: 'log-1',
    user: 'مدير النظام',
    role: 'مدير',
    action: 'إضافة',
    section: 'المواعيد',
    date: '15 مايو 2026',
    sortDate: '2026-05-15',
    time: '09:15 ص'
  },
  {
    id: 'log-2',
    user: 'د. سارة خالد',
    role: 'طبيب',
    action: 'تعديل',
    section: 'الملف الطبي',
    date: '15 مايو 2026',
    sortDate: '2026-05-15',
    time: '10:00 ص'
  },
  {
    id: 'log-3',
    user: 'أمل يوسف',
    role: 'ممرض',
    action: 'إضافة',
    section: 'طلبات التمريض',
    date: '14 مايو 2026',
    sortDate: '2026-05-14',
    time: '02:20 م'
  },
  {
    id: 'log-4',
    user: 'هبة علي',
    role: 'صيدلي',
    action: 'تعديل',
    section: 'طلبات الأدوية',
    date: '14 مايو 2026',
    sortDate: '2026-05-14',
    time: '03:45 م'
  },
  {
    id: 'log-5',
    user: 'مدير النظام',
    role: 'مدير',
    action: 'حذف',
    section: 'المرضى',
    date: '13 مايو 2026',
    sortDate: '2026-05-13',
    time: '11:35 ص'
  },
  {
    id: 'log-6',
    user: 'مدير النظام',
    role: 'مدير',
    action: 'تسجيل دخول',
    section: 'النظام',
    date: '13 مايو 2026',
    sortDate: '2026-05-13',
    time: '08:00 ص'
  }
])

const filteredLogs = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()

  return activityLogs.filter((log) => {
    const matchesSearch = !query || [log.user, log.action, log.section].some((value) => {
      return String(value).toLowerCase().includes(query)
    })
    const matchesRole = roleFilter.value === 'all' || log.role === roleFilter.value
    const matchesAction = actionFilter.value === 'all' || log.action === actionFilter.value
    const matchesDate = !dateFilter.value || log.sortDate === dateFilter.value

    return matchesSearch && matchesRole && matchesAction && matchesDate
  })
})

const totalPages = computed(() => {
  return Math.max(1, Math.ceil(filteredLogs.value.length / pageSize))
})

const paginatedLogs = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredLogs.value.slice(start, start + pageSize)
})

watch([searchQuery, roleFilter, actionFilter, dateFilter], () => {
  currentPage.value = 1
  isTableLoading.value = true
  window.setTimeout(() => {
    isTableLoading.value = false
  }, 250)
})
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
  padding: 32px;
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
  padding: 48px 40px 64px;
}

.page-header {
  margin-bottom: 44px;
}

.header-row {
  align-items: center;
  display: flex;
  justify-content: space-between;
}

.page-header h1 {
  margin: 0;
  font-size: 30px;
  font-weight: 900;
}

.activity-card {
  background-color: #eaf2fd;
  border: 1.5px solid #0b63f6;
  border-radius: 24px;
  min-height: 365px;
  padding: 42px 56px 38px;
}

.table-tools {
  display: grid;
  grid-template-columns: minmax(220px, 1fr) repeat(3, minmax(150px, 220px));
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

  .table-tools {
    grid-template-columns: repeat(2, minmax(180px, 1fr));
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

  .activity-card {
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
}
</style>

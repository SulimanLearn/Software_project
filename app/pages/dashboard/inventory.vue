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
          <NuxtLink to="/dashboard/inventory" class="sidebar-link active">
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
            <h1>مراقبة المخزون</h1>
            <AdminNotifications />
          </div>
        </header>

        <section class="inventory-card" aria-label="مراقبة المخزون">
          <div class="table-toolbar">
            <div class="table-tools">
              <label>
                <span>بحث</span>
                <input
                  v-model.trim="searchQuery"
                  type="search"
                  placeholder="ابحث باسم الدواء"
                >
              </label>

              <label>
                <span>الحالة</span>
                <select v-model="statusFilter">
                  <option value="all">الكل</option>
                  <option value="متوفر">متوفر</option>
                  <option value="منخفض">منخفض</option>
                  <option value="منتهي">منتهي</option>
                </select>
              </label>
            </div>

            <div class="export-actions">
              <button type="button" @click="printInventoryReport">
                طباعة التقرير
              </button>
              <button type="button" @click="exportInventoryCsv">
                تصدير CSV
              </button>
            </div>
          </div>

          <div v-if="isTableLoading" class="loading-state">
            <span class="spinner" />
            <p>جاري تحميل البيانات...</p>
          </div>

          <div id="inventory-report" class="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>اسم الدواء</th>
                  <th>التصنيف</th>
                  <th>الكمية الحالية</th>
                  <th>الحد الأدنى للمخزون</th>
                  <th>السعر</th>
                  <th>الحالة</th>
                  <th>آخر تحديث</th>
                  <th>المسؤول عن التحديث</th>
                  <th class="no-print">إجراء</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="medicine in paginatedMedicines"
                  :key="medicine.id"
                  :class="{ 'low-stock-row': medicine.status !== 'متوفر' }"
                >
                  <td>{{ medicine.name }}</td>
                  <td>{{ medicine.category }}</td>
                  <td>{{ medicine.currentQuantity }}</td>
                  <td>{{ medicine.minimumStock }}</td>
                  <td>{{ medicine.price }}</td>
                  <td>
                    <span class="status-pill" :class="medicine.statusClass">
                      {{ medicine.status }}
                    </span>
                  </td>
                  <td>{{ medicine.lastUpdated }}</td>
                  <td>{{ medicine.updatedBy }}</td>
                  <td class="no-print">
                    <button
                      class="view-button"
                      type="button"
                      @click="openDetailsModal(medicine)"
                    >
                      عرض
                    </button>
                  </td>
                </tr>
                <tr v-if="!isTableLoading && filteredMedicines.length === 0">
                  <td colspan="9">
                    {{ medicines.length ? 'لا توجد نتائج مطابقة للبحث' : 'لا توجد بيانات متاحة' }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <AdminPagination
            v-if="filteredMedicines.length > pageSize"
            v-model:page="currentPage"
            :total-pages="totalPages"
          />
        </section>
      </main>
    </div>

    <div
      v-if="selectedMedicine"
      class="modal-overlay"
      dir="rtl"
      @click.self="selectedMedicine = null"
    >
      <div
        class="details-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="medicine-modal-title"
      >
        <h2 id="medicine-modal-title">تفاصيل الدواء</h2>

        <dl class="details-list">
          <div
            v-for="detail in medicineDetails"
            :key="detail.label"
            class="details-row"
          >
            <dt>{{ detail.label }}</dt>
            <dd>{{ detail.value }}</dd>
          </div>
        </dl>

        <div class="modal-actions">
          <button type="button" @click="selectedMedicine = null">
            إغلاق
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
const searchQuery = ref('')
const statusFilter = ref('all')
const currentPage = ref(1)
const pageSize = 4
const isTableLoading = ref(false)
const selectedMedicine = ref(null)
const isLoggedIn = useState('isLoggedIn', () => false)
const user = useState('user', () => ({ name: '' }))

const confirmLogout = async () => {
  isLoggedIn.value = false
  user.value = { name: '' }
  showLogoutModal.value = false
  await navigateTo('/login')
}

const medicines = reactive([
  {
    id: 'med-1',
    name: 'باراسيتامول 500mg',
    category: 'مسكنات',
    currentQuantity: 180,
    minimumStock: 50,
    price: '₪12',
    status: 'متوفر',
    statusClass: 'available',
    lastUpdated: '15 مايو 2026',
    updatedBy: 'هبة علي'
  },
  {
    id: 'med-2',
    name: 'أموكسيسيلين 250mg',
    category: 'مضادات حيوية',
    currentQuantity: 18,
    minimumStock: 40,
    price: '₪28',
    status: 'منخفض',
    statusClass: 'low',
    lastUpdated: '14 مايو 2026',
    updatedBy: 'كريم حسن'
  },
  {
    id: 'med-3',
    name: 'أنسولين سريع المفعول',
    category: 'أدوية السكري',
    currentQuantity: 0,
    minimumStock: 20,
    price: '₪95',
    status: 'منتهي',
    statusClass: 'empty',
    lastUpdated: '13 مايو 2026',
    updatedBy: 'رنا سمير'
  },
  {
    id: 'med-4',
    name: 'لوراتادين 10mg',
    category: 'حساسية',
    currentQuantity: 62,
    minimumStock: 25,
    price: '₪18',
    status: 'متوفر',
    statusClass: 'available',
    lastUpdated: '12 مايو 2026',
    updatedBy: 'هبة علي'
  },
  {
    id: 'med-5',
    name: 'محلول ملحي 500ml',
    category: 'مستلزمات طبية',
    currentQuantity: 12,
    minimumStock: 30,
    price: '₪8',
    status: 'منخفض',
    statusClass: 'low',
    lastUpdated: '11 مايو 2026',
    updatedBy: 'كريم حسن'
  }
])

const filteredMedicines = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()

  return medicines.filter((medicine) => {
    const matchesSearch = !query || medicine.name.toLowerCase().includes(query)
    const matchesStatus = statusFilter.value === 'all' || medicine.status === statusFilter.value

    return matchesSearch && matchesStatus
  })
})

const totalPages = computed(() => {
  return Math.max(1, Math.ceil(filteredMedicines.value.length / pageSize))
})

const paginatedMedicines = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredMedicines.value.slice(start, start + pageSize)
})

const medicineDetails = computed(() => {
  if (!selectedMedicine.value) {
    return []
  }

  return [
    { label: 'اسم الدواء', value: selectedMedicine.value.name },
    { label: 'التصنيف', value: selectedMedicine.value.category },
    { label: 'الكمية الحالية', value: selectedMedicine.value.currentQuantity },
    { label: 'الحد الأدنى للمخزون', value: selectedMedicine.value.minimumStock },
    { label: 'السعر', value: selectedMedicine.value.price },
    { label: 'الحالة', value: selectedMedicine.value.status },
    { label: 'آخر تحديث', value: selectedMedicine.value.lastUpdated },
    { label: 'المسؤول عن التحديث', value: selectedMedicine.value.updatedBy }
  ]
})

watch([searchQuery, statusFilter], () => {
  currentPage.value = 1
  isTableLoading.value = true
  window.setTimeout(() => {
    isTableLoading.value = false
  }, 250)
})

const openDetailsModal = (medicine) => {
  selectedMedicine.value = medicine
}

const exportInventoryCsv = () => {
  const headers = [
    'اسم الدواء',
    'التصنيف',
    'الكمية الحالية',
    'الحد الأدنى للمخزون',
    'السعر',
    'الحالة',
    'آخر تحديث',
    'المسؤول عن التحديث'
  ]
  const rows = filteredMedicines.value.map((medicine) => [
    medicine.name,
    medicine.category,
    medicine.currentQuantity,
    medicine.minimumStock,
    medicine.price,
    medicine.status,
    medicine.lastUpdated,
    medicine.updatedBy
  ])
  const csv = [headers, ...rows]
    .map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(','))
    .join('\n')
  const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')

  link.href = url
  link.download = 'inventory-report.csv'
  link.click()
  URL.revokeObjectURL(url)
}

const printInventoryReport = () => {
  const reportElement = document.getElementById('inventory-report')

  if (!reportElement) {
    return
  }

  const printWindow = window.open('', '_blank', 'width=1100,height=800')

  if (!printWindow) {
    return
  }

  printWindow.document.write(`
    <!doctype html>
    <html lang="ar" dir="rtl">
      <head>
        <title>تقرير المخزون</title>
        <style>
          @page { size: A4 landscape; margin: 10mm; }
          * { box-sizing: border-box; }
          body { direction: rtl; font-family: Arial, sans-serif; margin: 0; color: #101010; }
          h1 { font-size: 20px; margin: 0 0 14px; }
          table { border-collapse: collapse; table-layout: fixed; width: 100%; }
          th, td {
            border-bottom: 1px solid #8dbbfb;
            font-size: 10px;
            padding: 6px 4px;
            text-align: center;
            white-space: normal;
            overflow-wrap: anywhere;
          }
          th { font-weight: 800; }
          .no-print { display: none !important; }
        </style>
      </head>
      <body>
        <h1>تقرير مراقبة المخزون</h1>
        ${reportElement.outerHTML}
      </body>
    </html>
  `)
  printWindow.document.close()
  printWindow.focus()
  printWindow.print()
  printWindow.close()
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

.inventory-card {
  background-color: #eaf2fd;
  border: 1.5px solid #0b63f6;
  border-radius: 24px;
  min-height: 365px;
  padding: 42px 56px 38px;
}

.table-toolbar {
  align-items: end;
  display: flex;
  gap: 16px;
  justify-content: space-between;
  margin-bottom: 26px;
}

.table-tools {
  display: grid;
  grid-template-columns: minmax(220px, 360px) minmax(150px, 220px);
  gap: 16px;
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

.export-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.export-actions button,
.view-button,
.modal-actions button {
  background-color: #115bd2;
  border: 1px solid #115bd2;
  border-radius: 14px;
  color: #ffffff;
  cursor: pointer;
  font-family: inherit;
  font-weight: 800;
  padding: 9px 16px;
  transition: background-color 0.2s ease, transform 0.2s ease;
}

.export-actions button:hover,
.view-button:hover,
.modal-actions button:hover {
  background-color: #0b4db8;
  transform: translateY(-1px);
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
  min-width: 1180px;
  width: 100%;
}

th,
td {
  border-bottom: 2px solid #8dbbfb;
  font-size: 15px;
  padding: 17px 14px;
  text-align: center;
  white-space: nowrap;
}

th {
  font-weight: 800;
}

td {
  height: 66px;
}

tbody tr {
  transition: background-color 0.2s ease;
}

tbody tr:hover td {
  background-color: rgba(141, 187, 251, 0.16);
}

.low-stock-row td {
  background-color: rgba(255, 255, 255, 0.38);
}

.status-pill {
  background-color: #d9e9ff;
  border-radius: 999px;
  color: #115bd2;
  display: inline-flex;
  font-weight: 900;
  justify-content: center;
  min-width: 82px;
  padding: 5px 12px;
}

.status-pill.low {
  color: #b7791f;
}

.status-pill.empty {
  color: #d92d2d;
}

.modal-overlay,
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

.details-modal,
.logout-modal {
  background-color: #eaf2fd;
  border: 1.5px solid #0b63f6;
  border-radius: 24px;
  box-shadow: 0 18px 45px rgba(0, 0, 0, 0.12);
  max-width: 100%;
}

.details-modal {
  padding: 34px 44px 36px;
  width: 640px;
}

.details-modal h2 {
  font-size: 24px;
  font-weight: 900;
  margin: 0 0 28px;
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
}

.modal-actions {
  display: flex;
  justify-content: center;
  margin-top: 26px;
}

.logout-modal {
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

  .table-toolbar {
    align-items: stretch;
    flex-direction: column;
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
    max-height: 520px;
    margin-top: 18px;
    opacity: 1;
    overflow: hidden;
  }

  .sidebar-nav:not(.is-open) {
    max-height: 0;
    margin-top: 0;
    opacity: 0;
  }

  .nav-caption {
    grid-column: 1 / -1;
    text-align: center;
  }

  .dashboard-content {
    padding: 32px 18px 44px;
  }

  .inventory-card {
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

  .export-actions button {
    width: 100%;
  }

  .details-modal {
    padding: 28px 22px;
  }

  .details-row {
    grid-template-columns: 1fr;
    gap: 6px;
  }
}
</style>

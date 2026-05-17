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
          <NuxtLink to="/dashboard/reports" class="sidebar-link active">
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
            <h1>التقارير والإحصائيات</h1>
          </div>
        </header>

        <section
          v-for="report in reports"
          :id="`report-${report.id}`"
          :key="report.id"
          class="report-section"
        >
          <div class="report-header">
            <h2>{{ report.title }}</h2>

            <div class="report-actions no-print">
              <button
                class="print-button"
                type="button"
                @click="printReport(report.id)"
              >
                طباعة التقرير
              </button>
              <button
                class="print-button"
                type="button"
                @click="printReport(report.id)"
              >
                تصدير PDF
              </button>
              <button
                class="print-button"
                type="button"
                @click="exportReportCsv(report)"
              >
                تصدير Excel/CSV
              </button>
            </div>
          </div>

          <div class="report-filters no-print">
            <label>
              <span>من تاريخ</span>
              <input
                v-model="report.filters.fromDate"
                type="date"
                @change="handleReportFilterChange(report)"
              >
            </label>

            <label>
              <span>إلى تاريخ</span>
              <input
                v-model="report.filters.toDate"
                type="date"
                @change="handleReportFilterChange(report)"
              >
            </label>

            <label>
              <span>الحالة</span>
              <select
                v-model="report.filters.status"
                @change="handleReportFilterChange(report)"
              >
                <option value="all">الكل</option>
                <option
                  v-for="status in report.statusOptions"
                  :key="status"
                  :value="status"
                >
                  {{ status }}
                </option>
              </select>
            </label>
          </div>

          <div class="summary-grid">
            <article
              v-for="summary in getSummary(report)"
              :key="summary.label"
              class="summary-card"
            >
              <strong>{{ summary.value }}</strong>
              <span>{{ summary.label }}</span>
            </article>
          </div>

          <article class="reports-card" :aria-label="report.title">
            <div v-if="report.loading" class="loading-state">
              <span class="spinner" />
              <p>جاري تحميل البيانات...</p>
            </div>

            <div class="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th
                      v-for="column in report.columns"
                      :key="column.key"
                    >
                      {{ column.label }}
                    </th>
                    <th class="no-print">إجراء</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="row in getPaginatedRows(report)"
                    :key="row.id"
                  >
                    <td
                      v-for="column in report.columns"
                      :key="column.key"
                    >
                      <span
                        v-if="column.type === 'status'"
                        class="status-pill neutral"
                      >
                        {{ row[column.key] }}
                      </span>
                      <span v-else>
                        {{ row[column.key] }}
                      </span>
                    </td>
                    <td class="no-print">
                      <button
                        class="view-button"
                        type="button"
                        @click="openDetailsModal(report, row)"
                      >
                        عرض
                      </button>
                    </td>
                  </tr>
                  <tr v-if="!report.loading && getFilteredRows(report).length === 0">
                    <td :colspan="report.columns.length + 1">
                      {{ report.rows.length ? 'لا توجد نتائج مطابقة للبحث' : 'لا توجد بيانات متاحة' }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <AdminPagination
              v-if="getFilteredRows(report).length > pageSize"
              v-model:page="report.page"
              :total-pages="getTotalPages(report)"
            />
          </article>
        </section>
      </main>
    </div>

    <div
      v-if="selectedRecord"
      class="record-overlay"
      dir="rtl"
      @click.self="selectedRecord = null"
    >
      <div
        class="record-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="record-modal-title"
      >
        <h2 id="record-modal-title">{{ selectedRecord.title }}</h2>

        <dl class="details-list">
          <div
            v-for="detail in selectedRecord.details"
            :key="detail.label"
            class="details-row"
          >
            <dt>{{ detail.label }}</dt>
            <dd>{{ detail.value }}</dd>
          </div>
        </dl>

        <div class="modal-actions">
          <button type="button" @click="selectedRecord = null">
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
const selectedRecord = ref(null)
const pageSize = 3
const isLoggedIn = useState('isLoggedIn', () => false)
const user = useState('user', () => ({ name: '' }))

const confirmLogout = async () => {
  isLoggedIn.value = false
  user.value = { name: '' }
  showLogoutModal.value = false
  await navigateTo('/login')
}

const createFilters = () => ({
  fromDate: '',
  toDate: '',
  status: 'all'
})

const appointmentColumns = [
  { key: 'bookingNumber', label: 'رقم الحجز' },
  { key: 'patientName', label: 'اسم المريض' },
  { key: 'doctorName', label: 'اسم الطبيب' },
  { key: 'specialty', label: 'التخصص' },
  { key: 'visitType', label: 'نوع الكشف' },
  { key: 'price', label: 'سعر الكشف' },
  { key: 'paymentMethod', label: 'طريقة الدفع' },
  { key: 'appointmentStatus', label: 'حالة الموعد', type: 'status' },
  { key: 'date', label: 'التاريخ' },
  { key: 'time', label: 'الوقت' }
]

const nursingColumns = [
  { key: 'requestNumber', label: 'رقم الطلب' },
  { key: 'patientName', label: 'اسم المريض' },
  { key: 'phone', label: 'رقم الهاتف' },
  { key: 'address', label: 'العنوان' },
  { key: 'nurseName', label: 'اسم الممرض' },
  { key: 'serviceType', label: 'نوع الخدمة' },
  { key: 'price', label: 'سعر الخدمة' },
  { key: 'paymentMethod', label: 'طريقة الدفع' },
  { key: 'requestStatus', label: 'حالة الطلب', type: 'status' },
  { key: 'date', label: 'تاريخ الطلب' }
]

const pharmacyColumns = [
  { key: 'orderNumber', label: 'رقم الطلب' },
  { key: 'patientName', label: 'اسم المريض' },
  { key: 'doctorName', label: 'اسم الطبيب' },
  { key: 'prescriptionNumber', label: 'رقم الوصفة' },
  { key: 'medicationCount', label: 'عدد الأدوية' },
  { key: 'totalPrice', label: 'إجمالي السعر' },
  { key: 'paymentMethod', label: 'طريقة الدفع' },
  { key: 'orderStatus', label: 'حالة الطلب', type: 'status' },
  { key: 'date', label: 'تاريخ الطلب' }
]

const reports = reactive([
  {
    id: 'appointments',
    title: 'تقرير حجوزات الكشوفات',
    statusKey: 'appointmentStatus',
    revenueKey: 'priceValue',
    columns: appointmentColumns,
    statusOptions: ['مؤكدة', 'انتظار', 'مكتملة', 'ملغية'],
    filters: createFilters(),
    page: 1,
    loading: false,
    rows: [
      {
        id: 'appt-1',
        bookingNumber: 'A-1024',
        patientName: 'أحمد علي',
        doctorName: 'د. سارة خالد',
        specialty: 'القلب',
        visitType: 'في العيادة',
        price: '₪100',
        priceValue: 100,
        paymentMethod: 'بطاقة',
        appointmentStatus: 'مؤكدة',
        date: '22 أبريل 2026',
        sortDate: '2026-04-22',
        time: '09:30 ص'
      },
      {
        id: 'appt-2',
        bookingNumber: 'A-1025',
        patientName: 'ليان محمود',
        doctorName: 'د. عمر حسن',
        specialty: 'الأطفال',
        visitType: 'أونلاين',
        price: '₪80',
        priceValue: 80,
        paymentMethod: 'محفظة',
        appointmentStatus: 'مكتملة',
        date: '23 أبريل 2026',
        sortDate: '2026-04-23',
        time: '11:00 ص'
      },
      {
        id: 'appt-3',
        bookingNumber: 'A-1026',
        patientName: 'محمد ناصر',
        doctorName: 'د. ريم يوسف',
        specialty: 'الجلدية',
        visitType: 'في العيادة',
        price: '₪120',
        priceValue: 120,
        paymentMethod: 'نقدي',
        appointmentStatus: 'انتظار',
        date: '24 أبريل 2026',
        sortDate: '2026-04-24',
        time: '12:30 م'
      }
    ]
  },
  {
    id: 'nursing',
    title: 'تقرير طلبات التمريض المنزلي',
    statusKey: 'requestStatus',
    revenueKey: 'priceValue',
    columns: nursingColumns,
    statusOptions: ['قيد الانتظار', 'مقبول', 'قيد التنفيذ', 'مكتمل'],
    filters: createFilters(),
    page: 1,
    loading: false,
    rows: [
      {
        id: 'nurse-1',
        requestNumber: 'N-2101',
        patientName: 'نور إبراهيم',
        phone: '056-332-9081',
        address: 'رام الله - الماصيون',
        nurseName: 'أمل يوسف',
        serviceType: 'تغيير ضماد',
        price: '₪150',
        priceValue: 150,
        paymentMethod: 'بطاقة',
        requestStatus: 'مكتمل',
        date: '20 أبريل 2026',
        sortDate: '2026-04-20'
      },
      {
        id: 'nurse-2',
        requestNumber: 'N-2102',
        patientName: 'سلمى خليل',
        phone: '059-654-2210',
        address: 'البيرة - البالوع',
        nurseName: 'مريم ناصر',
        serviceType: 'حقنة منزلية',
        price: '₪90',
        priceValue: 90,
        paymentMethod: 'نقدي',
        requestStatus: 'قيد التنفيذ',
        date: '23 أبريل 2026',
        sortDate: '2026-04-23'
      },
      {
        id: 'nurse-3',
        requestNumber: 'N-2103',
        patientName: 'خالد سمير',
        phone: '056-111-7832',
        address: 'نابلس - رفيديا',
        nurseName: 'سامي محمود',
        serviceType: 'متابعة ضغط وسكر',
        price: '₪110',
        priceValue: 110,
        paymentMethod: 'محفظة',
        requestStatus: 'مقبول',
        date: '25 أبريل 2026',
        sortDate: '2026-04-25'
      }
    ]
  },
  {
    id: 'pharmacy',
    title: 'تقرير طلبات شراء الأدوية',
    statusKey: 'orderStatus',
    revenueKey: 'totalValue',
    columns: pharmacyColumns,
    statusOptions: ['قيد الانتظار', 'قيد التحضير', 'في التوصيل', 'تم التسليم'],
    filters: createFilters(),
    page: 1,
    loading: false,
    rows: [
      {
        id: 'pharm-1',
        orderNumber: 'P-3301',
        patientName: 'أحمد علي',
        doctorName: 'د. سارة خالد',
        prescriptionNumber: 'RX-7712',
        medicationCount: 3,
        totalPrice: '₪240',
        totalValue: 240,
        paymentMethod: 'بطاقة',
        orderStatus: 'تم التسليم',
        date: '18 أبريل 2026',
        sortDate: '2026-04-18'
      },
      {
        id: 'pharm-2',
        orderNumber: 'P-3302',
        patientName: 'ليان محمود',
        doctorName: 'د. عمر حسن',
        prescriptionNumber: 'RX-7718',
        medicationCount: 2,
        totalPrice: '₪135',
        totalValue: 135,
        paymentMethod: 'محفظة',
        orderStatus: 'في التوصيل',
        date: '22 أبريل 2026',
        sortDate: '2026-04-22'
      },
      {
        id: 'pharm-3',
        orderNumber: 'P-3303',
        patientName: 'محمد ناصر',
        doctorName: 'د. ريم يوسف',
        prescriptionNumber: 'RX-7721',
        medicationCount: 5,
        totalPrice: '₪310',
        totalValue: 310,
        paymentMethod: 'نقدي',
        orderStatus: 'قيد التحضير',
        date: '24 أبريل 2026',
        sortDate: '2026-04-24'
      }
    ]
  }
])

const getFilteredRows = (report) => {
  return report.rows.filter((row) => {
    const matchesFromDate = !report.filters.fromDate || row.sortDate >= report.filters.fromDate
    const matchesToDate = !report.filters.toDate || row.sortDate <= report.filters.toDate
    const matchesStatus = report.filters.status === 'all' || row[report.statusKey] === report.filters.status

    return matchesFromDate && matchesToDate && matchesStatus
  })
}

const handleReportFilterChange = (report) => {
  report.page = 1
  report.loading = true
  window.setTimeout(() => {
    report.loading = false
  }, 250)
}

const getTotalPages = (report) => {
  return Math.max(1, Math.ceil(getFilteredRows(report).length / pageSize))
}

const getPaginatedRows = (report) => {
  const start = (report.page - 1) * pageSize
  return getFilteredRows(report).slice(start, start + pageSize)
}

const formatCurrency = (value) => {
  return `₪${value.toLocaleString('en-US')}`
}

const getSummary = (report) => {
  const rows = getFilteredRows(report)
  const revenue = rows.reduce((sum, row) => sum + (row[report.revenueKey] || 0), 0)

  return [
    { label: 'إجمالي العمليات', value: rows.length },
    { label: 'إجمالي الإيرادات', value: formatCurrency(revenue) },
    { label: 'المدفوع', value: rows.length }
  ]
}

const openDetailsModal = (report, row) => {
  selectedRecord.value = {
    title: report.title,
    details: report.columns.map((column) => ({
      label: column.label,
      value: row[column.key]
    }))
  }
}

const printReport = (reportId) => {
  const reportElement = document.getElementById(`report-${reportId}`)

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
        <title>طباعة التقرير</title>
        <style>
          @page {
            size: A4 landscape;
            margin: 8mm;
          }

          * {
            box-sizing: border-box;
          }

          html,
          body {
            font-family: Tajawal, Arial, sans-serif;
            direction: rtl;
            margin: 0;
            padding: 0;
            color: #101010;
            background: #ffffff;
            width: 100%;
          }

          .report-section,
          .reports-card,
          .summary-card {
            background: #eaf2fd;
            border: 1px solid #0b63f6;
            border-radius: 10px;
          }

          .report-section {
            margin: 0;
            padding: 8px;
            page-break-inside: avoid;
            width: 100%;
          }

          .report-header {
            align-items: center;
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
          }

          .report-header h2 {
            font-size: 15px;
            margin: 0;
          }

          .summary-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 6px;
            margin-bottom: 8px;
          }

          .summary-card {
            min-height: auto;
            padding: 6px 8px;
          }

          .summary-card strong,
          .summary-card span {
            display: block;
          }

          .summary-card strong {
            font-size: 12px;
            margin-bottom: 3px;
          }

          .summary-card span {
            font-size: 9px;
          }

          .reports-card {
            padding: 8px;
          }

          .table-wrap {
            overflow: visible !important;
            width: 100%;
          }

          table {
            border-collapse: collapse;
            table-layout: fixed;
            width: 100%;
            min-width: 0 !important;
          }

          th,
          td {
            border-bottom: 1px solid #8dbbfb;
            font-size: 7.6px;
            line-height: 1.35;
            padding: 4px 3px;
            text-align: center;
            white-space: normal;
            word-break: break-word;
            overflow-wrap: anywhere;
            height: auto;
          }

          th {
            font-weight: 800;
          }

          tr {
            page-break-inside: avoid;
          }

          .status-pill {
            background: transparent;
            border-radius: 0;
            color: #101010;
            display: inline;
            min-width: 0;
            padding: 0;
          }

          .no-print,
          .report-filters,
          .record-overlay,
          .logout-overlay,
          button {
            display: none !important;
          }

          @media print {
            html,
            body {
              height: auto;
              overflow: visible;
              print-color-adjust: exact;
              -webkit-print-color-adjust: exact;
            }

            .report-section {
              break-inside: avoid;
            }
          }
        </style>
      </head>
      <body>${reportElement.outerHTML}</body>
    </html>
  `)
  printWindow.document.close()
  printWindow.focus()
  printWindow.print()
  printWindow.close()
}

const exportReportCsv = (report) => {
  const headers = report.columns.map((column) => column.label)
  const rows = getFilteredRows(report).map((row) => {
    return report.columns.map((column) => `"${String(row[column.key] ?? '').replaceAll('"', '""')}"`)
  })
  const csv = [headers.map((header) => `"${header}"`), ...rows]
    .map((row) => row.join(','))
    .join('\n')
  const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')

  link.href = url
  link.download = `${report.id}-report.csv`
  link.click()
  URL.revokeObjectURL(url)
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
  margin-bottom: 44px;
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

.report-section {
  margin-bottom: 48px;
}

.report-header {
  align-items: center;
  display: flex;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 22px;
  width: 100%;
}

.report-header h2 {
  margin: 0;
  font-size: 24px;
  font-weight: 900;
}

.report-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.print-button,
.view-button,
.modal-actions button {
  background-color: #115bd2;
  border: 1px solid #115bd2;
  border-radius: 18px;
  color: #ffffff;
  cursor: pointer;
  font-family: inherit;
  font-weight: 800;
  padding: 9px 18px;
}

.print-button:hover,
.view-button:hover,
.modal-actions button:hover {
  background-color: #0b4db8;
}

.report-filters {
  display: grid;
  grid-template-columns: repeat(3, minmax(170px, 1fr));
  gap: 16px;
  margin-bottom: 22px;
}

.report-filters label {
  display: grid;
  gap: 8px;
}

.report-filters span {
  font-weight: 800;
}

.report-filters input,
.report-filters select {
  background-color: #ffffff;
  border: 1.5px solid #0b63f6;
  border-radius: 12px;
  color: #101010;
  font-family: inherit;
  height: 42px;
  padding: 0 12px;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(170px, 1fr));
  gap: 16px;
  margin-bottom: 26px;
}

.summary-card,
.reports-card {
  background-color: #eaf2fd;
  border: 1.5px solid #0b63f6;
  border-radius: 24px;
}

.summary-card {
  min-height: 112px;
  padding: 24px 28px;
}

.summary-card strong {
  display: block;
  font-size: 24px;
  font-weight: 900;
  margin-bottom: 12px;
}

.summary-card span {
  font-size: 17px;
}

.reports-card {
  min-height: 300px;
  padding: 34px 56px 38px;
  margin-top: 0;
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
  min-width: 1320px;
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

.status-pill.neutral {
  color: #4f86de;
}

.record-overlay,
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

.record-modal,
.logout-modal {
  background-color: #eaf2fd;
  border: 1.5px solid #0b63f6;
  border-radius: 24px;
  box-shadow: 0 18px 45px rgba(0, 0, 0, 0.12);
  max-width: 100%;
  width: 680px;
}

.record-modal {
  max-height: min(760px, 88vh);
  overflow-y: auto;
  padding: 34px 44px 36px;
}

.record-modal h2 {
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
  align-items: center;
  border-bottom: 1px solid #8dbbfb;
  display: grid;
  grid-template-columns: 180px minmax(0, 1fr);
  gap: 16px;
  padding: 10px 0;
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

  .report-filters,
  .summary-grid {
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

  .report-header {
    align-items: center;
    flex-direction: row;
    flex-wrap: wrap;
  }

  .report-actions {
    width: 100%;
  }

  .report-filters,
  .summary-grid {
    grid-template-columns: 1fr;
  }

  .reports-card {
    border-radius: 20px;
    padding: 28px 22px;
  }
}

@media (max-width: 560px) {
  .dashboard-content {
    padding: 28px 14px 36px;
  }

  .sidebar-nav {
    grid-template-columns: 1fr;
  }

  .print-button {
    padding-inline: 14px;
  }

  .record-modal {
    padding: 28px 22px;
  }

  .details-row {
    grid-template-columns: 1fr;
    gap: 6px;
  }
}
</style>

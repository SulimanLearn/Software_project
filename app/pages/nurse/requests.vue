<template>
  <div class="requests-page" dir="rtl">
    <NavBar />

    <div class="dashboard-shell">
      <NurseSidebar :nurse="nurse" @logout="logout" />

      <main class="dashboard-content">
        <header class="page-header">
          <h1>طلبات التمريض المنزلي</h1>
          <p>إدارة وتتبع الخدمات المنزلية</p>
        </header>

        <section class="requests-card" aria-labelledby="requests-list-title">
          <div class="list-header">
            <h2 id="requests-list-title">قائمة الطلبات</h2>
            <span>{{ filteredRequests.length }} طلب</span>
          </div>

          <form class="filters" @submit.prevent>
            <label class="search-box">
              <Search :size="20" aria-hidden="true" />
              <input v-model.trim="searchTerm" type="search" placeholder="ابحث باسم المريض أو رقم الطلب" />
            </label>
            <label class="filter-box">
              <Filter :size="19" aria-hidden="true" />
              <select v-model="selectedStatus" aria-label="تصفية حسب الحالة">
                <option value="">كل الحالات</option>
                <option v-for="status in nurseStatuses" :key="status.value" :value="status.value">
                  {{ status.label }}
                </option>
              </select>
            </label>
            <button class="print-report-button" type="button" dir="rtl" @click="printNurseRequestsReport">
              <span>طباعة التقرير</span>
            </button>
          </form>

          <NurseRequestsTable
            :requests="filteredRequests"
            @view="openDetails"
            @update-status="handleStatusUpdate"
          />
        </section>
      </main>
    </div>

    <section v-if="printReport" class="nurse-print-report" dir="rtl" aria-hidden="true">
      <main class="print-report">
        <header class="print-report-header">
          <div>
            <h1>Home Nursing Requests Report</h1>
            <p>تقرير طلبات التمريض المنزلي</p>
          </div>
        </header>

        <section class="print-meta-grid" aria-label="بيانات التقرير">
          <div class="print-meta-card">
            <span>تاريخ ووقت التقرير</span>
            <strong>{{ printReport.printedAt }}</strong>
          </div>
          <div class="print-meta-card">
            <span>اسم الممرضة</span>
            <strong>{{ printReport.nurseName }}</strong>
          </div>
          <div class="print-meta-card">
            <span>إجمالي عدد الطلبات</span>
            <strong>{{ printReport.total }}</strong>
          </div>
        </section>

        <table class="print-requests-table">
          <thead>
            <tr>
              <th>Request ID</th>
              <th>Patient Name</th>
              <th>Service Type</th>
              <th>Address</th>
              <th>Date &amp; Time</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="request in printReport.rows" :key="request.id">
              <td class="print-request-id">{{ request.id }}</td>
              <td>{{ request.patientName }}</td>
              <td>{{ request.serviceType }}</td>
              <td>{{ request.address }}</td>
              <td>{{ request.dateTime }}</td>
              <td>{{ request.status }}</td>
            </tr>
            <tr v-if="!printReport.rows.length">
              <td colspan="6" class="print-empty-cell">لا توجد طلبات مطابقة للبحث.</td>
            </tr>
          </tbody>
        </table>
      </main>
    </section>

    <RequestDetailsModal
      v-if="selectedRequest"
      :request="selectedRequest"
      :status-label="statusLabel"
      @close="closeDetails"
      @update-status="handleStatusUpdate"
    />
    <transition name="status-toast">
      <p v-if="toastMessage" class="toast" role="status">
        <CheckCircle :size="20" :stroke-width="2.5" aria-hidden="true" />
        {{ toastMessage }}
      </p>
    </transition>
  </div>
</template>

<script setup>
import { CheckCircle, Filter, Search } from '@lucide/vue'
import NurseRequestsTable from '~/components/nurse/NurseRequestsTable.vue'
import NurseSidebar from '~/components/nurse/NurseSidebar.vue'
import RequestDetailsModal from '~/components/nurse/RequestDetailsModal.vue'
import { nurseStatuses } from '~/composables/useNurseRequests'

const nurse = { name: 'الممرضة ريم أبو شمالة', role: 'تمريض منزلي' }
const route = useRoute()
const router = useRouter()
const searchTerm = ref('')
const selectedStatus = ref('')
const selectedRequestId = ref(null)
const toastMessage = ref('')
const printReport = ref(null)
const { requests, statusLabel, updateStatus } = useNurseRequests()

const filteredRequests = computed(() => {
  const term = searchTerm.value.toLocaleLowerCase()

  return requests.value.filter(request => {
    const matchesTerm = !term || [request.id, request.patientName, request.serviceType]
      .some(value => value.toLocaleLowerCase().includes(term))
    const matchesStatus = !selectedStatus.value || request.status === selectedStatus.value

    return matchesTerm && matchesStatus
  })
})

const selectedRequest = computed(() =>
  requests.value.find(request => request.id === selectedRequestId.value) || null
)

const clearPrintReport = () => {
  printReport.value = null
}

const printNurseRequestsReport = async () => {
  if (!import.meta.client) {
    return
  }

  const printedAt = new Intl.DateTimeFormat('ar', {
    dateStyle: 'full',
    timeStyle: 'short'
  }).format(new Date())
  const reportRows = filteredRequests.value

  printReport.value = {
    printedAt,
    nurseName: nurse.name,
    total: reportRows.length,
    rows: reportRows.map(request => ({
      id: request.id,
      patientName: request.patientName,
      serviceType: request.serviceType,
      address: request.address,
      dateTime: `${request.date}، ${request.time}`,
      status: statusLabel(request.status)
    }))
  }

  await nextTick()
  window.addEventListener('afterprint', clearPrintReport, { once: true })
  window.print()
}

onBeforeUnmount(clearPrintReport)

watch(() => route.query.details, (details) => {
  const id = typeof details === 'string' ? details : null
  selectedRequestId.value = requests.value.some(request => request.id === id) ? id : null
}, { immediate: true })

const openDetails = request => {
  selectedRequestId.value = request.id
  router.replace({ query: { ...route.query, details: request.id } })
}

const closeDetails = () => {
  selectedRequestId.value = null
  const { details, ...query } = route.query
  router.replace({ query })
}

const handleStatusUpdate = (id, status) => {
  updateStatus(id, status)
  toastMessage.value = 'تم تحديث حالة الطلب بنجاح'
  window.setTimeout(() => {
    toastMessage.value = ''
  }, 2200)
}

const logout = async () => {
  await navigateTo('/login')
}
</script>

<style scoped>
.requests-page {
  background: #fff;
  color: #101010;
  min-height: 100vh;
  overflow-x: hidden;
}

.nurse-print-report {
  display: none;
}

.dashboard-shell {
  display: grid;
  grid-template-columns: 290px minmax(0, 1fr);
  min-height: calc(100vh - 85px);
}

.dashboard-content {
  padding: 36px 40px 46px;
}

.page-header {
  margin-bottom: 27px;
}

.page-header p {
  color: #536174;
  font-size: 17px;
  font-weight: 700;
  margin: 0 0 7px;
}

.page-header h1 {
  font-size: 30px;
  font-weight: 900;
  margin: 0;
}

.requests-card {
  background: #eaf2fd;
  border: 1.5px solid #0b63f6;
  border-radius: 24px;
  padding: 26px;
}

.list-header {
  align-items: center;
  display: flex;
  justify-content: space-between;
  gap: 14px;
  margin-bottom: 21px;
}

.list-header h2 {
  font-size: 22px;
  margin: 0;
}

.list-header span {
  color: #536174;
  font-weight: 800;
}

.print-report-button {
  align-items: center;
  background: linear-gradient(135deg, #0b63f6 0%, #1688ff 100%);
  border: 1px solid rgba(11, 99, 246, .84);
  border-radius: 14px;
  box-shadow: 0 14px 28px rgba(17, 91, 210, .18);
  color: #fff;
  cursor: pointer;
  display: inline-flex;
  flex: 0 0 auto;
  font-family: inherit;
  font-size: 15px;
  font-weight: 900;
  min-height: 46px;
  justify-content: center;
  line-height: 1;
  min-width: 142px;
  padding: 0 22px;
  text-align: center;
  transition: background .24s ease, box-shadow .24s ease, transform .24s ease;
  white-space: nowrap;
}

.print-report-button:hover {
  background: linear-gradient(135deg, #0958df 0%, #0b74ec 100%);
  box-shadow: 0 18px 30px rgba(17, 91, 210, .2);
  transform: translateY(-2px);
}

.print-report-button:active {
  box-shadow: 0 10px 20px rgba(17, 91, 210, .16);
  transform: translateY(0);
}

.print-report-button:focus-visible {
  outline: 3px solid rgba(17, 91, 210, .2);
  outline-offset: 3px;
}

.filters {
  align-items: center;
  display: flex;
  gap: 13px;
  margin-bottom: 18px;
}

.search-box,
.filter-box {
  align-items: center;
  background: #fff;
  border: 1px solid #d0e2fa;
  border-radius: 13px;
  color: #536174;
  display: flex;
  gap: 8px;
  height: 48px;
  padding: 0 14px;
}

.search-box {
  flex: 1;
  max-width: 390px;
}

.search-box input,
.filter-box select {
  background: transparent;
  border: 0;
  color: #101010;
  font-family: inherit;
  font-size: 14px;
  font-weight: 700;
  height: 100%;
  outline: 0;
}

.search-box input {
  flex: 1;
}

.filter-box select {
  min-width: 135px;
}

.toast {
  align-items: center;
  background: #115bd2;
  border: 1px solid #0b63f6;
  border-radius: 14px;
  box-shadow: 0 12px 25px rgba(17, 91, 210, .24);
  color: #fff;
  display: inline-flex;
  font-weight: 800;
  gap: 10px;
  margin: 0;
  max-width: calc(100vw - 32px);
  padding: 13px 18px;
  position: fixed;
  right: 24px;
  bottom: 24px;
  z-index: 2400;
}

.status-toast-enter-active,
.status-toast-leave-active {
  transition: opacity .25s ease, transform .25s ease;
}

.status-toast-enter-from,
.status-toast-leave-to {
  opacity: 0;
  transform: translateX(28px);
}

.status-toast-enter-to,
.status-toast-leave-from {
  opacity: 1;
  transform: translateX(0);
}

@media print {
  @page {
    size: A4 landscape;
    margin: 10mm;
  }

  :global(html),
  :global(body) {
    background: #ffffff;
    margin: 0;
    print-color-adjust: exact;
    -webkit-print-color-adjust: exact;
  }

  :global(body *) {
    visibility: hidden !important;
  }

  :global(nav),
  :global(footer),
  :global(.footer),
  :global(.navbar),
  :global(.whatsapp-button),
  :global(.floating-button),
  :global(.floating-buttons),
  :global([class*="social"]),
  :global([class*="Social"]) {
    display: none !important;
  }

  .requests-page > :not(.nurse-print-report) {
    display: none !important;
  }

  .nurse-print-report {
    background: #ffffff;
    color: #10203f;
    direction: rtl;
    display: block !important;
    font-family: Tajawal, Arial, sans-serif;
    inset: 0;
    margin: 0 auto;
    max-width: 100%;
    position: absolute;
    visibility: visible !important;
    width: 100%;
  }

  .nurse-print-report * {
    visibility: visible !important;
  }

  .print-report {
    margin: 0 auto;
    width: 100%;
  }

  .print-report-header {
    align-items: flex-start;
    border-bottom: 2px solid #0b63f6;
    display: flex;
    gap: 18px;
    justify-content: space-between;
    margin-bottom: 18px;
    padding-bottom: 14px;
  }

  .print-report-header h1 {
    color: #0b3f91;
    font-size: 25px;
    font-weight: 900;
    margin: 0 0 8px;
  }

  .print-report-header p {
    color: #52627d;
    font-size: 13px;
    font-weight: 800;
    margin: 0;
  }

  .print-meta-grid {
    display: grid;
    gap: 10px;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    margin-bottom: 18px;
  }

  .print-meta-card {
    background: #eaf2fd;
    border: 1px solid #8dbbfb;
    border-radius: 10px;
    padding: 11px 13px;
  }

  .print-meta-card span {
    color: #52627d;
    display: block;
    font-size: 12px;
    font-weight: 800;
    margin-bottom: 5px;
  }

  .print-meta-card strong {
    color: #10203f;
    display: block;
    font-size: 15px;
    font-weight: 900;
    overflow-wrap: anywhere;
  }

  .print-requests-table {
    border-collapse: collapse;
    table-layout: fixed;
    width: 100%;
  }

  .print-requests-table th,
  .print-requests-table td {
    border: 1px solid #8dbbfb;
    font-size: 12px;
    line-height: 1.55;
    padding: 9px 8px;
    text-align: right;
    vertical-align: top;
    white-space: normal;
    word-break: break-word;
  }

  .print-requests-table th {
    background: #dcecff;
    color: #0b3f91;
    font-weight: 900;
  }

  .print-requests-table td {
    color: #10203f;
    font-weight: 700;
  }

  .print-requests-table tr {
    page-break-inside: avoid;
  }

  .print-request-id {
    color: #115bd2;
    direction: ltr;
    text-align: right;
    white-space: nowrap;
  }

  .print-empty-cell {
    color: #52627d;
    font-weight: 900;
    padding: 26px;
    text-align: center;
  }
}

@media (max-width: 1030px) {
  .dashboard-shell {
    grid-template-columns: 240px minmax(0, 1fr);
  }

  .dashboard-content {
    padding: 30px 24px 42px;
  }

  .page-header h1 {
    font-size: 28px;
  }

  .requests-card {
    border-radius: 20px;
    padding: 22px;
  }

  .list-header h2 {
    font-size: 20px;
  }

  .filters {
    flex-wrap: wrap;
  }

  .print-report-button {
    min-height: 44px;
    min-width: 132px;
    padding-inline: 19px;
  }
}

@media (max-width: 720px) {
  .dashboard-shell {
    display: flex;
    flex-direction: column;
  }

  .dashboard-content {
    padding: 28px 16px 38px;
  }

  .page-header h1 {
    font-size: 26px;
  }

  .requests-card {
    border-radius: 20px;
    padding: 19px 15px;
  }

  .list-header {
    align-items: center;
    flex-direction: row;
    gap: 8px;
  }

  .filters {
    flex-direction: column;
  }

  .search-box,
  .filter-box,
  .print-report-button {
    max-width: none;
    width: 100%;
  }

  .print-report-button {
    min-height: 46px;
  }

  .filter-box select {
    flex: 1;
  }

  .toast {
    bottom: 16px;
    font-size: 14px;
    right: 16px;
  }
}
</style>

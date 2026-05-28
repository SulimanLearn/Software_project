<template>
  <div class="nurse-page" dir="rtl">
    <NavBar />

    <div class="dashboard-shell">
      <NurseSidebar :nurse="nurse" @logout="showLogoutModal = true" />

      <main class="dashboard-content">
        <header class="page-header">
          <h1>لوحة تحكم-الممرض</h1>
          <p>{{ currentDate }}</p>
        </header>

        <section class="stats-grid" aria-label="ملخص حالات الطلبات">
          <article v-for="stat in statsCards" :key="stat.status" class="stat-card">
            <div>
              <strong>{{ stat.total }}</strong>
              <span>{{ stat.label }}</span>
            </div>
            <component :is="stat.icon" :size="26" class="stat-icon" aria-hidden="true" />
          </article>
        </section>

        <section class="card recent-requests" aria-labelledby="recent-title">
          <div class="section-header">
            <h2 id="recent-title">أحدث طلبات التمريض المنزلي</h2>
            <NuxtLink to="/nurse/requests">عرض جميع الطلبات</NuxtLink>
          </div>
          <NurseRequestsTable
            :requests="recentRequests"
            compact
            @view="selectedRequest = $event"
            @update-status="handleStatusUpdate"
          />
        </section>

        <section class="card activity-summary" aria-labelledby="activity-title">
          <div class="section-header">
            <h2 id="activity-title">ملخص النشاط والحالات</h2>
          </div>
          <div class="summary-grid">
            <article v-for="item in activityItems" :key="item.title">
              <component :is="item.icon" :size="22" aria-hidden="true" />
              <div>
                <strong>{{ item.title }}</strong>
                <p>{{ item.description }}</p>
              </div>
            </article>
          </div>
        </section>
      </main>
    </div>

    <RequestDetailsModal
      v-if="selectedRequest"
      :request="selectedRequest"
      :status-label="statusLabel"
      @close="selectedRequest = null"
      @update-status="handleStatusUpdate"
    />

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
        <p>هل أنت متأكد أنك تريد تسجيل الخروج؟</p>

        <div class="modal-actions">
          <button class="save-button" type="button" @click="confirmLogout">نعم</button>
          <button class="cancel-button" type="button" @click="showLogoutModal = false">لا</button>
        </div>
      </div>
    </div>

    <transition name="status-toast">
      <p v-if="toastMessage" class="toast" role="status">
        <CheckCircle :size="20" :stroke-width="2.5" aria-hidden="true" />
        {{ toastMessage }}
      </p>
    </transition>
  </div>
</template>

<script setup>
import { Activity, CheckCircle, ClipboardList, Clock } from '@lucide/vue'
import { markRaw } from 'vue'
import NurseRequestsTable from '~/components/nurse/NurseRequestsTable.vue'
import NurseSidebar from '~/components/nurse/NurseSidebar.vue'
import RequestDetailsModal from '~/components/nurse/RequestDetailsModal.vue'

const nurse = { name: 'الممرضة ريم أبو شمالة', role: 'تمريض منزلي' }
const currentDate = ref('')
const selectedRequest = ref(null)
const toastMessage = ref('')
const showLogoutModal = ref(false)
const { requests, stats, statusLabel, updateStatus } = useNurseRequests()

const iconByStatus = {
  new: markRaw(ClipboardList),
  'on-the-way': markRaw(Clock),
  'in-progress': markRaw(Activity),
  completed: markRaw(CheckCircle)
}

const statsCards = computed(() => stats.value.map(stat => ({
  status: stat.status,
  label: stat.status === 'new' ? 'الطلبات الجديدة' : stat.label,
  total: stat.count,
  icon: iconByStatus[stat.status]
})))

const getStatusCount = status => stats.value.find(stat => stat.status === status)?.count || 0
const recentRequests = computed(() => requests.value.slice(0, 4))
const activityItems = computed(() => [
  {
    title: `${getStatusCount('on-the-way')} زيارات في الطريق`,
    description: 'تم تأكيد الانطلاق إلى منازل المرضى في غزة.',
    icon: markRaw(Clock)
  },
  {
    title: `${getStatusCount('in-progress')} زيارات قيد الإجراء`,
    description: 'تجري متابعة الخدمة وتسجيل التقدم.',
    icon: markRaw(Activity)
  },
  {
    title: `${getStatusCount('completed')} زيارات مكتملة`,
    description: 'أُنجزت خدمات الرعاية المنزلية بنجاح.',
    icon: markRaw(CheckCircle)
  }
])

const showToast = message => {
  toastMessage.value = message
  window.setTimeout(() => {
    toastMessage.value = ''
  }, 2200)
}

const handleStatusUpdate = (id, status) => {
  updateStatus(id, status)
  showToast('تم تحديث حالة الطلب بنجاح')
}

const confirmLogout = async () => {
  showLogoutModal.value = false
  await navigateTo('/login')
}

onMounted(() => {
  currentDate.value = new Intl.DateTimeFormat('ar-u-nu-latn', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(new Date())
})
</script>

<style scoped>
.nurse-page {
  background: #fff;
  color: #101010;
  min-height: 100vh;
  overflow-x: hidden;
}

.dashboard-shell {
  display: grid;
  grid-template-columns: 290px minmax(0, 1fr);
  min-height: calc(100vh - 85px);
}

.dashboard-content {
  padding: 34px 40px 44px;
}

.page-header {
  margin-bottom: 24px;
}

.page-header p {
  color: #343434;
  font-size: 17px;
  margin: 0 0 6px;
}

.page-header h1 {
  font-size: 30px;
  font-weight: 900;
  margin: 0;
}

.stat-card,
.card {
  background: #eaf2fd;
  border: 1.5px solid #0b63f6;
  border-radius: 24px;
  transition: box-shadow .2s ease;
}

.stat-card:hover,
.card:hover {
  box-shadow: 0 12px 26px rgba(17, 91, 210, .12);
}

.stats-grid {
  display: grid;
  gap: 18px;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  margin-bottom: 22px;
}

.stat-card {
  align-items: center;
  display: flex;
  justify-content: space-between;
  min-height: 118px;
  padding: 21px;
}

.stat-card strong,
.stat-card span {
  display: block;
}

.stat-card strong {
  font-size: 28px;
  margin-bottom: 7px;
}

.stat-card span {
  font-size: 16px;
  font-weight: 800;
}

.stat-icon {
  background: #fff;
  border: 1px solid #8dbbfb;
  border-radius: 16px;
  color: #115bd2;
  height: 54px;
  padding: 13px;
  width: 54px;
}

.card {
  margin-bottom: 22px;
  padding: 25px;
}

.section-header {
  align-items: center;
  display: flex;
  gap: 18px;
  justify-content: space-between;
  margin-bottom: 13px;
}

.section-header h2 {
  font-size: 21px;
  margin: 0;
}

.section-header a {
  color: #115bd2;
  font-size: 14px;
  font-weight: 900;
  text-decoration: none;
}

.summary-grid {
  display: grid;
  gap: 13px;
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.summary-grid article {
  align-items: center;
  background: #fff;
  border: 1px solid #d0e2fa;
  border-radius: 16px;
  color: #115bd2;
  display: flex;
  gap: 13px;
  padding: 15px;
}

.summary-grid strong {
  color: #101010;
  display: block;
  font-size: 15px;
}

.summary-grid p {
  color: #536174;
  font-size: 13px;
  font-weight: 700;
  line-height: 1.5;
  margin: 4px 0 0;
}

.modal-overlay {
  align-items: center;
  backdrop-filter: blur(4px);
  background-color: rgba(68, 139, 239, .38);
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
  box-shadow: 0 18px 45px rgba(0, 0, 0, .12);
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

.save-button,
.cancel-button {
  align-items: center;
  border-radius: 18px;
  cursor: pointer;
  display: inline-flex;
  font-family: inherit;
  font-size: 16px;
  font-weight: 900;
  justify-content: center;
  min-height: 46px;
  min-width: 142px;
  padding: 10px 24px;
  transition: background-color .2s ease, box-shadow .2s ease, transform .2s ease;
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

.save-button:hover {
  background-color: #0b4db8;
  box-shadow: 0 8px 18px rgba(17, 91, 210, .22);
  transform: translateY(-1px);
}

.cancel-button:hover {
  background-color: #dcecff;
  transform: translateY(-1px);
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

@media (max-width: 1030px) {
  .dashboard-shell {
    grid-template-columns: 240px minmax(0, 1fr);
  }

  .dashboard-content {
    padding: 28px 24px 40px;
  }

  .page-header h1 {
    font-size: 28px;
  }

  .stats-grid {
    gap: 14px;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .stat-card {
    min-height: 104px;
    padding: 18px;
  }

  .stat-card strong {
    font-size: 25px;
  }

  .stat-card span {
    font-size: 15px;
  }

  .card {
    border-radius: 20px;
    padding: 22px;
  }

  .summary-grid {
    grid-template-columns: 1fr;
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

  .stats-grid {
    gap: 13px;
    grid-template-columns: 1fr;
  }

  .section-header {
    align-items: flex-start;
    flex-direction: column;
    gap: 8px;
  }

  .card {
    padding: 18px 15px;
  }

  .modal-overlay {
    padding: 16px;
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

  .toast {
    bottom: 16px;
    font-size: 14px;
    right: 16px;
  }
}
</style>

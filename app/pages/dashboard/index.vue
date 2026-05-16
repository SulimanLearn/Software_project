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
          <NuxtLink to="/dashboard" class="sidebar-link active">
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
        <header class="dashboard-header">
          <div>
            <h1>لوحة التحكم</h1>
            <p>{{ currentArabicDate }}</p>
          </div>
          <AdminNotifications />
        </header>

        <section class="stats-grid" aria-label="إحصائيات لوحة التحكم">
          <article
            v-for="stat in stats"
            :key="stat.label"
            class="stat-card"
          >
            <strong>{{ stat.value }}</strong>
            <span>{{ stat.label }}</span>
          </article>
        </section>

        <section class="charts-grid">
          <article class="panel status-panel">
            <h2>حالة المواعيد</h2>

            <div class="status-chart">
              <div class="status-legend">
                <div
                  v-for="item in appointmentStatus"
                  :key="item.label"
                  class="legend-item"
                >
                  <span
                    class="legend-dot"
                    :style="{ backgroundColor: item.color }"
                  />
                  <span>{{ item.percent }} % {{ item.label }}</span>
                </div>
              </div>

              <div class="donut-chart" aria-label="284 موعد">
                <div class="donut-center">
                  <strong>284</strong>
                  <span>موعد</span>
                </div>
              </div>
            </div>
          </article>

          <article class="panel weekly-panel">
            <h2>المواعيد الاسبوعية</h2>

            <div class="bar-chart" aria-label="المواعيد الاسبوعية">
              <div
                v-for="day in weeklyAppointments"
                :key="day.label"
                class="bar-item"
              >
                <span class="bar-count">{{ day.count }}</span>
                <span
                  class="bar"
                  :class="{ highlighted: day.highlighted }"
                  :style="{ height: day.height + '%' }"
                />
                <span class="bar-label">{{ day.label }}</span>
              </div>
            </div>
          </article>
        </section>

        <section class="panel appointments-panel">
          <h2>احدث المواعيد</h2>

          <div class="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>المريض</th>
                  <th>الطبيب</th>
                  <th>التخصص</th>
                  <th>التاريخ</th>
                  <th>الوقت</th>
                  <th>الحالة</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="appointment in latestAppointments"
                  :key="appointment.patient"
                >
                  <td>{{ appointment.patient }}</td>
                  <td>{{ appointment.doctor }}</td>
                  <td>{{ appointment.specialty }}</td>
                  <td>{{ appointment.date }}</td>
                  <td>{{ appointment.time }}</td>
                  <td>
                    <span class="status-pill">
                      {{ appointment.status }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
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
const isLoggedIn = useState('isLoggedIn', () => false)
const user = useState('user', () => ({ name: '' }))
const currentArabicDate = ref('')

const confirmLogout = async () => {
  isLoggedIn.value = false
  user.value = { name: '' }
  showLogoutModal.value = false
  await navigateTo('/login')
}

onMounted(() => {
  currentArabicDate.value = new Intl.DateTimeFormat('ar-u-nu-latn', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(new Date())
})

const stats = [
  { value: 284, label: 'إجمالي المواعيد' },
  { value: 126, label: 'المرضى الجدد' },
  { value: 48, label: 'الأطباء' },
  { value: 18, label: 'التقارير' }
]

const appointmentStatus = [
  { label: 'مؤكدة', percent: 36, color: '#115bd2' },
  { label: 'انتظار', percent: 25, color: '#5a9af4' },
  { label: 'مكتملة', percent: 19, color: '#d9e9ff' },
  { label: 'ملغية', percent: 20, color: '#969696' }
]

const weeklyAppointments = [
  { label: 'س', count: 32, height: 52 },
  { label: 'ج', count: 28, height: 45 },
  { label: 'خ', count: 36, height: 58 },
  { label: 'ار', count: 55, height: 90, highlighted: true },
  { label: 'ث', count: 30, height: 49 },
  { label: 'اث', count: 44, height: 72 },
  { label: 'اح', count: 33, height: 53 }
]

const latestAppointments = [
  {
    patient: 'أحمد علي',
    doctor: 'د. سارة خالد',
    specialty: 'القلب',
    date: '22 أبريل 2026',
    time: '09:30 ص',
    status: 'مؤكد'
  },
  {
    patient: 'ليان محمود',
    doctor: 'د. عمر حسن',
    specialty: 'الأطفال',
    date: '22 أبريل 2026',
    time: '10:15 ص',
    status: 'انتظار'
  },
  {
    patient: 'محمد ناصر',
    doctor: 'د. ريم يوسف',
    specialty: 'الجلدية',
    date: '23 أبريل 2026',
    time: '12:00 م',
    status: 'مكتمل'
  }
]
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

.dashboard-header {
  align-items: flex-start;
  display: flex;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 44px;
}

.dashboard-header > div {
  min-width: 0;
}

.dashboard-header h1 {
  margin: 0;
  font-size: 30px;
  font-weight: 900;
}

.dashboard-header p {
  margin: 4px 0 0;
  font-size: 20px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(180px, 1fr));
  gap: 16px;
  margin-bottom: 16px;
}

.stat-card,
.panel {
  background-color: #eaf2fd;
  border: 1.5px solid #0b63f6;
  border-radius: 24px;
}

.stat-card {
  min-height: 180px;
  padding: 54px 34px 28px;
  text-align: right;
}

.stat-card strong {
  display: block;
  font-size: 25px;
  font-weight: 900;
  margin-bottom: 12px;
}

.stat-card span {
  font-size: 20px;
}

.charts-grid {
  display: grid;
  grid-template-columns: minmax(430px, 1fr) minmax(420px, 1.35fr);
  gap: 16px;
  margin-bottom: 16px;
}

.panel {
  padding: 34px 40px;
}

.panel h2 {
  margin: 0 0 28px;
  font-size: 20px;
  font-weight: 500;
}

.status-panel {
  min-height: 345px;
  padding-inline: 32px;
}

.status-chart {
  align-items: center;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: center;
  gap: 24px;
}

.status-legend {
  display: grid;
  gap: 12px;
  min-width: 130px;
  flex: 0 0 140px;
}

.legend-item {
  align-items: center;
  display: flex;
  gap: 10px;
  font-size: 14px;
  white-space: nowrap;
}

.legend-dot {
  border-radius: 50%;
  display: inline-block;
  height: 18px;
  width: 18px;
}

.donut-chart {
  align-items: center;
  background:
    radial-gradient(circle, #eaf2fd 0 40%, transparent 41%),
    conic-gradient(
      #115bd2 0deg 130deg,
      #5a9af4 130deg 220deg,
      #d9e9ff 220deg 288deg,
      #969696 288deg 360deg
    );
  border-radius: 50%;
  display: flex;
  flex: 0 0 190px;
  flex-shrink: 0;
  height: 190px;
  justify-content: center;
  width: 190px;
}

.donut-center {
  align-items: center;
  background-color: #eaf2fd;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  height: 96px;
  justify-content: center;
  width: 96px;
}

.donut-center strong {
  font-size: 24px;
  font-weight: 900;
}

.donut-center span {
  font-size: 18px;
}

.weekly-panel {
  min-height: 345px;
}

.bar-chart {
  align-items: end;
  display: grid;
  grid-template-columns: repeat(7, minmax(44px, 1fr));
  gap: 10px;
  height: 215px;
  max-width: 680px;
  margin: 0 auto;
  padding-top: 6px;
}

.bar-item {
  align-items: center;
  display: flex;
  flex-direction: column;
  gap: 9px;
  height: 100%;
  justify-content: end;
  min-width: 0;
}

.bar-count {
  color: #115bd2;
  font-size: 15px;
  font-weight: 800;
  line-height: 1;
}

.bar {
  background-color: #5a99ef;
  border-radius: 22px 22px 0 0;
  display: block;
  width: min(100%, 64px);
  max-height: calc(100% - 52px);
  min-height: 44px;
}

.bar.highlighted {
  background-color: #115bd2;
}

.bar-label {
  font-size: 20px;
  line-height: 1;
}

.appointments-panel {
  min-height: 390px;
}

.appointments-panel h2 {
  margin-bottom: 22px;
}

.table-wrap {
  overflow-x: auto;
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
}

.status-pill {
  background-color: #d9e9ff;
  border-radius: 999px;
  color: #115bd2;
  display: inline-flex;
  font-weight: 700;
  justify-content: center;
  min-width: 72px;
  padding: 5px 12px;
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

  .dashboard-header {
    align-items: flex-start;
    flex-direction: row;
  }

  .dashboard-header :deep(.admin-notifications) {
    flex: 0 0 auto;
  }

  .stats-grid {
    grid-template-columns: repeat(2, minmax(180px, 1fr));
  }

  .charts-grid {
    grid-template-columns: 1fr;
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

  .dashboard-header {
    gap: 16px;
    margin-bottom: 28px;
  }

  .dashboard-header h1 {
    font-size: 26px;
  }

  .dashboard-header p {
    font-size: 18px;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .stat-card {
    min-height: 130px;
    padding: 32px 28px 24px;
  }

  .status-chart {
    flex-direction: column-reverse;
    gap: 24px;
  }

  .status-legend {
    justify-items: center;
  }

  .panel {
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

  .bar-chart {
    gap: 5px;
  }

  .bar-label {
    font-size: 16px;
  }

  .donut-chart {
    flex-basis: 168px;
    height: 168px;
    width: 168px;
  }
}
</style>

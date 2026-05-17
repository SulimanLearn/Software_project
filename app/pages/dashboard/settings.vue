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
          <NuxtLink to="/dashboard/articles" class="sidebar-link">
            إدارة المقالات
          </NuxtLink>
          <NuxtLink to="/dashboard/inventory" class="sidebar-link">
            مراقبة المخزون
          </NuxtLink>
          <NuxtLink to="/dashboard/settings" class="sidebar-link active">
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
            <h1>إعدادات المنصة</h1>
          </div>
        </header>

        <section class="settings-card" aria-label="الإعدادات العامة">
          <h2>الإعدادات العامة</h2>

          <form class="settings-form" @submit.prevent="saveSettings">
            <label
              v-for="field in settingsFields"
              :key="field.id"
              class="field-group"
              :for="field.id"
            >
              <span>{{ field.label }}</span>
              <input
                :id="field.id"
                v-model="field.value"
                type="number"
                inputmode="numeric"
              >
            </label>

            <div class="form-actions">
              <button type="submit" :disabled="isSaving">
                {{ isSaving ? 'جاري الحفظ...' : 'حفظ الإعدادات' }}
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>

    <div v-if="toastMessage" class="toast-message">
      {{ toastMessage }}
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
const isSaving = ref(false)
const toastMessage = ref('')
const isLoggedIn = useState('isLoggedIn', () => false)
const user = useState('user', () => ({ name: '' }))

const confirmLogout = async () => {
  isLoggedIn.value = false
  user.value = { name: '' }
  showLogoutModal.value = false
  await navigateTo('/login')
}

const settingsFields = reactive([
  {
    id: 'default-fee',
    label: 'رسوم الكشف الافتراضية (₪)',
    value: 100
  },
  {
    id: 'appointment-duration',
    label: 'مدة الموعد (دقيقة)',
    value: 30
  },
  {
    id: 'daily-limit',
    label: 'الحد الأقصى للمواعيد اليومية',
    value: 20
  },
  {
    id: 'cancellation-policy',
    label: 'سياسة الإلغاء (ساعات)',
    value: 24
  }
])

const showToast = (message) => {
  toastMessage.value = message
  window.setTimeout(() => {
    toastMessage.value = ''
  }, 2200)
}

const saveSettings = () => {
  isSaving.value = true
  window.setTimeout(() => {
    isSaving.value = false
    showToast('تم حفظ الإعدادات بنجاح')
  }, 350)
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

.settings-card {
  background-color: #eaf2fd;
  border: 1.5px solid #0b63f6;
  border-radius: 24px;
  min-height: 480px;
  padding: 44px 72px 42px;
}

.settings-card h2 {
  margin: 0 0 26px;
  font-size: 20px;
  font-weight: 500;
}

.settings-form {
  display: grid;
  grid-template-columns: repeat(2, minmax(220px, 1fr));
  gap: 34px 32px;
}

.field-group {
  display: grid;
  gap: 12px;
}

.field-group span {
  font-size: 22px;
  line-height: 1.3;
}

.field-group input {
  background-color: #dceafa;
  border: 1.5px solid #0b63f6;
  border-radius: 14px;
  color: #101010;
  font-family: inherit;
  font-size: 22px;
  height: 72px;
  outline: none;
  padding: 0 22px;
  text-align: right;
  width: 100%;
}

.field-group input:focus {
  box-shadow: 0 0 0 3px rgba(11, 99, 246, 0.12);
}

.form-actions {
  display: flex;
  grid-column: 1 / -1;
  justify-content: flex-start;
  margin-top: 10px;
}

.form-actions button {
  background-color: #115bd2;
  border: 1px solid #115bd2;
  border-radius: 24px;
  color: #ffffff;
  cursor: pointer;
  font-family: inherit;
  font-size: 17px;
  min-width: 180px;
  padding: 13px 30px;
  transition: background-color 0.2s ease, box-shadow 0.2s ease;
}

.form-actions button:hover {
  background-color: #0b4db8;
  box-shadow: 0 6px 16px rgba(17, 91, 210, 0.2);
}

.form-actions button:disabled {
  cursor: not-allowed;
  opacity: 0.7;
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

  .settings-card {
    padding: 38px 36px;
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
    margin-bottom: 36px;
  }

  .page-header h1 {
    font-size: 26px;
  }

  .settings-card {
    border-radius: 20px;
    min-height: auto;
    padding: 28px 22px;
  }

  .settings-form {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .field-group span {
    font-size: 19px;
  }

  .field-group input {
    font-size: 20px;
    height: 64px;
  }
}

@media (max-width: 560px) {
  .dashboard-content {
    padding: 28px 14px 36px;
  }

  .sidebar-nav {
    grid-template-columns: 1fr;
  }

  .form-actions button {
    width: 100%;
  }
}
</style>

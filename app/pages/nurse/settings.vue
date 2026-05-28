<template>
  <div class="nurse-settings-page" dir="rtl">
    <NavBar />

    <div class="nurse-settings-shell">
      <NurseSidebar :nurse="nurse" @logout="showLogoutModal = true" />

      <main class="nurse-settings-content">
        <header class="page-header">
          <h1>الإعدادات</h1>
          <p>إدارة تفضيلات النظام، التنبيهات، الخصوصية، والجلسات.</p>
        </header>

        <form class="settings-layout" @submit.prevent="saveSettings">
          <div class="settings-column">
            <section class="settings-card" aria-labelledby="notification-title">
              <div class="section-header">
                <h2 id="notification-title">إعدادات الإشعارات</h2>
                <span>اختيار القنوات والتنبيهات المهمة داخل لوحة الممرضة</span>
              </div>

              <div class="toggle-list">
                <label v-for="toggle in notificationToggles" :key="toggle.key" class="toggle-row">
                  <span>{{ toggle.label }}</span>
                  <input v-model="settings.notifications[toggle.key]" type="checkbox">
                </label>
              </div>
            </section>

            <section class="settings-card" aria-labelledby="privacy-title">
              <div class="section-header">
                <h2 id="privacy-title">الخصوصية والأمان</h2>
                <span>صلاحيات الظهور وخيارات حماية الحساب</span>
              </div>

              <div class="fields-grid">
                <label class="toggle-row field-toggle">
                  <span>إظهار حالة اتصال الممرضة</span>
                  <input v-model="settings.privacy.showOnlineStatus" type="checkbox">
                </label>

                <label class="toggle-row field-toggle">
                  <span>تفعيل المصادقة الثنائية</span>
                  <input v-model="settings.privacy.twoFactorAuth" type="checkbox">
                </label>

                <label class="toggle-row field-toggle">
                  <span>السماح بتنبيهات تسجيل الدخول</span>
                  <input v-model="settings.privacy.loginAlerts" type="checkbox">
                </label>

                <label class="toggle-row field-toggle">
                  <span>تسجيل الخروج التلقائي عند الخمول</span>
                  <input v-model="settings.privacy.autoLogout" type="checkbox">
                </label>
              </div>
            </section>
          </div>

          <div class="settings-column">
            <section class="settings-card" aria-labelledby="system-title">
              <div class="section-header">
                <h2 id="system-title">تفضيلات النظام</h2>
                <span>لغة الواجهة، المظهر، وطريقة عرض البيانات</span>
              </div>

              <div class="fields-grid">
                <label class="form-field">
                  <span>لغة الواجهة</span>
                  <select v-model="settings.system.language">
                    <option value="ar">العربية</option>
                    <option value="en">English</option>
                  </select>
                </label>

                <label class="form-field">
                  <span>كثافة عرض الجداول</span>
                  <select v-model="settings.system.tableDensity">
                    <option value="comfortable">مريحة</option>
                    <option value="compact">مضغوطة</option>
                  </select>
                </label>

                <label class="toggle-row field-toggle">
                  <span>الوضع الليلي</span>
                  <input v-model="settings.system.darkMode" type="checkbox">
                </label>

                <label class="toggle-row field-toggle">
                  <span>تثبيت الشريط الجانبي</span>
                  <input v-model="settings.system.pinSidebar" type="checkbox">
                </label>
              </div>
            </section>

            <section class="settings-card session-card" aria-labelledby="session-title">
              <div class="section-header">
                <h2 id="session-title">إدارة الجلسات</h2>
                <span>نشاط تسجيل الدخول والأجهزة الحالية</span>
              </div>

              <div class="session-list">
                <article v-for="session in sessions" :key="session.id" class="session-item">
                  <div>
                    <strong>{{ session.device }}</strong>
                    <span>{{ session.location }} - {{ session.lastActive }}</span>
                  </div>
                  <em :class="{ active: session.current }">
                    {{ session.current ? 'الجلسة الحالية' : 'نشطة' }}
                  </em>
                </article>
              </div>

              <div class="login-activity">
                <strong>آخر نشاط تسجيل دخول</strong>
                <span>{{ settings.session.lastLogin }}</span>
              </div>
            </section>
          </div>

          <div class="settings-actions">
            <button class="save-button" type="submit">حفظ الإعدادات</button>
          </div>
        </form>
      </main>
    </div>

    <div
      v-if="showLogoutModal"
      class="modal-overlay"
      dir="rtl"
      @click.self="showLogoutModal = false"
    >
      <div class="confirmation-modal" role="dialog" aria-modal="true" aria-labelledby="logout-modal-title">
        <h2 id="logout-modal-title">تسجيل الخروج</h2>
        <p>هل أنت متأكد أنك تريد تسجيل الخروج؟</p>

        <div class="modal-actions">
          <button class="save-button" type="button" @click="confirmLogout">نعم</button>
          <button class="cancel-button" type="button" @click="showLogoutModal = false">لا</button>
        </div>
      </div>
    </div>

    <transition name="toast">
      <div v-if="toastMessage" class="toast-message" role="status">{{ toastMessage }}</div>
    </transition>
  </div>
</template>

<script setup>
import NurseSidebar from '~/components/nurse/NurseSidebar.vue'

const showLogoutModal = ref(false)
const toastMessage = ref('')
let toastTimer

const nurse = {
  name: 'الممرضة ريم أبو شمالة',
  jobTitle: 'ممرضة تمريض منزلي',
  avatar: '/images/doctor.png'
}

const settings = useState('nurse-system-settings-demo', () => ({
  notifications: {
    notifications: true,
    requestReminders: true,
    requestChanges: true,
    emailAlerts: true,
    smsAlerts: false,
    newNursingRequests: true
  },
  privacy: {
    showOnlineStatus: true,
    twoFactorAuth: false,
    loginAlerts: true,
    autoLogout: true
  },
  system: {
    language: 'ar',
    tableDensity: 'comfortable',
    darkMode: false,
    pinSidebar: true
  },
  session: {
    lastLogin: 'اليوم، 09:18 ص - مجمع الحياة الطبي - غزة'
  }
}))

const notificationToggles = [
  { key: 'notifications', label: 'تفعيل الإشعارات' },
  { key: 'requestReminders', label: 'تذكير الطلبات' },
  { key: 'requestChanges', label: 'تنبيهات تعديل أو إلغاء الطلبات' },
  { key: 'emailAlerts', label: 'تفعيل تنبيهات البريد الإلكتروني' },
  { key: 'smsAlerts', label: 'تفعيل تنبيهات الرسائل النصية SMS' },
  { key: 'newNursingRequests', label: 'إشعارات طلبات التمريض الجديدة' }
]

const sessions = [
  {
    id: 1,
    device: 'Chrome - Windows',
    location: 'حي الرمال - غزة',
    lastActive: 'نشط الآن',
    current: true
  },
  {
    id: 2,
    device: 'Chrome - Android',
    location: 'تل الهوى - غزة',
    lastActive: 'منذ ساعتين',
    current: false
  }
]

function saveSettings() {
  showToast('تم حفظ الإعدادات بنجاح')
}

function showToast(message) {
  clearTimeout(toastTimer)
  toastMessage.value = message
  toastTimer = setTimeout(() => {
    toastMessage.value = ''
  }, 2600)
}

const confirmLogout = async () => {
  showLogoutModal.value = false
  await navigateTo('/login')
}

onBeforeUnmount(() => {
  clearTimeout(toastTimer)
})
</script>

<style scoped>
.nurse-settings-page {
  min-height: 100vh;
  background-color: #ffffff;
  color: #101010;
  overflow-x: hidden;
}

.nurse-settings-shell {
  display: grid;
  grid-template-columns: 290px minmax(0, 1fr);
  min-height: calc(100vh - 85px);
}

.nurse-settings-content {
  min-width: 0;
  padding: 30px 36px 38px;
}

.page-header {
  margin-bottom: 18px;
  text-align: right;
}

.page-header h1 {
  font-size: 30px;
  font-weight: 900;
  margin: 0 0 8px;
}

.page-header p {
  color: #343434;
  font-size: 16px;
  font-weight: 700;
  margin: 0;
}

.settings-layout {
  align-items: start;
  display: grid;
  gap: 18px;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
}

.settings-column {
  align-content: start;
  display: grid;
  gap: 18px;
  min-width: 0;
}

.settings-card {
  background-color: #eaf2fd;
  border: 1.5px solid #0b63f6;
  border-radius: 22px;
  padding: 22px;
}

.settings-card:hover {
  box-shadow: 0 12px 26px rgba(17, 91, 210, 0.12);
}

.settings-actions {
  display: flex;
  grid-column: 1 / -1;
  justify-content: flex-start;
}

.section-header {
  align-items: center;
  display: flex;
  gap: 12px;
  justify-content: space-between;
  margin-bottom: 16px;
}

.section-header h2 {
  font-size: 21px;
  font-weight: 900;
  margin: 0;
}

.section-header span {
  color: #343434;
  font-size: 14px;
  font-weight: 800;
}

.fields-grid {
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.form-field {
  display: grid;
  gap: 8px;
  min-width: 0;
}

.form-field span,
.toggle-row > span {
  color: #343434;
  font-size: 14px;
  font-weight: 900;
}

.form-field select {
  background-color: #ffffff;
  border: 1px solid #8dbbfb;
  border-radius: 16px;
  color: #101010;
  font-family: inherit;
  font-size: 15px;
  font-weight: 800;
  min-height: 44px;
  outline: none;
  padding: 0 14px;
  width: 100%;
}

.form-field select:focus {
  border-color: #0b63f6;
  box-shadow: 0 0 0 3px rgba(90, 153, 239, 0.2);
}

.toggle-list {
  display: grid;
  gap: 10px;
}

.toggle-row {
  align-items: center;
  background-color: #ffffff;
  border: 1px solid #8dbbfb;
  border-radius: 16px;
  display: grid;
  gap: 12px;
  grid-template-columns: minmax(0, 1fr) auto;
  min-height: 52px;
  padding: 10px 14px;
}

.field-toggle {
  min-height: 64px;
}

.toggle-row input {
  appearance: none;
  background-color: #d4e3f8;
  border: 1px solid #8dbbfb;
  border-radius: 999px;
  cursor: pointer;
  height: 28px;
  position: relative;
  transition: background-color 0.2s ease, border-color 0.2s ease;
  width: 52px;
}

.toggle-row input::before {
  background-color: #ffffff;
  border-radius: 999px;
  box-shadow: 0 2px 6px rgba(16, 24, 40, 0.18);
  content: '';
  height: 22px;
  inset-block-start: 2px;
  inset-inline-start: 2px;
  position: absolute;
  transition: inset-inline-start 0.2s ease;
  width: 22px;
}

.toggle-row input:checked {
  background-color: #115bd2;
  border-color: #0b63f6;
}

.toggle-row input:checked::before {
  inset-inline-start: 26px;
}

.toggle-row:focus-within {
  box-shadow: 0 0 0 3px rgba(90, 153, 239, 0.2);
}

.session-list {
  display: grid;
  gap: 10px;
}

.session-item,
.login-activity {
  background-color: #ffffff;
  border: 1px solid #8dbbfb;
  border-radius: 16px;
  padding: 14px 16px;
}

.session-item {
  align-items: center;
  display: flex;
  gap: 14px;
  justify-content: space-between;
}

.session-item strong,
.login-activity strong {
  display: block;
  font-size: 15px;
  font-weight: 900;
}

.session-item span,
.login-activity span {
  color: #5e6776;
  display: block;
  font-size: 13px;
  font-weight: 800;
  margin-top: 5px;
}

.session-item em {
  background-color: #eef2f7;
  border-radius: 999px;
  color: #667085;
  flex: 0 0 auto;
  font-size: 12px;
  font-style: normal;
  font-weight: 900;
  padding: 6px 10px;
}

.session-item em.active {
  background-color: #dff3e7;
  color: #137446;
}

.login-activity {
  margin-top: 10px;
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
  transition: background-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
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
  box-shadow: 0 8px 18px rgba(17, 91, 210, 0.22);
  transform: translateY(-1px);
}

.cancel-button:hover {
  background-color: #dcecff;
  transform: translateY(-1px);
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

.confirmation-modal {
  background-color: #eaf2fd;
  border: 1.5px solid #0b63f6;
  border-radius: 24px;
  box-shadow: 0 18px 45px rgba(0, 0, 0, 0.12);
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

.toast-message {
  background-color: #115bd2;
  border: 1px solid #0b63f6;
  border-radius: 18px;
  bottom: 24px;
  box-shadow: 0 14px 32px rgba(17, 91, 210, 0.24);
  color: #ffffff;
  font-weight: 900;
  inset-inline-start: 24px;
  padding: 12px 18px;
  position: fixed;
  z-index: 3000;
}

.toast-enter-active,
.toast-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

@media (max-width: 1030px) {
  .nurse-settings-shell {
    grid-template-columns: 240px minmax(0, 1fr);
  }

  .nurse-settings-content {
    padding: 28px 22px 40px;
  }

  .settings-layout {
    grid-template-columns: 1fr;
  }

  .settings-card {
    border-radius: 20px;
    padding: 20px;
  }

  .page-header h1 {
    font-size: 28px;
  }
}

@media (max-width: 720px) {
  .nurse-settings-shell {
    display: flex;
    flex-direction: column;
  }

  .nurse-settings-content {
    padding: 28px 16px 36px;
  }

  .page-header h1 {
    font-size: 26px;
  }

  .settings-card {
    border-radius: 20px;
    padding: 20px;
  }

  .fields-grid {
    grid-template-columns: 1fr;
  }

  .section-header {
    align-items: flex-start;
    flex-direction: column;
    gap: 5px;
  }

  .settings-actions,
  .modal-actions {
    flex-direction: column;
  }

  .save-button,
  .cancel-button,
  .modal-actions button {
    width: 100%;
  }

  .session-item {
    align-items: flex-start;
    flex-direction: column;
  }

  .toggle-row {
    padding: 12px 14px;
  }

  .confirmation-modal {
    border-radius: 20px;
    padding: 32px 22px 28px;
  }

  .confirmation-modal p {
    font-size: 20px;
  }

  .toast-message {
    inset-inline: 16px;
    text-align: center;
  }
}
</style>

<template>
  <div class="doctor-settings-page" dir="rtl">
    <NavBar />

    <div class="doctor-settings-shell">
      <DoctorSidebar :doctor="doctor" @logout="showLogoutModal = true" />

      <main class="doctor-settings-content">
        <header class="page-header">
          <h1>الإعدادات</h1>
          <p>إدارة تفضيلات النظام، التنبيهات، الخصوصية، والجلسات.</p>
        </header>

        <form class="settings-layout" @submit.prevent="saveSettings">
          <div class="settings-column">
            <section class="settings-card" aria-labelledby="notification-title">
              <div class="section-header">
                <h2 id="notification-title">إعدادات الإشعارات</h2>
                <span>اختيار القنوات والتنبيهات المهمة داخل لوحة الطبيب</span>
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
                  <span>إظهار حالة الاتصال للمرضى</span>
                  <input v-model="settings.privacy.showOnlineStatus" type="checkbox">
                </label>

                <label class="toggle-row field-toggle">
                  <span>السماح بتنبيهات تسجيل الدخول</span>
                  <input v-model="settings.privacy.loginAlerts" type="checkbox">
                </label>

                <label class="toggle-row field-toggle">
                  <span>تفعيل المصادقة الثنائية</span>
                  <input v-model="settings.privacy.twoFactorAuth" type="checkbox">
                </label>

                <label class="toggle-row field-toggle">
                  <span>تسجيل الخروج التلقائي عند الخمول</span>
                  <input v-model="settings.privacy.autoLogout" type="checkbox">
                </label>
              </div>
            </section>
          </div>

          <div class="settings-column">
            <section class="settings-card appointment-rules-card" aria-labelledby="appointment-rules-title">
              <div class="section-header">
                <h2 id="appointment-rules-title">إعدادات الجلسات والمواعيد</h2>
                <span>قواعد عامة لمدة الجلسة وسياسة الحجز فقط</span>
              </div>

              <div class="fields-grid appointment-rules-grid">
                <label class="form-field">
                  <span>مدة الجلسة</span>
                  <select v-model.number="settings.appointmentRules.sessionDuration">
                    <option :value="15">15 min</option>
                    <option :value="30">30 min</option>
                    <option :value="45">45 min</option>
                    <option :value="60">60 min</option>
                  </select>
                </label>

                <label class="form-field">
                  <span>سعر الجلسة الافتراضي</span>
                  <div class="currency-input">
                    <input v-model.number="settings.appointmentRules.defaultPrice" type="number" min="0">
                    <strong>₪</strong>
                  </div>
                </label>

                <label class="form-field">
                  <span>الاستراحة بين الجلسات</span>
                  <select v-model.number="settings.appointmentRules.breakBetweenSessions">
                    <option :value="0">No break</option>
                    <option :value="5">5 min</option>
                    <option :value="10">10 min</option>
                    <option :value="15">15 min</option>
                  </select>
                </label>

                <label class="form-field">
                  <span>الحد الأقصى للمواعيد اليومية</span>
                  <input v-model.number="settings.appointmentRules.maximumDailyAppointments" type="number" min="1">
                </label>

                <label class="toggle-row field-toggle">
                  <span>إتاحة المواعيد الأونلاين</span>
                  <input v-model="settings.appointmentRules.onlineAppointments" type="checkbox">
                </label>

                <label class="toggle-row field-toggle">
                  <span>تأكيد المواعيد تلقائياً</span>
                  <input v-model="settings.appointmentRules.autoConfirmAppointments" type="checkbox">
                </label>

                <label class="form-field">
                  <span>حد إلغاء الموعد</span>
                  <select v-model.number="settings.appointmentRules.cancellationLimit">
                    <option :value="1">1 hour before</option>
                    <option :value="3">3 hours before</option>
                    <option :value="6">6 hours before</option>
                    <option :value="24">24 hours before</option>
                  </select>
                </label>

                <label class="form-field">
                  <span>وقت التحضير بين المواعيد</span>
                  <select v-model.number="settings.appointmentRules.bufferTime">
                    <option :value="0">No buffer</option>
                    <option :value="5">5 min</option>
                    <option :value="10">10 min</option>
                    <option :value="15">15 min</option>
                  </select>
                </label>
              </div>
            </section>

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
            <button class="save-button" type="submit">
              حفظ الإعدادات
            </button>
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
      <div
        class="confirmation-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="logout-modal-title"
      >
        <h2 id="logout-modal-title">تسجيل الخروج</h2>
        <p>هل انت متاكد انك تريد تسجيل الخروج؟</p>

        <div class="modal-actions">
          <button class="save-button" type="button" @click="confirmLogout">
            نعم
          </button>
          <button class="cancel-button" type="button" @click="showLogoutModal = false">
            لا
          </button>
        </div>
      </div>
    </div>

    <transition name="toast">
      <div v-if="toastMessage" class="toast-message" role="status">
        {{ toastMessage }}
      </div>
    </transition>
  </div>
</template>

<script setup>
import DoctorSidebar from '~/components/doctor/DoctorSidebar.vue'

const showLogoutModal = ref(false)
const toastMessage = ref('')
let toastTimer

const isLoggedIn = useState('isLoggedIn', () => false)
const user = useState('user', () => ({ name: '' }))

const doctor = {
  name: 'د. خالد السيد',
  specialization: 'أمراض القلب',
  avatar: '/images/doctor.png'
}

const settings = useState('doctor-system-settings-demo', () => ({
  notifications: {
    notifications: true,
    appointmentReminders: true,
    appointmentChanges: true,
    emailReminders: true,
    smsReminders: false,
    prescriptionNotifications: true,
    newPatientNotifications: true
  },
  system: {
    language: 'ar',
    tableDensity: 'comfortable',
    darkMode: false,
    pinSidebar: true
  },
  appointmentRules: {
    sessionDuration: 45,
    defaultPrice: 120,
    breakBetweenSessions: 10,
    maximumDailyAppointments: 18,
    onlineAppointments: true,
    autoConfirmAppointments: false,
    cancellationLimit: 3,
    bufferTime: 5
  },
  privacy: {
    showOnlineStatus: true,
    loginAlerts: true,
    twoFactorAuth: false,
    autoLogout: true
  },
  session: {
    lastLogin: 'اليوم، 09:18 ص - جهاز Windows'
  }
}))

const notificationToggles = [
  { key: 'notifications', label: 'تفعيل الإشعارات' },
  { key: 'appointmentReminders', label: 'تذكير بالمواعيد' },
  { key: 'appointmentChanges', label: 'تنبيهات تعديل أو إلغاء المواعيد' },
  { key: 'emailReminders', label: 'تفعيل تذكيرات البريد الإلكتروني' },
  { key: 'smsReminders', label: 'تفعيل تذكيرات الرسائل النصية SMS' },
  { key: 'prescriptionNotifications', label: 'إشعارات الوصفات الطبية' },
  { key: 'newPatientNotifications', label: 'إشعارات المرضى الجدد' }
]

const sessions = [
  {
    id: 1,
    device: 'Windows - Chrome',
    location: 'الخليل',
    lastActive: 'نشط الآن',
    current: true
  },
  {
    id: 2,
    device: 'Android - Chrome',
    location: 'رام الله',
    lastActive: 'منذ ساعتين',
    current: false
  }
]

function saveSettings() {
  // Future API integration point: send settings.value to the backend.
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
  isLoggedIn.value = false
  user.value = { name: '' }
  showLogoutModal.value = false
  await navigateTo('/login')
}

onBeforeUnmount(() => {
  clearTimeout(toastTimer)
})
</script>

<style scoped>
.doctor-settings-page {
  min-height: 100vh;
  background-color: #ffffff;
  color: #101010;
}

.doctor-settings-shell {
  display: grid;
  grid-template-columns: 290px minmax(0, 1fr);
  min-height: calc(100vh - 85px);
}

.doctor-settings-content {
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
  grid-column: 1 / -1;
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

.form-field input,
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

.form-field input:read-only {
  background-color: #f6f8fb;
  color: #667085;
}

.form-field input:focus,
.form-field select:focus {
  border-color: #0b63f6;
  box-shadow: 0 0 0 3px rgba(90, 153, 239, 0.2);
}

.currency-input {
  align-items: center;
  background-color: #ffffff;
  border: 1px solid #8dbbfb;
  border-radius: 16px;
  display: flex;
  min-height: 44px;
  overflow: hidden;
}

.currency-input:focus-within {
  border-color: #0b63f6;
  box-shadow: 0 0 0 3px rgba(90, 153, 239, 0.2);
}

.currency-input input {
  border: 0;
  border-radius: 0;
  box-shadow: none;
  min-height: 42px;
}

.currency-input input:focus {
  box-shadow: none;
}

.currency-input strong {
  align-items: center;
  align-self: stretch;
  background-color: #eaf2fd;
  border-inline-start: 1px solid #8dbbfb;
  color: #115bd2;
  display: inline-flex;
  font-size: 16px;
  font-weight: 900;
  justify-content: center;
  min-width: 48px;
}

.wide-field {
  grid-column: 1 / -1;
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

.settings-actions {
  display: flex;
  justify-content: flex-start;
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

@media (max-width: 1180px) {
  .doctor-settings-shell {
    grid-template-columns: 240px minmax(0, 1fr);
  }

  .doctor-settings-content {
    padding: 28px 22px 40px;
  }

  .settings-layout {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 720px) {
  .doctor-settings-shell {
    display: flex;
    flex-direction: column;
  }

  .doctor-settings-content {
    padding: 26px 18px 36px;
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

  .wide-field {
    grid-column: auto;
  }

  .section-header {
    align-items: flex-start;
    flex-direction: column;
    gap: 5px;
  }
}

@media (max-width: 560px) {
  .doctor-settings-content {
    padding: 28px 14px 36px;
  }

  .settings-card {
    padding: 20px 16px;
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

<template>
  <div class="doctor-simple-page" dir="rtl">
    <NavBar />

    <div class="doctor-simple-shell">
      <DoctorSidebar :doctor="doctor" @logout="showLogoutModal = true" />

      <main class="doctor-simple-content">
        <header class="page-header">
          <h1>الإعدادات</h1>
          <p>إعدادات حساب الطبيب والتنبيهات.</p>
        </header>

        <section class="settings-card" aria-label="إعدادات الطبيب">
          <label>
            <span>تنبيهات المواعيد</span>
            <select v-model="settings.appointmentAlerts">
              <option value="enabled">مفعلة</option>
              <option value="disabled">غير مفعلة</option>
            </select>
          </label>

          <label>
            <span>لغة الواجهة</span>
            <select v-model="settings.language">
              <option value="ar">العربية</option>
            </select>
          </label>

          <label class="wide-field">
            <span>ملاحظات داخلية</span>
            <textarea v-model.trim="settings.notes" rows="4" />
          </label>
        </section>
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
  </div>
</template>

<script setup>
import DoctorSidebar from '~/components/doctor/DoctorSidebar.vue'

const showLogoutModal = ref(false)
const isLoggedIn = useState('isLoggedIn', () => false)
const user = useState('user', () => ({ name: '' }))

const doctor = {
  name: 'د. خالد السيد',
  specialization: 'أمراض القلب',
  avatar: '/images/doctor.png'
}

const settings = reactive({
  appointmentAlerts: 'enabled',
  language: 'ar',
  notes: ''
})

const confirmLogout = async () => {
  isLoggedIn.value = false
  user.value = { name: '' }
  showLogoutModal.value = false
  await navigateTo('/login')
}
</script>

<style scoped>
.doctor-simple-page {
  min-height: 100vh;
  background-color: #ffffff;
  color: #101010;
}

.doctor-simple-shell {
  display: grid;
  grid-template-columns: 290px minmax(0, 1fr);
  min-height: calc(100vh - 85px);
}

.doctor-simple-content {
  padding: 36px 40px 44px;
}

.page-header {
  margin-bottom: 24px;
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

.settings-card {
  background-color: #eaf2fd;
  border: 1.5px solid #0b63f6;
  border-radius: 24px;
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  padding: 22px;
}

.settings-card label {
  color: #343434;
  display: flex;
  flex-direction: column;
  font-size: 14px;
  font-weight: 900;
  gap: 8px;
}

.settings-card select,
.settings-card textarea {
  background-color: #ffffff;
  border: 1px solid #8dbbfb;
  border-radius: 14px;
  color: #101010;
  font-family: inherit;
  font-size: 15px;
  font-weight: 800;
  min-height: 44px;
  outline: none;
  padding: 10px 12px;
}

.wide-field {
  grid-column: 1 / -1;
}

.modal-overlay {
  align-items: center;
  background-color: rgba(68, 139, 239, 0.35);
  display: flex;
  inset: 0;
  justify-content: center;
  padding: 24px;
  position: fixed;
  z-index: 1000;
}

.confirmation-modal {
  background-color: #eaf2fd;
  border: 1.5px solid #0b63f6;
  border-radius: 24px;
  padding: 42px 44px 34px;
  text-align: center;
  width: min(560px, 100%);
}

.confirmation-modal h2 {
  font-size: 26px;
  font-weight: 900;
  margin: 0;
}

.confirmation-modal p {
  font-size: 22px;
  font-weight: 800;
  margin: 14px 0 30px;
}

.modal-actions {
  display: flex;
  gap: 14px;
  justify-content: center;
}

.save-button,
.cancel-button {
  border-radius: 18px;
  cursor: pointer;
  font-family: inherit;
  font-size: 16px;
  font-weight: 800;
  min-width: 110px;
  padding: 10px 26px;
}

.save-button {
  background-color: #5a99ef;
  border: 1px solid #0b63f6;
  color: #ffffff;
}

.cancel-button {
  background-color: #ffffff;
  border: 1px solid #8dbbfb;
  color: #101010;
}

@media (max-width: 720px) {
  .doctor-simple-shell {
    display: flex;
    flex-direction: column;
  }

  .doctor-simple-content {
    padding: 32px 18px 44px;
  }

  .settings-card {
    grid-template-columns: 1fr;
  }
}
</style>

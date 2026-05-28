<template>
  <PatientPortalLayout title="ملفي" subtitle="إدارة بياناتك الشخصية ومعلومات الحساب.">
    <section class="patient-profile-header-card profile-header">
      <div class="profile-avatar">
        <UserRound :size="44" :stroke-width="2.2" aria-hidden="true" />
      </div>
      <div class="profile-heading">
        <span class="patient-eyebrow">ملف المريض</span>
        <h2>{{ form.firstName }} {{ form.lastName }}</h2>
        <p>{{ form.email }}</p>
        <div class="profile-meta">
          <PatientStatusBadge :status="patientProfile.status" />
          <span>{{ form.phone }}</span>
        </div>
      </div>
    </section>

    <div class="patient-grid-two">
      <section class="patient-dashboard-card" aria-labelledby="profile-form-title">
        <div class="patient-section-header">
          <h2 id="profile-form-title">البيانات الشخصية</h2>
          <span>يمكن ربط الحقول بواجهة API لاحقاً</span>
        </div>

        <form class="patient-form-grid" @submit.prevent="saveProfile">
          <label class="patient-form-field">
            <span>الاسم الأول</span>
            <input v-model.trim="form.firstName" type="text" required>
          </label>
          <label class="patient-form-field">
            <span>اسم العائلة</span>
            <input v-model.trim="form.lastName" type="text" required>
          </label>
          <label class="patient-form-field">
            <span>رقم الهاتف</span>
            <input v-model.trim="form.phone" type="tel" required>
          </label>
          <label class="patient-form-field">
            <span>البريد الإلكتروني</span>
            <input v-model.trim="form.email" type="email" required>
          </label>
          <label class="patient-form-field">
            <span>تاريخ الميلاد</span>
            <input v-model="form.dateOfBirth" type="date" required>
          </label>
          <label class="patient-form-field">
            <span>فصيلة الدم</span>
            <select v-model="form.bloodType">
              <option>O+</option>
              <option>O-</option>
              <option>A+</option>
              <option>A-</option>
              <option>B+</option>
              <option>B-</option>
              <option>AB+</option>
              <option>AB-</option>
            </select>
          </label>
          <label class="patient-form-field full">
            <span>العنوان</span>
            <textarea v-model.trim="form.address" rows="3" required />
          </label>
          <div class="patient-action-row">
            <button class="patient-save-button" type="submit">حفظ التغييرات</button>
          </div>
        </form>
      </section>

      <section class="patient-dashboard-card" aria-labelledby="password-title">
        <div class="patient-section-header">
          <h2 id="password-title">تغيير كلمة المرور</h2>
          <span>استخدم كلمة قوية لحماية حسابك</span>
        </div>

        <form class="patient-form-grid password-grid" @submit.prevent="savePassword">
          <label class="patient-form-field full">
            <span>كلمة المرور الحالية</span>
            <input v-model="password.current" type="password" required>
          </label>
          <label class="patient-form-field full">
            <span>كلمة المرور الجديدة</span>
            <input v-model="password.next" type="password" required>
          </label>
          <label class="patient-form-field full">
            <span>تأكيد كلمة المرور الجديدة</span>
            <input v-model="password.confirm" type="password" required>
          </label>
          <p v-if="passwordError" class="profile-error">{{ passwordError }}</p>
          <div class="patient-action-row">
            <button class="patient-save-button" type="submit">حفظ كلمة المرور</button>
          </div>
        </form>
      </section>
    </div>

    <div v-if="toastMessage" class="patient-toast-message" role="status">
      {{ toastMessage }}
    </div>
  </PatientPortalLayout>
</template>

<script setup>
import { UserRound } from '@lucide/vue'
import { patientProfile } from '~/data/patientPortal'

const form = reactive({ ...patientProfile })
const password = reactive({ current: '', next: '', confirm: '' })
const passwordError = ref('')
const toastMessage = ref('')

const showToast = (message) => {
  toastMessage.value = message
  window.setTimeout(() => {
    toastMessage.value = ''
  }, 2400)
}

const saveProfile = () => {
  showToast('تم حفظ التغييرات بنجاح')
}

const savePassword = () => {
  passwordError.value = ''
  if (password.next !== password.confirm) {
    passwordError.value = 'كلمة المرور الجديدة وتأكيدها غير متطابقين'
    return
  }
  password.current = ''
  password.next = ''
  password.confirm = ''
  showToast('تم تغيير كلمة المرور بنجاح')
}
</script>

<style scoped>
.profile-header {
  align-items: center;
  display: flex;
  gap: 22px;
  padding: 24px;
}

.profile-avatar {
  align-items: center;
  background-color: #ffffff;
  border: 1px solid #8dbbfb;
  border-radius: 22px;
  color: #115bd2;
  display: flex;
  height: 132px;
  justify-content: center;
  width: 148px;
}

.profile-heading h2 {
  font-size: 30px;
  font-weight: 900;
  margin: 0 0 8px;
}

.profile-heading p {
  color: #343434;
  font-size: 17px;
  font-weight: 800;
  margin: 0 0 14px;
}

.profile-meta {
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.profile-meta > span:not(.patient-status-badge) {
  background-color: #ffffff;
  border: 1px solid #8dbbfb;
  border-radius: 999px;
  color: #343434;
  font-size: 14px;
  font-weight: 900;
  padding: 8px 14px;
}

.password-grid {
  grid-template-columns: 1fr;
}

.profile-error {
  background-color: #ffe4e4;
  border: 1px solid #fda29b;
  border-radius: 14px;
  color: #b42318;
  font-size: 14px;
  font-weight: 900;
  margin: 0;
  padding: 11px 14px;
}

@media (max-width: 720px) {
  .profile-header {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>

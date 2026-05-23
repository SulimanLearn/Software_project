<template>
  <div class="doctor-profile-page" dir="rtl">
    <NavBar />

    <div class="doctor-profile-shell">
      <DoctorSidebar :doctor="profile" @logout="showLogoutModal = true" />

      <main class="doctor-profile-content">
        <header class="page-header">
          <h1>الملف الشخصي</h1>
          <p>إدارة بيانات الطبيب المهنية ومعلومات الحساب داخل مجمع الحياة الطبي.</p>
        </header>

        <section class="profile-header-card" aria-labelledby="doctor-profile-title">
          <div class="profile-avatar-card">
            <img :src="profile.avatar" :alt="profile.name">
          </div>

          <div class="profile-heading">
            <div class="profile-title">
              <span class="eyebrow">الملف المهني</span>
              <h2 id="doctor-profile-title">{{ profile.name }}</h2>
              <p>{{ profile.specialization }}</p>
            </div>

            <div class="profile-meta">
              <span class="status-pill">
                <BadgeCheck :size="17" :stroke-width="2.4" aria-hidden="true" />
                {{ profile.status }}
              </span>
              <span>{{ profile.clinic }}</span>
            </div>
          </div>

          <div class="profile-actions profile-actions-top">
            <button class="primary-button" type="button" @click="openEditProfile">
              <UserPen :size="18" :stroke-width="2.4" aria-hidden="true" />
              تعديل الملف
            </button>

            <label class="outline-button upload-button">
              <Camera :size="18" :stroke-width="2.4" aria-hidden="true" />
              تغيير الصورة
              <input type="file" accept="image/*" @change="updateProfileAvatar">
            </label>

            <button class="outline-button" type="button" @click="openPasswordModal">
              <KeyRound :size="18" :stroke-width="2.4" aria-hidden="true" />
              تغيير كلمة المرور
            </button>

            <button class="save-button" type="button" @click="saveCurrentProfile">
              <Save :size="18" :stroke-width="2.4" aria-hidden="true" />
              حفظ التغييرات
            </button>
          </div>
        </section>

        <section class="profile-layout" aria-label="تفاصيل ملف الطبيب">
          <div class="profile-main-column">
            <section class="dashboard-card" aria-labelledby="profile-info-title">
              <div class="section-header">
                <h2 id="profile-info-title">معلومات الطبيب</h2>
                <span>بيانات الحساب الأساسية</span>
              </div>

              <div class="info-grid">
                <article v-for="item in profileDetails" :key="item.label" class="info-card">
                  <component :is="item.icon" class="info-icon" :size="22" :stroke-width="2.2" aria-hidden="true" />
                  <div>
                    <span>{{ item.label }}</span>
                    <strong>{{ item.value }}</strong>
                  </div>
                </article>
              </div>
            </section>

            <section class="dashboard-card bio-card" aria-labelledby="profile-bio-title">
              <div class="section-header">
                <h2 id="profile-bio-title">نبذة عن الطبيب</h2>
                <span>السيرة المهنية المختصرة</span>
              </div>

              <p>{{ profile.bio }}</p>
            </section>
          </div>

          <aside class="profile-side-column" aria-label="ملخص الحساب">
            <section class="dashboard-card summary-card">
              <div class="summary-avatar">
                <img :src="profile.avatar" :alt="profile.name">
              </div>
              <strong>{{ profile.name }}</strong>
              <span>{{ profile.specialization }}</span>

              <div class="summary-list">
                <div>
                  <span>رقم الطبيب</span>
                  <strong>{{ profile.doctorId }}</strong>
                </div>
                <div>
                  <span>سنوات الخبرة</span>
                  <strong>{{ profile.experienceYears }} سنوات</strong>
                </div>
                <div>
                  <span>حالة الحساب</span>
                  <strong>{{ profile.status }}</strong>
                </div>
              </div>
            </section>
          </aside>
        </section>
      </main>
    </div>

    <div
      v-if="activeModal === 'edit'"
      class="modal-overlay"
      dir="rtl"
      @click.self="closeActiveModal"
    >
      <form
        class="profile-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-profile-title"
        @submit.prevent="saveProfile"
      >
        <div class="modal-header">
          <div>
            <h2 id="edit-profile-title">تعديل الملف الشخصي</h2>
            <p>تحديث بيانات الطبيب الظاهرة في لوحة التحكم.</p>
          </div>
          <button class="close-button" type="button" aria-label="إغلاق" @click="closeActiveModal">
            <X :size="20" :stroke-width="2.5" aria-hidden="true" />
          </button>
        </div>

        <div class="edit-avatar-row">
          <img :src="avatarPreview || profile.avatar" alt="معاينة الصورة الشخصية">
          <label class="outline-button upload-button">
            <Camera :size="17" :stroke-width="2.4" aria-hidden="true" />
            رفع/تغيير الصورة الشخصية
            <input type="file" accept="image/*" @change="handleAvatarUpload">
          </label>
        </div>

        <div class="modal-fields">
          <label class="form-field">
            <span>الاسم الكامل</span>
            <input v-model.trim="editForm.name" type="text" required>
          </label>

          <label class="form-field">
            <span>رقم الهاتف</span>
            <input v-model.trim="editForm.phone" type="tel" required>
          </label>

          <label class="form-field">
            <span>البريد الإلكتروني</span>
            <input v-model.trim="editForm.email" type="email" required>
          </label>

          <label class="form-field">
            <span>التخصص</span>
            <input v-model.trim="editForm.specialization" type="text" required>
          </label>

          <label class="form-field">
            <span>موقع العيادة</span>
            <input v-model.trim="editForm.clinic" type="text" required>
          </label>

          <label class="form-field">
            <span>سنوات الخبرة</span>
            <input v-model.number="editForm.experienceYears" type="number" min="0" required>
          </label>

          <label class="form-field bio-field">
            <span>السيرة المهنية</span>
            <textarea v-model.trim="editForm.bio" rows="4" required />
          </label>
        </div>

        <div class="modal-actions">
          <button class="save-button" type="submit">
            <Save :size="18" :stroke-width="2.4" aria-hidden="true" />
            حفظ التغييرات
          </button>
          <button class="cancel-button" type="button" @click="closeActiveModal">
            إلغاء
          </button>
        </div>
      </form>
    </div>

    <div
      v-if="activeModal === 'password'"
      class="modal-overlay"
      dir="rtl"
      @click.self="closeActiveModal"
    >
      <form
        class="profile-modal password-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="change-password-title"
        @submit.prevent="savePassword"
      >
        <div class="modal-header">
          <div>
            <h2 id="change-password-title">تغيير كلمة المرور</h2>
            <p>أدخل كلمة المرور الحالية ثم كلمة المرور الجديدة.</p>
          </div>
          <button class="close-button" type="button" aria-label="إغلاق" @click="closeActiveModal">
            <X :size="20" :stroke-width="2.5" aria-hidden="true" />
          </button>
        </div>

        <div class="modal-fields password-fields">
          <label class="form-field">
            <span>كلمة المرور الحالية</span>
            <input v-model="passwordForm.currentPassword" type="password" required>
          </label>

          <label class="form-field">
            <span>كلمة المرور الجديدة</span>
            <input v-model="passwordForm.newPassword" type="password" required>
          </label>

          <label class="form-field">
            <span>تأكيد كلمة المرور الجديدة</span>
            <input v-model="passwordForm.confirmPassword" type="password" required>
          </label>
        </div>

        <p v-if="passwordError" class="form-error" role="alert">
          {{ passwordError }}
        </p>

        <div class="modal-actions">
          <button class="save-button" type="submit">
            <KeyRound :size="18" :stroke-width="2.4" aria-hidden="true" />
            حفظ كلمة المرور
          </button>
          <button class="cancel-button" type="button" @click="closeActiveModal">
            إلغاء
          </button>
        </div>
      </form>
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
import {
  BadgeCheck,
  BriefcaseMedical,
  Camera,
  KeyRound,
  Mail,
  MapPin,
  Phone,
  Save,
  ShieldCheck,
  Stethoscope,
  UserPen,
  X
} from '@lucide/vue'
import { markRaw } from 'vue'
import DoctorSidebar from '~/components/doctor/DoctorSidebar.vue'

const defaultProfile = () => ({
  name: 'د. خالد السيد',
  specialization: 'أمراض القلب',
  doctorId: 'DOC-123',
  phone: '0591234567',
  email: 'khaled.doctor@example.com',
  clinic: 'مجمع الحياة الطبي - عيادة القلب',
  experienceYears: 10,
  status: 'نشط',
  avatar: '/images/doctor.png',
  bio: 'استشاري في أمراض القلب بخبرة واسعة في تشخيص ومتابعة الأمراض المزمنة، ومتابعة حالات ضغط الدم واضطرابات النبض وخطط العلاج الوقائية للمرضى.'
})

const icons = {
  id: markRaw(BadgeCheck),
  phone: markRaw(Phone),
  email: markRaw(Mail),
  clinic: markRaw(MapPin),
  experience: markRaw(BriefcaseMedical),
  specialty: markRaw(Stethoscope),
  status: markRaw(ShieldCheck)
}

const profile = useState('doctor-profile-demo', defaultProfile)
const showLogoutModal = ref(false)
const activeModal = ref(null)
const toastMessage = ref('')
const passwordError = ref('')
const avatarPreview = ref('')
let toastTimer

const isLoggedIn = useState('isLoggedIn', () => false)
const user = useState('user', () => ({ name: '' }))

const editForm = reactive({
  name: '',
  phone: '',
  email: '',
  specialization: '',
  clinic: '',
  experienceYears: 0,
  bio: ''
})

const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const profileDetails = computed(() => [
  { label: 'رقم الطبيب', value: profile.value.doctorId, icon: icons.id },
  { label: 'رقم الهاتف', value: profile.value.phone, icon: icons.phone },
  { label: 'البريد الإلكتروني', value: profile.value.email, icon: icons.email },
  { label: 'العيادة / الموقع', value: profile.value.clinic, icon: icons.clinic },
  { label: 'سنوات الخبرة', value: `${profile.value.experienceYears} سنوات`, icon: icons.experience },
  { label: 'التخصص', value: profile.value.specialization, icon: icons.specialty }
])

const openEditProfile = () => {
  Object.assign(editForm, {
    name: profile.value.name,
    phone: profile.value.phone,
    email: profile.value.email,
    specialization: profile.value.specialization,
    clinic: profile.value.clinic,
    experienceYears: profile.value.experienceYears,
    bio: profile.value.bio
  })
  avatarPreview.value = profile.value.avatar
  activeModal.value = 'edit'
}

const openPasswordModal = () => {
  passwordError.value = ''
  Object.assign(passwordForm, {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  activeModal.value = 'password'
}

const closeActiveModal = () => {
  activeModal.value = null
  passwordError.value = ''
}

const readAvatarFile = (event, callback) => {
  const file = event.target.files?.[0]
  if (!file) {
    return
  }

  const reader = new FileReader()
  reader.onload = () => {
    callback(String(reader.result || profile.value.avatar))
  }
  reader.readAsDataURL(file)
}

const handleAvatarUpload = (event) => {
  readAvatarFile(event, (avatar) => {
    avatarPreview.value = avatar
  })
}

const updateProfileAvatar = (event) => {
  readAvatarFile(event, (avatar) => {
    profile.value = {
      ...profile.value,
      avatar
    }
    showToast('تم تغيير الصورة الشخصية')
  })
}

const saveCurrentProfile = () => {
  showToast('تم حفظ التغييرات بنجاح')
}

const saveProfile = () => {
  profile.value = {
    ...profile.value,
    name: editForm.name || profile.value.name,
    phone: editForm.phone || profile.value.phone,
    email: editForm.email || profile.value.email,
    specialization: editForm.specialization || profile.value.specialization,
    clinic: editForm.clinic || profile.value.clinic,
    experienceYears: Number(editForm.experienceYears) || 0,
    bio: editForm.bio || profile.value.bio,
    avatar: avatarPreview.value || profile.value.avatar
  }

  closeActiveModal()
  showToast('تم تحديث الملف الشخصي بنجاح')
}

const savePassword = () => {
  passwordError.value = ''

  if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
    passwordError.value = 'يرجى تعبئة جميع الحقول'
    return
  }

  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    passwordError.value = 'كلمة المرور الجديدة وتأكيدها غير متطابقين'
    return
  }

  closeActiveModal()
  showToast('تم تغيير كلمة المرور بنجاح')
}

const showToast = (message) => {
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
.doctor-profile-page {
  min-height: 100vh;
  background-color: #ffffff;
  color: #101010;
}

.doctor-profile-shell {
  display: grid;
  grid-template-columns: 290px minmax(0, 1fr);
  min-height: calc(100vh - 85px);
}

.doctor-profile-content {
  min-width: 0;
  padding: 36px 40px 44px;
}

.page-header {
  margin-bottom: 24px;
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

.profile-header-card,
.dashboard-card {
  background-color: #eaf2fd;
  border: 1.5px solid #0b63f6;
  border-radius: 24px;
}

.profile-header-card {
  align-items: center;
  display: grid;
  gap: 22px;
  grid-template-columns: auto minmax(0, 1fr) minmax(280px, 0.9fr);
  margin-bottom: 24px;
  padding: 24px;
}

.profile-avatar-card,
.summary-avatar {
  align-items: center;
  background-color: #ffffff;
  border: 1px solid #8dbbfb;
  display: flex;
  justify-content: center;
  overflow: hidden;
}

.profile-avatar-card {
  border-radius: 22px;
  height: 132px;
  padding: 12px;
  width: 148px;
}

.profile-avatar-card img,
.summary-avatar img,
.edit-avatar-row img {
  height: 100%;
  object-fit: contain;
  width: 100%;
}

.profile-heading {
  align-items: flex-start;
  display: flex;
  flex-direction: column;
  gap: 14px;
  min-width: 0;
}

.eyebrow {
  color: #115bd2;
  display: block;
  font-size: 14px;
  font-weight: 900;
  margin-bottom: 8px;
}

.profile-title h2 {
  font-size: 30px;
  font-weight: 900;
  margin: 0 0 8px;
}

.profile-title p {
  color: #343434;
  font-size: 18px;
  font-weight: 900;
  margin: 0;
}

.profile-meta {
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.profile-meta > span:not(.status-pill) {
  background-color: #ffffff;
  border: 1px solid #8dbbfb;
  border-radius: 999px;
  color: #343434;
  font-size: 14px;
  font-weight: 900;
  padding: 8px 14px;
}

.status-pill {
  align-items: center;
  background-color: #dff3e7;
  border: 1px solid #9bd6b0;
  border-radius: 999px;
  color: #137446;
  display: inline-flex;
  font-size: 14px;
  font-weight: 900;
  gap: 7px;
  padding: 8px 14px;
}

.profile-actions {
  display: grid;
  gap: 12px;
}

.profile-actions-top {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.primary-button,
.outline-button,
.save-button,
.cancel-button {
  align-items: center;
  border-radius: 18px;
  cursor: pointer;
  display: inline-flex;
  font-family: inherit;
  font-size: 15px;
  font-weight: 900;
  gap: 8px;
  justify-content: center;
  min-height: 46px;
  padding: 10px 18px;
  text-decoration: none;
  transition: background-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
}

.primary-button,
.save-button {
  background-color: #115bd2;
  border: 1px solid #115bd2;
  color: #ffffff;
}

.outline-button,
.cancel-button {
  background-color: #ffffff;
  border: 1px solid #0b63f6;
  color: #115bd2;
}

.primary-button:hover,
.save-button:hover {
  background-color: #0b4db8;
  box-shadow: 0 8px 18px rgba(17, 91, 210, 0.22);
  transform: translateY(-1px);
}

.outline-button:hover,
.cancel-button:hover {
  background-color: #dcecff;
  transform: translateY(-1px);
}

.upload-button input {
  display: none;
}

.profile-layout {
  align-items: start;
  display: grid;
  gap: 24px;
  grid-template-columns: minmax(0, 1fr) minmax(280px, 360px);
}

.profile-main-column,
.profile-side-column {
  display: grid;
  gap: 24px;
  min-width: 0;
}

.dashboard-card {
  padding: 26px;
}

.dashboard-card:hover {
  box-shadow: 0 12px 26px rgba(17, 91, 210, 0.12);
}

.section-header {
  align-items: center;
  display: flex;
  gap: 16px;
  justify-content: space-between;
  margin-bottom: 20px;
}

.section-header.compact {
  align-items: flex-start;
  flex-direction: column;
  gap: 6px;
}

.section-header h2 {
  font-size: 22px;
  font-weight: 900;
  margin: 0;
}

.section-header span {
  color: #343434;
  font-size: 15px;
  font-weight: 800;
}

.info-grid {
  display: grid;
  gap: 14px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.info-card {
  align-items: center;
  background-color: #ffffff;
  border: 1px solid #8dbbfb;
  border-radius: 16px;
  display: flex;
  gap: 14px;
  min-width: 0;
  padding: 16px 18px;
}

.info-icon {
  background-color: #eaf2fd;
  border: 1px solid #c7ddfb;
  border-radius: 14px;
  box-sizing: content-box;
  color: #115bd2;
  flex: 0 0 auto;
  padding: 10px;
}

.info-card div {
  min-width: 0;
}

.info-card span,
.summary-card span,
.summary-list span {
  color: #5e6776;
  display: block;
  font-size: 13px;
  font-weight: 900;
}

.info-card strong,
.summary-card strong,
.summary-list strong {
  color: #101010;
  display: block;
  font-size: 16px;
  font-weight: 900;
  margin-top: 5px;
  overflow-wrap: anywhere;
  word-break: break-word;
}

.bio-card p {
  background-color: #ffffff;
  border: 1px solid #8dbbfb;
  border-radius: 18px;
  color: #172033;
  font-size: 17px;
  font-weight: 800;
  line-height: 1.9;
  margin: 0;
  min-height: 118px;
  overflow-wrap: anywhere;
  padding: 18px;
  word-break: break-word;
}

.summary-card {
  align-items: center;
  display: flex;
  flex-direction: column;
  text-align: center;
}

.summary-avatar {
  border-radius: 22px;
  height: 112px;
  margin-bottom: 14px;
  padding: 10px;
  width: 128px;
}

.summary-card > strong {
  font-size: 18px;
}

.summary-card > span {
  margin-top: 5px;
}

.summary-list {
  display: grid;
  gap: 10px;
  margin-top: 20px;
  width: 100%;
}

.summary-list div {
  background-color: #ffffff;
  border: 1px solid #8dbbfb;
  border-radius: 16px;
  padding: 13px 14px;
  text-align: right;
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

.profile-modal,
.confirmation-modal {
  background-color: #eaf2fd;
  border: 1.5px solid #0b63f6;
  border-radius: 24px;
  box-shadow: 0 18px 45px rgba(0, 0, 0, 0.12);
  max-height: calc(100vh - 48px);
  max-width: 100%;
  overflow-y: auto;
}

.profile-modal {
  padding: 28px;
  width: 760px;
}

.password-modal {
  width: 620px;
}

.modal-header {
  align-items: flex-start;
  display: flex;
  gap: 18px;
  justify-content: space-between;
  margin-bottom: 22px;
}

.modal-header h2,
.confirmation-modal h2 {
  font-size: 26px;
  font-weight: 900;
  margin: 0 0 8px;
}

.modal-header p {
  color: #343434;
  font-size: 15px;
  font-weight: 800;
  margin: 0;
}

.close-button {
  align-items: center;
  background-color: #ffffff;
  border: 1px solid #8dbbfb;
  border-radius: 14px;
  color: #115bd2;
  cursor: pointer;
  display: inline-flex;
  flex: 0 0 auto;
  height: 40px;
  justify-content: center;
  width: 42px;
}

.edit-avatar-row {
  align-items: center;
  background-color: #ffffff;
  border: 1px solid #8dbbfb;
  border-radius: 18px;
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 18px;
  padding: 16px;
}

.edit-avatar-row img {
  background-color: #f7fbff;
  border: 1px solid #cfe1fb;
  border-radius: 18px;
  height: 86px;
  padding: 8px;
  width: 96px;
}

.modal-fields {
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.password-fields {
  grid-template-columns: 1fr;
}

.form-field {
  display: grid;
  gap: 8px;
}

.form-field span {
  color: #343434;
  font-size: 14px;
  font-weight: 900;
}

.form-field input,
.form-field textarea {
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
}

.form-field textarea {
  line-height: 1.8;
  padding: 12px 14px;
  resize: vertical;
}

.form-field input:focus,
.form-field textarea:focus {
  border-color: #0b63f6;
  box-shadow: 0 0 0 3px rgba(90, 153, 239, 0.2);
}

.bio-field {
  grid-column: 1 / -1;
}

.form-error {
  background-color: #ffe4e4;
  border: 1px solid #fda29b;
  border-radius: 14px;
  color: #b42318;
  font-size: 14px;
  font-weight: 900;
  margin: 16px 0 0;
  padding: 11px 14px;
}

.modal-actions {
  display: flex;
  gap: 14px;
  justify-content: flex-start;
  margin-top: 24px;
}

.modal-actions button {
  min-width: 124px;
}

.confirmation-modal {
  padding: 42px 44px 34px;
  text-align: center;
  width: 560px;
}

.confirmation-modal p {
  font-size: 22px;
  font-weight: 800;
  margin: 0 0 30px;
}

.confirmation-modal .modal-actions {
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
  .doctor-profile-shell {
    grid-template-columns: 240px minmax(0, 1fr);
  }

  .doctor-profile-content {
    padding: 32px 24px 48px;
  }

  .profile-header-card {
    grid-template-columns: auto minmax(0, 1fr);
  }

  .profile-actions-top {
    grid-column: 1 / -1;
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  .profile-layout {
    grid-template-columns: 1fr;
  }

}

@media (max-width: 820px) {
  .profile-actions-top {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .info-grid,
  .profile-side-column {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 720px) {
  .doctor-profile-shell {
    display: flex;
    flex-direction: column;
  }

  .doctor-profile-content {
    padding: 32px 18px 44px;
  }

  .page-header h1 {
    font-size: 26px;
  }

  .profile-header-card {
    align-items: stretch;
    grid-template-columns: 1fr;
    text-align: right;
  }

  .profile-avatar-card {
    height: 118px;
    width: 132px;
  }

  .profile-heading {
    gap: 12px;
  }

  .section-header {
    align-items: flex-start;
    flex-direction: column;
    gap: 6px;
  }

  .modal-fields {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 560px) {
  .doctor-profile-content {
    padding: 28px 14px 36px;
  }

  .profile-header-card,
  .dashboard-card {
    border-radius: 20px;
    padding: 20px 16px;
  }

  .profile-actions-top,
  .profile-actions {
    grid-template-columns: 1fr;
  }

  .primary-button,
  .outline-button,
  .save-button,
  .cancel-button {
    width: 100%;
  }

  .profile-title h2 {
    font-size: 24px;
  }

  .modal-overlay {
    padding: 16px;
  }

  .profile-modal {
    border-radius: 20px;
    padding: 24px 20px;
  }

  .modal-actions,
  .edit-avatar-row {
    align-items: stretch;
    flex-direction: column;
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

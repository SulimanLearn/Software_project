<template>
  <PharmacistDashboardLayout title="الملف الشخصي" subtitle="إدارة بيانات حساب الصيدلي ومعلومات التواصل.">
    <section class="pharmacist-profile-header-card">
      <div class="pharmacist-profile-avatar">
        <UserRound :size="44" :stroke-width="2.2" aria-hidden="true" />
      </div>
      <div class="pharmacist-profile-heading">
        <span class="pharmacist-eyebrow">ملف الصيدلي</span>
        <h2>{{ form.name }}</h2>
        <p>{{ form.email }}</p>
        <div class="pharmacist-profile-meta">
          <PharmacistStatusBadge :status="form.status" />
          <span>{{ form.phone }}</span>
          <span>{{ form.pharmacistId }}</span>
        </div>
      </div>
    </section>

    <div class="pharmacist-grid-two">
      <section class="pharmacist-card" aria-labelledby="profile-form-title">
        <div class="pharmacist-section-header">
          <h2 id="profile-form-title">البيانات الشخصية</h2>
          <span>يمكن ربط الحقول بواجهة API لاحقاً</span>
        </div>

        <form class="pharmacist-form-grid" @submit.prevent="saveProfile">
          <label class="pharmacist-form-field full">
            <span>الاسم</span>
            <input v-model.trim="form.name" type="text" required>
          </label>
          <label class="pharmacist-form-field">
            <span>البريد الإلكتروني</span>
            <input v-model.trim="form.email" type="email" required>
          </label>
          <label class="pharmacist-form-field">
            <span>رقم الهاتف</span>
            <input v-model.trim="form.phone" type="tel" required>
          </label>
          <label class="pharmacist-form-field">
            <span>رقم الصيدلي</span>
            <input v-model.trim="form.pharmacistId" type="text" required>
          </label>
          <label class="pharmacist-form-field">
            <span>الصيدلية/العيادة</span>
            <input v-model.trim="form.pharmacyName" type="text" required>
          </label>
          <label class="pharmacist-form-field">
            <span>حالة الحساب</span>
            <select v-model="form.status">
              <option>نشط</option>
              <option>غير نشط</option>
            </select>
          </label>
          <div class="pharmacist-action-row full">
            <button class="pharmacist-save-button" type="submit">حفظ التغييرات</button>
            <button class="pharmacist-cancel-button" type="button">تعديل الملف</button>
          </div>
        </form>
      </section>

      <section class="pharmacist-card" aria-labelledby="password-title">
        <div class="pharmacist-section-header">
          <h2 id="password-title">تغيير كلمة المرور</h2>
          <span>استخدم كلمة مرور قوية لحماية الحساب</span>
        </div>

        <form class="pharmacist-form-grid password-grid" @submit.prevent="savePassword">
          <label class="pharmacist-form-field full">
            <span>كلمة المرور الحالية</span>
            <input v-model="password.current" type="password" required>
          </label>
          <label class="pharmacist-form-field full">
            <span>كلمة المرور الجديدة</span>
            <input v-model="password.next" type="password" required>
          </label>
          <label class="pharmacist-form-field full">
            <span>تأكيد كلمة المرور الجديدة</span>
            <input v-model="password.confirm" type="password" required>
          </label>
          <p v-if="passwordError" class="pharmacist-error full">{{ passwordError }}</p>
          <div class="pharmacist-action-row full">
            <button class="pharmacist-save-button" type="submit">تغيير كلمة المرور</button>
          </div>
        </form>
      </section>
    </div>

    <div v-if="toastMessage" class="pharmacist-toast-message" role="status">
      {{ toastMessage }}
    </div>
  </PharmacistDashboardLayout>
</template>

<script setup lang="ts">
import { UserRound } from '@lucide/vue'
import { pharmacistProfile } from '~/data/pharmacistPortal'

const form = reactive({ ...pharmacistProfile })
const password = reactive({ current: '', next: '', confirm: '' })
const passwordError = ref('')
const toastMessage = ref('')

const showToast = (message: string) => {
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
.password-grid {
  grid-template-columns: 1fr;
}

.full {
  grid-column: 1 / -1;
}
</style>

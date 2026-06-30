<template>
    <NavBar />
  <div class="auth-page" dir="rtl">
    <div class="auth-card">
      <NuxtLink to="/login" class="back">→ العودة لتسجيل الدخول</NuxtLink>

      <h1>إعادة تعيين كلمة المرور</h1>
      <p>أدخل بريدك الإلكتروني وسنرسل لك رمز التحقق.</p>

      <form @submit.prevent="sendCode">
        <label>البريد الإلكتروني</label>
        <div class="input-wrap">
          <Mail class="input-icon" :size="18" aria-hidden="true" />
          <input
            v-model="email"
            type="email"
            placeholder="ahmed@gmail.com"
            required
          />
        </div>

        <button type="submit" :disabled="loading">
          {{ loading ? 'جاري الإرسال...' : 'إرسال الرمز' }}
        </button>
      </form>

      <p v-if="message" class="success">{{ message }}</p>
      <p v-if="error" class="error">{{ error }}</p>
    </div>
  </div>
</template>

<script setup>
import { Mail } from '@lucide/vue'

const email = ref('')
const loading = ref(false)
const message = ref('')
const error = ref('')

const resetEmail = useState('resetEmail', () => '')

const sendCode = async () => {
  loading.value = true
  error.value = ''
  message.value = ''

  try {
    // لاحقًا بدّل الرابط برابط Laravel API
    // await $fetch('http://localhost:8000/api/forgot-password', {
    //   method: 'POST',
    //   body: { email: email.value }
    // })

    resetEmail.value = email.value

    message.value = 'تم إرسال رمز التحقق إلى بريدك الإلكتروني'

    setTimeout(() => {
      navigateTo('/reset/verify')
    }, 800)
  } catch (err) {
    error.value = 'حدث خطأ أثناء إرسال الرمز'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  background:
    radial-gradient(circle at 10% 15%, #64c7ff30 0 9%, transparent 9.5%),
    radial-gradient(circle at 90% 12%, #ffffffd9 0 10%, transparent 10.5%),
    radial-gradient(circle at 18% 88%, #0ea5e91f 0 11%, transparent 11.5%),
    linear-gradient(145deg, #f9fbff 0%, #eaf6ff 52%, #f5fbff 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  position: relative;
  overflow: hidden;
}

.auth-page::before,
.auth-page::after {
  content: "";
  position: absolute;
  border: 1px solid #62bdf14f;
  border-radius: 28px;
  pointer-events: none;
}

.auth-page::before {
  width: 130px;
  height: 46px;
  top: 18%;
  right: 9%;
  transform: rotate(42deg);
}

.auth-page::after {
  width: 92px;
  height: 92px;
  left: 8%;
  bottom: 14%;
  border-radius: 50%;
}

.auth-card {
  width: 100%;
  max-width: 480px;
  background: linear-gradient(180deg, #f7fbff 0%, #daeafb 100%);
  border-radius: 24px;
  padding: 32px 26px;
  border: 1px solid #7fb6f4;
  box-shadow: 0 22px 55px #0b4ea526, 0 8px 20px #0b4ea51c;
  position: relative;
  z-index: 1;
}

.back {
  color: #1976d2;
  text-decoration: none;
  font-size: 14px;
}

h1 {
  margin: 24px 0 10px;
  color: #123b68;
}

p {
  color: #64748b;
}

label {
  display: block;
  margin: 22px 0 8px;
  color: #14345f;
  font-weight: 600;
  font-size: 17px;
}

.input-wrap {
  width: 100%;
  position: relative;
}

.input-icon {
  position: absolute;
  top: 50%;
  right: 13px;
  transform: translateY(-50%);
  color: #2b78d4;
  pointer-events: none;
}

input {
  width: 100%;
  height: 44px;
  border: 1px solid #9fc8f4;
  border-radius: 11px;
  padding: 0 42px 0 12px;
  font-size: 15px;
  background-color: #ffffffc9;
  color: #10233f;
  transition: border-color 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease, transform 0.2s ease;
}

input::placeholder {
  color: #7f97b3;
}

input:focus {
  outline: none;
  border-color: #0654CB;
  background-color: #ffffff;
  box-shadow: 0 0 0 4px #2d79f326;
  transform: translateY(-1px);
}

button {
  width: 100%;
  height: 44px;
  margin-top: 24px;
  border: none;
  border-radius: 11px;
  background: linear-gradient(135deg, #0654CB 0%, #2d79f3 100%);
  color: white;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 12px 24px #0654cb30;
  transition: transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease;
}

button:not(:disabled):hover {
  transform: translateY(-2px);
  box-shadow: 0 16px 28px #0654cb3d;
}

button:disabled {
  opacity: 0.7;
}

.success {
  color: #16a34a;
  margin-top: 16px;
}

.error {
  color: #dc2626;
  margin-top: 16px;
}

@media (max-width: 520px) {
  .auth-card {
    padding: 28px 18px;
    border-radius: 20px;
  }

  h1 {
    font-size: 22px;
  }
}
</style>

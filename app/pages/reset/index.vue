<template>
    <NavBar />
  <div class="auth-page" dir="rtl">
    <div class="auth-card">
      <NuxtLink to="/login" class="back">→ العودة لتسجيل الدخول</NuxtLink>

      <h1>إعادة تعيين كلمة المرور</h1>
      <p>أدخل بريدك الإلكتروني وسنرسل لك رمز التحقق.</p>

      <form @submit.prevent="sendCode">
        <label>البريد الإلكتروني</label>
        <input
          v-model="email"
          type="email"
          placeholder="example@email.com"
          required
        />

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
  background: linear-gradient(180deg, #f8fbff, #eaf5ff);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.auth-card {
  width: 100%;
  max-width: 480px;
  background: white;
  border-radius: 24px;
  padding: 36px;
  box-shadow: 0 20px 60px rgba(20, 90, 160, 0.12);
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
  color: #1e293b;
  font-weight: 600;
}

input {
  width: 100%;
  height: 52px;
  border: 1px solid #cbd5e1;
  border-radius: 14px;
  padding: 0 16px;
  font-size: 15px;
}

button {
  width: 100%;
  height: 52px;
  margin-top: 24px;
  border: none;
  border-radius: 14px;
  background: #1688e8;
  color: white;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
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
</style>

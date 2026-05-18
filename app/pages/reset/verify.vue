<template>
    <NavBar />

  <div class="auth-page" dir="rtl">
    <div class="auth-card">
      <NuxtLink to="/reset" class="back">→ رجوع</NuxtLink>

      <h1>إدخال رمز التحقق</h1>
      <p>أدخل الرمز المكوّن من 6 أرقام الذي تم إرساله إلى بريدك.</p>

      <div class="otp-box">
        <input
          v-for="(_, index) in otp"
          :key="index"
          v-model="otp[index]"
          maxlength="1"
          inputmode="numeric"
          @input="moveNext(index, $event)"
          @keydown.backspace="moveBack(index, $event)"
          ref="otpInputs"
        />
      </div>

      <button @click="verifyCode" :disabled="loading">
        {{ loading ? 'جاري التحقق...' : 'متابعة' }}
      </button>

      <p v-if="error" class="error">{{ error }}</p>
    </div>
  </div>
</template>

<script setup>
const otp = ref(['', '', '', '', '', ''])
const otpInputs = ref([])
const loading = ref(false)
const error = ref('')

const resetEmail = useState('resetEmail', () => '')

onMounted(() => {
  if (!resetEmail.value) {
    navigateTo('/forgot-password')
  }
})

const moveNext = (index, event) => {
  const value = event.target.value

  if (!/^\d$/.test(value)) {
    otp.value[index] = ''
    return
  }

  if (index < 5) {
    otpInputs.value[index + 1]?.focus()
  }
}

const moveBack = (index, event) => {
  if (!otp.value[index] && index > 0) {
    otpInputs.value[index - 1]?.focus()
  }
}

const verifyCode = async () => {
  const code = otp.value.join('')

  if (code.length !== 6) {
    error.value = 'أدخل الرمز كاملًا'
    return
  }

  loading.value = true
  error.value = ''

  try {
    // لاحقًا بدّل الرابط برابط Laravel API
    // await $fetch('http://localhost:8000/api/verify-otp', {
    //   method: 'POST',
    //   body: {
    //     email: resetEmail.value,
    //     otp: code
    //   }
    // })

    navigateTo('/reset/reset')
  } catch (err) {
    error.value = 'رمز التحقق غير صحيح'
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

.otp-box {
  display: flex;
  gap: 10px;
  justify-content: center;
  margin: 28px 0;
  direction: ltr;
}

.otp-box input {
  width: 52px;
  height: 58px;
  border: 1px solid #cbd5e1;
  border-radius: 14px;
  text-align: center;
  font-size: 22px;
  font-weight: bold;
}

button {
  width: 100%;
  height: 52px;
  border: none;
  border-radius: 14px;
  background: #1688e8;
  color: white;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
}

.error {
  color: #dc2626;
  margin-top: 16px;
}
</style>

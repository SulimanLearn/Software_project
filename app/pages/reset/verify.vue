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
          :placeholder="String(index + 1)"
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
    navigateTo('/reset')
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
  border: 1px solid #9fc8f4;
  border-radius: 11px;
  text-align: center;
  font-size: 22px;
  font-weight: bold;
  background-color: #ffffffc9;
  color: #10233f;
  transition: border-color 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease, transform 0.2s ease;
}

.otp-box input::placeholder {
  color: #9bb0c7;
}

.otp-box input:focus {
  outline: none;
  border-color: #0654CB;
  background-color: #ffffff;
  box-shadow: 0 0 0 4px #2d79f326;
  transform: translateY(-1px);
}

button {
  width: 100%;
  height: 44px;
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

  .otp-box {
    gap: 6px;
  }

  .otp-box input {
    width: 42px;
    height: 50px;
    font-size: 19px;
  }
}
</style>

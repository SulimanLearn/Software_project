<template>
    <div>
        <NavBar />
        <div class="container">
            <div class="box-login">
                <form @submit.prevent="login">
                    <div class="info">
                        <h1>تسجيل الدخول</h1>
                        <p>مرحباً بعودتك! سجّل دخولك للمتابعة</p>
                    </div> <!-- .end info -->
                    <div class="fields">
                        <div class="email field">
                            <label for="email-inputfield">البريد الالكتروني</label>
                            <div class="input-wrap">
                                <Mail class="input-icon" :size="18" aria-hidden="true" />
                                <input type="email" id="email-inputfield" placeholder="ahmed@gmail.com" v-model="email"/>
                            </div>
                        </div>
                        <div class="password field">
                            <label for="password-inputfield">كلمة المرور</label>
                            <div class="input-wrap">
                                <LockKeyhole class="input-icon" :size="18" aria-hidden="true" />
                                <input
                                    :type="showPassword ? 'text' : 'password'"
                                    id="password-inputfield"
                                    class="password-input"
                                    placeholder="********"
                                    v-model="password"
                                />
                                <button
                                    class="password-toggle"
                                    type="button"
                                    :aria-label="showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'"
                                    @click="showPassword = !showPassword"
                                >
                                    <EyeOff v-if="showPassword" :size="18" aria-hidden="true" />
                                    <Eye v-else :size="18" aria-hidden="true" />
                                </button>
                            </div>
                            <p class="error-message" v-if="errorMessage">{{ errorMessage }}</p>
                            <div class="remmember-and-forget-password">
                                <div class="remmember-me-btn">
                                    <input type="checkbox" id="remmember-me">
                                    <label for="remmember-me">تذكرني</label>
                                </div>
                                <NuxtLink class="Forgot-password" to="/reset">هل نسيت كلمة المرور؟</NuxtLink>
                            </div>
                        </div>
                    </div> <!-- .end fields -->
                    <div class="btns">
                        <button class="login-btn" type="submit">تسجيل الدخول</button>
                        <div class="dont-have-acount">
                            
                            <p>ليس لديك حساب؟ <NuxtLink class="register-now" to="/register">سجل الان</NuxtLink></p>
                        </div>
                        <div class="dividing-line">
                            <div></div>
                            <p>او</p>
                            <div></div>
                        </div>
                        
                        <div class="login-with-google-apple">
                            <a href="" class="login-with-google">
                            تسجيل الدخول عبر جوجل
                            <img src="/images/Google__G__logo.png" alt="Google icon">
                            </a>
                            <a href="" class="login-with-apple">
                                تسجيل الدخول عبر أبل
                                <img src="/images/apple-icon.png" alt="Google icon">
                            </a>
                        </div>
                        
                    </div> <!-- .end btns -->
                </form> <!-- .end form -->
            </div> <!-- .end box-login -->
        </div> <!-- .end container -->
        <Footer />
    </div>
</template>


<style scoped>
    .container {
        direction: rtl;
        min-height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        user-select: none;
        padding: 20px;
        background:
            radial-gradient(circle at 10% 15%, #64c7ff30 0 9%, transparent 9.5%),
            radial-gradient(circle at 90% 12%, #ffffffd9 0 10%, transparent 10.5%),
            radial-gradient(circle at 18% 88%, #0ea5e91f 0 11%, transparent 11.5%),
            linear-gradient(145deg, #f9fbff 0%, #eaf6ff 52%, #f5fbff 100%);
        position: relative;
        overflow: hidden;
    }
    .container::before,
    .container::after {
        content: "";
        position: absolute;
        border: 1px solid #62bdf14f;
        border-radius: 28px;
        pointer-events: none;
    }
    .container::before {
        width: 130px;
        height: 46px;
        top: 18%;
        right: 9%;
        transform: rotate(42deg);
    }
    .container::after {
        width: 92px;
        height: 92px;
        left: 8%;
        bottom: 14%;
        border-radius: 50%;
    }
    .box-login {
        width: 100%;
        max-width: 529px;
        background: linear-gradient(180deg, #f7fbff 0%, #daeafb 100%);
        padding: 32px 26px;
        border: 1px solid #7fb6f4;
        box-shadow: 0 22px 55px #0b4ea526, 0 8px 20px #0b4ea51c;
        border-radius: 24px;
        position: relative;
        z-index: 1;
    }
    
    form {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: self-start;
        gap: 34px;
    }
    .info {
        line-height: 38px;
    }
    .info h1 {
        font-weight: 700;
        font-size: 28px;
        margin: 0;
    }
    .info p{
        font-weight: 400;
        font-size: 17px;
        margin: 0;
    }
    .fields, input {
        width: 100%;
    }
    .field {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 10px;
        margin-bottom: 16px;
    }
    label {
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
        border-radius: 11px;
        border: 1px solid #9fc8f4;
        background-color: #ffffffc9;
        color: #10233f;
        padding: 0 42px 0 12px;
        transition: border-color 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease, transform 0.2s ease;
    }
    .password-input {
        padding-left: 42px;
    }
    .password-toggle {
        position: absolute;
        top: 50%;
        left: 13px;
        width: auto;
        height: auto;
        padding: 0;
        border: none;
        border-radius: 0;
        background: transparent;
        color: #2b78d4;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transform: translateY(-50%);
        box-shadow: none;
        transition: color 0.2s ease;
    }
    .password-toggle:hover,
    .password-toggle:focus {
        color: #0654CB;
        outline: none;
        box-shadow: none;
        transform: translateY(-50%);
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
    .error-message {
        width: 100%;
        color: #d7263d;
        font-size: 15px;
        font-weight: 500;
        margin: 0;
    }
    .remmember-and-forget-password {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .remmember-me-btn {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 6px;
        font-weight: 400;
    }
    .remmember-me-btn label {
        font-weight: 300;
    }
    .remmember-me-btn input {
        width: 17px;
        height: 17px;
        padding: 0;
        accent-color: #0654CB;
        transform: none;
    }
    .remmember-me-btn input:focus {
        transform: none;
        box-shadow: 0 0 0 3px #2d79f326;
    }
    .remmember-me-btn input,
    label {
        cursor: pointer;
    }
    .remmember-and-forget-password .Forgot-password {
        text-decoration: none;
        color: #2d79f3;
        transition: color 0.2s ease;
    }
    .remmember-and-forget-password .Forgot-password:hover,
    .dont-have-acount .register-now:hover {
        color: #0654CB;
    }
    button {
        width: 100%;
        height: 44px;
        border-radius: 11px;
        font-size: 18px;
        font-weight: 700;
        transition: transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease;
    }
    .btns {
        width: 100%;
    }
    .dont-have-acount {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .dont-have-acount .register-now {   
        text-decoration: none;
        color: #2d79f3;
    }
    .login-btn {
        margin-top: -13px;
        background: linear-gradient(135deg, #0654CB 0%, #2d79f3 100%);
        color: white;
        border: none;
        cursor: pointer;
        box-shadow: 0 12px 24px #0654cb30;
    }
    .login-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 16px 28px #0654cb3d;
    }
    .dividing-line {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 8px;
    }
    .dividing-line div {
        flex: 1;
        height: 1px;
        background-color: #0654CB;
    }
    .login-with-google-apple {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 30px;
        margin-right: -18px;
    }
    .login-with-google-apple .login-with-google, .login-with-apple {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 5px;
    }
    .login-with-google-apple a {
        text-decoration: none;
        height: 44px;
        border-radius: 11px;
        border: 1px solid #0654CB;
        color: #063f95;
        background-color: #ffffff8f;
        padding: 0 10px;
        transition: transform 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease;
    }
    .login-with-google-apple a:hover {
        background-color: #ffffff;
        box-shadow: 0 10px 20px #0654cb1c;
        transform: translateY(-2px);
    }
    .login-with-google-apple img {
        width: 25px;
        height: 25px;
    }
    @media (max-width: 1030px) {

    .box-login {
        width: 460px;
        padding: 32px 22px;
    }

    .info h1 {
        font-size: 25px;
    }

    .info p {
        font-size: 15px;
    }

    label {
        font-size: 17px;
    }

    button {
        font-size: 18px;
    }

    .login-with-google-apple {
        gap: 18px;
        margin-right: 0;
        flex-wrap: wrap;
    }

    .login-with-google-apple a {
        width: 180px;
        display: flex;
        justify-content: center;
        align-items: center;
    }
}



@media (max-width: 720px) {

    .container {
        padding: 20px 14px;
    }

    .box-login {
        width: 100%;
        max-width: 420px;
        padding: 28px 18px;
        border-radius: 20px;
    }

    form {
        gap: 24px;
    }

    .info {
        line-height: 30px;
    }

    .info h1 {
        font-size: 22px;
    }

    .info p {
        font-size: 14px;
    }

    label {
        font-size: 16px;
    }

    input {
        height: 42px;
        font-size: 14px;
    }

    .remmember-and-forget-password {
        gap: 12px;
        align-items: flex-start;
    }

    .Forgot-password {
        font-size: 14px;
    }

    button {
        height: 42px;
        font-size: 17px;
    }

    .dont-have-acount {
        font-size: 14px;
        text-align: center;
    }

    .login-with-google-apple {
        width: 100%;
        flex-direction: column;
        gap: 14px;
    }

    .login-with-google-apple a {
        width: 100%;
        height: 42px;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .login-with-google-apple img {
        width: 22px;
        height: 22px;
    }
}
</style>
<script setup>
import { Eye, EyeOff, LockKeyhole, Mail } from '@lucide/vue'

const email = ref('')
const password = ref('')
const errorMessage = ref('')
const showPassword = ref(false)

const isLoggedIn = useState('isLoggedIn', () => false)

const login = async () => {

  errorMessage.value = ''

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (!emailPattern.test(email.value)) {
    errorMessage.value = 'البريد الإلكتروني غير صحيح'
    return
  }

  if (password.value.length < 6) {
    errorMessage.value = 'كلمة المرور قصيرة'
    return
  }

  if (
    email.value === 'admin@gmail.com' &&
    password.value === '123456'
  ) {

    // تغيير حالة تسجيل الدخول
    isLoggedIn.value = true

    // الانتقال للصفحة الرئيسية
    await navigateTo('/')

  } else {
    errorMessage.value = 'البريد الإلكتروني أو كلمة المرور غير صحيحة'
  }

}
</script>


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
                        <input type="email" id="email-inputfield" placeholder="email@example.com" v-model="email"/>
                        </div>
                        <div class="password field">
                            <label for="password-inputfield">كلمة المرور</label>
                            <input type="password" id="password-inputfield" placeholder="........" v-model="password"/>
                            <p class="error-message" v-if="errorMessage">
  {{ errorMessage }}
</p>
                            <div class="remmember-and-forget-password">
                                <div class="remmember-me-btn">
                                    <input type="checkbox" id="remmember-me">
                                    <label for="remmember-me">ذكرني</label>
                                </div>
                                <NuxtLink class="Forgot-password" to="">هل نسيت كلمة المرور؟</NuxtLink>
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
        background: radial-gradient(circle at 12% 10%, #b4d5ff38 0 10%, transparent 10.5%),
            radial-gradient(circle at 88% 18%, #ffffffd1 0 11%, transparent 11.5%),
            linear-gradient(180deg, #f9fbff 0%, #e9f5ff 100%)
    }
    .box-login {
        width: 529px;
        /* height: 676px; */
        background-color: #DAE6F8;
        padding: 36px 25px 30px 25px;
        border: 1px solid #0654CB;
        box-shadow: 3px 3px 6px 0px #00000029;
        border-radius: 25px;
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
        font-weight: 400;
        font-size: 19px;
    }
    input {
        height: 44px;
        border-radius: 11px;
        border: 1px solid #0654CB;
        background-color: inherit;
        padding: 0 10px;
    }
    input:focus {
        border: 2px solid #0654CB;
        outline: none;
        box-shadow: none;
    }
    .error-message {
        width: 100%;
        color: #e63946;
        font-size: 15px;
        font-weight: 500;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);
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
        font-weight: 400;
    }
    .remmember-me-btn label {
        font-weight: 300;
    }
    .remmember-me-btn input, label {
        cursor: pointer;
    }
    .remmember-and-forget-password .Forgot-password {
        text-decoration: none;
        color: #2d79f3;
    }
    button {
        width: 100%;
        height: 44px;
        border-radius: 11px;
        font-size: 20px;
        font-weight: 700;
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
        background-color: #0654CB;
        color: white;
        border: none;
        cursor: pointer;
    }
    .create-new-account-btn {
        background-color: inherit;
        border: 1px solid #0654CB;
        color: #000000;
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
        color: #000000;
        background-color: inherit;
        padding: 0 10px;
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
    const email = ref('')
const password = ref('')
const errorMessage = ref('')

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


<template>
    <div>
        <NavBar />

        <div class="container">
            <div class="box-login">

                <form @submit.prevent="register">
                    <div class="info">
                        <h1>انشاء حساب</h1>
                        <p>ابدا رحلتك الصحية و انضم الى مجمع الحياة الطبي</p>
                    </div>
                    <p v-if="errors.general" class="error general-error">
                        {{ errors.general }}
                    </p>

                    <div class="fields">
                        <div class="first-last-names">
                            <div class="first-name field">
                                <label for="first-name">الاسم الاول</label>
                                <input type="text" id="first-name" v-model="form.firstName"/>
                                <span class="error">{{ errors.firstName }}</span>
                            </div>
                            <div class="last-name field">
                                <label for="last-name">اسم العائلة</label>
                                <input type="text" id="last-name" v-model="form.lastName"/>
                                <span class="error">{{ errors.lastName }}</span>
                            </div>
                        </div>
                        <div class="email field">
                            <label for="email">البريد الالكتروني</label>
                            <input type="email" id="email" v-model="form.email"/>
                            <span class="error">{{ errors.email }}</span>
                        </div>
                        <div class="phone-number field">
                            <label for="phone">رقم الهاتف</label>
                            <input type="tel" id="phone" v-model="form.phone"/>
                            <span class="error">{{ errors.phone }}</span>
                        </div>
                        <div class="passwords">
                            <div class="password field">
                                <label for="password">كلمة المرور</label>
                                <input type="password" id="password" v-model="form.password"/>
                                <span class="error">{{ errors.password }}</span>
                            </div>
                            <div class="confirm-password field">
                                <label for="confirm-password">تأكيد كلمة المرور</label>
                                <input type="password" id="confirm-password" v-model="form.confirmPassword"/>
                                <span class="error">{{ errors.confirmPassword }}</span>
                            </div>
                        </div>

                    </div>
                    <div class="btns">
                        <button 
                            class="create-account" 
                            type="submit"
                            :disabled="loading"
                        >
                            {{ loading ? 'جاري الانشاء...' : 'انشاء حساب' }}
                        </button>
                        <div class="dividing-line">
                            <div></div>
                            <p>لديك حساب ؟</p>
                            <div></div>
                        </div>
                        <NuxtLink to="/login" class="login-btn">
                            تسجيل الدخول
                        </NuxtLink>
                    </div>

                </form>

            </div>
        </div>
    </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const loading = ref(false)

const form = reactive({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
})

const errors = reactive({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    general: ''
})

const resetErrors = () => {
    Object.keys(errors).forEach(key => errors[key] = '')
}

const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

const validate = () => {
    resetErrors()
    let valid = true

    if (!form.firstName.trim()) {
        errors.firstName = 'الاسم الاول مطلوب'
        valid = false
    }

    if (!form.lastName.trim()) {
        errors.lastName = 'اسم العائلة مطلوب'
        valid = false
    }

    if (!form.email || !isValidEmail(form.email)) {
        errors.email = 'بريد غير صالح'
        valid = false
    }

    if (!form.phone || form.phone.length < 10) {
        errors.phone = 'رقم غير صالح'
        valid = false
    }

    if (!form.password) {
        errors.password = 'كلمة المرور مطلوبة'
        valid = false
    } else if (form.password.length < 6) {
        errors.password = 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'
        valid = false
    }

    if (!form.confirmPassword) {
        errors.confirmPassword = 'تأكيد كلمة المرور مطلوب'
        valid = false
    } else if (form.password !== form.confirmPassword) {
        errors.confirmPassword = 'كلمات المرور غير متطابقة'
        valid = false
    }

    return valid
}

const registerUser = async (data) => {
    return new Promise((resolve) => {
        setTimeout(() => resolve({ success: true }), 1500)
    })
}

const register = async () => {
    if (!validate()) return

    loading.value = true

    try {
        const payload = {
            first_name: form.firstName,
            last_name: form.lastName,
            email: form.email,
            phone: form.phone,
            password: form.password
        }

        const res = await registerUser(payload)

        if (res.success) {
            router.push('/login')
        }

    } catch (e) {
        errors.general = 'حدث خطأ، حاول مرة اخرى'
    } finally {
        loading.value = false
    }
}
</script>

<style scoped>
.container {
    direction: rtl;
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
    background: radial-gradient(circle at 12% 10%, #b4d5ff38 0 10%, transparent 10.5%),
        radial-gradient(circle at 88% 18%, #ffffffd1 0 11%, transparent 11.5%),
        linear-gradient(180deg, #f9fbff 0%, #e9f5ff 100%);
}

.box-login {
    width: 100%;
    max-width: 529px;
    background-color: #DAE6F8;
    padding: 30px 25px;
    border: 1px solid #0654CB;
    box-shadow: 3px 3px 6px #00000029;
    border-radius: 25px;
}

form {
    display: flex;
    flex-direction: column;
    gap: 30px;
}

.field {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

label {
    font-size: 17px;
}

input {
    height: 44px;
    border-radius: 11px;
    border: 1px solid #0654CB;
    padding: 0 10px;
    background-color: inherit;
}

input:focus {
    outline: none;
    box-shadow: 0 0 0 2px #0654CB33;
}

.error {
    color: red;
    font-size: 13px;
}

.general-error {
    text-align: center;
    font-weight: bold;
}

.first-last-names,
.passwords {
    display: flex;
    gap: 10px;
}

.first-name,
.last-name,
.password,
.confirm-password {
    width: 100%;
}

button {
    width: 100%;
    height: 44px;
    border-radius: 11px;
    font-size: 18px;
    font-weight: bold;
}

.create-account {
    background-color: #0654CB;
    color: white;
    border: none;
    cursor: pointer;
}

.create-account:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.login-btn {
    text-decoration: none;
    color: black;
    border: 1px solid #0654CB;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 44px;
    border-radius: 11px;
}

.dividing-line {
    display: flex;
    align-items: center;
    gap: 8px;
}

.dividing-line div {
    flex: 1;
    height: 1px;
    background-color: #0654CB;
}

@media (max-width: 480px) {
    .first-last-names,
    .passwords {
        flex-direction: column;
    }
}
</style>
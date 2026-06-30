<template>
    <NavBar />
    <div>

        <div class="container">
            <div class="box-login">

                <form @submit.prevent="register" novalidate>
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
                                <div class="input-wrap">
                                    <User class="input-icon" :size="18" aria-hidden="true" />
                                    <input
                                        type="text"
                                        id="first-name"
                                        v-model="form.firstName"
                                        placeholder="أحمد"
                                        required
                                        :aria-invalid="Boolean(errors.firstName)"
                                    />
                                </div>
                                <span v-if="errors.firstName" class="error">{{ errors.firstName }}</span>
                            </div>
                            <div class="last-name field">
                                <label for="last-name">اسم العائلة</label>
                                <div class="input-wrap">
                                    <UserRound class="input-icon" :size="18" aria-hidden="true" />
                                    <input
                                        type="text"
                                        id="last-name"
                                        v-model="form.lastName"
                                        placeholder="محمود"
                                        required
                                        :aria-invalid="Boolean(errors.lastName)"
                                    />
                                </div>
                                <span v-if="errors.lastName" class="error">{{ errors.lastName }}</span>
                            </div>
                        </div>
                        <div class="email field">
                            <label for="email">البريد الالكتروني</label>
                            <div class="input-wrap">
                                <Mail class="input-icon" :size="18" aria-hidden="true" />
                                <input
                                    type="email"
                                    id="email"
                                    v-model="form.email"
                                    placeholder="ahmed@gmail.com"
                                    required
                                    :aria-invalid="Boolean(errors.email)"
                                />
                            </div>
                            <span v-if="errors.email" class="error">{{ errors.email }}</span>
                        </div>
                        <div class="phone-number field">
                            <label for="phone">رقم الهاتف</label>
                            <div class="input-wrap">
                                <Phone class="input-icon" :size="18" aria-hidden="true" />
                                <input
                                    type="tel"
                                    id="phone"
                                    v-model="form.phone"
                                    placeholder="0591234567"
                                    required
                                    :aria-invalid="Boolean(errors.phone)"
                                />
                            </div>
                            <span v-if="errors.phone" class="error">{{ errors.phone }}</span>
                        </div>
                        <div class="passwords">
                            <div class="password field">
                                <label for="password">كلمة المرور</label>
                                <div class="input-wrap">
                                    <LockKeyhole class="input-icon" :size="18" aria-hidden="true" />
                                    <input
                                        :type="showPassword ? 'text' : 'password'"
                                        id="password"
                                        class="password-input"
                                        v-model="form.password"
                                        placeholder="********"
                                        required
                                        :aria-invalid="Boolean(errors.password)"
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
                                <span v-if="errors.password" class="error">{{ errors.password }}</span>
                            </div>
                            <div class="confirm-password field">
                                <label for="confirm-password">تأكيد كلمة المرور</label>
                                <div class="input-wrap">
                                    <ShieldCheck class="input-icon" :size="18" aria-hidden="true" />
                                    <input
                                        :type="showConfirmPassword ? 'text' : 'password'"
                                        id="confirm-password"
                                        class="password-input"
                                        v-model="form.confirmPassword"
                                        placeholder="********"
                                        required
                                        :aria-invalid="Boolean(errors.confirmPassword)"
                                    />
                                    <button
                                        class="password-toggle"
                                        type="button"
                                        :aria-label="showConfirmPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'"
                                        @click="showConfirmPassword = !showConfirmPassword"
                                    >
                                        <EyeOff v-if="showConfirmPassword" :size="18" aria-hidden="true" />
                                        <Eye v-else :size="18" aria-hidden="true" />
                                    </button>
                                </div>
                                <span v-if="errors.confirmPassword" class="error">{{ errors.confirmPassword }}</span>
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
    <Footer />
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Eye, EyeOff, LockKeyhole, Mail, Phone, ShieldCheck, User, UserRound } from '@lucide/vue'

const { register: registerUser, authLoading, getApiErrorMessage } = useAuth()

const apiLoading = computed(() => authLoading.value)
const uiLoading = ref(false)
const loading = computed(() => apiLoading.value || uiLoading.value)
const showPassword = ref(false)
const showConfirmPassword = ref(false)

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

const isStrongPassword = (password) => {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/.test(password)
}

const validate = () => {
    resetErrors()
    let valid = true

    if (!form.firstName.trim()) {
        errors.firstName = 'يرجى إدخال الاسم الأول'
        valid = false
    }

    if (!form.lastName.trim()) {
        errors.lastName = 'يرجى إدخال اسم العائلة'
        valid = false
    }

    if (!form.email.trim()) {
        errors.email = 'يرجى إدخال البريد الإلكتروني'
        valid = false
    } else if (!isValidEmail(form.email)) {
        errors.email = 'يرجى إدخال البريد الإلكتروني'
        valid = false
    }

    if (!form.phone.trim()) {
        errors.phone = 'يرجى إدخال رقم الهاتف'
        valid = false
    }

    if (!form.password) {
        errors.password = 'يرجى إدخال كلمة المرور'
        valid = false
    } else if (!isStrongPassword(form.password)) {
        errors.password = 'يجب أن تكون كلمة المرور 8 أحرف على الأقل وتحتوي على حرف كبير وحرف صغير ورقم ورمز'
        valid = false
    }

    if (!form.confirmPassword) {
        errors.confirmPassword = 'يرجى إدخال كلمة المرور'
        valid = false
    } else if (form.password !== form.confirmPassword) {
        errors.confirmPassword = 'كلمتا المرور غير متطابقتين'
        valid = false
    }

    return valid
}

const register = async () => {
    if (!validate()) return

    uiLoading.value = true

    try {
        await registerUser({
            name: `${form.firstName} ${form.lastName}`.trim(),
            email: form.email,
            password: form.password
        })

        await navigateTo('/patient')
    } catch (e) {
        errors.general = getApiErrorMessage(e)
    } finally {
        uiLoading.value = false
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
    color: #14345f;
    font-weight: 600;
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
    padding: 0 42px 0 12px;
    background-color: #ffffffc9;
    color: #10233f;
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

input[aria-invalid="true"] {
    border-color: #e5484d;
    box-shadow: 0 0 0 3px #e5484d1a;
}

.error {
    color: #d7263d;
    font-size: 13px;
    line-height: 1.5;
    min-height: 20px;
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
    transition: transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease;
}

.create-account {
    background: linear-gradient(135deg, #0654CB 0%, #2d79f3 100%);
    color: white;
    border: none;
    cursor: pointer;
    box-shadow: 0 12px 24px #0654cb30;
}

.create-account:not(:disabled):hover {
    transform: translateY(-2px);
    box-shadow: 0 16px 28px #0654cb3d;
}

.create-account:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.login-btn {
    text-decoration: none;
    color: #063f95;
    border: 1px solid #0654CB;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 44px;
    border-radius: 11px;
    background-color: #ffffff8f;
    transition: transform 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease;
}

.login-btn:hover {
    background-color: #ffffff;
    box-shadow: 0 10px 20px #0654cb1c;
    transform: translateY(-2px);
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

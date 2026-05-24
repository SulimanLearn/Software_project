<template>

    <div class="profile-page">

        <!-- Navbar -->
        <NavBar />

        <div class="parent-page">

            <!-- Sidebar -->
            <SideBarPatient class="side-bar" />

            <!-- Main Container -->
            <div class="patient-container" dir="rtl">

                <div class="wrapper-container">

                    <!-- Header -->
                    <div class="info">

                        <h1>
                            ملفي الشخصي
                        </h1>

                        <p>
                            يمكنك تعديل بياناتك الشخصية من هنا
                        </p>

                    </div>

                    <!-- Profile Box -->
                    <div class="profile-box">

                        <!-- Row -->
                        <div class="fields-row">

                            <!-- First Name -->
                            <div class="field">

                                <label>
                                    الاسم الأول
                                </label>

                                <input
                                    type="text"
                                    v-model="profile.firstName"
                                    placeholder="ادخل الاسم الأول"
                                >

                            </div>

                            <!-- Last Name -->
                            <div class="field">

                                <label>
                                    اسم العائلة
                                </label>

                                <input
                                    type="text"
                                    v-model="profile.lastName"
                                    placeholder="ادخل اسم العائلة"
                                >

                            </div>

                        </div>

                        <!-- Row -->
                        <div class="fields-row">

                            <!-- Phone -->
                            <div class="field">

                                <label>
                                    الهاتف
                                </label>

                                <input
                                    type="text"
                                    v-model="profile.phone"
                                    placeholder="0590000000"
                                >

                            </div>

                            <!-- Email -->
                            <div class="field">

                                <label>
                                    البريد الإلكتروني
                                </label>

                                <input
                                    type="email"
                                    v-model="profile.email"
                                    placeholder="example@gmail.com"
                                >

                            </div>

                        </div>

                        <!-- Row -->
                        <div class="fields-row">

                            <!-- Age -->
                            <div class="field">

                                <label>
                                    العمر
                                </label>

                                <input
                                    type="number"
                                    v-model="profile.age"
                                    placeholder="20"
                                >

                            </div>

                            <!-- Blood -->
                            <div class="field">

                                <label>
                                    فصيلة الدم
                                </label>

                                <select v-model="profile.bloodType">

                                    <option value="">
                                        اختر فصيلة الدم
                                    </option>

                                    <option value="A+">
                                        A+
                                    </option>

                                    <option value="A-">
                                        A-
                                    </option>

                                    <option value="B+">
                                        B+
                                    </option>

                                    <option value="B-">
                                        B-
                                    </option>

                                    <option value="AB+">
                                        AB+
                                    </option>

                                    <option value="AB-">
                                        AB-
                                    </option>

                                    <option value="O+">
                                        O+
                                    </option>

                                    <option value="O-">
                                        O-
                                    </option>

                                </select>

                            </div>

                        </div>

                        <!-- Error -->
                        <p
                            class="error-message"
                            v-if="errorMessage"
                        >

                            {{ errorMessage }}

                        </p>

                        <!-- Success -->
                        <p
                            class="success-message"
                            v-if="successMessage"
                        >

                            {{ successMessage }}

                        </p>

                        <!-- Buttons -->
                        <div class="btn-container">

                            <button
                                class="save-btn"
                                @click="saveProfile"
                                :disabled="loading"
                            >

                                {{ loading ? 'جاري الحفظ...' : 'حفظ التغييرات' }}

                            </button>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    </div>

</template>

<script setup>

import { ref , reactive , onMounted } from 'vue'

/* ========================= */
/* Loading */
/* ========================= */

const loading = ref(false)

/* ========================= */
/* Messages */
/* ========================= */

const errorMessage = ref('')
const successMessage = ref('')

/* ========================= */
/* Profile */
/* ========================= */

const profile = reactive({

    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    age: '',
    bloodType: ''

})

/* ========================= */
/* Get Profile */
/* ========================= */

const getProfile = async () => {

    try {

        /*
        const response = await $fetch(
            'http://localhost:8000/api/patient/profile'
        )

        profile.firstName = response.firstName
        profile.lastName = response.lastName
        profile.phone = response.phone
        profile.email = response.email
        profile.age = response.age
        profile.bloodType = response.bloodType
        */

        /* Dummy Data */

        profile.firstName = 'محمد'
        profile.lastName = 'ابو حليمة'
        profile.phone = '0591234567'
        profile.email = 'mohammed@gmail.com'
        profile.age = 22
        profile.bloodType = 'B+'

    } catch(error) {

        console.log(error)

    }

}

/* ========================= */
/* Validation */
/* ========================= */

const validateForm = () => {

    if(
        !profile.firstName ||
        !profile.lastName ||
        !profile.phone ||
        !profile.email ||
        !profile.age ||
        !profile.bloodType
    ) {

        errorMessage.value = 'يرجى تعبئة جميع الحقول'
        return false

    }

    if(profile.phone.length < 10) {

        errorMessage.value = 'رقم الهاتف غير صحيح'
        return false

    }

    if(!profile.email.includes('@')) {

        errorMessage.value = 'البريد الإلكتروني غير صالح'
        return false

    }

    return true

}

/* ========================= */
/* Save Profile */
/* ========================= */

const saveProfile = async () => {

    errorMessage.value = ''
    successMessage.value = ''

    const isValid = validateForm()

    if(!isValid) {
        return
    }

    loading.value = true

    try {

        /*
        await $fetch(
            'http://localhost:8000/api/patient/profile',
            {
                method: 'PUT',

                body: {
                    firstName: profile.firstName,
                    lastName: profile.lastName,
                    phone: profile.phone,
                    email: profile.email,
                    age: profile.age,
                    bloodType: profile.bloodType
                }
            }
        )
        */

        successMessage.value = 'تم حفظ التغييرات بنجاح'

    } catch(error) {

        errorMessage.value = 'حدث خطأ أثناء الحفظ'

        console.log(error)

    } finally {

        loading.value = false

    }

}

/* ========================= */
/* Lifecycle */
/* ========================= */

onMounted(() => {

    getProfile()

})

</script>

<style scoped>

/* ========================= */
/* Parent */
/* ========================= */

.parent-page {
    position: relative;
}

/* ========================= */
/* Sidebar */
/* ========================= */

.side-bar {

    position: fixed;

    right: 0;
    top: 85px;

    height: 100vh;
}

/* ========================= */
/* Main Container */
/* ========================= */

.patient-container {

    margin-right: 252px;

    padding: 30px;
}

.wrapper-container {

    max-width: 1206px;

    display: flex;
    flex-direction: column;

    gap: 25px;
}

/* ========================= */
/* Header */
/* ========================= */

.info h1 {

    font-size: 32px;
    font-weight: 700;

    margin-bottom: 8px;
}

.info p {

    font-size: 18px;

    color: #6B7280;

    margin: 0;
}

/* ========================= */
/* Profile Box */
/* ========================= */

.profile-box {

    width: 100%;

    background-color: #F9FBFF;

    border: 1px solid #0654CB;

    border-radius: 24px;

    padding: 35px;

    box-sizing: border-box;

    display: flex;
    flex-direction: column;

    gap: 28px;
}

/* ========================= */
/* Rows */
/* ========================= */

.fields-row {

    display: flex;

    gap: 20px;
}

/* ========================= */
/* Field */
/* ========================= */

.field {

    flex: 1;

    display: flex;
    flex-direction: column;

    gap: 10px;
}

.field label {

    font-size: 18px;
    font-weight: 600;

    color: #111827;
}

/* ========================= */
/* Inputs */
/* ========================= */

.field input,
.field select {

    height: 52px;

    border: 1px solid #5C99F5;

    border-radius: 14px;

    background-color: #EEF4FF;

    padding: 0 18px;

    font-size: 16px;

    outline: none;

    transition: 0.25s ease;
}

.field input:focus,
.field select:focus {

    border-color: #2563EB;

    box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.12);
}

/* ========================= */
/* Messages */
/* ========================= */

.error-message {

    color: #DC2626;

    font-size: 15px;

    margin: 0;
}

.success-message {

    color: #16A34A;

    font-size: 15px;

    margin: 0;
}

/* ========================= */
/* Button */
/* ========================= */

.btn-container {

    display: flex;

    justify-content: flex-start;

    margin-top: 10px;
}

.save-btn {

    width: 180px;
    height: 50px;

    background-color: #0654CB;

    color: white;

    border: none;

    border-radius: 50px;

    font-size: 16px;
    font-weight: 700;

    cursor: pointer;

    transition: 0.25s ease;
}

.save-btn:hover {

    background-color: #0548AD;
}

.save-btn:active {

    transform: scale(0.97);
}

.save-btn:disabled {

    opacity: 0.7;

    cursor: not-allowed;
}

/* ========================= */
/* Responsive */
/* ========================= */

@media (max-width: 992px) {

    .side-bar {

        position: relative;

        width: 100%;
        height: auto;
    }

    .patient-container {

        margin-right: 0;

        padding: 20px;
    }

    .fields-row {

        flex-direction: column;
    }

}

@media (max-width: 768px) {

    .wrapper-container {
        gap: 18px;
    }

    .info h1 {
        font-size: 26px;
    }

    .info p {
        font-size: 16px;
    }

    .profile-box {
        padding: 20px;
    }

}

@media (max-width: 576px) {

    .patient-container {
        padding: 15px;
    }

    .profile-box {
        padding: 15px;
    }

    .save-btn {
        width: 100%;
    }

}

</style>
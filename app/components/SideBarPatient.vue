<script setup>

const showLogoutModal = ref(false)

const openLogoutModal = () => {

    showLogoutModal.value = true
}

const closeLogoutModal = () => {

    showLogoutModal.value = false
}

const logout = () => {

    // هون لاحقاً تحذف التوكن او السيشن
    // localStorage.removeItem("token")

    navigateTo("/")

}

</script>

<template>

    <div class="container-sideBarPatient">

        <!-- Patient Info -->
        <div class="patient-info">

            <div class="patient-img">
                <img src="/images/patientImage.png" alt="">
            </div>

            <h1 class="patient-name">
                محمد ابو حليمة
            </h1>

            <p>مريض</p>

        </div>

        <!-- Links -->
        <NuxtLink class="link" to="/patient">
            نظرة عامة
        </NuxtLink>

        <NuxtLink class="link" to="/patient/appointments">
            مواعيدي
        </NuxtLink>

        <NuxtLink class="link" to="/patient/records">
            السجل الطبي
        </NuxtLink>

        <NuxtLink class="link" to="/patient/profile">
            ملفي
        </NuxtLink>

        <!-- Logout -->
        <button
            class="link logout-btn"
            @click="openLogoutModal"
        >
            خروج
        </button>

        <!-- ========================= -->
        <!-- Logout Modal -->
        <!-- ========================= -->

        <div
            v-if="showLogoutModal"
            class="modal-overlay"
        >

            <div class="logout-modal">

                <div class="modal-icon">
                    ⚠️
                </div>

                <h2>
                    تسجيل الخروج
                </h2>

                <p>
                    هل أنت متأكد أنك تريد تسجيل الخروج؟
                </p>

                <div class="modal-actions">

                    <button
                        class="cancel-btn"
                        @click="closeLogoutModal"
                    >
                        إلغاء
                    </button>

                    <button
                        class="confirm-btn"
                        @click="logout"
                    >
                        نعم، تسجيل الخروج
                    </button>

                </div>

            </div>

        </div>

    </div>

</template>

<style scoped>

/* ========================= */
/* Sidebar */
/* ========================= */

.container-sideBarPatient {

    direction: rtl;

    padding: 20px 0;

    background-color: #EAF0F9;

    width: 250px;
    height: 100vh;

    display: flex;
    flex-direction: column;
    align-items: center;

    gap: 30px;
}

/* ========================= */
/* Patient Info */
/* ========================= */

.patient-info {

    border-radius: 30px;

    padding: 10px;

    width: 68%;
    height: 156px;

    border: #0654CB 1px solid;

    display: flex;
    flex-direction: column;
    align-items: center;

    gap: 15px;
}

.patient-img {

    border: 1px solid #707070;

    border-radius: 14px;

    width: 70px;
    height: 57px;

    overflow: hidden;

    background-color: white;

    display: flex;
    justify-content: center;
    align-items: center;
}

.patient-img img {

    width: 100%;
    height: 100%;

    object-fit: cover;
}

.patient-info h1 {

    font-weight: 700;
    font-size: 15px;

    margin: 0;
}

.patient-info p {

    font-size: 15px;
    font-weight: 400;

    margin: 0;
}

/* ========================= */
/* Links */
/* ========================= */

.link {

    text-decoration: none;

    font-size: 15px;
    font-weight: 700;

    color: #1f2937;

    width: 176px;
    height: 44px;

    border-radius: 12px;

    display: flex;
    align-items: center;

    padding-right: 18px;

    box-sizing: border-box;

    transition: all 0.25s ease;
}

.link:hover {

    background-color: #5C99F5;

    color: white;

    transform: translateX(-4px);
}

/* Active Route */

.router-link-exact-active {

    background-color: #0654CB;

    color: white;
}

/* ========================= */
/* Logout Button */
/* ========================= */

.logout-btn {

    border: none;

    background: transparent;

    cursor: pointer;

    text-align: right;
}

.logout-btn:hover {

    background-color: #DC2626;
}

/* ========================= */
/* Modal Overlay */
/* ========================= */

.modal-overlay {

    position: fixed;

    top: 0;
    right: 0;
    left: 0;
    bottom: 0;

    background-color: rgba(0, 0, 0, 0.45);

    display: flex;
    justify-content: center;
    align-items: center;

    z-index: 999;
}

/* ========================= */
/* Modal */
/* ========================= */

.logout-modal {

    width: 420px;
    max-width: 95%;

    background-color: white;

    border-radius: 24px;

    padding: 30px;

    text-align: center;

    animation: modalAnimation 0.25s ease;
}

@keyframes modalAnimation {

    from {

        opacity: 0;
        transform: scale(0.9);
    }

    to {

        opacity: 1;
        transform: scale(1);
    }

}

/* ========================= */
/* Modal Content */
/* ========================= */

.modal-icon {

    font-size: 50px;

    margin-bottom: 15px;
}

.logout-modal h2 {

    margin: 0 0 10px 0;

    font-size: 28px;
}

.logout-modal p {

    color: #6B7280;

    font-size: 16px;

    margin-bottom: 30px;
}

/* ========================= */
/* Modal Buttons */
/* ========================= */

.modal-actions {

    display: flex;

    gap: 15px;
}

.cancel-btn,
.confirm-btn {

    flex: 1;

    height: 48px;

    border: none;
    border-radius: 14px;

    font-size: 15px;
    font-weight: 700;

    cursor: pointer;

    transition: 0.25s ease;
}

/* Cancel */

.cancel-btn {

    background-color: #F3F4F6;

    color: #111827;
}

.cancel-btn:hover {

    background-color: #E5E7EB;
}

/* Confirm */

.confirm-btn {

    background-color: #DC2626;

    color: white;
}

.confirm-btn:hover {

    background-color: #B91C1C;
}

/* ========================= */
/* Responsive */
/* ========================= */

@media (max-width: 992px) {

    .container-sideBarPatient {

        width: 100%;
        height: auto;

        padding: 20px;
    }

}

@media (max-width: 576px) {

    .logout-modal {

        padding: 22px;
    }

    .modal-actions {

        flex-direction: column;
    }

}

</style>
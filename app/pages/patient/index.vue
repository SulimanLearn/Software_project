<template>
    <div class="patient-page">

        <div class="parent-page">

            <!-- Navbar -->
            <NavBar />

            <!-- Sidebar -->
            <SideBarPatient class="side-bar" />

            <!-- Main Container -->
            <div class="patient-container" dir="rtl">

                <div class="wrapper-container">

                    <!-- Welcome -->
                    <div class="info">

                        <p>
                            👋 مرحباً بعودتك
                        </p>

                        <h1>
                            {{ patient.name }}
                        </h1>

                    </div>

                    <!-- Statistics Cards -->
                    <div class="cards">

                        <div
                            class="card"
                            v-for="stat in stats"
                            :key="stat.title"
                        >

                            <div class="info-card">

                                <p>
                                    {{ stat.number }}
                                </p>

                                <h1>
                                    {{ stat.title }}
                                </h1>

                            </div>

                        </div>

                    </div>

                    <!-- Upcoming Appointments -->
                    <div class="upcoming-dates">

                        <h1 class="title">
                            المواعيد القادمة
                        </h1>

                        <div class="cards-upcoming-dates">

                            <div
                                class="card-upcoming-dates"
                                v-for="appointment in appointments"
                                :key="appointment.id"
                            >

                                <!-- Left -->
                                <div class="date-info">

                                    <!-- Date -->
                                    <div class="date-box">

                                        <p>
                                            {{ appointment.day }}
                                        </p>

                                        <p>
                                            {{ appointment.month }}
                                        </p>

                                    </div>

                                    <!-- Info -->
                                    <div class="card-upcoming-dates-info">

                                        <h1>
                                            {{ appointment.doctor }}
                                        </h1>

                                        <p>
                                            {{ appointment.specialty }}
                                        </p>

                                        <p class="date">

                                            <strong>
                                                {{ appointment.time }}
                                            </strong>

                                        </p>

                                    </div>

                                </div>

                                <!-- Buttons -->
                                <div class="btns">

                                    <button class="confirm-btn">

                                        {{ appointment.status }}

                                    </button>

                                    <button
                                        class="cancel-btn"
                                        @click="cancelAppointment(appointment.id)"
                                    >

                                        الغاء

                                    </button>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    </div>
</template>

<script setup>

import { ref , onMounted } from 'vue'

/* ========================= */
/* Patient */
/* ========================= */

const patient = ref({
    name: 'محمد ابو حليمة'
})

/* ========================= */
/* Statistics */
/* ========================= */

const stats = ref([
    {
        title: 'اجمالي المواعيد',
        number: 284
    },
    {
        title: 'المواعيد القادمة',
        number: 18
    },
    {
        title: 'التقارير الطبية',
        number: 7
    }
])

/* ========================= */
/* Appointments */
/* ========================= */

const appointments = ref([
    {
        id: 1,
        day: '04',
        month: 'ابريل',
        doctor: 'د.محمد ابو حليمة',
        specialty: 'امراض القلب',
        time: '09:00 صباحاً',
        status: 'مؤكدة'
    },
    {
        id: 2,
        day: '12',
        month: 'ابريل',
        doctor: 'د.محمد ابو حليمة',
        specialty: 'الجلدية',
        time: '11:30 صباحاً',
        status: 'مؤكدة'
    },
    {
        id: 3,
        day: '20',
        month: 'ابريل',
        doctor: 'د.محمد ابو حليمة',
        specialty: 'العظام',
        time: '02:00 مساءً',
        status: 'مؤكدة'
    }
])

/* ========================= */
/* Backend Functions */
/* ========================= */

const getPatientDashboard = async () => {

    try {

        /*
        const response = await $fetch(
            'http://localhost:8000/api/patient/dashboard'
        )

        patient.value = response.patient
        stats.value = response.stats
        appointments.value = response.appointments
        */

        console.log('Dashboard Loaded')

    } catch(error) {

        console.log(error)

    }

}

/* ========================= */
/* Cancel Appointment */
/* ========================= */

const cancelAppointment = async (id) => {

    try {

        /*
        await $fetch(
            `http://localhost:8000/api/appointments/${id}`,
            {
                method: 'DELETE'
            }
        )
        */

        appointments.value = appointments.value.filter(
            appointment => appointment.id !== id
        )

    } catch(error) {

        console.log(error)

    }

}

/* ========================= */
/* Lifecycle */
/* ========================= */

onMounted(() => {

    getPatientDashboard()

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
/* Welcome */
/* ========================= */

.info {
    line-height: 1.2;
}

.info p {

    font-weight: 400;
    font-size: 20px;

    color: #4B5563;

    margin: 0;
}

.info h1 {

    font-weight: 700;
    font-size: 32px;

    margin-top: 10px;
}

/* ========================= */
/* Cards */
/* ========================= */

.cards {

    display: flex;

    gap: 20px;
}

.card {

    flex: 1;

    background-color: #EAF0F9;

    border: 1px solid #0654CB;

    border-radius: 20px;

    padding: 25px;

    height: 170px;

    display: flex;
    align-items: flex-end;

    transition: 0.3s ease;
}

.card:hover {

    transform: translateY(-4px);

    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
}

.info-card {
    line-height: 1.3;
}

.info-card h1 {

    font-size: 20px;
    font-weight: 400;

    margin: 0;
}

.info-card p {

    font-size: 35px;
    font-weight: 700;

    margin: 0 0 10px 0;

    color: #0654CB;
}

/* ========================= */
/* Upcoming Dates */
/* ========================= */

.upcoming-dates {

    width: 100%;

    border: 1px solid #0654CB;

    border-radius: 20px;

    padding: 25px;

    box-sizing: border-box;
}

.title {

    margin-top: 0;
    margin-bottom: 25px;
}

.cards-upcoming-dates {

    display: flex;
    flex-direction: column;

    gap: 20px;
}

/* ========================= */
/* Appointment Card */
/* ========================= */

.card-upcoming-dates {

    display: flex;

    justify-content: space-between;
    align-items: center;

    border: 1px solid #D6E4FF;

    background-color: #F9FBFF;

    border-radius: 20px;

    padding: 20px;

    transition: 0.3s ease;
}

.card-upcoming-dates:hover {

    transform: translateY(-3px);

    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.06);
}

/* ========================= */
/* Date Info */
/* ========================= */

.date-info {

    display: flex;

    align-items: center;

    gap: 25px;
}

/* ========================= */
/* Date Box */
/* ========================= */

.date-box {

    background-color: #5C99F5;

    color: white;

    width: 120px;
    height: 105px;

    border-radius: 20px;

    display: flex;
    flex-direction: column;

    justify-content: center;
    align-items: center;

    border: 1px solid #0654CB;

    line-height: 1.1;
}

.date-box p:first-child {

    font-size: 32px;
    font-weight: 700;

    margin: 0;
}

.date-box p:last-child {

    font-size: 18px;

    margin-top: 10px;
}

/* ========================= */
/* Appointment Info */
/* ========================= */

.card-upcoming-dates-info {
    line-height: 1.5;
}

.card-upcoming-dates-info h1 {

    font-size: 24px;
    font-weight: 700;

    margin: 0;
}

.card-upcoming-dates-info p {

    font-size: 18px;

    margin: 5px 0;

    color: #4B5563;
}

.card-upcoming-dates-info .date {

    font-size: 15px;

    color: #111827;
}

/* ========================= */
/* Buttons */
/* ========================= */

.btns {

    display: flex;

    gap: 10px;
}

button {

    border: none;

    border-radius: 50px;

    padding: 10px 18px;

    cursor: pointer;

    font-weight: 700;

    transition: 0.25s ease;
}

.confirm-btn {

    background-color: #5C99F5;

    color: white;
}

.confirm-btn:hover {
    background-color: #3b82f6;
}

.cancel-btn {

    background-color: #FEE2E2;

    color: #DC2626;
}

.cancel-btn:hover {
    background-color: #fecaca;
}

button:active {
    transform: scale(0.97);
}

/* ========================= */
/* Responsive */
/* ========================= */

@media (max-width: 1200px) {

    .cards {
        flex-wrap: wrap;
    }

    .card {
        width: 48%;
    }

}

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

    .cards {
        flex-direction: column;
    }

    .card {
        width: 100%;
    }

    .card-upcoming-dates {

        flex-direction: column;

        align-items: flex-start;

        gap: 20px;
    }

    .btns {
        width: 100%;
    }

    .btns button {
        flex: 1;
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

    .date-info {

        flex-direction: column;

        align-items: flex-start;
    }

    .date-box {

        width: 100px;
        height: 90px;
    }

    .date-box p:first-child {
        font-size: 26px;
    }

    .card-upcoming-dates-info h1 {
        font-size: 20px;
    }

    .card-upcoming-dates-info p {
        font-size: 16px;
    }

}

@media (max-width: 576px) {

    .patient-container {
        padding: 15px;
    }

    .upcoming-dates {
        padding: 15px;
    }

    .card {

        height: 140px;

        padding: 18px;
    }

    .info-card p {
        font-size: 28px;
    }

    .info-card h1 {
        font-size: 18px;
    }

    .btns {
        flex-direction: column;
    }

}

</style>
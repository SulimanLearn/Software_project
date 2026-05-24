<template>
    <div>
        <NavBar />
        <h1>My Appointments</h1>
    </div>
</template>

<script setup>

import { ref , computed , onMounted } from 'vue'

/* ========================= */
/* Active Category */
/* ========================= */

const activeCategory = ref('upcoming')

/* ========================= */
/* Appointments */
/* ========================= */

const appointments = ref([
    {
        id: 1,
        category: 'upcoming',
        day: '04',
        month: 'ابريل',
        doctor: 'د.محمد ابو حليمة',
        specialty: 'امراض القلب',
        time: '09:00 صباحاً'
    },

    {
        id: 2,
        category: 'upcoming',
        day: '10',
        month: 'ابريل',
        doctor: 'د.محمد ابو حليمة',
        specialty: 'العظام',
        time: '11:30 صباحاً'
    },

    {
        id: 3,
        category: 'completed',
        day: '18',
        month: 'مارس',
        doctor: 'د.محمد ابو حليمة',
        specialty: 'الجلدية',
        time: '02:00 مساءً'
    },

    {
        id: 4,
        category: 'cancelled',
        day: '25',
        month: 'مارس',
        doctor: 'د.محمد ابو حليمة',
        specialty: 'العيون',
        time: '12:00 مساءً'
    }
])

/* ========================= */
/* Computed */
/* ========================= */

const filteredAppointments = computed(() => {

    return appointments.value.filter(
        appointment => appointment.category === activeCategory.value
    )

})

const sectionTitle = computed(() => {

    if(activeCategory.value === 'upcoming') {
        return 'المواعيد القادمة'
    }

    if(activeCategory.value === 'completed') {
        return 'المواعيد المكتملة'
    }

    return 'المواعيد الملغية'

})

/* ========================= */
/* Backend Functions */
/* ========================= */

const getAppointments = async () => {

    try {

        /*
        const response = await $fetch(
            'http://localhost:8000/api/appointments'
        )

        appointments.value = response
        */

        console.log('Appointments Loaded')

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

        appointments.value = appointments.value.map(
            appointment => {

                if(appointment.id === id) {

                    return {
                        ...appointment,
                        category: 'cancelled'
                    }

                }

                return appointment

            }
        )

    } catch(error) {

        console.log(error)

    }

}

/* ========================= */
/* Lifecycle */
/* ========================= */

onMounted(() => {

    getAppointments()

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

    font-weight: 700;

    font-size: 32px;

    margin-bottom: 20px;
}

/* ========================= */
/* Categories */
/* ========================= */

.categories-btns {

    display: flex;

    gap: 15px;
}

/* ========================= */
/* Category Button */
/* ========================= */

.categories-btn {

    width: 120px;
    height: 44px;

    background-color: white;

    color: #111827;

    border: 1px solid #0654CB;

    border-radius: 12px;

    font-size: 15px;
    font-weight: 700;

    cursor: pointer;

    transition: 0.3s ease;
}

.categories-btn:hover {

    background-color: #0654CB;

    color: white;
}

.active-btn {

    background-color: #0654CB;

    color: white;
}

/* ========================= */
/* Section */
/* ========================= */

.upcoming-dates {

    width: 100%;

    border: 1px solid #0654CB;

    border-radius: 20px;

    padding: 25px;

    box-sizing: border-box;
}

.section-title {

    margin-top: 0;
    margin-bottom: 25px;

    font-size: 28px;
    font-weight: 700;
}

/* ========================= */
/* Cards */
/* ========================= */

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

    cursor: pointer;

    transition: 0.25s ease;
}

button:active {
    transform: scale(0.97);
}

/* ========================= */
/* Status Buttons */
/* ========================= */

.confirmed-btn,
.completed-btn,
.cancelled-btn {

    border: none;

    border-radius: 50px;

    padding: 10px 18px;

    font-weight: 700;
}

.confirmed-btn {

    background-color: #5C99F5;

    color: white;
}

.completed-btn {

    background-color: #DCFCE7;

    color: #15803D;
}

.cancelled-btn {

    background-color: #FEE2E2;

    color: #DC2626;
}

/* ========================= */
/* Cancel Button */
/* ========================= */

.cancellation-btn {

    background-color: white;

    color: #DC2626;

    border: 1px solid #DC2626;

    border-radius: 50px;

    padding: 10px 18px;

    font-weight: 700;
}

.cancellation-btn:hover {

    background-color: #DC2626;

    color: white;
}

/* ========================= */
/* Empty State */
/* ========================= */

.empty-state {

    width: 100%;

    padding: 40px 20px;

    text-align: center;

    color: #6B7280;

    border: 1px dashed #CBD5E1;

    border-radius: 20px;
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

    .categories-btns {
        flex-wrap: wrap;
    }

    .categories-btn {
        flex: 1;
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

    .btns {
        flex-direction: column;
    }

}

</style>
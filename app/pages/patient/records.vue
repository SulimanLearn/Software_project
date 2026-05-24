<template>
    <div>
        <NavBar />
        <h1>My records</h1>
    </div>
</template>

<script setup>

import { ref } from "vue"

const showPrintModal = ref(false)

const selectedRecord = ref({})

const records = ref([
    {
        id: 1,
        doctor: "د.محمد ابو حليمة",
        specialty: "امراض القلب",
        date: "04 / 04 / 2026",
        diagnosis: "ارتفاع ضغط الدم"
    },
    {
        id: 2,
        doctor: "د.محمد ابو حليمة",
        specialty: "العظام",
        date: "11 / 04 / 2026",
        diagnosis: "التهاب المفاصل"
    },
    {
        id: 3,
        doctor: "د.محمد ابو حليمة",
        specialty: "الجلدية",
        date: "18 / 04 / 2026",
        diagnosis: "حساسية جلدية"
    }
])

const openPrintModal = (record) => {
    selectedRecord.value = record
    showPrintModal.value = true
}

const closePrintModal = () => {
    showPrintModal.value = false
}

const downloadPDF = () => {

    const reportContent = `
        <html dir="rtl">
        <head>
            <title>التقرير الطبي</title>

            <style>

                body {
                    font-family: Arial;
                    padding: 40px;
                    direction: rtl;
                }

                h1 {
                    color: #0654CB;
                    margin-bottom: 30px;
                }

                p {
                    font-size: 18px;
                    margin-bottom: 15px;
                }

            </style>

        </head>

        <body>

            <h1>التقرير الطبي</h1>

            <p>
                <strong>الطبيب:</strong>
                ${selectedRecord.value.doctor}
            </p>

            <p>
                <strong>التخصص:</strong>
                ${selectedRecord.value.specialty}
            </p>

            <p>
                <strong>التاريخ:</strong>
                ${selectedRecord.value.date}
            </p>

            <p>
                <strong>التشخيص:</strong>
                ${selectedRecord.value.diagnosis}
            </p>

            <br>

            <p>
                تم إجراء الفحص الطبي للمريض
                وتوثيق الحالة الصحية الحالية
                والتوصيات الطبية اللازمة.
            </p>

        </body>

        </html>
    `

    const newWindow = window.open("", "_blank")

    newWindow.document.write(reportContent)

    newWindow.document.close()

    newWindow.focus()

    newWindow.print()

}

</script>

<style scoped>

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
/* Medical Records */
/* ========================= */

.medical-records {
    width: 100%;

    background-color: #F9FBFF;

    border: 1px solid #0654CB;
    border-radius: 24px;

    padding: 25px;

    box-sizing: border-box;
}

/* ========================= */
/* Header Row */
/* ========================= */

.records-header {
    display: grid;

    grid-template-columns:
        1.3fr
        1fr
        1fr
        1.5fr
        1fr;

    align-items: center;

    padding: 0 15px 20px 15px;

    border-bottom: 1px solid #B7CDF8;

    font-weight: 700;
    color: #374151;
}

/* ========================= */
/* Record Card */
/* ========================= */

.record-card {
    display: grid;

    grid-template-columns:
        1.3fr
        1fr
        1fr
        1.5fr
        1fr;

    align-items: center;

    padding: 22px 15px;

    border-bottom: 1px solid #D6E4FF;

    transition: 0.25s ease;
}

.record-card:last-child {
    border-bottom: none;
}

.record-card:hover {
    background-color: #EEF4FF;
    border-radius: 14px;
}

/* ========================= */
/* Text */
/* ========================= */

.record-card p {
    margin: 0;

    font-size: 16px;
    color: #111827;
}

/* ========================= */
/* Print Button */
/* ========================= */

.print-btn {
    width: 95px;
    height: 40px;

    background-color: #5C99F5;
    color: white;

    border: none;
    border-radius: 12px;

    font-size: 14px;
    font-weight: 700;

    cursor: pointer;

    transition: 0.25s ease;
}

.print-btn:hover {
    background-color: #3B82F6;
}

.print-btn:active {
    transform: scale(0.97);
}

/* ========================= */
/* Modal */
/* ========================= */

.modal-overlay {
    position: fixed;
    inset: 0;

    background-color: rgba(0, 0, 0, 0.45);

    display: flex;
    justify-content: center;
    align-items: center;

    z-index: 9999;

    padding: 20px;
}

.print-modal {
    width: 100%;
    max-width: 650px;

    background-color: white;

    border-radius: 24px;

    overflow: hidden;

    animation: popup 0.25s ease;
}

@keyframes popup {

    from {
        transform: scale(0.9);
        opacity: 0;
    }

    to {
        transform: scale(1);
        opacity: 1;
    }

}

/* ========================= */
/* Modal Header */
/* ========================= */

.modal-header {
    padding: 20px 25px;

    border-bottom: 1px solid #E5E7EB;

    display: flex;
    justify-content: space-between;
    align-items: center;
}

.modal-header h2 {
    margin: 0;
}

.close-btn {
    background: transparent;
    border: none;

    font-size: 22px;

    cursor: pointer;
}

/* ========================= */
/* Modal Body */
/* ========================= */

.modal-body {
    padding: 25px;
}

.report-preview {
    border: 1px solid #D6E4FF;

    border-radius: 18px;

    padding: 25px;

    background-color: #F9FBFF;
}

.report-preview h1 {
    margin-top: 0;

    color: #0654CB;
}

.report-info p {
    margin-bottom: 14px;

    font-size: 17px;
}

.report-text {
    margin-top: 25px;

    line-height: 1.8;
}

/* ========================= */
/* Modal Footer */
/* ========================= */

.modal-footer {
    padding: 20px 25px;

    border-top: 1px solid #E5E7EB;

    display: flex;
    justify-content: flex-end;
    gap: 12px;
}

.cancel-btn {
    background-color: #F3F4F6;
    color: #111827;

    border: none;

    padding: 12px 18px;

    border-radius: 12px;

    cursor: pointer;
}

.download-btn {
    background-color: #0654CB;
    color: white;

    border: none;

    padding: 12px 18px;

    border-radius: 12px;

    cursor: pointer;
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

    .records-header {
        display: none;
    }

    .record-card {
        grid-template-columns: 1fr;

        gap: 12px;

        background-color: #F9FBFF;

        border-radius: 16px;

        margin-bottom: 15px;
    }

    .print-btn {
        width: 100%;
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

    .medical-records {
        padding: 18px;
    }

}

@media (max-width: 576px) {

    .patient-container {
        padding: 15px;
    }

    .print-modal {
        border-radius: 18px;
    }

    .modal-footer {
        flex-direction: column;
    }

    .download-btn,
    .cancel-btn {
        width: 100%;
    }

}

</style>
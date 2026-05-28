<template>
  <PatientPortalLayout title="الوصفات الطبية" subtitle="عرض الوصفات وطباعتها وطلب الأدوية من الصيدلية.">
    <section class="patient-dashboard-card" aria-labelledby="prescriptions-title">
      <div class="patient-section-header">
        <h2 id="prescriptions-title">قائمة الوصفات</h2>
        <span>{{ patientPrescriptions.length }} وصفات</span>
      </div>

      <div class="patient-table-wrap">
        <table class="patient-table">
          <thead>
            <tr>
              <th>رقم الوصفة</th>
              <th>الطبيب</th>
              <th>التاريخ</th>
              <th>التشخيص المرتبط</th>
              <th>عدد الأدوية</th>
              <th>الحالة</th>
              <th>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="prescription in patientPrescriptions" :key="prescription.id">
              <td data-label="رقم الوصفة">{{ prescription.number }}</td>
              <td data-label="الطبيب">{{ prescription.doctorName }}</td>
              <td data-label="التاريخ">{{ formatArabicDate(prescription.date) }}</td>
              <td data-label="التشخيص المرتبط">{{ prescription.diagnosis }}</td>
              <td data-label="عدد الأدوية">{{ prescription.medicationsCount }}</td>
              <td data-label="الحالة"><PatientStatusBadge :status="prescription.status" /></td>
              <td data-label="الإجراءات">
                <div class="patient-action-row">
                  <PatientActionButton variant="soft" @click="selectedPrescription = prescription">عرض الوصفة</PatientActionButton>
                  <PatientActionButton variant="outline" @click="printPrescription(prescription)">طباعة الوصفة</PatientActionButton>
                  <PatientActionButton :to="pharmacyOrderRoute(prescription)" variant="primary">طلب الدواء من الصيدلية</PatientActionButton>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <PatientModal
      v-if="selectedPrescription"
      title="تفاصيل الوصفة الطبية"
      :subtitle="`${selectedPrescription.number} - ${selectedPrescription.diagnosis}`"
      size="lg"
      @close="selectedPrescription = null"
    >
      <div class="patient-table-wrap">
        <table class="patient-table">
          <thead>
            <tr>
              <th>اسم الدواء</th>
              <th>الجرعة</th>
              <th>التكرار</th>
              <th>المدة</th>
              <th>التعليمات</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="medication in selectedPrescription.medications" :key="medication.name">
              <td data-label="اسم الدواء">{{ medication.name }}</td>
              <td data-label="الجرعة">{{ medication.dosage }}</td>
              <td data-label="التكرار">{{ medication.frequency }}</td>
              <td data-label="المدة">{{ medication.duration }}</td>
              <td data-label="التعليمات">{{ medication.instructions }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <template #actions>
        <button class="patient-save-button" type="button" @click="printPrescription(selectedPrescription)">طباعة الوصفة</button>
        <NuxtLink class="patient-action-button primary" :to="pharmacyOrderRoute(selectedPrescription)">طلب الدواء</NuxtLink>
        <button class="patient-cancel-button" type="button" @click="selectedPrescription = null">إغلاق</button>
      </template>
    </PatientModal>

    <DoctorPrescriptionPrintZone
      :print-item="doctorPrescriptionPrintItem"
      :patient="patientPrescriptionOwner"
      :print-date="doctorPrescriptionPrintDate"
    />
  </PatientPortalLayout>
</template>

<script setup>
import { formatArabicDate, patientOrders, patientPrescriptions, patientProfile, patientRecords } from '~/data/patientPortal'

const selectedPrescription = ref(null)
const { doctorPrescriptionPrintDate, doctorPrescriptionPrintItem, printDoctorPrescription } = useDoctorPrescriptionPrint()

const patientPrescriptionOwner = {
  id: 'P-2056',
  fileNumber: 'P-2056',
  fullName: patientProfile.name,
  name: patientProfile.name
}

const prescriptionForDoctorTemplate = (prescription) => {
  const relatedRecord = patientRecords.find(record => record.prescriptions.includes(prescription.number))
  const relatedOrder = patientOrders.find(order => order.prescriptionNumber === prescription.number)

  return {
    ...prescription,
    doctorName: prescription.doctorName,
    specialty: relatedRecord?.specialty || 'غير متوفر',
    date: formatArabicDate(prescription.date),
    orderReference: relatedOrder?.number || ''
  }
}

const printPrescription = (prescription) => {
  printDoctorPrescription(prescriptionForDoctorTemplate(prescription))
}

const pharmacyOrderRoute = (prescription) => `/patient/pharmacy-order/${encodeURIComponent(prescription.number)}`
</script>

<style>
.print-area {
  inset-block-start: 0;
  inset-inline-start: -100vw;
  opacity: 0;
  pointer-events: none;
  position: fixed;
  visibility: hidden;
  width: 210mm;
  z-index: -1;
}

@media print {
  @page {
    size: A4;
    margin: 12mm;
  }

  html,
  body {
    background: #ffffff !important;
    color: #111827 !important;
    margin: 0 !important;
    padding: 0 !important;
    print-color-adjust: exact;
    -webkit-print-color-adjust: exact;
    width: 100% !important;
  }

  body * {
    visibility: hidden !important;
  }

  .print-area,
  .print-area * {
    visibility: visible !important;
  }

  .site-footer,
  footer,
  .navbar,
  nav,
  aside,
  button,
  .modal-overlay,
  .toast-message {
    display: none !important;
  }

  .print-area {
    inset: auto !important;
    inset-block-start: auto !important;
    inset-inline-start: auto !important;
    left: 0 !important;
    opacity: 1 !important;
    pointer-events: auto;
    position: absolute !important;
    top: 0 !important;
    z-index: 9999 !important;
  }

  .prescription-print-zone {
    background: #ffffff !important;
    box-sizing: border-box;
    color: #111827;
    direction: rtl;
    display: block !important;
    font-family: Arial, Tahoma, sans-serif;
    font-size: 11.2pt;
    line-height: 1.5;
    margin: 0 !important;
    max-width: 100% !important;
    padding: 0 !important;
    width: 100% !important;
  }

  .prescription-print-zone *,
  .prescription-print-zone *::before,
  .prescription-print-zone *::after {
    box-sizing: border-box;
  }

  .print-header {
    align-items: center;
    background: linear-gradient(135deg, #eef6ff 0%, #ffffff 68%);
    border: 1.3pt solid #9bc3ff;
    border-radius: 5mm;
    break-inside: avoid;
    display: flex;
    gap: 8mm;
    justify-content: space-between;
    margin-bottom: 4mm;
    page-break-inside: avoid;
    padding: 4mm 5mm;
  }

  .print-brand {
    align-items: center;
    display: flex;
    flex: 1;
    gap: 4mm;
    min-width: 0;
  }

  .print-logo {
    background: #ffffff;
    border: 1px solid #bfdbfe;
    border-radius: 4mm;
    flex: 0 0 auto;
    height: 18mm;
    object-fit: contain;
    padding: 2mm;
    width: 18mm;
  }

  .print-brand h1 {
    color: #0b63f6;
    font-size: 22pt;
    font-weight: 900;
    letter-spacing: 0;
    line-height: 1.1;
    margin: 0;
  }

  .print-brand p {
    color: #172033;
    font-size: 14pt;
    font-weight: 800;
    margin: 1.5mm 0 0;
  }

  .print-header-details {
    display: grid;
    gap: 1.7mm;
    min-width: 55mm;
  }

  .print-header-details p {
    align-items: center;
    background: #ffffff;
    border: 1px solid #bfdbfe;
    border-radius: 3mm;
    display: flex;
    gap: 4mm;
    justify-content: space-between;
    margin: 0;
    padding: 2.2mm 3mm;
  }

  .print-header-details span,
  .print-grid span {
    color: #475569;
    display: block;
    font-size: 9.6pt;
    font-weight: 800;
    line-height: 1.25;
  }

  .print-header-details strong,
  .print-grid strong {
    color: #111827;
    display: block;
    font-size: 11.2pt;
    font-weight: 900;
    line-height: 1.4;
    margin-top: 1mm;
    overflow-wrap: anywhere;
    word-break: break-word;
  }

  .print-card,
  .print-section {
    background: #ffffff !important;
    border: 1px solid #bfdbfe;
    border-radius: 4mm;
    break-inside: avoid;
    margin-bottom: 3mm;
    page-break-inside: avoid;
    padding: 3.5mm;
  }

  .print-card h2,
  .print-section h2 {
    background: #eaf3ff;
    border: 1px solid #d7e8ff;
    border-radius: 3mm;
    color: #0b63f6;
    font-size: 13pt;
    font-weight: 900;
    margin: 0 0 3mm;
    padding: 2mm 3mm;
  }

  .print-grid {
    display: grid;
    gap: 2mm 3mm;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .print-grid p,
  .print-notes {
    background: #ffffff;
    border: 1px solid #e0edff;
    border-radius: 3mm;
    margin: 0;
    overflow-wrap: anywhere;
    padding: 2mm 3mm;
    word-break: break-word;
  }

  .prescription-print-table {
    border-collapse: separate;
    border-spacing: 0;
    width: 100%;
  }

  .prescription-print-table th,
  .prescription-print-table td {
    border: 1px solid #e0edff;
    font-size: 10.4pt;
    padding: 2.3mm;
    text-align: right;
    vertical-align: top;
  }

  .prescription-print-table th {
    background: #f1f7ff;
    color: #0b63f6;
    font-weight: 900;
  }

  .print-notes {
    color: #111827;
    font-size: 10.8pt;
    line-height: 1.65;
    margin-bottom: 2mm;
  }
}
</style>

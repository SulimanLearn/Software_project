<template>
  <PatientPortalLayout
    title="السجل الطبي"
    subtitle="عرض التشخيصات والتقارير والزيارات السابقة والوصفات المرتبطة."
  >
    <section class="patient-stats-grid" aria-label="ملخص السجل الطبي">
      <article v-for="stat in medicalSummaryCards" :key="stat.label" class="patient-stat-card">
        <div class="patient-stat-copy">
          <strong>{{ stat.value }}</strong>
          <span>{{ stat.label }}</span>
        </div>
        <component :is="stat.icon" class="patient-stat-icon" :size="26" :stroke-width="2" aria-hidden="true" />
      </article>
    </section>

    <section class="patient-dashboard-card" aria-labelledby="diagnoses-title">
      <div class="patient-section-header">
        <h2 id="diagnoses-title">التشخيصات السابقة والتقارير الطبية</h2>
        <span>{{ patientRecords.length }} تقارير</span>
      </div>

      <div class="patient-table-wrap">
        <table class="patient-table">
          <thead>
            <tr>
              <th>رقم التقرير</th>
              <th>الطبيب</th>
              <th>التخصص</th>
              <th>التاريخ</th>
              <th>ملخص التشخيص</th>
              <th>الوصفات</th>
              <th>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="record in patientRecords" :key="record.id">
              <td data-label="رقم التقرير">{{ record.reportNumber }}</td>
              <td data-label="الطبيب">{{ record.doctorName }}</td>
              <td data-label="التخصص">{{ record.specialty }}</td>
              <td data-label="التاريخ">{{ formatArabicDate(record.date) }}</td>
              <td data-label="ملخص التشخيص">{{ record.summary }}</td>
              <td data-label="الوصفات">{{ record.prescriptions.join('، ') }}</td>
              <td data-label="الإجراءات">
                <div class="patient-action-row">
                  <PatientActionButton variant="soft" @click="selectedRecord = record">عرض التقرير</PatientActionButton>
                  <PatientActionButton variant="outline" @click="printRecord(record)">طباعة التقرير</PatientActionButton>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <div class="patient-grid-two">
      <section class="patient-dashboard-card" aria-labelledby="visits-title">
        <div class="patient-section-header">
          <h2 id="visits-title">الزيارات السابقة</h2>
          <span>آخر الزيارات</span>
        </div>
        <div class="patient-list">
          <article v-for="record in patientRecords" :key="`visit-${record.id}`" class="patient-list-item">
            <strong>{{ record.doctorName }} - {{ record.specialty }}</strong>
            <p>{{ formatArabicDate(record.date) }} - {{ record.diagnosis }}</p>
          </article>
        </div>
      </section>

      <section class="patient-dashboard-card" aria-labelledby="linked-prescriptions-title">
        <div class="patient-section-header">
          <h2 id="linked-prescriptions-title">الوصفات المرتبطة</h2>
          <NuxtLink class="patient-outline-button" to="/patient/prescriptions">عرض الوصفات</NuxtLink>
        </div>
        <div class="patient-list">
          <article v-for="prescription in patientPrescriptions" :key="prescription.id" class="patient-list-item">
            <strong>{{ prescription.number }} - {{ prescription.doctorName }}</strong>
            <p>{{ prescription.diagnosis }} - {{ prescription.medicationsCount }} أدوية</p>
            <PatientStatusBadge :status="prescription.status" />
          </article>
        </div>
      </section>
    </div>

    <PatientModal
      v-if="selectedRecord"
      :title="selectedDoctorReport.title"
      subtitle="مراجعة التقرير الطبي"
      size="lg"
      @close="selectedRecord = null"
    >
      <DoctorReportDetails :report="selectedDoctorReport" :patient="patientReportOwner" />
      <template #actions>
        <button class="patient-save-button" type="button" @click="printRecord(selectedRecord)">طباعة التقرير</button>
        <button class="patient-cancel-button" type="button" @click="selectedRecord = null">إغلاق</button>
      </template>
    </PatientModal>

    <DoctorReportPrintZone
      :print-item="doctorReportPrintItem"
      :patient="patientReportOwner"
      :prescriptions="printPrescriptions"
      :medical-history="printMedicalHistory"
      :print-date="doctorReportPrintDate"
    />
  </PatientPortalLayout>
</template>

<script setup>
import {
  formatArabicDate,
  medicalSummaryCards,
  patientAppointments,
  patientPrescriptions,
  patientProfile,
  patientRecords
} from '~/data/patientPortal'

const selectedRecord = ref(null)
const { doctorReportPrintDate, doctorReportPrintItem, printDoctorReport } = useDoctorReportPrint()

const calculateAge = (dateOfBirth) => {
  const birthDate = new Date(`${dateOfBirth}T00:00:00`)

  if (Number.isNaN(birthDate.getTime())) {
    return 'غير متوفر'
  }

  const today = new Date()
  let age = today.getFullYear() - birthDate.getFullYear()
  const hasBirthdayPassed = today.getMonth() > birthDate.getMonth()
    || (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate())

  if (!hasBirthdayPassed) {
    age -= 1
  }

  return age
}

const latestCompletedVisit = computed(() => patientAppointments
  .filter(appointment => appointment.category === 'completed')
  .sort((first, second) => new Date(second.date).getTime() - new Date(first.date).getTime())[0])

const patientReportOwner = {
  id: 'P-2056',
  fileNumber: 'P-2056',
  fullName: patientProfile.name,
  name: patientProfile.name,
  age: calculateAge(patientProfile.dateOfBirth),
  gender: 'ذكر',
  phone: patientProfile.phone,
  email: patientProfile.email,
  lastVisit: latestCompletedVisit.value ? formatArabicDate(latestCompletedVisit.value.date) : formatArabicDate(patientRecords[0]?.date || ''),
  visitCount: medicalSummaryCards.find(card => card.label === 'الزيارات السابقة')?.value || patientRecords.length,
  followUpStatus: 'بحاجة متابعة',
  latestDiagnosis: patientRecords[0]?.diagnosis || 'غير متوفر'
}

const printPrescriptions = computed(() => patientPrescriptions
  .filter(prescription => prescription.status === 'فعالة')
  .map(prescription => ({
    ...prescription,
    date: formatArabicDate(prescription.date)
  })))

const printMedicalHistory = computed(() => patientRecords.map(record => (
  `${record.diagnosis} - ${formatArabicDate(record.date)}`
)))

const reportForDoctorTemplate = (record) => ({
  id: record.id,
  reportNumber: record.reportNumber,
  title: `التقرير الطبي ${record.reportNumber}`,
  type: 'تقرير طبي',
  doctor: record.doctorName,
  specialty: record.specialty,
  date: formatArabicDate(record.date),
  diagnosis: record.diagnosis,
  summary: record.summary,
  content: record.recommendations,
  prescriptions: record.prescriptions,
  fileName: record.fileName || '',
  externalUrl: record.externalUrl || ''
})

const selectedDoctorReport = computed(() => (
  selectedRecord.value ? reportForDoctorTemplate(selectedRecord.value) : {}
))

const printRecord = (record) => {
  printDoctorReport(reportForDoctorTemplate(record))
}
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

  .print-zone {
    background: #ffffff !important;
    box-sizing: border-box;
    color: #101010;
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

  .print-zone *,
  .print-zone *::before,
  .print-zone *::after {
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

  .print-grid p {
    background: #ffffff;
    border: 1px solid #e0edff;
    border-radius: 3mm;
    margin: 0;
    min-height: 11mm;
    overflow-wrap: anywhere;
    padding: 2mm 3mm;
    word-break: break-word;
  }

  .print-section ul {
    display: grid;
    gap: 2mm;
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .print-section li,
  .print-empty,
  .print-notes {
    color: #111827;
    font-size: 10.8pt;
    margin: 0;
    overflow-wrap: anywhere;
    word-break: break-word;
  }

  .print-section li {
    background: #ffffff;
    border: 1px solid #e0edff;
    border-radius: 3mm;
    break-inside: avoid;
    page-break-inside: avoid;
    padding: 2.2mm 3mm;
  }

  .print-prescriptions-list li {
    align-items: start;
    display: grid;
    gap: 2mm 4mm;
    grid-template-columns: 32mm 28mm minmax(0, 1fr);
  }

  .print-prescriptions-list strong {
    font-weight: 900;
  }

  .print-empty,
  .print-notes {
    background: #ffffff;
    border: 1px solid #e0edff;
    border-radius: 3mm;
    line-height: 1.65;
    padding: 2.5mm 3mm;
  }
}
</style>

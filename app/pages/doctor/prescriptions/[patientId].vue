<template>
  <div class="doctor-form-page" dir="rtl">
    <NavBar />

    <div class="doctor-form-shell">
      <DoctorSidebar :doctor="doctor" @logout="showLogoutModal = true" />

      <main class="doctor-form-content">
        <header class="form-header">
          <button class="back-button" type="button" @click="goBack">
            رجوع
          </button>
          <h1>الوصفات الطبية</h1>
        </header>

        <PatientInfoHeader
          :avatar="patient.avatar"
          :name="patient.name"
          :items="patientHeaderItems"
        />

        <section class="form-card" aria-labelledby="add-medicine-title">
          <h2 id="add-medicine-title">إضافة دواء</h2>

          <form class="medicine-form" @submit.prevent="addMedicine">
            <label>
              <span>اسم الدواء</span>
              <input v-model="medicineForm.name" type="text" placeholder="ابحث عن الدواء" :class="{ invalid: errors.name }">
            </label>

            <label>
              <span>الكمية</span>
              <input v-model="medicineForm.quantity" type="text" placeholder="مثال: 30" :class="{ invalid: errors.quantity }">
            </label>

            <label>
              <span>الجرعة</span>
              <input v-model="medicineForm.dose" type="text" placeholder="مثال: 500 مجم" :class="{ invalid: errors.dose }">
            </label>

            <label>
              <span>التكرار</span>
              <input v-model="medicineForm.frequency" type="text" placeholder="مثال: كل 8 ساعات" :class="{ invalid: errors.frequency }">
            </label>

            <label>
              <span>مدة الاستخدام</span>
              <input v-model="medicineForm.duration" type="text" placeholder="مثال: 5 أيام" :class="{ invalid: errors.duration }">
            </label>

            <label>
              <span>تعليمات إضافية</span>
              <input v-model="medicineForm.instructions" type="text" placeholder="اكتب تعليمات إضافية للدواء">
            </label>

            <p v-if="hasErrors" class="form-error">
              يرجى تعبئة بيانات الدواء المطلوبة.
            </p>

            <button class="primary-button add-button" type="submit">
              إضافة الدواء
            </button>
          </form>
        </section>

        <section class="table-card" aria-labelledby="added-medicines-title">
          <h2 id="added-medicines-title">الأدوية المضافة</h2>

          <div v-if="medicines.length" class="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>الدواء</th>
                  <th>الجرعة</th>
                  <th>التكرار</th>
                  <th>مدة الاستخدام</th>
                  <th>إجراء</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="medicine in medicines" :key="medicine.id">
                  <td data-label="الدواء">{{ medicine.name }}</td>
                  <td data-label="الجرعة">{{ medicine.dose }}</td>
                  <td data-label="التكرار">{{ medicine.frequency }}</td>
                  <td data-label="مدة الاستخدام">{{ medicine.duration }}</td>
                  <td data-label="إجراء">
                    <button
                      class="delete-button"
                      type="button"
                      aria-label="حذف الدواء"
                      @click="deleteMedicine(medicine.id)"
                    >
                      حذف
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div v-else class="empty-state">
            لم تتم إضافة أدوية بعد.
          </div>

          <div class="form-actions">
            <button class="primary-button" type="button" @click="savePrescription">
              حفظ الوصفة
            </button>
            <button class="secondary-button" type="button" @click="goBack">
              إلغاء
            </button>
          </div>
        </section>
      </main>
    </div>

    <div v-if="toastMessage" class="toast-message">
      {{ toastMessage }}
    </div>

    <LogoutModal
      v-if="showLogoutModal"
      @close="showLogoutModal = false"
      @confirm="confirmLogout"
    />
  </div>
</template>

<script setup>
import DoctorSidebar from '~/components/doctor/DoctorSidebar.vue'
import PatientInfoHeader from '~/components/doctor/PatientInfoHeader.vue'
import { useDoctorPatients } from '~/composables/doctor/useDoctorPatients'
import { useDoctorPatientRecords } from '~/composables/doctor/useDoctorPatientRecords'

const route = useRoute()
const router = useRouter()

const showLogoutModal = ref(false)
const toastMessage = ref('')
let toastTimer

const isLoggedIn = useState('isLoggedIn', () => false)
const user = useState('user', () => ({ name: '' }))
const { addPrescription, loadPersistedRecords } = useDoctorPatientRecords()
const { findPatient } = useDoctorPatients()

const doctor = {
  name: 'د. خالد السيد',
  specialization: 'أمراض القلب',
  avatar: '/images/doctor.png'
}

const currentPatientId = computed(() => String(route.params.patientId || ''))

const patient = computed(() => {
  const record = findPatient(currentPatientId.value)

  return {
    name: record?.fullName || 'مريض غير محدد',
    age: record?.age || 0,
    gender: record?.gender || 'غير محدد',
    fileNo: record?.fileNumber || 'P-0000',
    visitDate: formatVisitDate(record?.lastVisit),
    avatar: '/images/face.svg'
  }
})

const patientHeaderItems = computed(() => [
  { label: 'اسم المريض', value: patient.value.name },
  { label: 'رقم الملف', value: patient.value.fileNo, ltr: true },
  { label: 'العمر', value: `${patient.value.age} سنة` },
  { label: 'تاريخ الزيارة', value: patient.value.visitDate }
])

const medicineForm = reactive({
  name: '',
  quantity: '',
  dose: '',
  frequency: '',
  duration: '',
  instructions: ''
})

const errors = reactive({
  name: false,
  quantity: false,
  dose: false,
  frequency: false,
  duration: false
})

const medicines = ref([
  {
    id: 1,
    name: 'باراسيتامول 500مجم',
    quantity: '20',
    dose: '500 مجم',
    frequency: 'كل 8 ساعات',
    duration: '5 أيام',
    instructions: 'بعد الطعام'
  }
])

const hasErrors = computed(() => Object.values(errors).some(Boolean))

const validateMedicine = () => {
  errors.name = !medicineForm.name.trim()
  errors.quantity = !medicineForm.quantity.trim()
  errors.dose = !medicineForm.dose.trim()
  errors.frequency = !medicineForm.frequency.trim()
  errors.duration = !medicineForm.duration.trim()
  return !hasErrors.value
}

const resetMedicineForm = () => {
  medicineForm.name = ''
  medicineForm.quantity = ''
  medicineForm.dose = ''
  medicineForm.frequency = ''
  medicineForm.duration = ''
  medicineForm.instructions = ''
}

function formatVisitDate(dateValue) {
  const date = new Date(dateValue)
  if (Number.isNaN(date.getTime())) {
    return 'غير متوفر'
  }

  return new Intl.DateTimeFormat('ar-u-nu-latn', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(date)
}

const addMedicine = () => {
  if (!validateMedicine()) {
    return
  }

  medicines.value.push({
    id: Date.now(),
    name: medicineForm.name,
    quantity: medicineForm.quantity,
    dose: medicineForm.dose,
    frequency: medicineForm.frequency,
    duration: medicineForm.duration,
    instructions: medicineForm.instructions
  })

  resetMedicineForm()
}

const deleteMedicine = (medicineId) => {
  medicines.value = medicines.value.filter((medicine) => medicine.id !== medicineId)
}

const showToast = (message) => {
  toastMessage.value = message
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => {
    toastMessage.value = ''
  }, 2600)
}

const savePrescription = () => {
  if (!medicines.value.length) {
    showToast('يرجى إضافة دواء واحد على الأقل')
    return
  }

  const date = new Date().toISOString().slice(0, 10)
  const sequence = String(Date.now()).slice(-5)

  addPrescription(currentPatientId.value, {
    code: `RX-${patient.value.fileNo.replace('P-', '')}-${sequence}`,
    date,
    doctor: doctor.name,
    status: 'نشطة',
    medicines: medicines.value.map((medicine) => ({
      name: medicine.name,
      quantity: medicine.quantity,
      dose: medicine.dose,
      frequency: medicine.frequency,
      duration: medicine.duration,
      instructions: medicine.instructions,
      notes: medicine.instructions
    })),
    notes: medicines.value.map((medicine) => medicine.instructions).filter(Boolean).join('، ')
  })

  // Future API integration point: replace addPrescription with a backend mutation.
  showToast('تم حفظ الوصفة بنجاح')
  window.setTimeout(() => {
    navigateTo(`/doctor/patients/${currentPatientId.value}?tab=prescriptions`)
  }, 650)
}

const goBack = () => {
  if (window.history.length > 1) {
    router.back()
    return
  }

  navigateTo(`/doctor/patients/${currentPatientId.value}`)
}

const confirmLogout = async () => {
  isLoggedIn.value = false
  user.value = { name: '' }
  showLogoutModal.value = false
  await navigateTo('/login')
}

onBeforeUnmount(() => {
  clearTimeout(toastTimer)
})

onMounted(() => {
  loadPersistedRecords()
})

const LogoutModal = {
  emits: ['close', 'confirm'],
  template: `
    <div class="modal-overlay" dir="rtl" @click.self="$emit('close')">
      <div class="confirmation-modal" role="dialog" aria-modal="true" aria-labelledby="logout-modal-title">
        <h2 id="logout-modal-title">تسجيل الخروج</h2>
        <p>هل انت متاكد انك تريد تسجيل الخروج؟</p>
        <div class="modal-actions">
          <button class="save-button" type="button" @click="$emit('confirm')">نعم</button>
          <button class="cancel-button" type="button" @click="$emit('close')">لا</button>
        </div>
      </div>
    </div>
  `
}
</script>

<style scoped>
.doctor-form-page {
  min-height: 100vh;
  background-color: #ffffff;
  color: #101010;
}

.doctor-form-shell {
  display: grid;
  grid-template-columns: 290px minmax(0, 1fr);
  min-height: calc(100vh - 85px);
}

.doctor-sidebar {
  background-color: #eaf2fd;
  border-left: 1.5px solid #0b63f6;
  padding: 32px;
}

.sidebar-header {
  align-items: center;
  display: flex;
  justify-content: center;
  gap: 16px;
}

.doctor-profile-card {
  align-items: center;
  background-color: #eaf2fd;
  border: 1.5px solid #0b63f6;
  border-radius: 24px;
  display: flex;
  flex-direction: column;
  margin-bottom: 26px;
  min-height: 164px;
  padding: 18px 16px;
  text-align: center;
  width: 100%;
}

.doctor-profile-card img {
  background-color: #ffffff;
  border: 1px solid #8dbbfb;
  border-radius: 18px;
  height: 70px;
  margin-bottom: 12px;
  object-fit: contain;
  padding: 8px;
  width: 82px;
}

.doctor-profile-card strong {
  font-size: 17px;
  font-weight: 900;
}

.doctor-profile-card span {
  color: #343434;
  font-size: 15px;
  margin-top: 4px;
}

.sidebar-toggle {
  display: none;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.sidebar-link {
  align-items: center;
  border-radius: 8px;
  color: #0a0a0a;
  display: flex;
  font-size: 16px;
  font-weight: 800;
  justify-content: center;
  min-height: 34px;
  text-decoration: none;
  transition: background-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
}

.sidebar-link:hover,
.sidebar-link.active {
  background-color: #5a99ef;
  box-shadow: inset 0 0 0 1px #0b63f6;
}

.sidebar-link:hover {
  transform: translateY(-1px);
}

.logout-link {
  background-color: transparent;
  border: 0;
  cursor: pointer;
  font-family: inherit;
  width: 100%;
}

.doctor-form-content {
  margin-inline: auto;
  max-width: 980px;
  padding: 28px 32px 38px;
  width: 100%;
}

.form-header {
  align-items: center;
  display: flex;
  flex-direction: row-reverse;
  justify-content: space-between;
  gap: 18px;
  margin-bottom: 18px;
}

.form-header h1 {
  font-size: 28px;
  font-weight: 900;
  margin: 0;
}

.patient-summary-card,
.form-card,
.table-card {
  background-color: #eaf2fd;
  border: 1.5px solid #0b63f6;
  border-radius: 18px;
}

.patient-summary-card {
  align-items: center;
  display: flex;
  flex-wrap: nowrap;
  gap: 12px;
  margin-bottom: 16px;
  padding: 14px;
}

.patient-avatar {
  background-color: #ffffff;
  border: 1px solid #8dbbfb;
  border-radius: 50%;
  flex: 0 0 auto;
  height: 78px;
  object-fit: contain;
  padding: 9px;
  width: 78px;
}

.summary-grid {
  align-items: stretch;
  display: flex;
  flex: 1 1 auto;
  flex-wrap: wrap;
  gap: 10px;
  min-width: 0;
}

.summary-grid article {
  background-color: #ffffff;
  border: 1px solid #8dbbfb;
  border-radius: 12px;
  flex: 1 1 150px;
  min-width: 132px;
  padding: 12px 14px;
}

.summary-grid article:first-child {
  flex-grow: 1.45;
  min-width: 190px;
}

.summary-grid span,
.medicine-form label span {
  color: #343434;
  display: block;
  font-size: 13px;
  font-weight: 900;
  margin-bottom: 8px;
}

.summary-grid strong {
  font-size: 15px;
  font-weight: 900;
}

.ltr-text {
  direction: ltr;
  display: inline-block;
}

.form-card,
.table-card {
  margin-bottom: 16px;
  padding: 22px;
}

.form-card h2,
.table-card h2 {
  font-size: 22px;
  font-weight: 900;
  margin: 0 0 18px;
}

.medicine-form {
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.medicine-form input {
  background-color: #ffffff;
  border: 1px solid #8dbbfb;
  border-radius: 12px;
  font-family: inherit;
  font-size: 15px;
  outline: none;
  padding: 12px 14px;
  width: 100%;
}

.medicine-form input:focus {
  border-color: #0b63f6;
  box-shadow: 0 0 0 3px rgba(90, 153, 239, 0.18);
}

.invalid {
  border-color: #d92d2d !important;
}

.form-error {
  color: #b42318;
  font-size: 14px;
  font-weight: 900;
  grid-column: 1 / -1;
  margin: 0;
}

.add-button {
  grid-column: 1 / 2;
}

.table-wrap {
  overflow-x: auto;
}

table {
  border-collapse: separate;
  border-spacing: 0 10px;
  min-width: 720px;
  width: 100%;
}

th,
td {
  padding: 14px 16px;
  text-align: right;
  white-space: nowrap;
}

th {
  color: #343434;
  font-size: 15px;
  font-weight: 900;
}

td {
  background-color: #ffffff;
  border-bottom: 1px solid #8dbbfb;
  border-top: 1px solid #8dbbfb;
  font-size: 15px;
  font-weight: 800;
}

td:first-child {
  border-radius: 0 14px 14px 0;
  border-right: 1px solid #8dbbfb;
}

td:last-child {
  border-left: 1px solid #8dbbfb;
  border-radius: 14px 0 0 14px;
}

.empty-state {
  background-color: #ffffff;
  border: 1px solid #8dbbfb;
  border-radius: 14px;
  font-weight: 900;
  padding: 24px;
  text-align: center;
}

.form-actions {
  display: flex;
  gap: 14px;
  justify-content: flex-start;
  margin-top: 18px;
}

.back-button,
.primary-button,
.secondary-button,
.delete-button,
.save-button,
.cancel-button {
  border-radius: 18px;
  cursor: pointer;
  font-family: inherit;
  font-weight: 800;
  min-width: 130px;
  padding: 10px 22px;
  transition: background-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
}

.back-button,
.secondary-button,
.cancel-button {
  background-color: #ffffff;
  border: 1px solid #0b63f6;
  color: #115bd2;
}

.primary-button,
.save-button {
  background-color: #115bd2;
  border: 1px solid #115bd2;
  color: #ffffff;
}

.delete-button {
  background-color: #ffe4e4;
  border: 1px solid #f2a3a3;
  color: #b42318;
  min-width: 72px;
  padding: 7px 12px;
}

.toast-message {
  background-color: #115bd2;
  border-radius: 14px;
  bottom: 24px;
  color: #ffffff;
  font-weight: 900;
  left: 24px;
  padding: 12px 18px;
  position: fixed;
  z-index: 3000;
}

.modal-overlay {
  align-items: center;
  background-color: rgba(68, 139, 239, 0.38);
  display: flex;
  inset: 0;
  justify-content: center;
  padding: 24px;
  position: fixed;
  z-index: 2000;
}

.confirmation-modal {
  background-color: #eaf2fd;
  border: 1.5px solid #0b63f6;
  border-radius: 24px;
  box-shadow: 0 18px 45px rgba(0, 0, 0, 0.12);
  max-width: 100%;
  padding: 42px 44px 34px;
  text-align: center;
  width: 560px;
}

.confirmation-modal h2 {
  font-size: 26px;
  font-weight: 900;
  margin: 0 0 14px;
}

.confirmation-modal p {
  font-size: 22px;
  font-weight: 800;
  margin: 0 0 30px;
}

.modal-actions {
  display: flex;
  gap: 14px;
  justify-content: center;
}

@media (max-width: 1030px) {
  .doctor-form-shell {
    grid-template-columns: 240px minmax(0, 1fr);
  }

  .doctor-form-content {
    padding: 28px 22px 42px;
  }

  .medicine-form {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 720px) {
  .doctor-form-shell {
    display: flex;
    flex-direction: column;
  }

  .doctor-sidebar {
    border-left: 0;
    border-bottom: 1.5px solid #0b63f6;
    padding: 18px;
  }

  .sidebar-header {
    justify-content: space-between;
  }

  .doctor-profile-card {
    align-items: center;
    flex: 1;
    flex-direction: row;
    gap: 12px;
    margin-bottom: 0;
    min-height: 76px;
    padding: 12px;
    text-align: right;
  }

  .doctor-profile-card img {
    height: 52px;
    margin-bottom: 0;
    width: 58px;
  }

  .doctor-profile-card span {
    display: block;
  }

  .sidebar-toggle {
    align-items: center;
    background-color: #5a99ef;
    border: 1px solid #0b63f6;
    border-radius: 8px;
    cursor: pointer;
    display: inline-flex;
    flex-direction: column;
    flex: 0 0 auto;
    gap: 5px;
    height: 40px;
    justify-content: center;
    padding: 0;
    width: 44px;
  }

  .sidebar-toggle span {
    background-color: #ffffff;
    border-radius: 999px;
    display: block;
    height: 2px;
    width: 22px;
  }

  .sidebar-nav {
    display: grid;
    grid-template-columns: repeat(2, minmax(120px, 1fr));
    gap: 10px;
    max-height: 0;
    margin-top: 0;
    opacity: 0;
    overflow: hidden;
    transition: max-height 0.25s ease, margin-top 0.25s ease, opacity 0.2s ease;
  }

  .sidebar-nav.is-open {
    max-height: 360px;
    margin-top: 18px;
    opacity: 1;
  }

  .patient-summary-card {
    align-items: center;
  }

  .patient-avatar {
    height: 70px;
    width: 70px;
  }

  table {
    border-spacing: 0;
    min-width: 0;
  }

  thead {
    display: none;
  }

  table,
  tbody,
  tr,
  td {
    display: block;
    width: 100%;
  }

  tr {
    background-color: #ffffff;
    border: 1px solid #8dbbfb;
    border-radius: 18px;
    margin-bottom: 12px;
    padding: 10px 14px;
  }

  td,
  td:first-child,
  td:last-child {
    align-items: center;
    background-color: transparent;
    border: 0;
    border-radius: 0;
    display: flex;
    justify-content: space-between;
    gap: 18px;
    padding: 10px 0;
    white-space: normal;
  }

  td::before {
    color: #343434;
    content: attr(data-label);
    flex: 0 0 auto;
    font-weight: 900;
  }
}

@media (max-width: 560px) {
  .doctor-form-content {
    padding: 24px 14px 36px;
  }

  .sidebar-nav,
  .medicine-form {
    grid-template-columns: 1fr;
  }

  .summary-grid article,
  .summary-grid article:first-child {
    flex: 1 1 145px;
    min-width: 132px;
  }

  .form-header {
    align-items: stretch;
    flex-direction: column-reverse;
  }

  .add-button,
  .form-actions,
  .modal-actions {
    grid-column: auto;
    flex-direction: column;
  }

  .back-button,
  .primary-button,
  .secondary-button,
  .delete-button,
  .modal-actions button {
    width: 100%;
  }
}

@media (max-width: 360px) {
  .patient-summary-card {
    flex-wrap: wrap;
  }
}
</style>

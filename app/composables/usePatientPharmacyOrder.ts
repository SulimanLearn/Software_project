import {
  patientPrescriptions,
  patientProfile,
  patientRecords
} from '~/data/patientPortal'
import { computed } from 'vue'

export const pharmacyOrderSteps = [
  { number: 1, label: 'بيانات المريض والوصفة' },
  { number: 2, label: 'تفاصيل الطلب والتوصيل' },
  { number: 3, label: 'التأكيد' }
]

export const usePatientPharmacyOrder = (prescriptionId: string) => {
  const normalizedPrescriptionId = computed(() => decodeURIComponent(String(prescriptionId || '')))
  const prescription = computed(() =>
    patientPrescriptions.find(item => item.number === normalizedPrescriptionId.value || String(item.id) === normalizedPrescriptionId.value)
  )
  const relatedRecord = computed(() =>
    patientRecords.find(record => Array.isArray(record.prescriptions) && record.prescriptions.includes(prescription.value?.number || ''))
  )
  const orderState = useState(`pharmacy-order-${normalizedPrescriptionId.value}`, () => ({} as Record<string, any>))

  const specialty = computed(() => relatedRecord.value?.specialty || 'غير متوفر')
  const hasValidPrescription = computed(() => Boolean(
    prescription.value
      && Array.isArray(prescription.value.medications)
      && prescription.value.medications.length
  ))

  const patientInfo = computed(() => ({
    name: patientProfile.name,
    phone: patientProfile.phone,
    email: patientProfile.email,
    age: calculateAge(patientProfile.dateOfBirth),
    gender: 'ذكر',
    address: patientProfile.address
  }))

  return {
    hasValidPrescription,
    normalizedPrescriptionId,
    orderState,
    patientInfo,
    prescription,
    relatedRecord,
    specialty
  }
}

const calculateAge = (dateOfBirth: string) => {
  const birthDate = new Date(`${dateOfBirth}T00:00:00`)

  if (Number.isNaN(birthDate.getTime())) {
    return 'غير متوفر'
  }

  const today = new Date()
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDelta = today.getMonth() - birthDate.getMonth()

  if (monthDelta < 0 || (monthDelta === 0 && today.getDate() < birthDate.getDate())) {
    age -= 1
  }

  return age
}

import { patientPrescriptions as localPatientPrescriptions } from '~/data/patientPortal'

type ApiMedication = {
  id?: number
  name?: string
  title?: string
}

type ApiPrescriptionItem = {
  id?: number
  medication_id: number
  dosage: string
  frequency: string
  duration: string
  medication?: ApiMedication
}

type ApiPrescription = {
  id: number
  appointment_id?: number
  doctor_id?: number
  patient_id: number
  notes?: string
  created_at?: string
  updated_at?: string
  items?: ApiPrescriptionItem[]
}

export type PrescriptionItemPayload = {
  medication_id: number
  dosage: string
  frequency: string
  duration: string
}

export type PrescriptionPayload = {
  appointment_id: number
  patient_id: number
  notes?: string
  items: PrescriptionItemPayload[]
}

const formatDate = (value?: string) => {
  if (!value) {
    return new Date().toISOString().slice(0, 10)
  }

  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? value : date.toISOString().slice(0, 10)
}

const mapApiPrescription = (prescription: ApiPrescription) => {
  const medications = (prescription.items || []).map((item) => ({
    id: item.id,
    medicationId: item.medication_id,
    name: item.medication?.name || item.medication?.title || `دواء #${item.medication_id}`,
    dosage: item.dosage,
    dose: item.dosage,
    frequency: item.frequency,
    duration: item.duration,
    instructions: '',
  }))

  return {
    id: prescription.id,
    number: `RX-${prescription.id}`,
    code: `RX-${prescription.id}`,
    doctorName: prescription.doctor_id ? `دكتور #${prescription.doctor_id}` : 'غير متوفر',
    doctor: prescription.doctor_id ? `دكتور #${prescription.doctor_id}` : 'غير متوفر',
    date: formatDate(prescription.created_at),
    diagnosis: prescription.notes || 'غير متوفر',
    medicationsCount: medications.length,
    status: 'فعالة',
    medications,
    medicines: medications,
    notes: prescription.notes || '',
  }
}

export const usePrescriptions = () => {
  const { authFetch } = useAuth()
  const patientPrescriptions = useState('api-patient-prescriptions', () => (
    localPatientPrescriptions.map((prescription) => ({ ...prescription }))
  ))
  const prescriptionsLoading = useState('api-prescriptions-loading', () => false)
  const prescriptionsError = useState<string | null>('api-prescriptions-error', () => null)

  const fetchPrescription = async (prescriptionId: string | number) => {
    const response = await authFetch<{ status: boolean; data: ApiPrescription }>(`/prescriptions/${prescriptionId}`)
    return mapApiPrescription(response.data)
  }

  const fetchPatientPrescriptions = async (patientId: string | number) => {
    prescriptionsLoading.value = true
    prescriptionsError.value = null

    try {
      let response: { status: boolean; data: ApiPrescription[] }

      try {
        response = await authFetch<{ status: boolean; data: ApiPrescription[] }>(`/patients/${patientId}/prescriptions`)
      } catch {
        response = await authFetch<{ status: boolean; data: ApiPrescription[] }>(`/prescriptions/patient/${patientId}`)
      }

      patientPrescriptions.value = response.data.map(mapApiPrescription)
      return patientPrescriptions.value
    } catch (error) {
      prescriptionsError.value = 'تعذر تحميل الوصفات من الخادم، تم عرض البيانات المحلية مؤقتاً.'
      patientPrescriptions.value = localPatientPrescriptions.map((prescription) => ({ ...prescription }))
      return patientPrescriptions.value
    } finally {
      prescriptionsLoading.value = false
    }
  }

  const createPrescription = async (payload: PrescriptionPayload) => {
    const response = await authFetch<{ status: boolean; message: string; data: ApiPrescription }>('/prescriptions', {
      method: 'POST',
      body: payload,
    })

    return mapApiPrescription(response.data)
  }

  return {
    patientPrescriptions,
    prescriptionsLoading,
    prescriptionsError,
    fetchPrescription,
    fetchPatientPrescriptions,
    createPrescription,
  }
}

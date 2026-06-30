const STORAGE_KEY = 'mediconnect-doctor-patient-records'

const defaultState = () => ({
  diagnosesByPatient: {},
  prescriptionsByPatient: {}
})

const clone = (value) => JSON.parse(JSON.stringify(value))

const isPlainObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value)

const normalizeState = (value) => ({
  diagnosesByPatient: isPlainObject(value?.diagnosesByPatient) ? value.diagnosesByPatient : {},
  prescriptionsByPatient: isPlainObject(value?.prescriptionsByPatient) ? value.prescriptionsByPatient : {}
})

const sortNewestFirst = (items) => {
  return (Array.isArray(items) ? [...items] : []).sort((first, second) => {
    return new Date(second.createdAt || second.date).getTime() - new Date(first.createdAt || first.date).getTime()
  })
}

export const useDoctorPatientRecords = () => {
  const records = useState('doctor-patient-records', defaultState)

  const loadPersistedRecords = () => {
    if (!process.client) {
      return
    }

    try {
      const stored = window.localStorage.getItem(STORAGE_KEY)
      if (stored) {
        records.value = normalizeState(JSON.parse(stored))
      }
    } catch {
      records.value = defaultState()
    }
  }

  const persistRecords = () => {
    if (!process.client) {
      return
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(records.value))
  }

  const ensurePatient = (patientId) => {
    const id = String(patientId || '')
    records.value = normalizeState(records.value)

    if (!Array.isArray(records.value.diagnosesByPatient[id])) {
      records.value.diagnosesByPatient[id] = []
    }

    if (!Array.isArray(records.value.prescriptionsByPatient[id])) {
      records.value.prescriptionsByPatient[id] = []
    }

    return id
  }

  const seedPatientRecords = (patientId, { diagnoses = [], prescriptions = [] } = {}) => {
    const id = ensurePatient(patientId)

    if (!records.value.diagnosesByPatient[id].length && Array.isArray(diagnoses) && diagnoses.length) {
      records.value.diagnosesByPatient[id] = sortNewestFirst(clone(diagnoses))
    }

    if (!records.value.prescriptionsByPatient[id].length && Array.isArray(prescriptions) && prescriptions.length) {
      records.value.prescriptionsByPatient[id] = sortNewestFirst(clone(prescriptions))
    }

    persistRecords()
  }

  const diagnosesForPatient = (patientId) => computed(() => {
    const id = String(patientId || '')
    return sortNewestFirst(records.value.diagnosesByPatient?.[id] || [])
  })

  const prescriptionsForPatient = (patientId) => computed(() => {
    const id = String(patientId || '')
    return sortNewestFirst(records.value.prescriptionsByPatient?.[id] || [])
  })

  const addDiagnosis = (patientId, diagnosis) => {
    const id = ensurePatient(patientId)
    records.value.diagnosesByPatient[id].unshift({
      id: `diagnosis-${Date.now()}`,
      type: 'diagnosis',
      status: 'تحت المتابعة',
      attachments: [],
      createdAt: new Date().toISOString(),
      ...diagnosis
    })
    records.value.diagnosesByPatient[id] = sortNewestFirst(records.value.diagnosesByPatient[id])
    persistRecords()
  }

  const updateDiagnosis = (patientId, diagnosisId, diagnosis) => {
    const id = ensurePatient(patientId)
    records.value.diagnosesByPatient[id] = sortNewestFirst(
      records.value.diagnosesByPatient[id].map((item) =>
        item.id === diagnosisId ? { ...item, ...diagnosis } : item
      )
    )
    persistRecords()
  }

  const addPrescription = (patientId, prescription) => {
    const id = ensurePatient(patientId)
    records.value.prescriptionsByPatient[id].unshift({
      id: `prescription-${Date.now()}`,
      status: 'نشطة',
      createdAt: new Date().toISOString(),
      ...prescription
    })
    records.value.prescriptionsByPatient[id] = sortNewestFirst(records.value.prescriptionsByPatient[id])
    persistRecords()
  }

  const removeDiagnosis = (patientId, diagnosisId) => {
    const id = ensurePatient(patientId)
    records.value.diagnosesByPatient[id] = records.value.diagnosesByPatient[id].filter(item => item.id !== diagnosisId)
    persistRecords()
  }

  const removePrescription = (patientId, prescriptionId) => {
    const id = ensurePatient(patientId)
    records.value.prescriptionsByPatient[id] = records.value.prescriptionsByPatient[id].filter(item => item.id !== prescriptionId)
    persistRecords()
  }

  return {
    records,
    loadPersistedRecords,
    seedPatientRecords,
    diagnosesForPatient,
    prescriptionsForPatient,
    addDiagnosis,
    updateDiagnosis,
    addPrescription,
    removeDiagnosis,
    removePrescription
  }
}

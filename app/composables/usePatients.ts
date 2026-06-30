import { patientAppointments as localPatientAppointments, patientProfile } from '~/data/patientPortal'

type ApiPatientProfile = {
  id: number
  user_id?: number
  full_name?: string | null
  email?: string | null
  phone?: string | null
  birth_date?: string | null
  gender?: 'male' | 'female' | string | null
  bio?: string | null
  created_at?: string
  updated_at?: string
}

type ApiAppointment = {
  id: number
  code?: string
  date?: string
  time?: string
  status?: string
  appointment_type?: string
  type?: string
  meeting_link?: string
  reason?: string
  notes?: string
  doctor?: {
    id?: number
    specialization?: string
    specialty?: string | { name?: string; title?: string }
    user?: {
      full_name?: string
      name?: string
    }
  }
}

const splitFullName = (fullName = '') => {
  const parts = fullName.trim().split(/\s+/).filter(Boolean)
  return {
    firstName: parts[0] || '',
    lastName: parts.slice(1).join(' '),
  }
}

const normalizeStatus = (status?: string) => {
  const value = String(status || '').toLowerCase()

  return {
    confirmed: 'مؤكد',
    pending: 'قيد الانتظار',
    completed: 'مكتمل',
    cancelled: 'ملغي',
    canceled: 'ملغي',
  }[value] || status || 'قيد الانتظار'
}

const categoryFromStatus = (status: string) => {
  if (status === 'مكتمل') {
    return 'completed'
  }

  if (status === 'ملغي') {
    return 'cancelled'
  }

  return 'upcoming'
}

const formatTime = (time?: string) => {
  if (!time) {
    return 'غير متوفر'
  }

  return String(time).slice(0, 5)
}

const doctorSpecialty = (doctor?: ApiAppointment['doctor']) => {
  if (!doctor) {
    return 'غير متوفر'
  }

  if (typeof doctor.specialty === 'string') {
    return doctor.specialty
  }

  return doctor.specialty?.name || doctor.specialty?.title || doctor.specialization || 'غير متوفر'
}

const mapPatientProfile = (profile: ApiPatientProfile) => {
  const name = profile.full_name || patientProfile.name
  const { firstName, lastName } = splitFullName(name)

  return {
    id: profile.id,
    userId: profile.user_id,
    firstName,
    lastName,
    name,
    role: 'مريض',
    email: profile.email || '',
    phone: profile.phone || '',
    dateOfBirth: profile.birth_date || '',
    gender: profile.gender || '',
    bio: profile.bio || '',
    status: 'نشط',
    avatar: '',
  }
}

const mapAppointment = (appointment: ApiAppointment) => {
  const status = normalizeStatus(appointment.status)
  const type = appointment.appointment_type || appointment.type || ''

  return {
    id: appointment.id,
    code: appointment.code || `APT-${appointment.id}`,
    doctorName: appointment.doctor?.user?.full_name || appointment.doctor?.user?.name || 'غير متوفر',
    specialty: doctorSpecialty(appointment.doctor),
    date: appointment.date || '',
    time: formatTime(appointment.time),
    appointmentType: String(type).toLowerCase().includes('online') ? 'أونلاين' : 'في العيادة',
    status,
    meetingLink: appointment.meeting_link || '',
    reason: appointment.reason || 'غير متوفر',
    notes: appointment.notes || '',
    category: categoryFromStatus(status),
    canJoin: Boolean(appointment.meeting_link),
    rating: 0,
  }
}

export const usePatients = () => {
  const { authFetch, user } = useAuth()
  const profileFromAuthUser = () => {
    const currentUser = (user.value || {}) as Record<string, any>
    const name = String(currentUser.name || currentUser.full_name || '').trim()
    const { firstName, lastName } = splitFullName(name)

    return {
      ...patientProfile,
      id: Number(currentUser.patient_id || currentUser.patient?.id || currentUser.profile?.patient_id) || patientProfile.id,
      userId: Number(currentUser.id) || patientProfile.userId,
      firstName: firstName || patientProfile.firstName,
      lastName: lastName || patientProfile.lastName,
      name: name || patientProfile.name,
      email: String(currentUser.email || patientProfile.email || ''),
      phone: String(currentUser.phone || patientProfile.phone || ''),
      role: 'مريض',
    }
  }

  const patientProfileState = useState('api-patient-profile', profileFromAuthUser)
  const patientAppointmentsState = useState('api-patient-appointments', () => localPatientAppointments.map(item => ({ ...item })))
  const patientLoading = useState('api-patient-loading', () => false)
  const patientError = useState<string | null>('api-patient-error', () => null)
  const patientAppointmentsLoading = useState('api-patient-appointments-loading', () => false)
  const patientAppointmentsError = useState<string | null>('api-patient-appointments-error', () => null)

  const currentPatientId = computed(() => {
    const currentUser = (user.value || {}) as Record<string, any>
    const possibleId = currentUser.patient_id
      || currentUser.patient?.id
      || currentUser.profile?.patient_id
      || currentUser.id

    return Number(possibleId) || 0
  })

  const fetchPatientProfile = async (patientId = currentPatientId.value) => {
    if (!patientId) {
      patientError.value = 'تعذر تحديد رقم المريض من بيانات تسجيل الدخول.'
      return patientProfileState.value
    }

    patientLoading.value = true
    patientError.value = null

    try {
      const response = await authFetch<{ status: string; message: string; data: ApiPatientProfile }>(`/patients/${patientId}`)
      const profile = mapPatientProfile(response.data)
      patientProfileState.value = profile
      user.value = {
        ...(user.value || {}),
        id: user.value?.id || profile.userId || profile.id,
        patient_id: profile.id,
        name: profile.name,
        full_name: profile.name,
        email: profile.email,
        phone: profile.phone,
      }
      return profile
    } catch (error) {
      patientError.value = 'تعذر تحميل ملف المريض من الخادم، تم عرض البيانات المحلية مؤقتاً.'
      patientProfileState.value = profileFromAuthUser()
      return patientProfileState.value
    } finally {
      patientLoading.value = false
    }
  }

  const updatePatientProfile = async (patientId: number, payload: Record<string, unknown>) => {
    const response = await authFetch<{ status: string; message: string; data: ApiPatientProfile }>(`/patients/${patientId}`, {
      method: 'PUT',
      body: payload,
    })
    const profile = mapPatientProfile(response.data)
    patientProfileState.value = profile
    user.value = {
      ...(user.value || {}),
      patient_id: profile.id,
      name: profile.name,
      full_name: profile.name,
      email: profile.email,
      phone: profile.phone,
    }
    return profile
  }

  const fetchPatientAppointments = async (patientId = currentPatientId.value, filters: Record<string, string> = {}) => {
    if (!patientId) {
      patientAppointmentsError.value = 'تعذر تحديد رقم المريض من بيانات تسجيل الدخول.'
      return patientAppointmentsState.value
    }

    patientAppointmentsLoading.value = true
    patientAppointmentsError.value = null

    try {
      const query = new URLSearchParams(Object.entries(filters).filter(([, value]) => Boolean(value))).toString()
      const response = await authFetch<{ status: string; message: string; data: { data?: ApiAppointment[] } | ApiAppointment[] }>(
        `/patients/${patientId}/appointments${query ? `?${query}` : ''}`,
      )
      const appointments = Array.isArray(response.data) ? response.data : response.data.data || []
      patientAppointmentsState.value = appointments.map(mapAppointment)
      return patientAppointmentsState.value
    } catch (error) {
      patientAppointmentsError.value = 'تعذر تحميل المواعيد من الخادم، تم عرض البيانات المحلية مؤقتاً.'
      patientAppointmentsState.value = localPatientAppointments.map(item => ({ ...item }))
      return patientAppointmentsState.value
    } finally {
      patientAppointmentsLoading.value = false
    }
  }

  return {
    currentPatientId,
    patientProfile: patientProfileState,
    patientAppointments: patientAppointmentsState,
    patientLoading,
    patientError,
    patientAppointmentsLoading,
    patientAppointmentsError,
    fetchPatientProfile,
    updatePatientProfile,
    fetchPatientAppointments,
  }
}

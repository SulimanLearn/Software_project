export type Nurse = {
  id: string
  name: string
  gender: string
  specialty: string
  experienceYears: number
  price: number
  availabilityStatus: string
  image: string
  isActive: boolean
  active: boolean
  address: string
  shift: string
  patients: number
  user: {
    fullName: string
    email: string
    password: string
    phone: string
    role: string
  }
}

const defaultNurses: Nurse[] = [
  {
    id: 'nurse-1',
    user: {
      fullName: 'ريم أبو شمالة',
      email: 'reem.abushamala@mediconnect.test',
      password: 'demo-password',
      phone: '0591234567',
      role: 'nurse',
    },
    name: 'ريم أبو شمالة',
    gender: 'female',
    specialty: 'ممرضة عامة',
    experienceYears: 6,
    price: 120,
    availabilityStatus: 'صباحية',
    image: '/images/doctor.png',
    isActive: true,
    active: true,
    address: 'حي الرمال - غزة',
    shift: 'صباحية',
    patients: 18,
  },
  {
    id: 'nurse-2',
    user: {
      fullName: 'مريم أبو دان',
      email: 'mariam.abudan@mediconnect.test',
      password: 'demo-password',
      phone: '0569876543',
      role: 'nurse',
    },
    name: 'مريم أبو دان',
    gender: 'female',
    specialty: 'رعاية منزلية',
    experienceYears: 5,
    price: 100,
    availabilityStatus: 'مسائية',
    image: '/images/doctor.png',
    isActive: true,
    active: true,
    address: 'جباليا - النزلة',
    shift: 'مسائية',
    patients: 12,
  },
  {
    id: 'nurse-3',
    user: {
      fullName: 'يزن الكحلوت',
      email: 'yazan.alkahlout@mediconnect.test',
      password: 'demo-password',
      phone: '0591234567',
      role: 'nurse',
    },
    name: 'يزن الكحلوت',
    gender: 'male',
    specialty: 'رعاية كبار السن',
    experienceYears: 8,
    price: 130,
    availabilityStatus: 'ليلية',
    image: '/images/doctor.png',
    isActive: false,
    active: false,
    address: 'دير البلح - شارع البحر',
    shift: 'ليلية',
    patients: 15,
  },
]

export const useNurses = () => {
  const nurses = useState<Nurse[]>('adminNurses', () =>
    defaultNurses.map((nurse) => ({ ...nurse, user: { ...nurse.user } })),
  )

  const syncNurseStatus = (nurse: Nurse, isActive: boolean) => {
    nurse.isActive = isActive
    nurse.active = isActive
  }

  return {
    nurses,
    syncNurseStatus,
  }
}

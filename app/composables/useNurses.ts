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
      fullName: 'أمل يوسف',
      email: 'amal.yousef@mediconnect.test',
      password: 'demo-password',
      phone: '056-332-9081',
      role: 'nurse',
    },
    name: 'أمل يوسف',
    gender: 'female',
    specialty: 'ممرضة عامة',
    experienceYears: 6,
    price: 120,
    availabilityStatus: 'صباحية',
    image: '/images/doctor.png',
    isActive: true,
    active: true,
    address: 'رام الله - الماصيون',
    shift: 'صباحية',
    patients: 18,
  },
  {
    id: 'nurse-2',
    user: {
      fullName: 'مريم ناصر',
      email: 'mariam.nasser@mediconnect.test',
      password: 'demo-password',
      phone: '059-654-2210',
      role: 'nurse',
    },
    name: 'مريم ناصر',
    gender: 'female',
    specialty: 'رعاية منزلية',
    experienceYears: 5,
    price: 100,
    availabilityStatus: 'مسائية',
    image: '/images/doctor.png',
    isActive: true,
    active: true,
    address: 'البيرة - البالوع',
    shift: 'مسائية',
    patients: 12,
  },
  {
    id: 'nurse-3',
    user: {
      fullName: 'سامي محمود',
      email: 'sami.mahmoud@mediconnect.test',
      password: 'demo-password',
      phone: '056-111-7832',
      role: 'nurse',
    },
    name: 'سامي محمود',
    gender: 'male',
    specialty: 'رعاية كبار السن',
    experienceYears: 8,
    price: 130,
    availabilityStatus: 'ليلية',
    image: '/images/doctor.png',
    isActive: false,
    active: false,
    address: 'نابلس - رفيديا',
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

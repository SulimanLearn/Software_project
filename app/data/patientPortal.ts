import {
  Bell,
  CalendarDays,
  ClipboardList,
  HeartPulse,
  Home,
  PackageCheck,
  Pill,
  UserRound
} from '@lucide/vue'
import { markRaw } from 'vue'

export const patientProfile = {
  firstName: 'محمد',
  lastName: 'أبو حليمة',
  name: 'محمد أبو حليمة',
  role: 'مريض',
  email: 'mohammad.patient@example.com',
  phone: '0597654321',
  dateOfBirth: '1991-08-14',
  bloodType: 'O+',
  address: 'غزة، الرمال، شارع عمر المختار',
  status: 'نشط',
  avatar: ''
}

export const patientStats = [
  { label: 'المواعيد القادمة', value: 3, icon: markRaw(CalendarDays) },
  { label: 'الوصفات الطبية', value: 5, icon: markRaw(Pill) },
  { label: 'الطلبات النشطة', value: 2, icon: markRaw(PackageCheck) },
  { label: 'الإشعارات الجديدة', value: 4, icon: markRaw(Bell) }
]

export const patientAppointments = [
  {
    id: 1,
    code: 'P-2041',
    doctorName: 'د. خالد السيد',
    specialty: 'أمراض القلب',
    date: '2026-05-26',
    time: '10:30 ص',
    appointmentType: 'في العيادة',
    status: 'مؤكد',
    meetingLink: '',
    reason: 'متابعة ضغط الدم',
    notes: 'إحضار قياسات الضغط للأسبوع السابق.',
    category: 'upcoming',
    canJoin: false
  },
  {
    id: 2,
    code: 'P-2042',
    doctorName: 'د. سارة ناصر',
    specialty: 'طب الأسرة',
    date: '2026-05-27',
    time: '07:00 م',
    appointmentType: 'أونلاين',
    status: 'قيد الانتظار',
    meetingLink: 'https://meet.google.com/patient-demo',
    reason: 'استشارة عامة',
    notes: 'سيظهر رابط الاجتماع قبل الموعد.',
    category: 'upcoming',
    canJoin: true
  },
  {
    id: 3,
    code: 'P-2034',
    doctorName: 'د. ليلى حسن',
    specialty: 'الجلدية',
    date: '2026-05-12',
    time: '01:00 م',
    appointmentType: 'في العيادة',
    status: 'مكتمل',
    meetingLink: '',
    reason: 'حساسية جلدية',
    notes: 'تم صرف علاج موضعي لمدة أسبوعين.',
    category: 'completed',
    rating: 0
  },
  {
    id: 4,
    code: 'P-2029',
    doctorName: 'د. عادل منصور',
    specialty: 'العظام',
    date: '2026-04-28',
    time: '11:30 ص',
    appointmentType: 'أونلاين',
    status: 'ملغي',
    meetingLink: 'https://meet.google.com/old-patient-demo',
    reason: 'ألم الركبة',
    notes: 'تم الإلغاء بناء على طلب المريض.',
    category: 'cancelled',
    rating: 0
  },
  {
    id: 5,
    code: 'P-2030',
    doctorName: 'د. مريم سالم',
    specialty: 'العيون',
    date: '2026-05-02',
    time: '09:00 ص',
    appointmentType: 'في العيادة',
    status: 'مكتمل',
    meetingLink: '',
    reason: 'فحص نظر دوري',
    notes: 'الحالة مستقرة مع توصية بقطرة مرطبة.',
    category: 'completed',
    rating: 4
  }
]

export const patientPrescriptions = [
  {
    id: 1,
    number: 'RX-7781',
    doctorName: 'د. خالد السيد',
    date: '2026-05-12',
    diagnosis: 'ارتفاع ضغط الدم',
    medicationsCount: 2,
    status: 'فعالة',
    medications: [
      { name: 'أملوديبين 5mg', dosage: 'قرص واحد', frequency: 'مرة يوميا', duration: '30 يوم', instructions: 'بعد الإفطار' },
      { name: 'أسبرين 81mg', dosage: 'قرص واحد', frequency: 'مرة يوميا', duration: '30 يوم', instructions: 'بعد الغداء' }
    ]
  },
  {
    id: 2,
    number: 'RX-7710',
    doctorName: 'د. ليلى حسن',
    date: '2026-05-08',
    diagnosis: 'حساسية جلدية',
    medicationsCount: 2,
    status: 'فعالة',
    medications: [
      { name: 'كريم هيدروكورتيزون', dosage: 'طبقة خفيفة', frequency: 'مرتين يوميا', duration: '10 أيام', instructions: 'على المنطقة المصابة فقط' },
      { name: 'سيتريزين 10mg', dosage: 'قرص واحد', frequency: 'مساء', duration: '7 أيام', instructions: 'قد يسبب النعاس' }
    ]
  },
  {
    id: 3,
    number: 'RX-7633',
    doctorName: 'د. مريم سالم',
    date: '2026-04-29',
    diagnosis: 'جفاف العين',
    medicationsCount: 1,
    status: 'منتهية',
    medications: [
      { name: 'قطرة مرطبة', dosage: 'نقطة واحدة', frequency: '4 مرات يوميا', duration: '14 يوم', instructions: 'تجنب لمس طرف العبوة للعين' }
    ]
  }
]

export const patientOrders = [
  {
    id: 1,
    number: 'ORD-4509',
    prescriptionNumber: 'RX-7781',
    date: '2026-05-22',
    medications: 'أملوديبين، أسبرين',
    status: 'في التوصيل',
    address: patientProfile.address,
    timelineStep: 3
  },
  {
    id: 2,
    number: 'ORD-4488',
    prescriptionNumber: 'RX-7710',
    date: '2026-05-20',
    medications: 'كريم هيدروكورتيزون، سيتريزين',
    status: 'يتم التحضير',
    address: 'غزة، النصر، قرب مفترق السرايا',
    timelineStep: 2
  },
  {
    id: 3,
    number: 'ORD-4421',
    prescriptionNumber: 'RX-7633',
    date: '2026-05-01',
    medications: 'قطرة مرطبة',
    status: 'تم التسليم',
    address: patientProfile.address,
    timelineStep: 4
  }
]

export const patientRecords = [
  {
    id: 1,
    reportNumber: 'REP-3001',
    doctorName: 'د. خالد السيد',
    specialty: 'أمراض القلب',
    date: '2026-05-12',
    diagnosis: 'ارتفاع ضغط الدم',
    summary: 'قراءات الضغط أعلى من المعدل مع استجابة جيدة للخطة العلاجية.',
    recommendations: 'الالتزام بالدواء، تقليل الملح، ومراجعة بعد شهر.',
    prescriptions: ['RX-7781']
  },
  {
    id: 2,
    reportNumber: 'REP-2974',
    doctorName: 'د. ليلى حسن',
    specialty: 'الجلدية',
    date: '2026-05-08',
    diagnosis: 'حساسية جلدية',
    summary: 'طفح جلدي بسيط دون علامات عدوى.',
    recommendations: 'استخدام العلاج الموضعي وتجنب المهيجات.',
    prescriptions: ['RX-7710']
  },
  {
    id: 3,
    reportNumber: 'REP-2909',
    doctorName: 'د. مريم سالم',
    specialty: 'العيون',
    date: '2026-04-29',
    diagnosis: 'جفاف العين',
    summary: 'جفاف متوسط مع سلامة فحص قاع العين.',
    recommendations: 'قطرات مرطبة ومراجعة عند استمرار الأعراض.',
    prescriptions: ['RX-7633']
  }
]

export const patientNotifications = [
  {
    id: 1,
    type: 'appointment',
    icon: markRaw(CalendarDays),
    title: 'تذكير بموعد قادم',
    description: 'موعدك مع د. خالد السيد يوم الثلاثاء الساعة 10:30 ص.',
    date: '2026-05-24',
    time: '09:15 ص',
    unread: true,
    action: 'عرض الموعد'
  },
  {
    id: 2,
    type: 'prescription',
    icon: markRaw(Pill),
    title: 'تم إنشاء وصفة طبية',
    description: 'أضاف الطبيب وصفة RX-7781 إلى ملفك الطبي.',
    date: '2026-05-22',
    time: '01:40 م',
    unread: true,
    action: 'عرض الوصفة'
  },
  {
    id: 3,
    type: 'order',
    icon: markRaw(PackageCheck),
    title: 'تحديث طلب الصيدلية',
    description: 'طلب الأدوية ORD-4509 الآن في التوصيل.',
    date: '2026-05-22',
    time: '05:20 م',
    unread: true,
    action: 'تتبع الطلب'
  },
  {
    id: 4,
    type: 'nursing',
    icon: markRaw(Home),
    title: 'تحديث طلب التمريض المنزلي',
    description: 'تم قبول طلب زيارة قياس العلامات الحيوية.',
    date: '2026-05-21',
    time: '04:05 م',
    unread: false,
    action: 'عرض الطلب'
  }
]

export const nursingRequests = [
  {
    id: 1,
    number: 'NUR-1180',
    date: '2026-05-21',
    serviceType: 'قياس العلامات الحيوية',
    status: 'مقبول',
    nurseName: 'الممرضة آية محمود',
    address: patientProfile.address,
    preferredTime: '06:00 م',
    notes: 'زيارة متابعة بعد الموعد القلبي.'
  },
  {
    id: 2,
    number: 'NUR-1162',
    date: '2026-05-10',
    serviceType: 'تغيير ضماد',
    status: 'مكتمل',
    nurseName: 'الممرض أحمد حمدان',
    address: patientProfile.address,
    preferredTime: '11:00 ص',
    notes: 'تمت الزيارة دون ملاحظات إضافية.'
  }
]

export const medicalSummaryCards = [
  { label: 'التشخيصات السابقة', value: 8, icon: markRaw(HeartPulse) },
  { label: 'التقارير الطبية', value: 3, icon: markRaw(ClipboardList) },
  { label: 'الزيارات السابقة', value: 12, icon: markRaw(CalendarDays) },
  { label: 'الوصفات المرتبطة', value: 5, icon: markRaw(Pill) }
]

export const bookingDoctors = [
  { id: 'cardiology', name: 'د. خالد السيد', specialty: 'أمراض القلب', nextSlot: '2026-05-26 - 10:30 ص' },
  { id: 'family', name: 'د. سارة ناصر', specialty: 'طب الأسرة', nextSlot: '2026-05-27 - 07:00 م' },
  { id: 'dermatology', name: 'د. ليلى حسن', specialty: 'الجلدية', nextSlot: '2026-05-29 - 01:00 م' }
]

export const formatArabicDate = (dateValue: string) => {
  const date = new Date(`${dateValue}T00:00:00`)

  if (Number.isNaN(date.getTime())) {
    return 'غير متوفر'
  }

  return new Intl.DateTimeFormat('ar-u-nu-latn', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(date)
}

export const statusClassFor = (status: string) => {
  return {
    مكتمل: 'completed',
    فعالة: 'confirmed',
    منتهية: 'cancelled',
    مؤكد: 'confirmed',
    مقبول: 'confirmed',
    نشط: 'confirmed',
    'قيد الانتظار': 'waiting',
    'قيد المراجعة': 'waiting',
    'يتم التحضير': 'preparing',
    'في التوصيل': 'delivery',
    'قيد التنفيذ': 'delivery',
    ملغي: 'cancelled',
    مرفوض: 'cancelled',
    'تم التسليم': 'completed'
  }[status] || 'confirmed'
}

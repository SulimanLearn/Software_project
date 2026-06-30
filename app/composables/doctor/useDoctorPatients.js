const clone = (value) => JSON.parse(JSON.stringify(value))

const defaultPatients = [
  {
    id: 'p-2056',
    fileNumber: 'P-2056',
    fullName: 'أحمد محمود السيد',
    age: 42,
    gender: 'ذكر',
    phone: '0599123456',
    email: 'ahmad.sayed@example.com',
    address: 'رام الله - المصايف',
    lastVisit: '2026-05-19',
    visitCount: 8,
    latestDiagnosis: 'ارتفاع ضغط الدم مع متابعة دورية',
    followUpStatus: 'بحاجة لمتابعة',
    lastVisitType: 'في العيادة',
    prescriptions: [
      { number: 'RX-2026-014', date: '2026-05-19', medicines: ['Amlodipine 5mg', 'Aspirin 81mg'] }
    ],
    medicalHistory: ['ارتفاع ضغط الدم منذ 2023', 'حساسية بسيطة من البنسلين'],
    notes: 'ينصح بمراجعة قياسات الضغط أسبوعياً وتقليل الملح.'
  },
  {
    id: 'p-2057',
    fileNumber: 'P-2057',
    fullName: 'نور عبد الرحمن',
    age: 29,
    gender: 'أنثى',
    phone: '0567459182',
    email: 'nour.awad@example.com',
    address: 'البيرة - شارع القدس',
    lastVisit: '2026-05-16',
    visitCount: 5,
    latestDiagnosis: 'خفقان متقطع بحاجة لتخطيط متابعة',
    followUpStatus: 'مستقر',
    lastVisitType: 'أونلاين',
    prescriptions: [
      { number: 'RX-2026-011', date: '2026-05-16', medicines: ['Magnesium supplement'] }
    ],
    medicalHistory: ['نقص فيتامين د', 'لا توجد عمليات سابقة'],
    notes: 'تمت جدولة فحص تخطيط قلب في الزيارة القادمة.'
  },
  {
    id: 'p-2058',
    fileNumber: 'P-2058',
    fullName: 'محمد عبد الله سالم',
    age: 58,
    gender: 'ذكر',
    phone: '0598551200',
    email: 'mohammad.salem@example.com',
    address: 'نابلس - رفيديا',
    lastVisit: '2026-05-11',
    visitCount: 12,
    latestDiagnosis: 'سكري نوع ثاني مع دهنيات مرتفعة',
    followUpStatus: 'حالة حرجة',
    lastVisitType: 'في العيادة',
    prescriptions: [
      { number: 'RX-2026-009', date: '2026-05-11', medicines: ['Metformin 500mg', 'Atorvastatin 20mg'] }
    ],
    medicalHistory: ['سكري نوع ثاني', 'قسطرة قلبية عام 2021'],
    notes: 'يلزم فحص HbA1c ومراجعة نتائج الدهون خلال أسبوعين.'
  },
  {
    id: 'p-2059',
    fileNumber: 'P-2059',
    fullName: 'سارة يوسف خليل',
    age: 29,
    gender: 'أنثى',
    phone: '0597013344',
    email: 'sara.khalil@example.com',
    address: 'الخليل - الحرس',
    lastVisit: '2026-04-27',
    visitCount: 3,
    latestDiagnosis: 'التهاب قصبات حاد',
    followUpStatus: 'مستقر',
    lastVisitType: 'أونلاين',
    prescriptions: [
      { number: 'RX-2026-006', date: '2026-04-27', medicines: ['Paracetamol 500mg', 'Salbutamol inhaler'] }
    ],
    medicalHistory: ['ربو خفيف في الطفولة'],
    notes: 'الأعراض تحسنت بعد العلاج، لا توجد علامات خطورة حالياً.'
  },
  {
    id: 'p-2060',
    fileNumber: 'P-2060',
    fullName: 'ليان محمود ناصر',
    age: 47,
    gender: 'أنثى',
    phone: '0568899011',
    email: 'layan.nasser@example.com',
    address: 'بيت لحم - الدوحة',
    lastVisit: '2026-04-09',
    visitCount: 6,
    latestDiagnosis: 'صداع نصفي متكرر',
    followUpStatus: 'بحاجة لمتابعة',
    lastVisitType: 'في العيادة',
    prescriptions: [
      { number: 'RX-2026-004', date: '2026-04-09', medicines: ['Sumatriptan 50mg'] }
    ],
    medicalHistory: ['صداع نصفي منذ سنوات', 'فقر دم سابق'],
    notes: 'تدوين محفزات الصداع قبل الزيارة القادمة.'
  },
  {
    id: 'p-2061',
    fileNumber: 'P-2061',
    fullName: 'عمر فراس حماد',
    age: 18,
    gender: 'ذكر',
    phone: '0596007788',
    email: 'omar.hammad@example.com',
    address: 'جنين - الحي الشرقي',
    lastVisit: '2026-03-28',
    visitCount: 2,
    latestDiagnosis: 'التهاب لوزتين متكرر',
    followUpStatus: 'مستقر',
    lastVisitType: 'في العيادة',
    prescriptions: [
      { number: 'RX-2026-002', date: '2026-03-28', medicines: ['Ibuprofen 400mg'] }
    ],
    medicalHistory: ['لا يوجد تاريخ مرضي مزمن'],
    notes: 'تقييم أنف وأذن وحنجرة إذا تكررت الأعراض.'
  },
  {
    id: 'p-2062',
    fileNumber: 'P-2062',
    fullName: 'ياسر خالد عيسى',
    age: 51,
    gender: 'ذكر',
    phone: '0592114477',
    email: 'yaser.eissa@example.com',
    address: 'طولكرم - شويكة',
    lastVisit: '2026-02-20',
    visitCount: 15,
    latestDiagnosis: 'قصور قلب مزمن مستقر',
    followUpStatus: 'حالة حرجة',
    lastVisitType: 'أونلاين',
    prescriptions: [
      { number: 'RX-2026-001', date: '2026-02-20', medicines: ['Bisoprolol 2.5mg', 'Furosemide 40mg'] }
    ],
    medicalHistory: ['قصور قلب مزمن', 'ارتفاع ضغط الدم'],
    notes: 'مراقبة الوزن اليومي ومراجعة فورية عند زيادة ضيق النفس.'
  },
  {
    id: 'p-2063',
    fileNumber: 'P-2063',
    fullName: 'خالد علي منصور',
    age: 63,
    gender: 'ذكر',
    phone: '0564442199',
    email: 'khaled.mansour@example.com',
    address: 'طولكرم - الحي الجنوبي',
    lastVisit: '2026-04-28',
    visitCount: 10,
    latestDiagnosis: 'متابعة قصور قلب مع استقرار الأعراض',
    followUpStatus: 'بحاجة لمتابعة',
    lastVisitType: 'أونلاين',
    prescriptions: [
      { number: 'RX-2026-003', date: '2026-04-28', medicines: ['Furosemide 40mg'] }
    ],
    medicalHistory: ['قصور قلب مزمن', 'ارتفاع ضغط الدم'],
    notes: 'مراجعة فورية عند زيادة ضيق النفس أو تورم القدمين.'
  }
]

const toArabicDate = (dateValue) => {
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

export const useDoctorPatients = () => {
  const patients = useState('doctor-patients-demo-list', () => clone(defaultPatients))

  const patientsList = computed(() => Array.isArray(patients.value) ? patients.value : [])

  const findPatient = (patientId) => {
    const id = String(patientId || '')
    return patientsList.value.find((patient) => patient?.id === id) || null
  }

  const createPatientRecord = (patientId) => {
    const source = findPatient(patientId)

    if (!source) {
      return {
        patient: {
          id: 'P-0000',
          fullName: 'مريض غير محدد',
          age: 0,
          gender: 'غير محدد',
          phone: 'غير متوفر',
          email: 'غير متوفر',
          address: 'غير متوفر',
          lastVisit: 'غير متوفر',
          generalStatus: 'بيانات تجريبية لحين ربط الصفحة بواجهة backend.',
          avatar: '/images/face.svg'
        },
        medicalHistory: [],
        notes: [],
        prescriptions: [],
        reports: [],
        appointments: []
      }
    }

    return {
      patient: {
        id: source.fileNumber,
        fullName: source.fullName,
        age: source.age,
        gender: source.gender,
        phone: source.phone,
        email: source.email,
        address: source.address,
        lastVisit: toArabicDate(source.lastVisit),
        generalStatus: source.notes || source.latestDiagnosis || 'لا توجد ملاحظات مسجلة.',
        avatar: '/images/face.svg'
      },
      medicalHistory: [
        ...(Array.isArray(source.medicalHistory)
          ? source.medicalHistory.map((item, index) => ({
              id: `history-${source.id}-${index}`,
              type: index === 0 ? 'chronic' : 'general',
              title: item,
              description: item,
              date: source.lastVisit,
              doctor: 'د. خالد السيد',
              createdAt: source.lastVisit,
              notes: source.notes || '',
              attachments: []
            }))
          : []),
        {
          id: `diagnosis-${source.id}`,
          type: 'diagnosis',
          title: source.latestDiagnosis,
          description: source.latestDiagnosis,
          date: source.lastVisit,
          doctor: 'د. خالد السيد',
          status: source.followUpStatus,
          createdAt: source.lastVisit,
          notes: source.notes || '',
          attachments: []
        }
      ],
      notes: source.notes
        ? [{ id: `note-${source.id}`, date: source.lastVisit, doctor: 'د. خالد السيد', title: 'ملاحظة متابعة', text: source.notes }]
        : [],
      prescriptions: Array.isArray(source.prescriptions)
        ? source.prescriptions.map((prescription, index) => ({
            id: `prescription-${source.id}-${index}`,
            code: prescription.number,
            date: prescription.date,
            doctor: 'د. خالد السيد',
            status: 'نشطة',
            medicines: Array.isArray(prescription.medicines)
              ? prescription.medicines.map((name) => ({
                  name,
                  dose: 'حسب إرشادات الطبيب',
                  frequency: 'حسب الحاجة',
                  duration: 'غير محدد',
                  instructions: source.notes || ''
                }))
              : []
          }))
        : [],
      reports: [],
      appointments: [
        {
          id: `appointment-${source.id}`,
          date: toArabicDate(source.lastVisit),
          time: '10:00 ص',
          appointmentType: source.lastVisitType || 'في العيادة',
          meetingLink: source.lastVisitType === 'أونلاين' ? 'https://meet.google.com/demo-link' : '',
          reason: source.latestDiagnosis || 'متابعة طبية',
          notes: source.notes || ''
        }
      ]
    }
  }

  return {
    patients,
    patientsList,
    findPatient,
    createPatientRecord
  }
}

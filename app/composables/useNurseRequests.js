export const nurseStatuses = [
  { value: 'new', label: 'جديد' },
  { value: 'on-the-way', label: 'في الطريق' },
  { value: 'in-progress', label: 'قيد الإجراء' },
  { value: 'completed', label: 'مكتمل' }
]

const mockRequests = [
  {
    id: 'NR-1041',
    patientName: 'سليمان الخرطي',
    phone: '0591234567',
    serviceType: 'تغيير ضماد',
    address: 'حي الرمال - غزة',
    date: '25 مايو 2026',
    time: '09:30 ص',
    status: 'new',
    notes: 'يحتاج المريض إلى تغيير الضماد بعد العملية مع تقييم الجرح.'
  },
  {
    id: 'NR-1040',
    patientName: 'فاطمة المصري',
    phone: '0569876543',
    serviceType: 'إعطاء حقنة',
    address: 'تل الهوى - غزة',
    date: '25 مايو 2026',
    time: '10:45 ص',
    status: 'on-the-way',
    notes: 'جرعة موصوفة من الطبيب، يرجى الاتصال قبل الوصول.'
  },
  {
    id: 'NR-1039',
    patientName: 'أحمد الشيخ خليل',
    phone: '0591234567',
    serviceType: 'قياس المؤشرات الحيوية',
    address: 'الشيخ رضوان - غزة',
    date: '25 مايو 2026',
    time: '12:00 م',
    status: 'in-progress',
    notes: 'قياس الضغط ونسبة السكر وتسجيل النتائج في تقرير الزيارة.'
  },
  {
    id: 'NR-1038',
    patientName: 'آية الحداد',
    phone: '0569876543',
    serviceType: 'رعاية ما بعد الجراحة',
    address: 'خان يونس - حي الأمل',
    date: '24 مايو 2026',
    time: '05:15 م',
    status: 'completed',
    notes: 'متابعة عامة وتقديم تعليمات الرعاية المنزلية.'
  },
  {
    id: 'NR-1037',
    patientName: 'محمود عاشور',
    phone: '0591234567',
    serviceType: 'سحب عينة دم',
    address: 'رفح - حي الجنينة',
    date: '25 مايو 2026',
    time: '03:30 م',
    status: 'new',
    notes: 'المريض صائم منذ ثماني ساعات حسب التعليمات.'
  }
]

export const useNurseRequests = () => {
  const requests = useState('nurse-home-requests', () =>
    mockRequests.map(request => ({ ...request }))
  )

  const statusLabel = status =>
    nurseStatuses.find(item => item.value === status)?.label || status

  const updateStatus = (id, status) => {
    const request = requests.value.find(item => item.id === id)

    if (request) {
      request.status = status
    }
  }

  const stats = computed(() => nurseStatuses.map(status => ({
    status: status.value,
    label: status.label,
    count: requests.value.filter(request => request.status === status.value).length
  })))

  return {
    requests,
    stats,
    statusLabel,
    updateStatus
  }
}

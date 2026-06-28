import { computed } from 'vue'

type PatientNotificationIcon =
  | 'calendar'
  | 'bell'
  | 'fileText'
  | 'pill'
  | 'messageCircle'
  | 'clipboardList'
  | 'creditCard'
  | 'xCircle'

type PatientNotification = {
  id: number
  type: string
  icon: PatientNotificationIcon
  color: string
  title: string
  description: string
  date: string
  time: string
  relativeTime: string
  isRead: boolean
  action: string
  route: string
}

const initialPatientNotifications: PatientNotification[] = [
  {
    id: 1,
    type: 'appointment-confirmed',
    icon: 'calendar',
    color: 'blue',
    title: 'تم تأكيد الموعد',
    description: 'تم تأكيد موعدك مع د. خالد السيد غداً الساعة 10:30 صباحاً.',
    date: '2026-05-26',
    time: '10:30 ص',
    relativeTime: 'منذ 5 دقائق',
    isRead: false,
    action: 'عرض الموعد',
    route: '/patient/appointments'
  },
  {
    id: 2,
    type: 'appointment-reminder',
    icon: 'bell',
    color: 'purple',
    title: 'تذكير بموعد قادم',
    description: 'لديك موعد في عيادة القلب بعد ساعتين.',
    date: '2026-05-26',
    time: '08:30 ص',
    relativeTime: 'منذ 18 دقيقة',
    isRead: false,
    action: 'عرض الموعد',
    route: '/patient/appointments'
  },
  {
    id: 3,
    type: 'test-result-ready',
    icon: 'fileText',
    color: 'green',
    title: 'نتيجة التحليل جاهزة',
    description: 'تم رفع نتائج المختبر الجديدة إلى ملفك الطبي.',
    date: '2026-05-25',
    time: '04:10 م',
    relativeTime: 'منذ ساعة',
    isRead: false,
    action: 'عرض النتيجة',
    route: '/patient/records'
  },
  {
    id: 4,
    type: 'prescription-available',
    icon: 'pill',
    color: 'orange',
    title: 'وصفة طبية متاحة',
    description: 'أصدر الطبيب وصفة جديدة ويمكنك طلبها من الصيدلية.',
    date: '2026-05-25',
    time: '02:45 م',
    relativeTime: 'منذ ساعتين',
    isRead: true,
    action: 'عرض الوصفة',
    route: '/patient/prescriptions'
  },
  {
    id: 5,
    type: 'doctor-message',
    icon: 'messageCircle',
    color: 'blue',
    title: 'رسالة من الطبيب',
    description: 'أرسل د. أحمد ملاحظة متابعة بخصوص خطة العلاج.',
    date: '2026-05-24',
    time: '06:30 م',
    relativeTime: 'منذ 3 ساعات',
    isRead: true,
    action: 'عرض الرسالة',
    route: '/patient/records'
  },
  {
    id: 6,
    type: 'medical-record-updated',
    icon: 'clipboardList',
    color: 'green',
    title: 'تم تحديث السجل الطبي',
    description: 'تمت إضافة تقرير الزيارة الأخيرة إلى سجلك الطبي.',
    date: '2026-05-23',
    time: '11:20 ص',
    relativeTime: 'أمس',
    isRead: true,
    action: 'عرض السجل',
    route: '/patient/records'
  },
  {
    id: 7,
    type: 'payment-successful',
    icon: 'creditCard',
    color: 'emerald',
    title: 'تم الدفع بنجاح',
    description: 'اكتملت عملية دفع رسوم الموعد بنجاح.',
    date: '2026-05-22',
    time: '01:05 م',
    relativeTime: 'أمس',
    isRead: true,
    action: 'عرض الطلب',
    route: '/patient/orders'
  },
  {
    id: 8,
    type: 'appointment-cancelled',
    icon: 'xCircle',
    color: 'red',
    title: 'تم إلغاء الموعد',
    description: 'تم إلغاء موعد التمريض المنزلي بناءً على طلبك.',
    date: '2026-05-21',
    time: '09:50 ص',
    relativeTime: 'منذ يومين',
    isRead: true,
    action: 'عرض الطلب',
    route: '/patient/nursing'
  }
]

export const usePatientNotifications = () => {
  const notifications = useState('patient-notifications', () => (
    initialPatientNotifications.map((notification) => ({ ...notification }))
  ))

  const unreadCount = computed(() => (
    notifications.value.filter((notification) => !notification.isRead).length
  ))

  const latestNotifications = computed(() => notifications.value.slice(0, 5))

  const markAsRead = (notificationId: number) => {
    const notification = notifications.value.find((item) => item.id === notificationId)

    if (notification) {
      notification.isRead = true
    }
  }

  const toggleRead = (notificationId: number) => {
    const notification = notifications.value.find((item) => item.id === notificationId)

    if (notification) {
      notification.isRead = !notification.isRead
    }
  }

  const markAllAsRead = () => {
    notifications.value.forEach((notification) => {
      notification.isRead = true
    })
  }

  return {
    notifications,
    latestNotifications,
    unreadCount,
    markAsRead,
    toggleRead,
    markAllAsRead
  }
}

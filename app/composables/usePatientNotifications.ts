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

type ApiNotification = {
  id: number
  user_id?: number
  type?: string
  title?: string
  message?: string
  description?: string
  is_read?: boolean | number
  read_at?: string | null
  created_at?: string
  updated_at?: string
  data?: Record<string, unknown> | null
}

type NotificationFilters = {
  type?: string
  is_read?: boolean
  search?: string
  from?: string
  to?: string
  per_page?: number
}

type CreateNotificationPayload = {
  user_id: number
  type: string
  title: string
  message: string
  is_read?: boolean
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

const typeMeta: Record<string, Pick<PatientNotification, 'icon' | 'color' | 'action' | 'route'>> = {
  'appointment-confirmed': {
    icon: 'calendar',
    color: 'blue',
    action: 'عرض الموعد',
    route: '/patient/appointments',
  },
  'appointment-reminder': {
    icon: 'bell',
    color: 'purple',
    action: 'عرض الموعد',
    route: '/patient/appointments',
  },
  'appointment-cancelled': {
    icon: 'xCircle',
    color: 'red',
    action: 'عرض الموعد',
    route: '/patient/appointments',
  },
  'test-result-ready': {
    icon: 'fileText',
    color: 'green',
    action: 'عرض النتيجة',
    route: '/patient/records',
  },
  'medical-record-updated': {
    icon: 'clipboardList',
    color: 'green',
    action: 'عرض السجل',
    route: '/patient/records',
  },
  'prescription-available': {
    icon: 'pill',
    color: 'orange',
    action: 'عرض الوصفة',
    route: '/patient/prescriptions',
  },
  'pharmacy-order': {
    icon: 'pill',
    color: 'emerald',
    action: 'عرض الطلب',
    route: '/patient/orders',
  },
  'payment-successful': {
    icon: 'creditCard',
    color: 'emerald',
    action: 'عرض الطلب',
    route: '/patient/orders',
  },
  'doctor-message': {
    icon: 'messageCircle',
    color: 'blue',
    action: 'عرض الرسالة',
    route: '/patient/records',
  },
}

const defaultMeta: Pick<PatientNotification, 'icon' | 'color' | 'action' | 'route'> = {
  icon: 'bell',
  color: 'blue',
  action: 'عرض التفاصيل',
  route: '/patient',
}

const formatNotificationTime = (value?: string) => {
  if (!value) {
    return ''
  }

  return new Intl.DateTimeFormat('ar-u-nu-latn', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(value))
}

const mapNotification = (notification: ApiNotification): PatientNotification => {
  const type = notification.type || 'general'
  const meta = typeMeta[type] || defaultMeta
  const createdAt = notification.created_at || notification.updated_at || ''
  const data = notification.data || {}
  const route = typeof data.route === 'string' ? data.route : meta.route

  return {
    id: notification.id,
    type,
    icon: meta.icon,
    color: meta.color,
    title: notification.title || 'إشعار جديد',
    description: notification.message || notification.description || '',
    date: createdAt ? createdAt.slice(0, 10) : '',
    time: formatNotificationTime(createdAt),
    relativeTime: '',
    isRead: Boolean(notification.is_read),
    action: meta.action,
    route,
  }
}

export const usePatientNotifications = () => {
  const { authFetch, user } = useAuth()
  const notifications = useState('patient-notifications', () => (
    initialPatientNotifications.map((notification) => ({ ...notification }))
  ))
  const notificationsLoading = useState('patient-notifications-loading', () => false)
  const notificationsError = useState<string | null>('patient-notifications-error', () => null)
  const apiUnreadCount = useState<number | null>('patient-notifications-api-unread-count', () => null)

  const unreadCount = computed(() => (
    apiUnreadCount.value ?? notifications.value.filter((notification) => !notification.isRead).length
  ))

  const latestNotifications = computed(() => notifications.value.slice(0, 5))

  const currentUserId = computed(() => Number(user.value?.id) || 0)

  const fetchNotifications = async (filters: NotificationFilters = {}) => {
    if (!currentUserId.value) {
      notificationsError.value = 'تعذر تحديد المستخدم من بيانات تسجيل الدخول.'
      return notifications.value
    }

    notificationsLoading.value = true
    notificationsError.value = null

    try {
      const params = new URLSearchParams({
        user_id: String(currentUserId.value),
        per_page: String(filters.per_page || 50),
      })

      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && key !== 'per_page') {
          params.set(key, String(value))
        }
      })

      const response = await authFetch<{
        status: boolean
        message: string
        data: {
          notifications: ApiNotification[]
          unread_count: number
        }
      }>(`/notifications?${params.toString()}`)

      notifications.value = response.data.notifications.map(mapNotification)
      apiUnreadCount.value = response.data.unread_count
      return notifications.value
    } catch (error) {
      notificationsError.value = 'تعذر تحميل الإشعارات من الخادم، تم عرض البيانات المحلية مؤقتاً.'
      return notifications.value
    } finally {
      notificationsLoading.value = false
    }
  }

  const createNotification = async (payload: CreateNotificationPayload) => {
    const response = await authFetch<{
      status: boolean
      message: string
      data: ApiNotification
    }>('/notifications', {
      method: 'POST',
      body: payload,
    })

    const notification = mapNotification(response.data)
    notifications.value = [notification, ...notifications.value]

    if (!notification.isRead) {
      apiUnreadCount.value = (apiUnreadCount.value ?? unreadCount.value) + 1
    }

    return notification
  }

  const markAsRead = async (notificationId: number) => {
    const notification = notifications.value.find((item) => item.id === notificationId)

    if (!notification || notification.isRead) {
      return notification
    }

    notification.isRead = true
    apiUnreadCount.value = Math.max(0, (apiUnreadCount.value ?? unreadCount.value) - 1)

    try {
      const response = await authFetch<{
        status: boolean
        message: string
        data: ApiNotification
      }>(`/notifications/${notificationId}/read`, {
        method: 'PATCH',
        body: { user_id: currentUserId.value },
      })

      const updated = mapNotification(response.data)
      notifications.value = notifications.value.map(item => (item.id === notificationId ? updated : item))
      return updated
    } catch (error) {
      notificationsError.value = 'تعذر تحديث حالة الإشعار على الخادم.'
      return notification
    }
  }

  const toggleRead = async (notificationId: number) => {
    const notification = notifications.value.find((item) => item.id === notificationId)

    if (notification && !notification.isRead) {
      return markAsRead(notificationId)
    }

    return notification
  }

  const markAllAsRead = async () => {
    const previousNotifications = notifications.value.map(notification => ({ ...notification }))
    notifications.value.forEach((notification) => {
      notification.isRead = true
    })
    apiUnreadCount.value = 0

    if (!currentUserId.value) {
      return
    }

    try {
      await authFetch('/notifications/read-all', {
        method: 'PATCH',
        body: { user_id: currentUserId.value },
      })
    } catch (error) {
      notifications.value = previousNotifications
      apiUnreadCount.value = previousNotifications.filter(notification => !notification.isRead).length
      notificationsError.value = 'تعذر تعليم كل الإشعارات كمقروءة على الخادم.'
    }
  }

  const deleteNotification = async (notificationId: number) => {
    const previousNotifications = notifications.value.map(notification => ({ ...notification }))
    const notification = notifications.value.find(item => item.id === notificationId)

    notifications.value = notifications.value.filter(item => item.id !== notificationId)

    if (notification && !notification.isRead) {
      apiUnreadCount.value = Math.max(0, (apiUnreadCount.value ?? unreadCount.value) - 1)
    }

    try {
      await authFetch(`/notifications/${notificationId}?user_id=${currentUserId.value}`, {
        method: 'DELETE',
      })
    } catch (error) {
      notifications.value = previousNotifications
      apiUnreadCount.value = previousNotifications.filter(item => !item.isRead).length
      notificationsError.value = 'تعذر حذف الإشعار من الخادم.'
    }
  }

  return {
    notifications,
    latestNotifications,
    unreadCount,
    notificationsLoading,
    notificationsError,
    fetchNotifications,
    createNotification,
    markAsRead,
    toggleRead,
    markAllAsRead,
    deleteNotification,
  }
}

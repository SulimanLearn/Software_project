import { patientOrders } from '~/data/patientPortal'
import { pharmacistOrders } from '~/data/pharmacistPortal'

type ApiPharmacyOrder = {
  id: number
  patient_id: number
  prescription_id: number
  status: string
  delivery_address?: string | null
  notes?: string | null
  ordered_at?: string | null
  created_at?: string | null
  updated_at?: string | null
}

type ApiPharmacyOrderItem = {
  name: string
  price?: number
  dosage: string
  frequency: string
  duration: string
}

const apiStatusToPatientStatus: Record<string, string> = {
  pending: 'قيد المراجعة',
  preparing: 'يتم التحضير',
  on_delivery: 'في التوصيل',
  delivered: 'تم التسليم',
}

const apiStatusToPharmacistStatus: Record<string, string> = {
  pending: 'جديد',
  preparing: 'قيد المعالجة',
  on_delivery: 'في التوصيل',
  delivered: 'مكتمل',
}

const pharmacistStatusToApiStatus: Record<string, string> = {
  جديد: 'pending',
  'قيد المعالجة': 'preparing',
  جاهز: 'preparing',
  'في التوصيل': 'on_delivery',
  مكتمل: 'delivered',
  'تم التسليم': 'delivered',
  pending: 'pending',
  preparing: 'preparing',
  on_delivery: 'on_delivery',
  delivered: 'delivered',
}

const timelineStepForApiStatus = (status: string) => ({
  pending: 1,
  preparing: 2,
  on_delivery: 3,
  delivered: 4,
}[status] || 1)

const toDate = (value?: string | null) => {
  if (!value) {
    return new Date().toISOString().slice(0, 10)
  }

  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? String(value).slice(0, 10) : date.toISOString().slice(0, 10)
}

const toTime = (value?: string | null) => {
  if (!value) {
    return ''
  }

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return String(value).slice(11, 16)
  }

  return new Intl.DateTimeFormat('ar-u-nu-latn', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

const mapItems = (items: ApiPharmacyOrderItem[] = []) => items.map((item, index) => {
  const unitPrice = Number(item.price || 0)
  const quantity = 1

  return {
    name: item.name || `دواء ${index + 1}`,
    dosage: item.dosage,
    frequency: item.frequency,
    duration: item.duration,
    quantity,
    unitPrice,
    totalPrice: unitPrice * quantity,
    instructions: 'حسب تعليمات الطبيب',
  }
})

const mapOrder = (order: ApiPharmacyOrder, items: ApiPharmacyOrderItem[] = []) => {
  const medicines = mapItems(items)
  const medicinesText = medicines.map(item => item.name).join('، ') || 'حسب الوصفة'
  const orderedAt = order.ordered_at || order.created_at
  const patientStatus = apiStatusToPatientStatus[order.status] || order.status
  const pharmacistStatus = apiStatusToPharmacistStatus[order.status] || order.status
  const medicinesTotal = medicines.reduce((total, medicine) => total + Number(medicine.totalPrice || 0), 0)

  return {
    id: String(order.id),
    apiId: order.id,
    number: `ORD-${order.id}`,
    prescriptionId: order.prescription_id,
    prescriptionNumber: `RX-${order.prescription_id}`,
    patientId: order.patient_id,
    patientName: `مريض #${order.patient_id}`,
    phone: '',
    email: '',
    address: order.delivery_address || 'غير متوفر',
    date: toDate(orderedAt),
    time: toTime(orderedAt),
    paymentMethod: 'غير متوفر',
    deliveryMethod: 'توصيل للمنزل',
    notes: order.notes || '',
    pharmacistNotes: '',
    status: pharmacistStatus,
    patientStatus,
    medicines,
    medications: medicinesText,
    deliveryFee: 0,
    discount: 0,
    medicinesTotal,
    finalTotal: medicinesTotal,
    timelineStep: timelineStepForApiStatus(order.status),
  }
}

const localOrders = () => pharmacistOrders.map(order => ({
  ...order,
  apiId: Number(String(order.id).replace(/\D/g, '')) || undefined,
  patientStatus: order.status,
  medications: order.medicines.map(medicine => medicine.name).join('، '),
  timelineStep: 1,
  medicines: order.medicines.map(medicine => ({ ...medicine })),
}))

export const usePharmacyOrders = () => {
  const { authFetch } = useAuth()
  const pharmacyOrders = useState('api-pharmacy-orders', localOrders)
  const pharmacyOrdersLoading = useState('api-pharmacy-orders-loading', () => false)
  const pharmacyOrdersError = useState<string | null>('api-pharmacy-orders-error', () => null)

  const fetchPharmacyOrders = async () => {
    pharmacyOrdersLoading.value = true
    pharmacyOrdersError.value = null

    try {
      const response = await authFetch<{ status: boolean; data: ApiPharmacyOrder[] }>('/pharmacy-orders')
      pharmacyOrders.value = response.data.map(order => mapOrder(order))
      return pharmacyOrders.value
    } catch (error) {
      pharmacyOrdersError.value = 'تعذر تحميل طلبات الصيدلية من الخادم، تم عرض البيانات المحلية مؤقتاً.'
      pharmacyOrders.value = localOrders()
      return pharmacyOrders.value
    } finally {
      pharmacyOrdersLoading.value = false
    }
  }

  const fetchPharmacyOrder = async (orderId: string | number) => {
    const response = await authFetch<{ status: boolean; data: { order: ApiPharmacyOrder; items: ApiPharmacyOrderItem[] } }>(`/pharmacy-orders/${orderId}`)
    const mapped = mapOrder(response.data.order, response.data.items)
    const index = pharmacyOrders.value.findIndex(order => order.apiId === mapped.apiId || order.id === mapped.id)

    if (index >= 0) {
      pharmacyOrders.value[index] = {
        ...pharmacyOrders.value[index],
        ...mapped,
      }
    } else {
      pharmacyOrders.value = [mapped, ...pharmacyOrders.value]
    }

    return mapped
  }

  const createPharmacyOrder = async (payload: { prescription_id: number; delivery_address?: string; notes?: string }) => {
    const response = await authFetch<{ status: boolean; message: string; data: ApiPharmacyOrder }>('/pharmacy-orders', {
      method: 'POST',
      body: payload,
    })
    const mapped = mapOrder(response.data)
    pharmacyOrders.value = [mapped, ...pharmacyOrders.value.filter(order => order.apiId !== mapped.apiId)]
    return mapped
  }

  const updatePharmacyOrderStatus = async (orderId: string | number, status: string) => {
    const apiStatus = pharmacistStatusToApiStatus[status] || status
    const response = await authFetch<{ status: boolean; message: string; data: ApiPharmacyOrder }>(`/pharmacy-orders/${orderId}`, {
      method: 'PUT',
      body: { status: apiStatus },
    })
    const mapped = mapOrder(response.data)
    const index = pharmacyOrders.value.findIndex(order => order.apiId === mapped.apiId || order.id === mapped.id || order.number === `ORD-${orderId}`)

    if (index >= 0) {
      pharmacyOrders.value[index] = {
        ...pharmacyOrders.value[index],
        ...mapped,
      }
    }

    return mapped
  }

  const patientMedicationOrders = computed(() => pharmacyOrders.value.map(order => ({
    id: order.id,
    apiId: order.apiId,
    number: order.number,
    prescriptionNumber: order.prescriptionNumber,
    date: order.date,
    medications: order.medications,
    status: order.patientStatus || order.status,
    address: order.address,
    timelineStep: order.timelineStep,
    patientId: order.patientId,
  })))

  return {
    pharmacyOrders,
    patientMedicationOrders,
    pharmacyOrdersLoading,
    pharmacyOrdersError,
    fetchPharmacyOrders,
    fetchPharmacyOrder,
    createPharmacyOrder,
    updatePharmacyOrderStatus,
  }
}

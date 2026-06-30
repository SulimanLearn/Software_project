import {
  AlertTriangle,
  CheckCircle,
  Clock,
  ClipboardList,
  Pill
} from '@lucide/vue'
import { markRaw } from 'vue'
import { patientOrders, patientProfile } from '~/data/patientPortal'

export const pharmacistProfile = {
  name: 'د. أحمد الصيدلي',
  role: 'صيدلي',
  email: 'ahmad.pharmacist@example.com',
  phone: '0591234567',
  pharmacistId: 'PH-2048',
  pharmacyName: 'صيدلية العيادة المركزية',
  status: 'نشط',
  avatar: '/images/doctor.png'
}

export const pharmacistStatusOptions = ['جديد', 'قيد المعالجة', 'جاهز', 'في التوصيل', 'مكتمل', 'مرفوض']

const medicineTotal = (quantity: number, unitPrice: number) => Number((quantity * unitPrice).toFixed(2))

const orderTotals = (medicines: Array<{ quantity: number, unitPrice?: number }>, deliveryFee = 0, discount = 0) => {
  const medicinesTotal = medicines.reduce((total, medicine) => {
    return total + medicineTotal(Number(medicine.quantity || 0), Number(medicine.unitPrice || 0))
  }, 0)

  return {
    medicinesTotal: Number(medicinesTotal.toFixed(2)),
    deliveryFee,
    discount,
    finalTotal: Number((medicinesTotal + deliveryFee - discount).toFixed(2))
  }
}

export const pharmacistOrders = [
  {
    id: 'ord-4509',
    number: 'ORD-4509',
    prescriptionNumber: 'RX-7781',
    patientName: patientProfile.name,
    phone: patientProfile.phone,
    email: patientProfile.email,
    address: patientProfile.address,
    date: '2026-05-24',
    time: '10:20 ص',
    paymentMethod: 'الدفع عند الاستلام',
    deliveryMethod: 'توصيل للمنزل',
    notes: 'يفضل التواصل قبل الوصول بنصف ساعة.',
    pharmacistNotes: '',
    status: 'جديد',
    medicines: [
      { name: 'أملوديبين 5mg', dosage: 'قرص واحد', frequency: 'مرة يوميا', duration: '30 يوم', quantity: 1, unitPrice: 18, instructions: 'بعد الإفطار' },
      { name: 'أسبرين 81mg', dosage: 'قرص واحد', frequency: 'مرة يوميا', duration: '30 يوم', quantity: 1, unitPrice: 12, instructions: 'بعد الغداء' }
    ],
    ...orderTotals([
      { quantity: 1, unitPrice: 18 },
      { quantity: 1, unitPrice: 12 }
    ], 10, 0)
  },
  {
    id: 'ord-4488',
    number: 'ORD-4488',
    prescriptionNumber: 'RX-7710',
    patientName: 'نور عبد الرحمن',
    phone: '0594455667',
    email: 'nour.patient@example.com',
    address: 'غزة، النصر، قرب مفترق السرايا',
    date: '2026-05-24',
    time: '12:45 م',
    paymentMethod: 'بطاقة بنكية',
    deliveryMethod: 'استلام من الصيدلية',
    notes: 'المريضة ستستلم الطلب مساء.',
    pharmacistNotes: 'بانتظار تأكيد توفر الكريم.',
    status: 'قيد المعالجة',
    medicines: [
      { name: 'كريم هيدروكورتيزون', dosage: 'طبقة خفيفة', frequency: 'مرتين يوميا', duration: '10 أيام', quantity: 1, unitPrice: 22, instructions: 'على المنطقة المصابة فقط' },
      { name: 'سيتريزين 10mg', dosage: 'قرص واحد', frequency: 'مساء', duration: '7 أيام', quantity: 1, unitPrice: 9, instructions: 'قد يسبب النعاس' }
    ],
    ...orderTotals([
      { quantity: 1, unitPrice: 22 },
      { quantity: 1, unitPrice: 9 }
    ], 0, 3)
  },
  {
    id: 'ord-4421',
    number: 'ORD-4421',
    prescriptionNumber: 'RX-7633',
    patientName: 'محمد عبد الله سالم',
    phone: '0597788990',
    email: 'mohammad.salem@example.com',
    address: 'غزة، تل الهوا، شارع الصناعة',
    date: '2026-05-23',
    time: '09:10 ص',
    paymentMethod: 'الدفع عند الاستلام',
    deliveryMethod: 'توصيل للمنزل',
    notes: '',
    pharmacistNotes: '',
    status: 'جاهز',
    medicines: [
      { name: 'قطرة مرطبة', dosage: 'نقطة واحدة', frequency: '4 مرات يوميا', duration: '14 يوم', quantity: 3, unitPrice: 15, instructions: 'تجنب لمس طرف العبوة للعين' }
    ],
    ...orderTotals([{ quantity: 3, unitPrice: 15 }], 10, 0)
  },
  {
    id: 'ord-4385',
    number: 'ORD-4385',
    prescriptionNumber: 'RX-7602',
    patientName: 'سارة يوسف خالد',
    phone: '0591112233',
    email: '',
    address: 'غزة، الرمال، شارع الوحدة',
    date: '2026-05-23',
    time: '03:25 م',
    paymentMethod: 'محفظة إلكترونية',
    deliveryMethod: 'توصيل للمنزل',
    notes: 'العنوان بجانب الصيدلية القديمة.',
    pharmacistNotes: 'تم تسليم الطلب دون ملاحظات.',
    status: 'مكتمل',
    medicines: [
      { name: 'إيبوبروفين 400mg', dosage: 'قرص واحد', frequency: 'عند الحاجة', duration: '5 أيام', quantity: 2, unitPrice: 8, instructions: 'بعد الطعام' }
    ],
    ...orderTotals([{ quantity: 2, unitPrice: 8 }], 8, 0)
  },
  {
    id: 'ord-4320',
    number: 'ORD-4320',
    prescriptionNumber: 'RX-7511',
    patientName: 'ليان محمود ناصر',
    phone: '0593332211',
    email: 'layan.patient@example.com',
    address: 'غزة، الشجاعية، شارع بغداد',
    date: '2026-05-22',
    time: '05:05 م',
    paymentMethod: 'الدفع عند الاستلام',
    deliveryMethod: 'توصيل للمنزل',
    notes: 'حساسية سابقة من بعض المضادات.',
    pharmacistNotes: 'رفض الطلب لحاجة الوصفة لمراجعة الطبيب.',
    status: 'مرفوض',
    medicines: [
      { name: 'أوميبرازول 20mg', dosage: 'كبسولة واحدة', frequency: 'صباحا', duration: '14 يوم', quantity: 1, unitPrice: 14, instructions: 'قبل الطعام' }
    ],
    ...orderTotals([{ quantity: 1, unitPrice: 14 }], 10, 0)
  },
  ...patientOrders
    .filter(order => !['ORD-4509', 'ORD-4488', 'ORD-4421'].includes(order.number))
    .map(order => ({
      id: String(order.id),
      number: order.number,
      prescriptionNumber: order.prescriptionNumber,
      patientName: patientProfile.name,
      phone: patientProfile.phone,
      email: patientProfile.email,
      address: order.address,
      date: order.date,
      time: '11:00 ص',
      paymentMethod: 'الدفع عند الاستلام',
      deliveryMethod: 'توصيل للمنزل',
      notes: 'طلب منشأ من بوابة المريض.',
      pharmacistNotes: '',
      status: order.status,
      medicines: String(order.medications)
        .split('،')
        .map((name, index) => ({
          name: name.trim(),
          dosage: 'حسب الوصفة',
          frequency: 'حسب تعليمات الطبيب',
          duration: 'حسب الوصفة',
          quantity: index + 1,
          unitPrice: 10 + (index * 5),
          totalPrice: medicineTotal(index + 1, 10 + (index * 5)),
          instructions: 'مراجعة الوصفة الطبية عند التسليم'
        })),
      ...orderTotals(String(order.medications)
        .split('،')
        .map((_, index) => ({ quantity: index + 1, unitPrice: 10 + (index * 5) })), 10, 0)
    }))
]

export const inventoryItems = [
  { id: 'MED-1001', name: 'باراسيتامول 500 مجم', category: 'مسكنات', quantity: 8, minQuantity: 20, expiryDate: '2027-02-15', supplier: 'شركة الشفاء الطبية', notes: 'الطلب القادم خلال أسبوع' },
  { id: 'MED-1002', name: 'أموكسيسيلين 500 مجم', category: 'مضادات حيوية', quantity: 5, minQuantity: 15, expiryDate: '2026-12-10', supplier: 'المورد الطبي الأول', notes: 'كمية حرجة' },
  { id: 'MED-1003', name: 'فيتامين د3 1000 وحدة', category: 'فيتامينات', quantity: 3, minQuantity: 12, expiryDate: '2027-06-01', supplier: 'مستودع النور', notes: '' },
  { id: 'MED-1004', name: 'إيبوبروفين 400 مجم', category: 'مسكنات', quantity: 6, minQuantity: 18, expiryDate: '2026-10-20', supplier: 'شركة الشفاء الطبية', notes: 'يحتاج متابعة' },
  { id: 'MED-1005', name: 'أوميبرازول 20 مجم', category: 'الجهاز الهضمي', quantity: 42, minQuantity: 12, expiryDate: '2027-03-11', supplier: 'صيد فارما', notes: '' },
  { id: 'MED-1006', name: 'قطرة مرطبة', category: 'عيون', quantity: 0, minQuantity: 10, expiryDate: '2027-01-08', supplier: 'مورد العيون', notes: 'غير متوفر حاليا' },
  { id: 'MED-1007', name: 'كريم هيدروكورتيزون', category: 'جلدية', quantity: 18, minQuantity: 8, expiryDate: '2026-04-01', supplier: 'مستودع النور', notes: 'مراجعة الصلاحية' }
]

export const pharmacistStats = [
  { label: 'الطلبات الجديدة', helper: 'طلبات جديدة', valueKey: 'new', icon: markRaw(ClipboardList) },
  { label: 'قيد المعالجة', helper: 'طلبات جارية', valueKey: 'processing', icon: markRaw(Clock) },
  { label: 'الطلبات المكتملة', helper: 'هذا الأسبوع', valueKey: 'completed', icon: markRaw(CheckCircle) },
  { label: 'أدوية منخفضة المخزون', helper: 'تحتاج إلى متابعة', valueKey: 'lowStock', icon: markRaw(AlertTriangle) }
]

export const quantityStatusFor = (quantity: number, minQuantity: number) => {
  if (quantity <= 0) return 'غير متوفر'
  if (quantity < minQuantity) return 'منخفض'
  return 'متوفر'
}

export const inventoryStatusFor = (item: { quantity: number, minQuantity: number, expiryDate: string, status?: string }) => {
  if (item.status) return item.status

  const today = new Date()
  const expiry = new Date(`${item.expiryDate}T00:00:00`)

  if (!Number.isNaN(expiry.getTime()) && expiry < today) return 'منتهي الصلاحية'
  return quantityStatusFor(item.quantity, item.minQuantity)
}

export const statusClassForPharmacist = (status: string) => {
  return {
    جديد: 'new',
    'قيد المعالجة': 'processing',
    جاهز: 'ready',
    'في التوصيل': 'delivery',
    مكتمل: 'completed',
    مرفوض: 'rejected',
    متوفر: 'available',
    منخفض: 'low',
    'غير متوفر': 'unavailable',
    'منتهي الصلاحية': 'expired',
    نشط: 'available',
    'غير نشط': 'rejected',
    'تم التسليم': 'completed',
    'يتم التحضير': 'processing'
  }[status] || 'new'
}

export const statusToPatientOrder = (status: string) => {
  return {
    جديد: 'قيد المراجعة',
    'قيد المعالجة': 'يتم التحضير',
    جاهز: 'يتم التحضير',
    'في التوصيل': 'في التوصيل',
    مكتمل: 'تم التسليم',
    مرفوض: 'مرفوض'
  }[status] || status
}

export const timelineStepForStatus = (status: string) => {
  return {
    جديد: 1,
    'قيد المعالجة': 2,
    جاهز: 2,
    'في التوصيل': 3,
    مكتمل: 4,
    مرفوض: 1
  }[status] || 1
}

export const orderMedicinesText = (order: { medicines: Array<{ name: string }> }) => {
  return order.medicines.map(medicine => medicine.name).join('، ')
}

export const orderQuantity = (order: { medicines: Array<{ quantity: number }> }) => {
  return order.medicines.reduce((total, medicine) => total + Number(medicine.quantity || 0), 0)
}

export const formatPharmacistDate = (dateValue: string) => {
  const date = new Date(`${dateValue}T00:00:00`)

  if (Number.isNaN(date.getTime())) return 'غير متوفر'

  return new Intl.DateTimeFormat('ar-u-nu-latn', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(date)
}

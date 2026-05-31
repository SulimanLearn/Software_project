import {
  inventoryItems,
  inventoryStatusFor,
  pharmacistOrders,
  quantityStatusFor,
  statusToPatientOrder,
  timelineStepForStatus
} from '~/data/pharmacistPortal'

export const usePharmacistPortal = () => {
  const orders = useState('pharmacist-medication-orders', () => pharmacistOrders.map(order => ({
    ...order,
    medicines: order.medicines.map(medicine => ({ ...medicine }))
  })))

  const inventory = useState('pharmacist-inventory', () => inventoryItems.map(item => ({ ...item })))
  const { medicationOrders } = usePatientMedicationOrders()

  const lowStockItems = computed(() => inventory.value.filter(item => inventoryStatusFor(item) === 'منخفض' || inventoryStatusFor(item) === 'غير متوفر'))

  const updateOrderStatus = (orderNumber: string, status: string, pharmacistNotes?: string) => {
    const order = orders.value.find(item => item.number === orderNumber)

    if (order) {
      order.status = status

      if (typeof pharmacistNotes === 'string') {
        order.pharmacistNotes = pharmacistNotes
      }
    }

    const patientOrder = medicationOrders.value.find(item => item.number === orderNumber)

    if (patientOrder) {
      patientOrder.status = statusToPatientOrder(status)
      patientOrder.timelineStep = timelineStepForStatus(status)
    }
  }

  const updateStock = (medicineId: string, addedQuantity: number, expiryDate: string, supplier: string, notes: string) => {
    const item = inventory.value.find(medicine => medicine.id === medicineId)

    if (!item) return false

    item.quantity = Number(item.quantity) + Number(addedQuantity)
    item.expiryDate = expiryDate || item.expiryDate
    item.supplier = supplier || item.supplier
    item.notes = notes || item.notes
    item.status = quantityStatusFor(Number(item.quantity), Number(item.minQuantity))

    return true
  }

  const updateMedicineDetails = (medicineId: string, details: {
    name: string
    category: string
    quantity: number
    minQuantity: number
    expiryDate: string
    status: string
    notes: string
  }) => {
    const item = inventory.value.find(medicine => medicine.id === medicineId)

    if (!item) return false

    item.name = details.name || item.name
    item.category = details.category || item.category
    item.quantity = Number(details.quantity)
    item.minQuantity = Number(details.minQuantity)
    item.expiryDate = details.expiryDate || item.expiryDate
    item.status = details.status || quantityStatusFor(Number(item.quantity), Number(item.minQuantity))
    item.notes = details.notes

    return true
  }

  return {
    orders,
    inventory,
    lowStockItems,
    updateOrderStatus,
    updateStock,
    updateMedicineDetails
  }
}

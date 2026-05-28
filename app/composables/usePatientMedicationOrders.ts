import { patientOrders } from '~/data/patientPortal'

export const usePatientMedicationOrders = () => {
  const medicationOrders = useState('patient-medication-orders', () => patientOrders.map(order => ({ ...order })))

  const addMedicationOrder = (order: Record<string, any>) => {
    const exists = medicationOrders.value.some(item => item.number === order.number)

    if (!exists) {
      medicationOrders.value = [order, ...medicationOrders.value]
    }
  }

  return {
    medicationOrders,
    addMedicationOrder
  }
}

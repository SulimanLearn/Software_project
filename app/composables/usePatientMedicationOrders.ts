export const usePatientMedicationOrders = () => {
  const {
    patientMedicationOrders,
    pharmacyOrdersLoading,
    pharmacyOrdersError,
    fetchPharmacyOrders,
    createPharmacyOrder,
  } = usePharmacyOrders()
  const medicationOrders = patientMedicationOrders

  const addMedicationOrder = async (order: Record<string, any>) => {
    if (order.prescriptionId || order.prescription_id) {
      return createPharmacyOrder({
        prescription_id: Number(order.prescriptionId || order.prescription_id),
        delivery_address: order.address || order.deliveryAddress || '',
        notes: order.notes || '',
      })
    }

    return order
  }

  return {
    medicationOrders,
    medicationOrdersLoading: pharmacyOrdersLoading,
    medicationOrdersError: pharmacyOrdersError,
    fetchMedicationOrders: fetchPharmacyOrders,
    addMedicationOrder
  }
}

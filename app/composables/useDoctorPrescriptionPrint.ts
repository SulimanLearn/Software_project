export const useDoctorPrescriptionPrint = () => {
  const doctorPrescriptionPrintItem = ref<{ kind: 'prescription', data: Record<string, any> } | null>(null)
  const doctorPrescriptionPrintDate = ref<Date | null>(null)

  const printDoctorPrescription = async (prescription: Record<string, any>) => {
    doctorPrescriptionPrintItem.value = { kind: 'prescription', data: prescription }
    doctorPrescriptionPrintDate.value = new Date()
    document.body.classList.add('is-printing-document')
    await nextTick()
    window.setTimeout(() => {
      window.print()
      window.setTimeout(() => {
        document.body.classList.remove('is-printing-document')
      }, 500)
    }, 150)
  }

  return {
    doctorPrescriptionPrintDate,
    doctorPrescriptionPrintItem,
    printDoctorPrescription
  }
}

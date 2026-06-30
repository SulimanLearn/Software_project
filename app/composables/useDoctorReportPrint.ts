export const useDoctorReportPrint = () => {
  const doctorReportPrintItem = ref<{ kind: 'report', data: Record<string, any> } | null>(null)
  const doctorReportPrintDate = ref<Date | null>(null)

  const printDoctorReport = async (report: Record<string, any>) => {
    doctorReportPrintItem.value = { kind: 'report', data: report }
    doctorReportPrintDate.value = new Date()
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
    doctorReportPrintItem,
    doctorReportPrintDate,
    printDoctorReport
  }
}

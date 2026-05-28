const appointmentBookingRoute = '/doctors'

export const usePatientAppointmentBooking = () => {
  const goToAppointmentBooking = () => navigateTo(appointmentBookingRoute)

  return {
    appointmentBookingRoute,
    goToAppointmentBooking
  }
}

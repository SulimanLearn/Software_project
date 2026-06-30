<template>
  <PatientPortalLayout title="حجز موعد جديد" subtitle="اختر الطبيب ونوع الموعد والوقت المناسب.">
    <section class="patient-dashboard-card" aria-labelledby="booking-title">
      <div class="patient-section-header">
        <h2 id="booking-title">بيانات الحجز</h2>
        <span>نقطة دخول سريعة للحجز</span>
      </div>

      <form class="patient-form-grid" @submit.prevent="submitBooking">
        <label class="patient-form-field">
          <span>الطبيب</span>
          <select v-model="form.doctorId" required>
            <option v-for="doctor in bookingDoctors" :key="doctor.id" :value="doctor.id">
              {{ doctor.name }} - {{ doctor.specialty }}
            </option>
          </select>
        </label>
        <label class="patient-form-field">
          <span>نوع الموعد</span>
          <select v-model="form.appointmentType" required>
            <option>في العيادة</option>
            <option>أونلاين</option>
          </select>
        </label>
        <label class="patient-form-field">
          <span>التاريخ المفضل</span>
          <input v-model="form.date" type="date" required>
        </label>
        <label class="patient-form-field">
          <span>الوقت المفضل</span>
          <input v-model="form.time" type="time" required>
        </label>
        <label class="patient-form-field full">
          <span>سبب الزيارة</span>
          <textarea v-model.trim="form.reason" rows="3" required />
        </label>
        <div class="patient-action-row">
          <button class="patient-save-button" type="submit">تأكيد طلب الحجز</button>
          <NuxtLink class="patient-action-button outline" to="/patient/appointments">العودة للمواعيد</NuxtLink>
        </div>
      </form>
    </section>

    <section class="patient-dashboard-card" aria-labelledby="doctors-title">
      <div class="patient-section-header">
        <h2 id="doctors-title">أقرب المواعيد المتاحة</h2>
        <span>{{ bookingDoctors.length }} أطباء</span>
      </div>
      <div class="patient-list">
        <article v-for="doctor in bookingDoctors" :key="doctor.id" class="patient-list-item">
          <strong>{{ doctor.name }} - {{ doctor.specialty }}</strong>
          <p>أقرب موعد: {{ doctor.nextSlot }}</p>
        </article>
      </div>
    </section>

    <div v-if="toastMessage" class="patient-toast-message" role="status">{{ toastMessage }}</div>
  </PatientPortalLayout>
</template>

<script setup>
import { bookingDoctors } from '~/data/patientPortal'

const { goToAppointmentBooking } = usePatientAppointmentBooking()
await goToAppointmentBooking()

const toastMessage = ref('')
const form = reactive({
  doctorId: bookingDoctors[0]?.id || '',
  appointmentType: 'في العيادة',
  date: '2026-05-28',
  time: '10:00',
  reason: 'متابعة صحية'
})

const submitBooking = () => {
  toastMessage.value = 'تم إرسال طلب الحجز وسيتم إشعارك عند التأكيد'
  window.setTimeout(() => {
    toastMessage.value = ''
  }, 2600)
}
</script>

<template>
  <PatientPortalLayout
    title="نظرة عامة"
    :eyebrow="currentArabicDate"
    :subtitle="`مرحباً بعودتك، ${patientProfile.name}. هذا ملخص نشاطك الصحي.`"
  >
    <template #header-action>
      <PatientActionButton :to="appointmentBookingRoute" variant="primary">
        حجز موعد جديد
      </PatientActionButton>
    </template>

    <div class="patient-overview-stack">
      <section class="patient-stats-grid" aria-label="ملخص حساب المريض">
        <article v-for="stat in patientStats" :key="stat.label" class="patient-stat-card">
          <div class="patient-stat-copy">
            <strong>{{ stat.value }}</strong>
            <span>{{ stat.label }}</span>
          </div>
          <component :is="stat.icon" class="patient-stat-icon" :size="26" :stroke-width="2" aria-hidden="true" />
        </article>
      </section>

      <section class="patient-dashboard-card patient-stack" aria-labelledby="upcoming-appointments-title">
        <div class="patient-section-header">
          <h2 id="upcoming-appointments-title">المواعيد القادمة</h2>
          <span>{{ upcomingAppointments.length }} مواعيد</span>
        </div>

        <div class="patient-table-wrap">
          <table class="patient-table">
            <thead>
              <tr>
                <th>رقم الموعد</th>
                <th>الطبيب</th>
                <th>التخصص</th>
                <th>التاريخ</th>
                <th>الوقت</th>
                <th>النوع</th>
                <th>الحالة</th>
                <th>إجراء</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="appointment in upcomingAppointments" :key="appointment.id">
                <td data-label="رقم الموعد">{{ appointment.code }}</td>
                <td data-label="الطبيب">{{ appointment.doctorName }}</td>
                <td data-label="التخصص">{{ appointment.specialty }}</td>
                <td data-label="التاريخ">{{ formatArabicDate(appointment.date) }}</td>
                <td data-label="الوقت">{{ appointment.time }}</td>
                <td data-label="النوع">
                  <span class="patient-type-badge" :class="appointment.appointmentType === 'أونلاين' ? 'online' : 'clinic'">
                    {{ appointment.appointmentType }}
                  </span>
                </td>
                <td data-label="الحالة">
                  <PatientStatusBadge :status="appointment.status" />
                </td>
                <td data-label="إجراء">
                  <PatientActionButton variant="soft" @click="selectedAppointment = appointment">
                    عرض التفاصيل
                  </PatientActionButton>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <div class="patient-grid-two patient-overview-bottom">
        <section class="patient-dashboard-card" aria-labelledby="orders-preview-title">
          <div class="patient-section-header">
            <h2 id="orders-preview-title">تتبع طلبات الأدوية</h2>
            <NuxtLink class="patient-outline-button" to="/patient/orders">عرض الكل</NuxtLink>
          </div>

          <div class="patient-list">
            <article v-for="order in patientOrders.slice(0, 2)" :key="order.id" class="patient-list-item">
              <strong>{{ order.number }} - {{ order.medications }}</strong>
              <p>{{ order.prescriptionNumber }} - {{ order.address }}</p>
              <PatientStatusBadge :status="order.status" />
            </article>
          </div>
        </section>

        <section class="patient-dashboard-card" aria-labelledby="latest-prescriptions-title">
          <div class="patient-section-header">
            <h2 id="latest-prescriptions-title">آخر الوصفات الطبية</h2>
            <NuxtLink class="patient-outline-button" to="/patient/prescriptions">عرض الكل</NuxtLink>
          </div>

          <div class="patient-list">
            <article v-for="prescription in patientPrescriptions.slice(0, 3)" :key="prescription.id" class="patient-list-item">
              <strong>{{ prescription.number }} - {{ prescription.doctorName }}</strong>
              <p>{{ prescription.diagnosis }} - {{ prescription.medicationsCount }} أدوية</p>
              <PatientStatusBadge :status="prescription.status" />
            </article>
          </div>
        </section>
      </div>

      <section class="patient-dashboard-card" aria-labelledby="notifications-preview-title">
        <div class="patient-section-header">
          <h2 id="notifications-preview-title">آخر الإشعارات</h2>
          <NuxtLink class="patient-outline-button" to="/patient/notifications">عرض الإشعارات</NuxtLink>
        </div>

        <div class="patient-list">
          <article v-for="notification in patientNotifications.slice(0, 3)" :key="notification.id" class="patient-list-item">
            <strong>{{ notification.title }}</strong>
            <p>{{ notification.description }}</p>
            <span>{{ formatArabicDate(notification.date) }} - {{ notification.time }}</span>
          </article>
        </div>
      </section>
    </div>

    <PatientModal
      v-if="selectedAppointment"
      title="تفاصيل الموعد"
      subtitle="معلومات الموعد القادم"
      @close="selectedAppointment = null"
    >
      <dl class="patient-details-grid">
        <div><dt>الطبيب</dt><dd>{{ selectedAppointment.doctorName }}</dd></div>
        <div><dt>التخصص</dt><dd>{{ selectedAppointment.specialty }}</dd></div>
        <div><dt>التاريخ</dt><dd>{{ formatArabicDate(selectedAppointment.date) }}</dd></div>
        <div><dt>الوقت</dt><dd>{{ selectedAppointment.time }}</dd></div>
        <div><dt>نوع الموعد</dt><dd>{{ selectedAppointment.appointmentType }}</dd></div>
        <div><dt>سبب الزيارة</dt><dd>{{ selectedAppointment.reason }}</dd></div>
        <div><dt>ملاحظات</dt><dd>{{ selectedAppointment.notes }}</dd></div>
      </dl>
      <template #actions>
        <button class="patient-cancel-button" type="button" @click="selectedAppointment = null">
          إغلاق
        </button>
      </template>
    </PatientModal>
  </PatientPortalLayout>
</template>

<script setup>
import {
  formatArabicDate,
  patientAppointments,
  patientNotifications,
  patientOrders,
  patientPrescriptions,
  patientProfile,
  patientStats
} from '~/data/patientPortal'

const selectedAppointment = ref(null)
const { appointmentBookingRoute } = usePatientAppointmentBooking()
const upcomingAppointments = computed(() => patientAppointments.filter((appointment) => appointment.category === 'upcoming'))
const currentArabicDate = ref('')

onMounted(() => {
  currentArabicDate.value = new Intl.DateTimeFormat('ar-u-nu-latn', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(new Date())
})
</script>

<style scoped>
.patient-overview-stack {
  display: grid;
  gap: 28px;
  padding-bottom: 8px;
}

.patient-overview-stack > .patient-stats-grid {
  margin-bottom: 0;
}

.patient-overview-bottom {
  align-items: stretch;
  gap: 24px;
}

.patient-overview-bottom > .patient-dashboard-card {
  min-width: 0;
}

@media (max-width: 720px) {
  .patient-overview-stack {
    gap: 24px;
  }
}
</style>

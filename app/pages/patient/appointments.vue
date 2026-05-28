<template>
  <PatientPortalLayout
    title="مواعيدي"
    subtitle="إدارة المواعيد القادمة والمكتملة والملغية بنفس نمط لوحة الطبيب."
  >
    <template #header-action>
      <PatientActionButton :to="appointmentBookingRoute" variant="primary">
        حجز موعد جديد
      </PatientActionButton>
    </template>

    <section class="patient-period-filter-card" aria-label="تصفية المواعيد">
      <button
        v-for="filter in filters"
        :key="filter.value"
        class="patient-filter-button"
        :class="{ active: activeFilter === filter.value }"
        type="button"
        @click="activeFilter = filter.value"
      >
        {{ filter.label }}
      </button>
    </section>

    <section class="patient-filters-card" aria-label="بحث في المواعيد">
      <label class="patient-form-field">
        <span>بحث</span>
        <input v-model.trim="search" type="search" placeholder="ابحث باسم الطبيب أو التخصص أو رقم الموعد">
      </label>
      <label class="patient-form-field">
        <span>نوع الموعد</span>
        <select v-model="typeFilter">
          <option>الكل</option>
          <option>في العيادة</option>
          <option>أونلاين</option>
        </select>
      </label>
      <label class="patient-form-field">
        <span>الحالة</span>
        <select v-model="statusFilter">
          <option>الكل</option>
          <option>مؤكد</option>
          <option>قيد الانتظار</option>
          <option>مكتمل</option>
          <option>ملغي</option>
        </select>
      </label>
    </section>

    <section class="patient-dashboard-card" aria-labelledby="appointments-title">
      <div class="patient-section-header">
        <h2 id="appointments-title">قائمة المواعيد</h2>
        <span>{{ filteredAppointments.length }} موعد</span>
      </div>

      <div v-if="filteredAppointments.length" class="patient-table-wrap">
        <table class="patient-table">
          <thead>
            <tr>
              <th>رقم الموعد</th>
              <th>الطبيب</th>
              <th>التخصص</th>
              <th>التاريخ</th>
              <th>الوقت</th>
              <th>نوع الموعد</th>
              <th>الحالة</th>
              <th>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="appointment in filteredAppointments" :key="appointment.id">
              <td data-label="رقم الموعد">{{ appointment.code }}</td>
              <td data-label="الطبيب">{{ appointment.doctorName }}</td>
              <td data-label="التخصص">{{ appointment.specialty }}</td>
              <td data-label="التاريخ">{{ formatArabicDate(appointment.date) }}</td>
              <td data-label="الوقت">{{ appointment.time }}</td>
              <td data-label="نوع الموعد">
                <span class="patient-type-badge" :class="appointment.appointmentType === 'أونلاين' ? 'online' : 'clinic'">
                  {{ appointment.appointmentType }}
                </span>
              </td>
              <td data-label="الحالة">
                <PatientStatusBadge :status="appointment.status" />
              </td>
              <td data-label="الإجراءات">
                <div class="patient-action-row">
                  <PatientActionButton variant="soft" @click="selectedAppointment = appointment">عرض التفاصيل</PatientActionButton>
                  <PatientActionButton
                    v-if="appointment.category === 'upcoming'"
                    variant="danger"
                    @click="cancelAppointment(appointment)"
                  >
                    إلغاء الموعد
                  </PatientActionButton>
                  <PatientActionButton
                    v-if="appointment.category !== 'upcoming'"
                    :to="appointmentBookingRoute"
                    variant="outline"
                  >
                    إعادة الحجز
                  </PatientActionButton>
                  <a
                    v-if="appointment.appointmentType === 'أونلاين' && appointment.canJoin"
                    class="patient-action-button outline"
                    :href="appointment.meetingLink"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    دخول الاجتماع
                  </a>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <PatientEmptyState
        v-else
        title="لا توجد مواعيد مطابقة"
        description="جرّب تعديل البحث أو الفلاتر لعرض نتائج أخرى."
      />
    </section>

    <section class="patient-dashboard-card" aria-labelledby="review-title">
      <div class="patient-section-header">
        <h2 id="review-title">تقييم الأطباء بعد المواعيد المكتملة</h2>
        <span>يساعدنا تقييمك في تحسين الخدمة</span>
      </div>

      <div class="patient-list">
        <article
          v-for="appointment in completedAppointments"
          :key="`review-${appointment.id}`"
          class="patient-list-item"
        >
          <strong>{{ appointment.doctorName }} - {{ appointment.specialty }}</strong>
          <p>{{ formatArabicDate(appointment.date) }} - {{ appointment.reason }}</p>
          <div class="rating-row" dir="rtl">
            <button
              v-for="star in 5"
              :key="star"
              type="button"
              :class="{ active: appointment.rating >= star }"
              @click="appointment.rating = star"
            >
              ★
            </button>
            <span>{{ appointment.rating ? `${appointment.rating}/5` : 'لم يتم التقييم بعد' }}</span>
          </div>
        </article>
      </div>
    </section>

    <PatientModal
      v-if="selectedAppointment"
      title="تفاصيل الموعد"
      subtitle="تفاصيل الموعد وحالة الحجز"
      @close="selectedAppointment = null"
    >
      <dl class="patient-details-grid">
        <div><dt>رقم الموعد</dt><dd>{{ selectedAppointment.code }}</dd></div>
        <div><dt>الطبيب</dt><dd>{{ selectedAppointment.doctorName }}</dd></div>
        <div><dt>التخصص</dt><dd>{{ selectedAppointment.specialty }}</dd></div>
        <div><dt>التاريخ</dt><dd>{{ formatArabicDate(selectedAppointment.date) }}</dd></div>
        <div><dt>الوقت</dt><dd>{{ selectedAppointment.time }}</dd></div>
        <div><dt>النوع</dt><dd>{{ selectedAppointment.appointmentType }}</dd></div>
        <div><dt>الحالة</dt><dd>{{ selectedAppointment.status }}</dd></div>
        <div><dt>الملاحظات</dt><dd>{{ selectedAppointment.notes }}</dd></div>
      </dl>
      <template #actions>
        <button class="patient-cancel-button" type="button" @click="selectedAppointment = null">إغلاق</button>
      </template>
    </PatientModal>

    <div v-if="toastMessage" class="patient-toast-message" role="status">
      {{ toastMessage }}
    </div>
  </PatientPortalLayout>
</template>

<script setup>
import { formatArabicDate, patientAppointments } from '~/data/patientPortal'

const appointments = ref(patientAppointments.map((appointment) => ({ ...appointment })))
const { appointmentBookingRoute } = usePatientAppointmentBooking()
const selectedAppointment = ref(null)
const activeFilter = ref('all')
const search = ref('')
const typeFilter = ref('الكل')
const statusFilter = ref('الكل')
const toastMessage = ref('')

const filters = [
  { label: 'الكل', value: 'all' },
  { label: 'القادمة', value: 'upcoming' },
  { label: 'المكتملة', value: 'completed' },
  { label: 'الملغية', value: 'cancelled' }
]

const filteredAppointments = computed(() => {
  const term = search.value.toLowerCase()
  return appointments.value.filter((appointment) => {
    const matchesFilter = activeFilter.value === 'all' || appointment.category === activeFilter.value
    const matchesSearch = [appointment.code, appointment.doctorName, appointment.specialty].some((value) => String(value).toLowerCase().includes(term))
    const matchesType = typeFilter.value === 'الكل' || appointment.appointmentType === typeFilter.value
    const matchesStatus = statusFilter.value === 'الكل' || appointment.status === statusFilter.value
    return matchesFilter && matchesSearch && matchesType && matchesStatus
  })
})

const completedAppointments = computed(() => appointments.value.filter((appointment) => appointment.category === 'completed'))

const showToast = (message) => {
  toastMessage.value = message
  window.setTimeout(() => {
    toastMessage.value = ''
  }, 2400)
}

const cancelAppointment = (appointment) => {
  appointment.status = 'ملغي'
  appointment.category = 'cancelled'
  showToast('تم إلغاء الموعد بنجاح')
}
</script>

<style scoped>
.rating-row {
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.rating-row button {
  background-color: #ffffff;
  border: 1px solid #8dbbfb;
  border-radius: 10px;
  color: #8b8b8b;
  cursor: pointer;
  font-size: 20px;
  height: 38px;
  line-height: 1;
  width: 40px;
}

.rating-row button.active {
  background-color: #fff2d8;
  border-color: #f4c15d;
  color: #9a6507;
}

.rating-row span {
  color: #343434;
  font-weight: 900;
}
</style>

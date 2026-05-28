<template>
  <PatientPortalLayout title="طلبات الأدوية" subtitle="تتبع طلبات الصيدلية المرتبطة بوصفاتك الطبية.">
    <section class="patient-dashboard-card" aria-labelledby="orders-title">
      <div class="patient-section-header">
        <h2 id="orders-title">طلبات الصيدلية</h2>
        <span>{{ medicationOrders.length }} طلبات</span>
      </div>

      <div class="patient-table-wrap">
        <table class="patient-table">
          <thead>
            <tr>
              <th>رقم الطلب</th>
              <th>رقم الوصفة</th>
              <th>التاريخ</th>
              <th>الأدوية</th>
              <th>الحالة</th>
              <th>عنوان التوصيل</th>
              <th>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in medicationOrders" :key="order.id">
              <td data-label="رقم الطلب">{{ order.number }}</td>
              <td data-label="رقم الوصفة">{{ order.prescriptionNumber }}</td>
              <td data-label="التاريخ">{{ formatArabicDate(order.date) }}</td>
              <td data-label="الأدوية">{{ order.medications }}</td>
              <td data-label="الحالة"><PatientStatusBadge :status="order.status" /></td>
              <td data-label="عنوان التوصيل">{{ order.address }}</td>
              <td data-label="الإجراءات">
                <div class="patient-action-row">
                  <PatientActionButton variant="soft" @click="selectedOrder = order">عرض التفاصيل</PatientActionButton>
                  <PatientActionButton variant="outline" @click="selectedOrder = order">تتبع الطلب</PatientActionButton>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <PatientModal
      v-if="selectedOrder"
      title="تتبع طلب الأدوية"
      :subtitle="`${selectedOrder.number} - ${selectedOrder.prescriptionNumber}`"
      @close="selectedOrder = null"
    >
      <dl class="patient-details-grid">
        <div><dt>الأدوية</dt><dd>{{ selectedOrder.medications }}</dd></div>
        <div><dt>العنوان</dt><dd>{{ selectedOrder.address }}</dd></div>
        <div><dt>الحالة الحالية</dt><dd>{{ selectedOrder.status }}</dd></div>
      </dl>
      <div class="patient-progress" aria-label="مراحل الطلب">
        <div
          v-for="(step, index) in steps"
          :key="step"
          class="patient-progress-step"
          :class="{ done: index + 1 <= selectedOrder.timelineStep }"
        >
          {{ step }}
        </div>
      </div>
      <template #actions>
        <button class="patient-cancel-button" type="button" @click="selectedOrder = null">إغلاق</button>
      </template>
    </PatientModal>
  </PatientPortalLayout>
</template>

<script setup>
import { formatArabicDate } from '~/data/patientPortal'

const selectedOrder = ref(null)
const { medicationOrders } = usePatientMedicationOrders()
const steps = ['قيد المراجعة', 'يتم التحضير', 'في التوصيل', 'تم التسليم']
</script>

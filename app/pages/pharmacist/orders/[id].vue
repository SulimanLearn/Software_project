<template>
  <PharmacistDashboardLayout
    title="تفاصيل الطلب"
    :subtitle="order ? `${order.number} - ${order.patientName}` : 'طلب غير موجود'"
  >
    <template #header-action>
      <PharmacistActionButton to="/pharmacist/orders" variant="outline">
        رجوع للطلبات
      </PharmacistActionButton>
    </template>

    <template v-if="order">
      <section class="pharmacist-card" aria-labelledby="order-info-title">
        <div class="pharmacist-section-header">
          <h2 id="order-info-title">معلومات الطلب</h2>
          <PharmacistStatusBadge :status="order.status" />
        </div>

        <dl class="pharmacist-details-grid">
          <div><dt>رقم الطلب</dt><dd>{{ order.number }}</dd></div>
          <div><dt>رقم الوصفة</dt><dd>{{ order.prescriptionNumber }}</dd></div>
          <div><dt>اسم المريض</dt><dd>{{ order.patientName }}</dd></div>
          <div><dt>رقم الهاتف</dt><dd>{{ order.phone }}</dd></div>
          <div><dt>عنوان التوصيل</dt><dd>{{ order.address }}</dd></div>
          <div><dt>تاريخ الطلب</dt><dd>{{ formatPharmacistDate(order.date) }}</dd></div>
          <div><dt>طريقة الدفع</dt><dd>{{ order.paymentMethod }}</dd></div>
          <div><dt>الحالة الحالية</dt><dd>{{ order.status }}</dd></div>
        </dl>
      </section>

      <section class="pharmacist-card" aria-labelledby="medicine-list-title">
        <div class="pharmacist-section-header">
          <h2 id="medicine-list-title">قائمة الأدوية</h2>
          <span>{{ order.medicines.length }} أدوية</span>
        </div>

        <PharmacistDataTable>
          <thead>
            <tr>
              <th>اسم الدواء</th>
              <th>الجرعة</th>
              <th>عدد المرات</th>
              <th>المدة</th>
              <th>الكمية</th>
              <th>التعليمات</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="medicine in order.medicines" :key="medicine.name">
              <td data-label="اسم الدواء">{{ medicine.name }}</td>
              <td data-label="الجرعة">{{ medicine.dosage }}</td>
              <td data-label="عدد المرات">{{ medicine.frequency }}</td>
              <td data-label="المدة">{{ medicine.duration }}</td>
              <td data-label="الكمية">{{ medicine.quantity }}</td>
              <td data-label="التعليمات">{{ medicine.instructions }}</td>
            </tr>
          </tbody>
        </PharmacistDataTable>
      </section>

      <section class="pharmacist-card" aria-labelledby="status-update-title">
        <div class="pharmacist-section-header">
          <h2 id="status-update-title">تحديث حالة الطلب</h2>
          <span>سيظهر التحديث للمريض في صفحة طلبات الأدوية</span>
        </div>

        <form class="pharmacist-form-grid order-status-form" @submit.prevent="saveStatus">
          <label class="pharmacist-form-field">
            <span>الحالة</span>
            <select v-model="statusForm">
              <option v-for="status in pharmacistStatusOptions" :key="status" :value="status">
                {{ status }}
              </option>
            </select>
          </label>
          <div class="pharmacist-action-row">
            <button class="pharmacist-save-button" type="submit">تحديث الحالة</button>
          </div>
        </form>
      </section>
    </template>

    <section v-else class="pharmacist-card">
      <div class="pharmacist-section-header">
        <h2>لم يتم العثور على الطلب</h2>
      </div>
      <PharmacistActionButton to="/pharmacist/orders" variant="soft">
        عرض الطلبات
      </PharmacistActionButton>
    </section>

    <div v-if="toastMessage" class="pharmacist-toast-message" role="status">
      {{ toastMessage }}
    </div>
  </PharmacistDashboardLayout>
</template>

<script setup lang="ts">
import { formatPharmacistDate, pharmacistStatusOptions } from '~/data/pharmacistPortal'

const route = useRoute()
const { orders, updateOrderStatus } = usePharmacistPortal()
const order = computed(() => orders.value.find(item => item.id === route.params.id || item.number === route.params.id))
const statusForm = ref('')
const toastMessage = ref('')

watch(order, (value) => {
  statusForm.value = value?.status || ''
}, { immediate: true })

const showToast = (message: string) => {
  toastMessage.value = message
  window.setTimeout(() => {
    toastMessage.value = ''
  }, 2400)
}

const saveStatus = () => {
  if (!order.value || !statusForm.value) return

  updateOrderStatus(order.value.number, statusForm.value)
  showToast('تم تحديث الحالة بنجاح وتحديث طلب المريض المرتبط')
}
</script>

<style scoped>
.order-status-form {
  align-items: end;
  grid-template-columns: minmax(220px, 1fr) auto;
}

@media (max-width: 820px) {
  .order-status-form {
    grid-template-columns: 1fr;
  }
}
</style>

<template>
  <PharmacistDashboardLayout title="طلبات الأدوية" subtitle="إدارة جميع طلبات الصيدلية المرتبطة بوصفات المرضى.">
    <section class="pharmacist-filters-card" aria-label="فلاتر طلبات الأدوية">
      <PharmacistSearchInput
        v-model="searchTerm"
        label="بحث"
        placeholder="اسم المريض، رقم الطلب، أو اسم الدواء"
      />
      <PharmacistFilterSelect v-model="statusFilter" label="الحالة" :options="statusOptions" />
      <label class="pharmacist-form-field">
        <span>التاريخ</span>
        <input v-model="dateFilter" type="date">
      </label>
    </section>

    <section class="pharmacist-card" aria-labelledby="orders-title">
      <div class="pharmacist-section-header">
        <h2 id="orders-title">كل طلبات الأدوية</h2>
        <span>{{ filteredOrders.length }} طلب</span>
      </div>

      <PharmacistDataTable>
        <thead>
          <tr>
            <th>رقم الطلب</th>
            <th>اسم المريض</th>
            <th>رقم الوصفة</th>
            <th>الأدوية</th>
            <th>الكمية</th>
            <th>تاريخ الطلب</th>
            <th>الحالة</th>
            <th>الإجراءات</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in filteredOrders" :key="order.number">
            <td data-label="رقم الطلب">{{ order.number }}</td>
            <td data-label="اسم المريض">{{ order.patientName }}</td>
            <td data-label="رقم الوصفة">{{ order.prescriptionNumber }}</td>
            <td data-label="الأدوية">{{ orderMedicinesText(order) }}</td>
            <td data-label="الكمية">{{ orderQuantity(order) }}</td>
            <td data-label="تاريخ الطلب">{{ formatPharmacistDate(order.date) }}</td>
            <td data-label="الحالة"><PharmacistStatusBadge :status="order.status" /></td>
            <td data-label="الإجراءات">
              <div class="pharmacist-action-row">
                <PharmacistActionButton variant="soft" @click="selectedOrder = order">
                  عرض
                </PharmacistActionButton>
              </div>
            </td>
          </tr>
        </tbody>
      </PharmacistDataTable>
    </section>

    <OrderDetailsModal
      v-if="selectedOrder"
      :order="selectedOrder"
      @close="selectedOrder = null"
      @save="saveOrderChanges"
    />

    <div v-if="toastMessage" class="pharmacist-toast-message" role="status">
      {{ toastMessage }}
    </div>
  </PharmacistDashboardLayout>
</template>

<script setup lang="ts">
import OrderDetailsModal from '~/components/pharmacist/OrderDetailsModal.vue'
import {
  formatPharmacistDate,
  orderMedicinesText,
  orderQuantity,
  pharmacistStatusOptions
} from '~/data/pharmacistPortal'

const searchTerm = ref('')
const statusFilter = ref('')
const dateFilter = ref('')
const selectedOrder = ref<any>(null)
const toastMessage = ref('')
const { orders, updateOrderStatus } = usePharmacistPortal()

const statusOptions = [
  { label: 'كل الحالات', value: '' },
  ...pharmacistStatusOptions.map(status => ({ label: status, value: status }))
]

const filteredOrders = computed(() => {
  const term = searchTerm.value.trim().toLowerCase()

  return orders.value.filter((order) => {
    const matchesTerm = !term ||
      order.number.toLowerCase().includes(term) ||
      order.patientName.toLowerCase().includes(term) ||
      orderMedicinesText(order).toLowerCase().includes(term)
    const matchesStatus = !statusFilter.value || order.status === statusFilter.value
    const matchesDate = !dateFilter.value || order.date === dateFilter.value

    return matchesTerm && matchesStatus && matchesDate
  })
})

const showToast = (message: string) => {
  toastMessage.value = message
  window.setTimeout(() => {
    toastMessage.value = ''
  }, 2400)
}

const saveOrderChanges = (payload: { orderNumber: string, status: string, pharmacistNotes: string }) => {
  updateOrderStatus(payload.orderNumber, payload.status, payload.pharmacistNotes)
  selectedOrder.value = null
  showToast('تم حفظ تغييرات الطلب وربطها بحالة طلب المريض')
}
</script>

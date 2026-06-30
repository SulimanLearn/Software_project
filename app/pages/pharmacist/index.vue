<template>
  <PharmacistDashboardLayout
    title="لوحة البيانات - الصيدلي"
    :eyebrow="currentArabicDate"
    subtitle="متابعة طلبات الأدوية والمخزون والتنبيهات التشغيلية اليومية."
  >
    <section class="pharmacist-stats-grid" aria-label="إحصائيات الصيدلي">
      <article v-for="stat in statsCards" :key="stat.label" class="pharmacist-stat-card">
        <div class="pharmacist-stat-copy">
          <strong>{{ stat.value }}</strong>
          <span>{{ stat.label }}</span>
          <small>{{ stat.helper }}</small>
        </div>
        <component :is="stat.icon" class="pharmacist-stat-icon" :size="26" :stroke-width="2" aria-hidden="true" />
      </article>
    </section>

    <section class="pharmacist-card" aria-labelledby="latest-orders-title">
      <div class="pharmacist-section-header">
        <h2 id="latest-orders-title">أحدث طلبات الأدوية</h2>
        <NuxtLink to="/pharmacist/orders">عرض جميع الطلبات</NuxtLink>
      </div>

      <PharmacistDataTable>
        <thead>
          <tr>
            <th>رقم الطلب</th>
            <th>اسم المريض</th>
            <th>اسم الدواء</th>
            <th>الكمية</th>
            <th>التاريخ</th>
            <th>الحالة</th>
            <th>الإجراءات</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in latestOrders" :key="order.number">
            <td data-label="رقم الطلب">{{ order.number }}</td>
            <td data-label="اسم المريض">{{ order.patientName }}</td>
            <td data-label="اسم الدواء">{{ orderMedicinesText(order) }}</td>
            <td data-label="الكمية">{{ orderQuantity(order) }}</td>
            <td data-label="التاريخ">{{ formatPharmacistDate(order.date) }}</td>
            <td data-label="الحالة"><PharmacistStatusBadge :status="order.status" /></td>
            <td data-label="الإجراءات">
              <PharmacistActionButton variant="soft" @click="selectedOrder = order">
                عرض
              </PharmacistActionButton>
            </td>
          </tr>
        </tbody>
      </PharmacistDataTable>
    </section>

    <section class="pharmacist-card pharmacist-low-stock-card" aria-labelledby="low-stock-title">
      <div class="pharmacist-section-header">
        <h2 id="low-stock-title">تنبيهات المخزون المنخفض</h2>
        <NuxtLink to="/pharmacist/low-stock">عرض جميع التنبيهات</NuxtLink>
      </div>

      <div class="pharmacist-alert-grid">
        <article v-for="item in lowStockItems.slice(0, 4)" :key="item.id" class="pharmacist-alert-card">
          <div class="pharmacist-alert-heading">
            <AlertTriangle :size="20" :stroke-width="2.3" aria-hidden="true" />
            <strong>{{ item.name }}</strong>
          </div>
          <span>الكمية المتبقية: {{ item.quantity }}</span>
        </article>
      </div>
      <p class="pharmacist-alert-message">يرجى تحديث المخزون لتجنب نفاد الأدوية المهمة.</p>
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
import { AlertTriangle } from '@lucide/vue'
import OrderDetailsModal from '~/components/pharmacist/OrderDetailsModal.vue'
import {
  formatPharmacistDate,
  orderMedicinesText,
  orderQuantity,
  pharmacistStats
} from '~/data/pharmacistPortal'

const currentArabicDate = ref('')
const selectedOrder = ref<any>(null)
const toastMessage = ref('')
const { orders, lowStockItems, updateOrderStatus } = usePharmacistPortal()
const latestOrders = computed(() => orders.value.slice(0, 5))

const statsCards = computed(() => {
  const values = {
    new: orders.value.filter(order => order.status === 'جديد').length,
    processing: orders.value.filter(order => order.status === 'قيد المعالجة' || order.status === 'في التوصيل').length,
    completed: orders.value.filter(order => order.status === 'مكتمل' || order.status === 'تم التسليم').length,
    lowStock: lowStockItems.value.length
  }

  return pharmacistStats.map(stat => ({
    ...stat,
    value: values[stat.valueKey as keyof typeof values]
  }))
})

onMounted(() => {
  currentArabicDate.value = new Intl.DateTimeFormat('ar-u-nu-latn', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(new Date())
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
  showToast('تم حفظ تغييرات الطلب بنجاح')
}
</script>

<style scoped>
.pharmacist-low-stock-card {
  border-color: #fda29b;
}

.pharmacist-low-stock-card .pharmacist-section-header h2 {
  color: #101010;
}

</style>

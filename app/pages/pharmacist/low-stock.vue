<template>
  <PharmacistDashboardLayout title="تنبيهات المخزون المنخفض" subtitle="الأدوية التي تحتاج إلى متابعة وتحديث سريع للكمية.">
    <section class="pharmacist-card pharmacist-low-alerts" aria-labelledby="low-alerts-title">
      <div class="pharmacist-section-header">
        <h2 id="low-alerts-title">الأدوية تحت الحد الأدنى</h2>
        <span>{{ lowStockItems.length }} تنبيهات</span>
      </div>

      <div class="pharmacist-alert-grid">
        <article v-for="item in lowStockItems" :key="item.id" class="pharmacist-alert-card">
          <div class="pharmacist-alert-heading">
            <AlertTriangle :size="20" :stroke-width="2.3" aria-hidden="true" />
            <strong>{{ item.name }}</strong>
          </div>
          <span>الكمية المتبقية: {{ item.quantity }}</span>
          <span>الحد الأدنى: {{ item.minQuantity }}</span>
          <p>يرجى تحديث المخزون لتجنب نفاد الأدوية المهمة.</p>
          <PharmacistActionButton variant="soft" @click="selectedStockItem = item">
            تحديث الكمية
          </PharmacistActionButton>
        </article>
      </div>
    </section>

    <UpdateQuantityModal
      v-if="selectedStockItem"
      :medicine="selectedStockItem"
      @close="selectedStockItem = null"
      @save="saveStockUpdate"
    />

    <div v-if="toastMessage" class="pharmacist-toast-message" role="status">
      {{ toastMessage }}
    </div>
  </PharmacistDashboardLayout>
</template>

<script setup lang="ts">
import { AlertTriangle } from '@lucide/vue'
import UpdateQuantityModal from '~/components/pharmacist/UpdateQuantityModal.vue'

const { lowStockItems, updateStock } = usePharmacistPortal()
const selectedStockItem = ref<any>(null)
const toastMessage = ref('')

const showToast = (message: string) => {
  toastMessage.value = message
  window.setTimeout(() => {
    toastMessage.value = ''
  }, 2400)
}

const saveStockUpdate = (payload: { medicineId: string, addedQuantity: number, expiryDate: string, supplier: string, notes: string }) => {
  updateStock(payload.medicineId, payload.addedQuantity, payload.expiryDate, payload.supplier, payload.notes)
  selectedStockItem.value = null
  showToast('تم حفظ تحديث كمية الدواء بنجاح')
}
</script>

<style scoped>
.pharmacist-low-alerts {
  border-color: #fda29b;
}

.pharmacist-alert-card .pharmacist-action-button {
  margin-top: 4px;
  width: fit-content;
}

@media (max-width: 560px) {
  .pharmacist-alert-card .pharmacist-action-button {
    width: 100%;
  }
}
</style>

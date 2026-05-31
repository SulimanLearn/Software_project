<template>
  <PharmacistDashboardLayout title="إدارة المخزون" subtitle="متابعة كميات الأدوية وحالات التوفر والصلاحية.">
    <template #header-action>
      <PharmacistActionButton variant="primary" @click="showGeneralStockModal = true">
        تحديث الكمية
      </PharmacistActionButton>
    </template>

    <section class="pharmacist-card inventory-card" aria-labelledby="inventory-title">
      <div class="pharmacist-section-header">
        <h2 id="inventory-title">جدول المخزون</h2>
        <NuxtLink to="/pharmacist/low-stock">تنبيهات المخزون المنخفض</NuxtLink>
      </div>

      <PharmacistDataTable>
        <thead>
          <tr>
            <th>رقم الدواء</th>
            <th>اسم الدواء</th>
            <th>التصنيف</th>
            <th>الكمية الحالية</th>
            <th>الحد الأدنى</th>
            <th>تاريخ الانتهاء</th>
            <th>الحالة</th>
            <th>الإجراءات</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in inventory" :key="item.id">
            <td data-label="رقم الدواء">{{ item.id }}</td>
            <td data-label="اسم الدواء">{{ item.name }}</td>
            <td data-label="التصنيف">{{ item.category }}</td>
            <td data-label="الكمية الحالية">{{ item.quantity }}</td>
            <td data-label="الحد الأدنى">{{ item.minQuantity }}</td>
            <td data-label="تاريخ الانتهاء">{{ formatPharmacistDate(item.expiryDate) }}</td>
            <td data-label="الحالة"><PharmacistStatusBadge :status="inventoryStatusFor(item)" /></td>
            <td data-label="الإجراءات">
              <div class="pharmacist-action-row inventory-actions">
                <PharmacistActionButton variant="outline" @click="selectedDetailsItem = item">عرض التفاصيل</PharmacistActionButton>
                <PharmacistActionButton variant="soft" @click="selectedStockItem = item">تحديث الكمية</PharmacistActionButton>
              </div>
            </td>
          </tr>
        </tbody>
      </PharmacistDataTable>
    </section>

    <PharmacistModal
      v-if="selectedDetailsItem"
      title="تفاصيل الدواء"
      :subtitle="selectedDetailsItem.name"
      @close="closeDetailsModal"
    >
      <form v-if="isEditingDetails" class="medicine-edit-form" @submit.prevent="saveMedicineDetails">
        <label class="pharmacist-form-field">
          <span>رقم الدواء</span>
          <input :value="selectedDetailsItem.id" type="text" readonly>
        </label>
        <label class="pharmacist-form-field">
          <span>اسم الدواء</span>
          <input v-model.trim="detailsForm.name" type="text">
        </label>
        <label class="pharmacist-form-field">
          <span>التصنيف</span>
          <input v-model.trim="detailsForm.category" type="text">
        </label>
        <label class="pharmacist-form-field">
          <span>الكمية الحالية</span>
          <input v-model.trim="detailsForm.quantity" type="number" min="0" step="1">
        </label>
        <label class="pharmacist-form-field">
          <span>الحد الأدنى</span>
          <input v-model.trim="detailsForm.minQuantity" type="number" min="0" step="1">
        </label>
        <label class="pharmacist-form-field">
          <span>تاريخ الانتهاء</span>
          <input v-model="detailsForm.expiryDate" type="date">
        </label>
        <label class="pharmacist-form-field">
          <span>الحالة</span>
          <select v-model="detailsForm.status">
            <option v-for="status in inventoryStatusOptions" :key="status" :value="status">
              {{ status }}
            </option>
          </select>
        </label>
        <label class="pharmacist-form-field full">
          <span>ملاحظات</span>
          <textarea v-model.trim="detailsForm.notes" rows="3" placeholder="ملاحظات الدواء" />
        </label>
        <p v-if="detailsError" class="pharmacist-error full">{{ detailsError }}</p>
      </form>

      <dl v-else class="pharmacist-details-grid">
        <div><dt>رقم الدواء</dt><dd>{{ selectedDetailsItem.id }}</dd></div>
        <div><dt>اسم الدواء</dt><dd>{{ selectedDetailsItem.name }}</dd></div>
        <div><dt>التصنيف</dt><dd>{{ selectedDetailsItem.category }}</dd></div>
        <div><dt>الكمية الحالية</dt><dd>{{ selectedDetailsItem.quantity }}</dd></div>
        <div><dt>الحد الأدنى</dt><dd>{{ selectedDetailsItem.minQuantity }}</dd></div>
        <div><dt>تاريخ الانتهاء</dt><dd>{{ formatPharmacistDate(selectedDetailsItem.expiryDate) }}</dd></div>
        <div><dt>الحالة الحالية</dt><dd><PharmacistStatusBadge :status="inventoryStatusFor(selectedDetailsItem)" /></dd></div>
        <div><dt>المورد</dt><dd>{{ selectedDetailsItem.supplier }}</dd></div>
        <div><dt>ملاحظات</dt><dd>{{ selectedDetailsItem.notes || 'لا توجد ملاحظات' }}</dd></div>
      </dl>
      <template #actions>
        <template v-if="isEditingDetails">
          <button class="pharmacist-save-button" type="button" @click="saveMedicineDetails">حفظ التعديلات</button>
          <button class="pharmacist-cancel-button" type="button" @click="cancelMedicineEdit">إلغاء</button>
        </template>
        <template v-else>
          <button class="pharmacist-save-button" type="button" @click="startMedicineEdit">تعديل</button>
          <PharmacistActionButton variant="soft" @click="openStockModalFromDetails">
            تحديث الكمية
          </PharmacistActionButton>
          <button class="pharmacist-cancel-button" type="button" @click="closeDetailsModal">إغلاق</button>
        </template>
      </template>
    </PharmacistModal>

    <UpdateQuantityModal
      v-if="selectedStockItem"
      :medicine="selectedStockItem"
      @close="selectedStockItem = null"
      @save="saveStockUpdate"
    />

    <UpdateQuantityModal
      v-if="showGeneralStockModal"
      :inventory="inventory"
      @close="showGeneralStockModal = false"
      @save="saveGeneralStockUpdate"
    />

    <div v-if="toastMessage" class="pharmacist-toast-message" role="status">
      {{ toastMessage }}
    </div>
  </PharmacistDashboardLayout>
</template>

<script setup lang="ts">
import UpdateQuantityModal from '~/components/pharmacist/UpdateQuantityModal.vue'
import { formatPharmacistDate, inventoryStatusFor } from '~/data/pharmacistPortal'

const { inventory, updateStock, updateMedicineDetails } = usePharmacistPortal()
const selectedDetailsItem = ref<any>(null)
const selectedStockItem = ref<any>(null)
const showGeneralStockModal = ref(false)
const isEditingDetails = ref(false)
const detailsError = ref('')
const toastMessage = ref('')
const inventoryStatusOptions = ['متوفر', 'منخفض', 'غير متوفر', 'منتهي الصلاحية']
const detailsForm = reactive({
  name: '',
  category: '',
  quantity: '',
  minQuantity: '',
  expiryDate: '',
  status: '',
  notes: ''
})

const showToast = (message: string) => {
  toastMessage.value = message
  window.setTimeout(() => {
    toastMessage.value = ''
  }, 2400)
}

const openStockModalFromDetails = () => {
  selectedStockItem.value = selectedDetailsItem.value
  closeDetailsModal()
}

const saveStockUpdate = (payload: { medicineId: string, addedQuantity: number, expiryDate: string, supplier: string, notes: string }) => {
  updateStock(payload.medicineId, payload.addedQuantity, payload.expiryDate, payload.supplier, payload.notes)
  selectedStockItem.value = null
  showToast('تم حفظ تحديث كمية الدواء بنجاح')
}

const saveGeneralStockUpdate = (payload: { medicineId: string, addedQuantity: number, expiryDate: string, supplier: string, notes: string }) => {
  updateStock(payload.medicineId, payload.addedQuantity, payload.expiryDate, payload.supplier, payload.notes)
  showGeneralStockModal.value = false
  showToast('تم حفظ تحديث كمية الدواء بنجاح')
}

const fillDetailsForm = () => {
  if (!selectedDetailsItem.value) return

  detailsForm.name = selectedDetailsItem.value.name
  detailsForm.category = selectedDetailsItem.value.category
  detailsForm.quantity = String(selectedDetailsItem.value.quantity)
  detailsForm.minQuantity = String(selectedDetailsItem.value.minQuantity)
  detailsForm.expiryDate = selectedDetailsItem.value.expiryDate
  detailsForm.status = inventoryStatusFor(selectedDetailsItem.value)
  detailsForm.notes = selectedDetailsItem.value.notes || ''
  detailsError.value = ''
}

watch(selectedDetailsItem, (item) => {
  if (item) fillDetailsForm()
})

const startMedicineEdit = () => {
  fillDetailsForm()
  isEditingDetails.value = true
}

const cancelMedicineEdit = () => {
  fillDetailsForm()
  isEditingDetails.value = false
}

const closeDetailsModal = () => {
  selectedDetailsItem.value = null
  isEditingDetails.value = false
  detailsError.value = ''
}

const saveMedicineDetails = () => {
  if (!selectedDetailsItem.value) return

  const quantity = Number(detailsForm.quantity)
  const minQuantity = Number(detailsForm.minQuantity)

  if (!detailsForm.name || !detailsForm.category) {
    detailsError.value = 'اسم الدواء والتصنيف مطلوبان'
    return
  }

  if (!Number.isFinite(quantity) || quantity < 0 || !Number.isFinite(minQuantity) || minQuantity < 0) {
    detailsError.value = 'الكمية والحد الأدنى يجب أن يكونا أرقاماً صحيحة'
    return
  }

  updateMedicineDetails(selectedDetailsItem.value.id, {
    name: detailsForm.name,
    category: detailsForm.category,
    quantity,
    minQuantity,
    expiryDate: detailsForm.expiryDate,
    status: detailsForm.status,
    notes: detailsForm.notes
  })
  isEditingDetails.value = false
  showToast('تم حفظ تعديلات الدواء بنجاح')
}
</script>

<style scoped>
.inventory-card {
  max-width: 100%;
  min-width: 0;
  overflow: hidden;
}

.inventory-card :deep(.pharmacist-table-wrap) {
  max-width: 100%;
  overflow-x: auto;
}

.inventory-card :deep(.pharmacist-table) {
  min-width: 900px;
}

.inventory-card :deep(.pharmacist-table th),
.inventory-card :deep(.pharmacist-table td) {
  padding: 12px 10px;
}

.inventory-card :deep(.pharmacist-table td) {
  white-space: normal;
}

.inventory-actions {
  gap: 6px;
  justify-content: flex-start;
}

.inventory-actions :deep(.pharmacist-action-button) {
  border-radius: 14px;
  font-size: 13px;
  min-height: 34px;
  padding: 6px 10px;
}

.medicine-edit-form {
  display: grid;
  gap: 14px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.medicine-edit-form .full {
  grid-column: 1 / -1;
}

@media (max-width: 720px) {
  .inventory-card :deep(.pharmacist-table) {
    min-width: 0;
  }

  .inventory-actions {
    width: 100%;
  }

  .medicine-edit-form {
    grid-template-columns: 1fr;
  }
}
</style>

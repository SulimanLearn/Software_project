<template>
  <PharmacistModal
    title="تحديث كمية الدواء"
    :subtitle="selectedMedicine ? `${selectedMedicine.name} - ${selectedMedicine.id}` : 'اختيار الدواء وتحديث الكمية'"
    size="stock"
    @close="$emit('close')"
  >
    <form class="stock-update-modal" @submit.prevent="saveUpdate">
      <label v-if="isGeneralMode" class="pharmacist-form-field">
        <span>اختيار/بحث الدواء</span>
        <input v-model.trim="medicineSearch" list="stock-medicine-options" type="search" placeholder="ابحث باسم الدواء أو رقمه">
        <datalist id="stock-medicine-options">
          <option v-for="item in inventory" :key="item.id" :value="`${item.id} - ${item.name}`" />
        </datalist>
      </label>

      <label v-if="isGeneralMode" class="pharmacist-form-field">
        <span>الدواء</span>
        <select v-model="selectedMedicineId">
          <option value="">اختر الدواء</option>
          <option v-for="item in filteredInventory" :key="item.id" :value="item.id">
            {{ item.name }} - {{ item.id }}
          </option>
        </select>
      </label>

      <dl v-if="selectedMedicine" class="stock-info-grid">
        <div>
          <dt>رقم الدواء</dt>
          <dd>{{ selectedMedicine.id }}</dd>
        </div>
        <div>
          <dt>اسم الدواء</dt>
          <dd>{{ selectedMedicine.name }}</dd>
        </div>
        <div>
          <dt>التصنيف</dt>
          <dd>{{ selectedMedicine.category }}</dd>
        </div>
        <div>
          <dt>الكمية الحالية</dt>
          <dd>{{ selectedMedicine.quantity }}</dd>
        </div>
        <div>
          <dt>الحد الأدنى</dt>
          <dd>{{ selectedMedicine.minQuantity }}</dd>
        </div>
        <div>
          <dt>تاريخ الانتهاء</dt>
          <dd>{{ formatPharmacistDate(selectedMedicine.expiryDate) }}</dd>
        </div>
        <div class="wide">
          <dt>الحالة الحالية</dt>
          <dd><PharmacistStatusBadge :status="inventoryStatusFor(selectedMedicine)" /></dd>
        </div>
      </dl>

      <div class="stock-form-grid">
        <label class="pharmacist-form-field">
          <span>الكمية المضافة</span>
          <input v-model.trim="form.addedQuantity" type="number" min="1" step="1" placeholder="مثال: 25">
        </label>

        <label class="pharmacist-form-field">
          <span>تاريخ انتهاء جديد</span>
          <input v-model="form.expiryDate" type="date">
        </label>

        <label class="pharmacist-form-field full">
          <span>المورد</span>
          <input v-model.trim="form.supplier" type="text" placeholder="اسم المورد إن وجد">
        </label>

        <label class="pharmacist-form-field full">
          <span>ملاحظات</span>
          <textarea v-model.trim="form.notes" rows="3" placeholder="أي ملاحظات عن الدفعة الجديدة" />
        </label>
      </div>

      <p v-if="errorMessage" class="pharmacist-error">{{ errorMessage }}</p>
    </form>

    <template #actions>
      <button class="pharmacist-save-button" type="button" @click="saveUpdate">حفظ التحديث</button>
      <button class="pharmacist-cancel-button" type="button" @click="$emit('close')">إغلاق</button>
    </template>
  </PharmacistModal>
</template>

<script setup lang="ts">
import { formatPharmacistDate, inventoryStatusFor } from '~/data/pharmacistPortal'

const props = withDefaults(defineProps<{
  medicine?: any
  inventory?: any[]
}>(), {
  medicine: null,
  inventory: () => []
})
const emit = defineEmits(['close', 'save'])

const errorMessage = ref('')
const medicineSearch = ref('')
const selectedMedicineId = ref('')
const form = reactive({
  addedQuantity: '',
  expiryDate: '',
  supplier: '',
  notes: ''
})

const isGeneralMode = computed(() => !props.medicine)

const filteredInventory = computed(() => {
  const term = medicineSearch.value.trim().toLowerCase()

  if (!term) return props.inventory

  return props.inventory.filter((item: any) => {
    return item.id.toLowerCase().includes(term) || item.name.toLowerCase().includes(term)
  })
})

const selectedMedicine = computed(() => {
  if (props.medicine) return props.medicine

  return props.inventory.find((item: any) => {
    const searchId = medicineSearch.value.split('-')[0]?.trim()
    return item.id === selectedMedicineId.value || item.id === searchId
  }) || null
})

watch(() => props.medicine, (medicine: any) => {
  errorMessage.value = ''
  selectedMedicineId.value = medicine?.id || ''
  medicineSearch.value = ''
  form.addedQuantity = ''
  form.expiryDate = medicine?.expiryDate || ''
  form.supplier = medicine?.supplier || ''
  form.notes = ''
}, { immediate: true })

watch(selectedMedicine, (medicine: any) => {
  form.expiryDate = medicine?.expiryDate || ''
  form.supplier = medicine?.supplier || ''
})

const saveUpdate = () => {
  errorMessage.value = ''
  const medicine = selectedMedicine.value

  if (!medicine) {
    errorMessage.value = 'يجب اختيار الدواء'
    return
  }

  const quantity = Number(form.addedQuantity)

  if (!form.addedQuantity) {
    errorMessage.value = 'الكمية المضافة مطلوبة'
    return
  }

  if (!Number.isFinite(quantity) || quantity <= 0) {
    errorMessage.value = 'الكمية يجب أن تكون رقماً موجباً'
    return
  }

  emit('save', {
    medicineId: medicine.id,
    addedQuantity: quantity,
    expiryDate: form.expiryDate,
    supplier: form.supplier,
    notes: form.notes
  })
}
</script>

<style scoped>
.stock-update-modal {
  display: grid;
  gap: 18px;
  max-width: 100%;
  min-width: 0;
}

.stock-info-grid,
.stock-form-grid {
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  margin: 0;
  min-width: 0;
}

.stock-info-grid div {
  background-color: #ffffff;
  border: 1px solid #d7e8ff;
  border-radius: 14px;
  display: grid;
  gap: 6px;
  min-width: 0;
  padding: 12px 14px;
}

.stock-info-grid .wide,
.stock-form-grid .full {
  grid-column: 1 / -1;
}

.stock-info-grid dt {
  color: #343434;
  font-size: 13px;
  font-weight: 900;
}

.stock-info-grid dd {
  color: #101010;
  font-size: 15px;
  font-weight: 800;
  margin: 0;
  overflow-wrap: anywhere;
}

@media (max-width: 620px) {
  .stock-info-grid,
  .stock-form-grid {
    grid-template-columns: 1fr;
  }
}
</style>

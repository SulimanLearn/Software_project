<template>
  <PharmacistModal
    title="تفاصيل طلب الدواء"
    :subtitle="order ? `${order.number} - ${order.patientName}` : ''"
    size="lg"
    @close="$emit('close')"
  >
    <div v-if="order" class="order-details-modal">
      <section class="order-modal-section" aria-labelledby="patient-info-title">
        <h3 id="patient-info-title">معلومات المريض</h3>
        <dl class="order-modal-grid">
          <div>
            <dt>اسم المريض</dt>
            <dd>{{ valueOrFallback(order.patientName) }}</dd>
          </div>
          <div>
            <dt>رقم الهاتف</dt>
            <dd>{{ valueOrFallback(order.phone) }}</dd>
          </div>
          <div v-if="order.email">
            <dt>البريد الإلكتروني</dt>
            <dd>{{ order.email }}</dd>
          </div>
          <div>
            <dt>العنوان</dt>
            <dd>{{ valueOrFallback(order.address) }}</dd>
          </div>
          <div v-if="order.notes" class="wide">
            <dt>ملاحظات المريض</dt>
            <dd>{{ order.notes }}</dd>
          </div>
        </dl>
      </section>

      <section class="order-modal-section" aria-labelledby="order-info-title">
        <div class="order-modal-section-heading">
          <h3 id="order-info-title">معلومات الطلب</h3>
          <PharmacistStatusBadge :status="order.status" />
        </div>
        <dl class="order-modal-grid">
          <div>
            <dt>رقم الطلب</dt>
            <dd>{{ valueOrFallback(order.number) }}</dd>
          </div>
          <div>
            <dt>رقم الوصفة</dt>
            <dd>{{ valueOrFallback(order.prescriptionNumber) }}</dd>
          </div>
          <div>
            <dt>تاريخ الطلب</dt>
            <dd>{{ formatPharmacistDate(order.date) }}</dd>
          </div>
          <div>
            <dt>وقت الطلب</dt>
            <dd>{{ valueOrFallback(order.time) }}</dd>
          </div>
          <div>
            <dt>الحالة الحالية</dt>
            <dd>{{ valueOrFallback(order.status) }}</dd>
          </div>
          <div>
            <dt>طريقة الدفع</dt>
            <dd>{{ valueOrFallback(order.paymentMethod) }}</dd>
          </div>
          <div class="wide">
            <dt>طريقة/عنوان التوصيل</dt>
            <dd>{{ deliveryDetails }}</dd>
          </div>
        </dl>
      </section>

      <section class="order-modal-section" aria-labelledby="requested-medicines-title">
        <h3 id="requested-medicines-title">الأدوية المطلوبة</h3>
        <PharmacistDataTable>
          <thead>
            <tr>
              <th>اسم الدواء</th>
              <th>الجرعة</th>
              <th>عدد المرات</th>
              <th>المدة</th>
              <th>الكمية</th>
              <th>سعر الوحدة</th>
              <th>الإجمالي</th>
              <th>التعليمات</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="medicine in order.medicines" :key="medicine.name">
              <td data-label="اسم الدواء">{{ valueOrFallback(medicine.name) }}</td>
              <td data-label="الجرعة">{{ valueOrFallback(medicine.dosage) }}</td>
              <td data-label="عدد المرات">{{ valueOrFallback(medicine.frequency) }}</td>
              <td data-label="المدة">{{ valueOrFallback(medicine.duration) }}</td>
              <td data-label="الكمية">{{ medicine.quantity || 0 }}</td>
              <td data-label="سعر الوحدة">{{ formatCurrency(medicine.unitPrice) }}</td>
              <td data-label="الإجمالي">{{ formatCurrency(medicine.totalPrice || medicineTotal(medicine)) }}</td>
              <td data-label="التعليمات">{{ valueOrFallback(medicine.instructions) }}</td>
            </tr>
          </tbody>
        </PharmacistDataTable>
      </section>

      <section class="order-modal-section" aria-labelledby="payment-summary-title">
        <h3 id="payment-summary-title">ملخص الدفع</h3>
        <dl class="payment-summary-list">
          <div>
            <dt>إجمالي الأدوية</dt>
            <dd>{{ formatCurrency(medicinesTotal) }}</dd>
          </div>
          <div v-if="hasNumber(order.deliveryFee)">
            <dt>رسوم التوصيل</dt>
            <dd>{{ formatCurrency(order.deliveryFee) }}</dd>
          </div>
          <div v-if="hasNumber(order.discount) && Number(order.discount) > 0">
            <dt>الخصم</dt>
            <dd>{{ formatCurrency(order.discount) }}</dd>
          </div>
          <div class="final-total">
            <dt>الإجمالي النهائي</dt>
            <dd>{{ formatCurrency(finalTotal) }}</dd>
          </div>
        </dl>
      </section>

      <section class="order-modal-section" aria-labelledby="pharmacist-notes-title">
        <label class="pharmacist-form-field full">
          <span id="pharmacist-notes-title">ملاحظات الصيدلي</span>
          <textarea v-model="notesForm" rows="4" placeholder="اكتب ملاحظات مرتبطة بهذا الطلب" />
        </label>
      </section>

      <section class="order-modal-section" aria-labelledby="status-update-title">
        <label class="pharmacist-form-field">
          <span id="status-update-title">تحديث حالة الطلب</span>
          <select v-model="statusForm">
            <option v-for="status in pharmacistStatusOptions" :key="status" :value="status">
              {{ status }}
            </option>
          </select>
        </label>
      </section>
    </div>

    <template #actions>
      <button class="pharmacist-save-button" type="button" @click="saveChanges">حفظ التغييرات</button>
      <button class="pharmacist-cancel-button" type="button" @click="$emit('close')">إغلاق</button>
    </template>
  </PharmacistModal>
</template>

<script setup lang="ts">
import { formatPharmacistDate, pharmacistStatusOptions } from '~/data/pharmacistPortal'

const props = defineProps<{ order: any }>()

const emit = defineEmits(['close', 'save'])

const statusForm = ref('')
const notesForm = ref('')

const hasNumber = (value: unknown) => value !== null && value !== undefined && value !== '' && !Number.isNaN(Number(value))

const valueOrFallback = (value: unknown) => {
  if (value === null || value === undefined || value === '') return 'غير متوفر'
  return String(value)
}

const medicineTotal = (medicine: any) => Number((Number(medicine.quantity || 0) * Number(medicine.unitPrice || 0)).toFixed(2))

const medicinesTotal = computed(() => {
  return props.order.medicines.reduce((total: number, medicine: any) => {
    return total + Number(medicine.totalPrice || medicineTotal(medicine))
  }, 0)
})

const finalTotal = computed(() => {
  if (hasNumber(props.order.finalTotal)) return Number(props.order.finalTotal)

  return Number((medicinesTotal.value + Number(props.order.deliveryFee || 0) - Number(props.order.discount || 0)).toFixed(2))
})

const deliveryDetails = computed(() => {
  const parts = [props.order.deliveryMethod, props.order.address].filter(Boolean)
  return parts.length ? parts.join(' - ') : 'غير متوفر'
})

const formatCurrency = (value: unknown) => {
  if (!hasNumber(value)) return 'غير متوفر'

  return new Intl.NumberFormat('ar-u-nu-latn', {
    style: 'currency',
    currency: 'ILS',
    maximumFractionDigits: 2
  }).format(Number(value))
}

watch(() => props.order, (order: any) => {
  statusForm.value = order?.status || ''
  notesForm.value = order?.pharmacistNotes || ''
}, { immediate: true })

const saveChanges = () => {
  emit('save', {
    orderNumber: props.order.number,
    status: statusForm.value,
    pharmacistNotes: notesForm.value
  })
}
</script>

<style scoped>
.order-details-modal {
  display: grid;
  gap: 20px;
  max-width: 100%;
  min-width: 0;
  overflow-x: hidden;
}

.order-modal-section {
  background-color: #f7fbff;
  border: 1px solid #8dbbfb;
  border-radius: 18px;
  box-sizing: border-box;
  min-width: 0;
  overflow: hidden;
  padding: 18px;
}

.order-modal-section h3,
.order-modal-section-heading h3 {
  color: #101010;
  font-size: 18px;
  font-weight: 900;
  margin: 0 0 14px;
}

.order-modal-section-heading {
  align-items: center;
  display: flex;
  gap: 12px;
  justify-content: space-between;
  margin-bottom: 14px;
}

.order-modal-section-heading h3 {
  margin: 0;
}

.order-modal-grid {
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  margin: 0;
  min-width: 0;
}

.order-modal-grid div,
.payment-summary-list div {
  background-color: #ffffff;
  border: 1px solid #d7e8ff;
  border-radius: 14px;
  display: grid;
  gap: 6px;
  min-width: 0;
  padding: 12px 14px;
}

.order-modal-grid .wide {
  grid-column: 1 / -1;
}

.order-modal-grid dt,
.payment-summary-list dt {
  color: #343434;
  font-size: 13px;
  font-weight: 900;
}

.order-modal-grid dd,
.payment-summary-list dd {
  color: #101010;
  font-size: 15px;
  font-weight: 800;
  margin: 0;
  overflow-wrap: anywhere;
}

.payment-summary-list {
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  margin: 0;
  min-width: 0;
}

.payment-summary-list .final-total {
  background-color: #eaf2fd;
  border-color: #0b63f6;
}

.payment-summary-list .final-total dd {
  color: #115bd2;
  font-size: 18px;
  font-weight: 900;
}

.order-modal-section :deep(.pharmacist-table) {
  min-width: 880px;
}

.order-modal-section :deep(.pharmacist-table-wrap) {
  max-width: 100%;
  min-width: 0;
  overflow-x: auto;
  overflow-y: hidden;
}

.order-modal-section :deep(.pharmacist-table th),
.order-modal-section :deep(.pharmacist-table td) {
  padding: 12px 10px;
  white-space: normal;
}

.order-modal-section :deep(.pharmacist-table td) {
  overflow-wrap: anywhere;
}

@media (max-width: 1040px) {
  .order-modal-grid {
    grid-template-columns: repeat(2, minmax(180px, 1fr));
  }
}

@media (max-width: 820px) {
  .order-modal-grid {
    grid-template-columns: 1fr;
  }

  .order-modal-section-heading {
    align-items: flex-start;
    flex-direction: column;
  }
}

@media (max-width: 720px) {
  .order-details-modal {
    gap: 16px;
  }

  .order-modal-section {
    border-radius: 16px;
    padding: 14px;
  }

  .order-modal-section :deep(.pharmacist-table) {
    min-width: 0;
  }

  .order-modal-section :deep(.pharmacist-table-wrap) {
    overflow-x: hidden;
  }
}
</style>

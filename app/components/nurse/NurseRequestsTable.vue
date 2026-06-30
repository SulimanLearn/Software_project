<template>
  <div class="table-wrap">
    <table class="requests-table">
      <thead>
        <tr>
          <th>رقم الطلب</th>
          <th>اسم المريض</th>
          <th>نوع الخدمة</th>
          <th v-if="!compact">العنوان</th>
          <th>التاريخ والوقت</th>
          <th>الحالة</th>
          <th>الإجراءات</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="request in requests" :key="request.id">
          <td data-label="رقم الطلب" class="request-id">{{ request.id }}</td>
          <td data-label="اسم المريض">{{ request.patientName }}</td>
          <td data-label="نوع الخدمة">{{ request.serviceType }}</td>
          <td v-if="!compact" data-label="العنوان" class="address">{{ request.address }}</td>
          <td data-label="التاريخ والوقت">{{ request.date }}، {{ request.time }}</td>
          <td data-label="الحالة">
            <label class="status-control">
              <span class="sr-only">تحديث الحالة</span>
              <select
                :class="request.status"
                :value="request.status"
                aria-label="تحديث الحالة"
                @change="emitStatus(request.id, $event)"
              >
                <option
                  v-for="status in nurseStatuses"
                  :key="status.value"
                  :value="status.value"
                >
                  {{ status.label }}
                </option>
              </select>
            </label>
          </td>
          <td data-label="الإجراءات">
            <div class="actions">
              <button
                class="view-button"
                type="button"
                aria-label="عرض التفاصيل"
                @click="$emit('view', request)"
              >
                <Eye :size="18" />
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <p v-if="!requests.length" class="empty">لا توجد طلبات مطابقة للبحث.</p>
  </div>
</template>

<script setup>
import { Eye } from '@lucide/vue'
import { nurseStatuses } from '~/composables/useNurseRequests'

defineProps({
  requests: {
    type: Array,
    required: true
  },
  compact: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['view', 'updateStatus'])

const emitStatus = (id, event) => {
  emit('updateStatus', id, event.target.value)
}
</script>

<style scoped>
.table-wrap {
  overflow-x: auto;
}

.requests-table {
  border-collapse: separate;
  border-spacing: 0 10px;
  min-width: 790px;
  width: 100%;
}

.requests-table th,
.requests-table td {
  padding: 13px 12px;
  text-align: right;
}

.requests-table th {
  color: #343434;
  font-size: 14px;
  font-weight: 900;
  white-space: nowrap;
}

.requests-table td {
  background: #fff;
  border-block: 1px solid #d0e2fa;
  font-size: 14px;
  font-weight: 700;
}

.requests-table td:first-child {
  border-radius: 0 14px 14px 0;
  border-right: 1px solid #d0e2fa;
}

.requests-table td:last-child {
  border-left: 1px solid #d0e2fa;
  border-radius: 14px 0 0 14px;
}

.request-id {
  color: #115bd2;
  direction: ltr;
  text-align: right;
  white-space: nowrap;
}

.address {
  max-width: 220px;
}

.actions {
  align-items: center;
  display: flex;
}

.view-button {
  align-items: center;
  background: #5a99ef;
  border: 1px solid #0b63f6;
  border-radius: 10px;
  color: #fff;
  cursor: pointer;
  display: inline-flex;
  height: 38px;
  justify-content: center;
  width: 42px;
}

.status-control select {
  -moz-appearance: none;
  -webkit-appearance: none;
  appearance: none;
  border: 1px solid transparent;
  border-radius: 999px;
  cursor: pointer;
  direction: rtl;
  font-family: inherit;
  font-size: 13px;
  font-weight: 800;
  height: 38px;
  min-width: 122px;
  outline: 0;
  padding: 0 13px;
  text-align: center;
  text-align-last: center;
}

.status-control select.new {
  background: #dcecff;
  border-color: #b6d4fc;
  color: #115bd2;
}

.status-control select.on-the-way {
  background: #fff2d8;
  border-color: #f4d58d;
  color: #9a6507;
}

.status-control select.in-progress {
  background: #e7e2ff;
  border-color: #cfc1fa;
  color: #5337b6;
}

.status-control select.completed {
  background: #dff3e7;
  border-color: #bce3cd;
  color: #137446;
}

.status-control select:focus {
  box-shadow: 0 0 0 3px rgba(17, 91, 210, .14);
}

.view-button:hover {
  background: #115bd2;
}

.sr-only {
  clip: rect(0, 0, 0, 0);
  height: 1px;
  overflow: hidden;
  position: absolute;
  white-space: nowrap;
  width: 1px;
}

.empty {
  background: #fff;
  border: 1px solid #d0e2fa;
  border-radius: 14px;
  color: #536174;
  font-weight: 700;
  margin: 8px 0 0;
  padding: 30px;
  text-align: center;
}

@media (max-width: 1030px) {
  .requests-table {
    min-width: 680px;
  }

  .requests-table th,
  .requests-table td {
    padding: 11px 10px;
  }

  .requests-table th,
  .requests-table td {
    font-size: 13px;
  }

  .status-control select {
    font-size: 12px;
    min-width: 108px;
  }

  .view-button {
    height: 36px;
    width: 40px;
  }
}

@media (max-width: 720px) {
  .table-wrap {
    overflow-x: hidden;
  }

  .requests-table {
    border-spacing: 0;
    min-width: 0;
  }

  .requests-table thead {
    display: none;
  }

  .requests-table,
  .requests-table tbody,
  .requests-table tr,
  .requests-table td {
    display: block;
    width: 100%;
  }

  .requests-table tr {
    background: #fff;
    border: 1px solid #d0e2fa;
    border-radius: 16px;
    margin-bottom: 12px;
    padding: 9px 14px;
  }

  .requests-table td,
  .requests-table td:first-child,
  .requests-table td:last-child {
    align-items: center;
    background: transparent;
    border: 0;
    border-radius: 0;
    display: flex;
    gap: 12px;
    justify-content: space-between;
    padding: 9px 0;
  }

  .requests-table td::before {
    color: #343434;
    content: attr(data-label);
    font-weight: 900;
  }

  .address {
    max-width: none;
    text-align: left;
  }

  .actions,
  .view-button,
  .status-control,
  .status-control select {
    width: 100%;
  }
}
</style>

<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <section
      class="details-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="details-title"
    >
      <header class="modal-header">
        <div>
          <p>{{ request.id }}</p>
          <h2 id="details-title">تفاصيل طلب التمريض المنزلي</h2>
        </div>
        <button type="button" aria-label="إغلاق" @click="$emit('close')">&times;</button>
      </header>

      <div class="patient-name">
        <User :size="22" />
        <div>
          <span>معلومات المريض</span>
          <strong>{{ request.patientName }}</strong>
        </div>
      </div>

      <dl class="details-grid">
        <div>
          <dt><Phone :size="17" /> رقم الهاتف</dt>
          <dd dir="ltr">{{ request.phone }}</dd>
        </div>
        <div>
          <dt><Activity :size="17" /> نوع الخدمة</dt>
          <dd>{{ request.serviceType }}</dd>
        </div>
        <div class="wide">
          <dt><MapPin :size="17" /> العنوان</dt>
          <dd>{{ request.address }}</dd>
        </div>
        <div>
          <dt><Clock :size="17" /> التاريخ والوقت</dt>
          <dd>{{ request.date }}، {{ request.time }}</dd>
        </div>
        <div>
          <dt>الحالة الحالية</dt>
          <dd><span class="status" :class="request.status">{{ statusLabel(request.status) }}</span></dd>
        </div>
        <div class="wide notes">
          <dt>الملاحظات / الوصف</dt>
          <dd>{{ request.notes }}</dd>
        </div>
      </dl>

      <footer class="modal-footer">
        <label>
          <span>تحديث الحالة</span>
          <select :value="request.status" @change="emitStatus($event)">
            <option
              v-for="status in nurseStatuses"
              :key="status.value"
              :value="status.value"
            >
              {{ status.label }}
            </option>
          </select>
        </label>
        <button class="close-button" type="button" @click="$emit('close')">إغلاق</button>
      </footer>
    </section>
  </div>
</template>

<script setup>
import { Activity, Clock, MapPin, Phone, User } from '@lucide/vue'
import { nurseStatuses } from '~/composables/useNurseRequests'

const props = defineProps({
  request: {
    type: Object,
    required: true
  },
  statusLabel: {
    type: Function,
    required: true
  }
})

const emit = defineEmits(['close', 'updateStatus'])

const emitStatus = event => {
  emit('updateStatus', props.request.id, event.target.value)
}
</script>

<style scoped>
.modal-overlay {
  align-items: center;
  background: rgba(29, 61, 108, .38);
  display: flex;
  inset: 0;
  justify-content: center;
  padding: 22px;
  position: fixed;
  z-index: 2100;
}

.details-modal {
  background: #eaf2fd;
  border: 1.5px solid #0b63f6;
  border-radius: 24px;
  box-shadow: 0 18px 45px rgba(0, 0, 0, .14);
  max-height: calc(100vh - 44px);
  max-width: 100%;
  overflow-y: auto;
  padding: 25px;
  width: 690px;
}

.modal-header {
  align-items: start;
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.modal-header p {
  color: #115bd2;
  direction: ltr;
  font-size: 14px;
  font-weight: 900;
  margin: 0 0 5px;
  text-align: right;
}

.modal-header h2 {
  font-size: 23px;
  margin: 0;
}

.modal-header button {
  background: #fff;
  border: 1px solid #8dbbfb;
  border-radius: 10px;
  color: #115bd2;
  cursor: pointer;
  font-size: 27px;
  height: 39px;
  line-height: 1;
  width: 39px;
}

.patient-name {
  align-items: center;
  background: #fff;
  border: 1px solid #d0e2fa;
  border-radius: 16px;
  color: #115bd2;
  display: flex;
  gap: 12px;
  margin-bottom: 14px;
  padding: 13px 16px;
}

.patient-name span {
  color: #536174;
  display: block;
  font-size: 13px;
  font-weight: 700;
}

.patient-name strong {
  color: #101010;
  font-size: 17px;
}

.details-grid {
  display: grid;
  gap: 11px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  margin: 0;
}

.details-grid div {
  background: #fff;
  border: 1px solid #d0e2fa;
  border-radius: 14px;
  padding: 13px 15px;
}

.details-grid .wide {
  grid-column: 1 / -1;
}

dt {
  align-items: center;
  color: #536174;
  display: flex;
  font-size: 13px;
  font-weight: 800;
  gap: 7px;
  margin-bottom: 8px;
}

dd {
  font-size: 15px;
  font-weight: 800;
  margin: 0;
}

.notes dd {
  font-weight: 700;
  line-height: 1.7;
}

.status {
  border-radius: 999px;
  display: inline-flex;
  font-size: 13px;
  padding: 6px 15px;
}

.status.new {
  background: #dcecff;
  color: #115bd2;
}

.status.on-the-way {
  background: #fff2d8;
  color: #9a6507;
}

.status.in-progress {
  background: #e7e2ff;
  color: #5337b6;
}

.status.completed {
  background: #dff3e7;
  color: #137446;
}

.modal-footer {
  align-items: end;
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 18px;
}

.modal-footer label span {
  color: #343434;
  display: block;
  font-size: 13px;
  font-weight: 800;
  margin-bottom: 6px;
}

.modal-footer select,
.close-button {
  border-radius: 11px;
  font-family: inherit;
  font-weight: 800;
  height: 43px;
}

.modal-footer select {
  background: #fff;
  border: 1px solid #8dbbfb;
  color: #115bd2;
  min-width: 145px;
  padding: 0 12px;
}

.close-button {
  background: #115bd2;
  border: 1px solid #115bd2;
  color: #fff;
  cursor: pointer;
  padding: 0 27px;
}

@media (max-width: 1030px) {
  .details-modal {
    width: 640px;
  }
}

@media (max-width: 720px) {
  .modal-overlay {
    align-items: flex-start;
    padding: 16px;
  }

  .details-modal {
    border-radius: 19px;
    max-height: calc(100vh - 32px);
    padding: 18px;
    width: 100%;
  }

  .modal-header h2 {
    font-size: 20px;
  }

  .details-grid {
    grid-template-columns: 1fr;
  }

  .modal-footer {
    align-items: stretch;
    flex-direction: column;
  }

  .modal-footer select,
  .close-button {
    width: 100%;
  }
}
</style>

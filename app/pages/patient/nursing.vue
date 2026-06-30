<template>
  <PatientPortalLayout title="التمريض المنزلي" subtitle="طلب خدمة تمريض منزلية ومتابعة الطلبات السابقة.">
    <template #header-action>
      <PatientActionButton to="/nursing" variant="primary">طلب خدمة تمريض جديدة</PatientActionButton>
    </template>

    <section class="patient-dashboard-card nursing-history-card" aria-labelledby="nursing-list-title">
      <div class="patient-section-header">
        <h2 id="nursing-list-title">الطلبات السابقة</h2>
        <span>{{ requests.length }} طلبات</span>
      </div>
      <div class="patient-list nursing-request-list">
        <article v-for="request in requests" :key="request.id" class="patient-list-item nursing-request-item">
          <div class="nursing-request-summary">
            <span>رقم الطلب</span>
            <strong>{{ request.number }}</strong>
            <p>{{ request.serviceType }}</p>
            <small>{{ formatArabicDate(request.date) }}</small>
          </div>

          <dl class="nursing-request-details">
            <div>
              <dt>الممرض/ة</dt>
              <dd>{{ request.nurseName || 'لم يتم تعيين ممرض بعد' }}</dd>
            </div>
            <div>
              <dt>العنوان</dt>
              <dd>{{ request.address }}</dd>
            </div>
            <div>
              <dt>الوقت</dt>
              <dd>{{ request.preferredTime }}</dd>
            </div>
            <div>
              <dt>الملاحظات</dt>
              <dd>{{ request.notes || 'لا توجد ملاحظات' }}</dd>
            </div>
          </dl>

          <div class="nursing-request-actions">
            <PatientStatusBadge :status="request.status" />
            <PatientActionButton variant="soft" @click="selectedRequest = request">عرض التفاصيل</PatientActionButton>
          </div>
        </article>
      </div>
    </section>

    <PatientModal
      v-if="selectedRequest"
      title="تفاصيل طلب التمريض"
      :subtitle="selectedRequest.number"
      @close="selectedRequest = null"
    >
      <dl class="patient-details-grid">
        <div><dt>نوع الخدمة</dt><dd>{{ selectedRequest.serviceType }}</dd></div>
        <div><dt>الحالة</dt><dd>{{ selectedRequest.status }}</dd></div>
        <div><dt>الممرض/ة</dt><dd>{{ selectedRequest.nurseName || 'لم يتم التعيين' }}</dd></div>
        <div><dt>العنوان</dt><dd>{{ selectedRequest.address }}</dd></div>
        <div><dt>الوقت المفضل</dt><dd>{{ selectedRequest.preferredTime }}</dd></div>
        <div><dt>ملاحظات</dt><dd>{{ selectedRequest.notes }}</dd></div>
      </dl>
      <template #actions>
        <button class="patient-cancel-button" type="button" @click="selectedRequest = null">إغلاق</button>
      </template>
    </PatientModal>
  </PatientPortalLayout>
</template>

<script setup>
import { formatArabicDate, nursingRequests } from '~/data/patientPortal'

const requests = ref(nursingRequests.map((request) => ({ ...request })))
const selectedRequest = ref(null)
</script>

<style scoped>
.nursing-history-card {
  margin-inline: auto;
  width: 100%;
}

.nursing-request-list {
  gap: 16px;
}

.nursing-request-item {
  align-items: stretch;
  display: grid;
  gap: 18px;
  grid-template-columns: minmax(180px, 0.75fr) minmax(0, 1.5fr) auto;
  padding: 18px;
}

.nursing-request-summary {
  background: #f8fbff;
  border: 1px solid #d7e8ff;
  border-radius: 12px;
  min-width: 0;
  padding: 14px;
}

.nursing-request-summary span,
.nursing-request-details dt {
  color: #115bd2;
  display: block;
  font-size: 13px;
  font-weight: 900;
  margin-bottom: 5px;
}

.nursing-request-summary strong {
  color: #101010;
  display: block;
  font-size: 20px;
  font-weight: 900;
  margin-bottom: 8px;
}

.nursing-request-summary p,
.nursing-request-summary small,
.nursing-request-details dd {
  color: #374151;
  font-size: 14px;
  font-weight: 800;
  line-height: 1.7;
  margin: 0;
}

.nursing-request-summary p {
  color: #101010;
  font-size: 15px;
  margin-bottom: 4px;
}

.nursing-request-details {
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  margin: 0;
}

.nursing-request-details div {
  background: #ffffff;
  border: 1px solid #d7e8ff;
  border-radius: 12px;
  min-width: 0;
  padding: 12px 14px;
}

.nursing-request-details dd {
  color: #101010;
  overflow-wrap: anywhere;
}

.nursing-request-actions {
  align-items: flex-start;
  display: flex;
  flex-direction: column;
  gap: 12px;
  justify-content: center;
  min-width: 150px;
}

@media (max-width: 720px) {
  .nursing-request-item {
    align-items: flex-start;
    grid-template-columns: 1fr;
  }

  .nursing-request-details {
    grid-template-columns: 1fr;
  }

  .nursing-request-actions {
    align-items: stretch;
    width: 100%;
  }
}
</style>

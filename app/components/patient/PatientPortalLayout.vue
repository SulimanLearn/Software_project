<template>
  <div class="patient-portal-page" dir="rtl">
    <NavBar />

    <div class="patient-portal-shell">
      <SideBarPatient :patient="patient" @logout="showLogoutModal = true" />

      <main class="patient-portal-content">
        <header class="patient-page-header">
          <div>
            <p v-if="eyebrow">{{ eyebrow }}</p>
            <h1>{{ title }}</h1>
            <span v-if="subtitle">{{ subtitle }}</span>
          </div>
          <slot name="header-action" />
        </header>

        <slot />
      </main>
    </div>

    <PatientModal
      v-if="showLogoutModal"
      title="تسجيل الخروج"
      size="sm"
      @close="showLogoutModal = false"
    >
      <p class="patient-modal-question">هل أنت متأكد أنك تريد تسجيل الخروج؟</p>

      <template #actions>
        <button class="patient-save-button" type="button" @click="confirmLogout">
          نعم
        </button>
        <button class="patient-cancel-button" type="button" @click="showLogoutModal = false">
          لا
        </button>
      </template>
    </PatientModal>
  </div>
</template>

<script setup>
import { patientProfile } from '~/data/patientPortal'

defineProps({
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String,
    default: ''
  },
  eyebrow: {
    type: String,
    default: ''
  },
  patient: {
    type: Object,
    default: () => patientProfile
  }
})

const showLogoutModal = ref(false)
const isLoggedIn = useState('isLoggedIn', () => false)
const user = useState('user', () => ({ name: '' }))

const confirmLogout = async () => {
  isLoggedIn.value = false
  user.value = { name: '' }
  showLogoutModal.value = false
  await navigateTo('/login')
}
</script>

<style>
.patient-portal-page {
  min-height: 100vh;
  background-color: #ffffff;
  color: #101010;
}

.patient-portal-shell {
  display: grid;
  grid-template-columns: 290px minmax(0, 1fr);
  min-height: calc(100vh - 85px);
}

.patient-portal-content {
  display: flex;
  flex-direction: column;
  gap: 28px;
  min-width: 0;
  padding: 36px 40px 64px;
}

.patient-page-header {
  align-items: flex-start;
  display: flex;
  gap: 18px;
  justify-content: space-between;
  margin-bottom: 0;
  text-align: right;
}

.patient-page-header p,
.patient-eyebrow {
  color: #115bd2;
  font-size: 15px;
  font-weight: 900;
  margin: 0 0 8px;
}

.patient-page-header h1 {
  font-size: 30px;
  font-weight: 900;
  margin: 0 0 8px;
}

.patient-page-header span {
  color: #343434;
  display: block;
  font-size: 16px;
  font-weight: 700;
}

.patient-stats-grid {
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  margin-bottom: 0;
}

.patient-stat-card,
.patient-dashboard-card,
.patient-filters-card,
.patient-period-filter-card,
.patient-profile-header-card {
  background-color: #eaf2fd;
  border: 1.5px solid #0b63f6;
  border-radius: 24px;
}

.patient-stat-card {
  align-items: center;
  display: flex;
  gap: 18px;
  justify-content: space-between;
  min-height: 126px;
  padding: 24px;
  transition: box-shadow 0.2s ease, transform 0.2s ease;
}

.patient-stat-card:hover,
.patient-dashboard-card:hover {
  box-shadow: 0 12px 26px rgba(17, 91, 210, 0.12);
}

.patient-stat-card:hover {
  transform: translateY(-2px);
}

.patient-stat-copy {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.patient-stat-copy strong {
  font-size: 28px;
  font-weight: 900;
}

.patient-stat-copy span {
  font-size: 17px;
  font-weight: 800;
}

.patient-stat-icon,
.patient-info-icon,
.patient-notification-icon {
  background-color: #ffffff;
  border: 1px solid #8dbbfb;
  border-radius: 16px;
  box-sizing: border-box;
  color: #115bd2;
  flex: 0 0 auto;
  height: 54px;
  padding: 12px;
  stroke: #115bd2;
  width: 54px;
}

.patient-dashboard-card {
  padding: 26px;
}

.patient-section-header {
  align-items: center;
  display: flex;
  gap: 16px;
  justify-content: space-between;
  margin-bottom: 20px;
}

.patient-section-header h2 {
  font-size: 22px;
  font-weight: 900;
  margin: 0;
}

.patient-section-header span {
  color: #343434;
  font-size: 15px;
  font-weight: 800;
}

.patient-grid-two {
  display: grid;
  gap: 28px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.patient-stack {
  display: grid;
  gap: 28px;
}

.patient-list {
  display: grid;
  gap: 14px;
}

.patient-list-item {
  background-color: #ffffff;
  border: 1px solid #8dbbfb;
  border-radius: 16px;
  display: grid;
  gap: 8px;
  padding: 16px 18px;
}

.patient-list-item strong {
  font-size: 16px;
  font-weight: 900;
}

.patient-list-item p,
.patient-list-item span {
  color: #343434;
  font-size: 15px;
  font-weight: 700;
  margin: 0;
}

.patient-table-wrap {
  overflow-x: auto;
}

.patient-table {
  border-collapse: separate;
  border-spacing: 0 12px;
  min-width: 980px;
  width: 100%;
}

.patient-table th,
.patient-table td {
  padding: 15px 16px;
  text-align: right;
  white-space: nowrap;
}

.patient-table th {
  color: #343434;
  font-size: 15px;
  font-weight: 900;
}

.patient-table td {
  background-color: #ffffff;
  border-bottom: 1px solid #8dbbfb;
  border-top: 1px solid #8dbbfb;
  font-size: 15px;
  font-weight: 800;
}

.patient-table td:first-child {
  border-radius: 0 14px 14px 0;
  border-right: 1px solid #8dbbfb;
}

.patient-table td:last-child {
  border-left: 1px solid #8dbbfb;
  border-radius: 14px 0 0 14px;
}

.patient-status-badge,
.patient-type-badge {
  align-items: center;
  border-radius: 999px;
  display: inline-flex;
  font-size: 13px;
  font-weight: 900;
  justify-content: center;
  min-width: 92px;
  padding: 6px 12px;
}

.patient-status-badge.completed {
  background-color: #dff3e7;
  color: #137446;
}

.patient-status-badge.waiting {
  background-color: #fff2d8;
  color: #9a6507;
}

.patient-status-badge.confirmed,
.patient-status-badge.preparing,
.patient-type-badge.online {
  background-color: #dcecff;
  color: #115bd2;
}

.patient-status-badge.delivery {
  background-color: #e6f7fb;
  color: #04768d;
}

.patient-status-badge.cancelled {
  background-color: #ffe4e4;
  color: #b42318;
}

.patient-type-badge.clinic {
  background-color: #e9f7ef;
  color: #137446;
}

.patient-action-row {
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.patient-form-grid > .patient-action-row {
  margin-top: 6px;
}

.patient-action-button,
.patient-save-button,
.patient-cancel-button,
.patient-outline-button,
.patient-filter-button {
  align-items: center;
  border-radius: 18px;
  cursor: pointer;
  display: inline-flex;
  font-family: inherit;
  font-size: 15px;
  font-weight: 900;
  gap: 8px;
  justify-content: center;
  min-height: 40px;
  padding: 8px 16px;
  text-decoration: none;
  transition: background-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
}

.patient-action-button.primary,
.patient-save-button {
  background-color: #115bd2;
  border: 1px solid #115bd2;
  color: #ffffff;
}

.patient-action-button.soft {
  background-color: #5a99ef;
  border: 1px solid #0b63f6;
  color: #ffffff;
}

.patient-action-button.outline,
.patient-outline-button,
.patient-cancel-button {
  background-color: #ffffff;
  border: 1px solid #0b63f6;
  color: #115bd2;
}

.patient-action-button.danger {
  background-color: #ffffff;
  border: 1px solid #fda29b;
  color: #b42318;
}

.patient-action-button:hover,
.patient-save-button:hover,
.patient-outline-button:hover,
.patient-cancel-button:hover,
.patient-filter-button:hover {
  box-shadow: 0 5px 12px rgba(17, 91, 210, 0.16);
  transform: translateY(-1px);
}

.patient-action-button.primary:hover,
.patient-action-button.soft:hover,
.patient-save-button:hover {
  background-color: #0b4db8;
}

.patient-action-button:disabled {
  cursor: not-allowed;
  opacity: 0.58;
  transform: none;
}

.patient-period-filter-card {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 0;
  padding: 18px;
}

.patient-filter-button {
  background-color: #ffffff;
  border: 1px solid #8dbbfb;
  color: #115bd2;
  min-width: 120px;
}

.patient-filter-button.active,
.patient-filter-button:hover {
  background-color: #5a99ef;
  border-color: #0b63f6;
  color: #ffffff;
}

.patient-filters-card {
  display: grid;
  gap: 18px;
  grid-template-columns: minmax(260px, 1.5fr) repeat(2, minmax(170px, 1fr));
  margin-bottom: 0;
  padding: 22px;
}

.patient-form-grid {
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.patient-form-field {
  display: grid;
  gap: 8px;
}

.patient-form-field.full {
  grid-column: 1 / -1;
}

.patient-form-field span {
  color: #343434;
  font-size: 14px;
  font-weight: 900;
}

.patient-form-field input,
.patient-form-field select,
.patient-form-field textarea {
  background-color: #ffffff;
  border: 1px solid #8dbbfb;
  border-radius: 16px;
  color: #101010;
  font-family: inherit;
  font-size: 15px;
  font-weight: 800;
  min-height: 44px;
  outline: none;
  padding: 0 14px;
}

.patient-form-field textarea {
  line-height: 1.8;
  padding: 12px 14px;
  resize: vertical;
}

.patient-form-field input:focus,
.patient-form-field select:focus,
.patient-form-field textarea:focus {
  border-color: #0b63f6;
  box-shadow: 0 0 0 3px rgba(90, 153, 239, 0.2);
}

.patient-empty-state {
  background-color: #ffffff;
  border: 1px solid #8dbbfb;
  border-radius: 18px;
  padding: 42px 24px;
  text-align: center;
}

.patient-empty-state h2 {
  font-size: 24px;
  font-weight: 900;
  margin: 0 0 10px;
}

.patient-empty-state p {
  font-size: 17px;
  margin: 0;
}

.patient-modal-overlay {
  align-items: center;
  background-color: rgba(68, 139, 239, 0.38);
  display: flex;
  inset: 0;
  justify-content: center;
  padding: 24px;
  position: fixed;
  z-index: 2000;
}

.patient-modal {
  background-color: #eaf2fd;
  border: 1.5px solid #0b63f6;
  border-radius: 24px;
  box-shadow: 0 18px 45px rgba(0, 0, 0, 0.12);
  max-height: calc(100vh - 48px);
  max-width: 100%;
  overflow-y: auto;
  padding: 28px;
  width: 760px;
}

.patient-modal-sm {
  padding: 42px 44px 34px;
  text-align: center;
  width: 560px;
}

.patient-modal-lg {
  width: 920px;
}

.patient-modal-header {
  align-items: flex-start;
  display: flex;
  gap: 18px;
  justify-content: space-between;
  margin-bottom: 22px;
}

.patient-modal-sm .patient-modal-header {
  display: block;
}

.patient-modal-header h2 {
  font-size: 26px;
  font-weight: 900;
  margin: 0 0 8px;
}

.patient-modal-header p,
.patient-modal-question {
  color: #343434;
  font-size: 15px;
  font-weight: 800;
  margin: 0;
}

.patient-modal-question {
  font-size: 22px;
  margin-bottom: 30px;
}

.patient-close-button {
  align-items: center;
  background-color: #ffffff;
  border: 1px solid #8dbbfb;
  border-radius: 14px;
  color: #115bd2;
  cursor: pointer;
  display: inline-flex;
  flex: 0 0 auto;
  font-size: 24px;
  height: 40px;
  justify-content: center;
  line-height: 1;
  width: 42px;
}

.patient-modal-sm .patient-close-button {
  display: none;
}

.patient-modal-actions {
  display: flex;
  gap: 14px;
  justify-content: flex-start;
  margin-top: 24px;
}

.patient-modal-sm .patient-modal-actions {
  justify-content: center;
  margin-top: 0;
}

.patient-modal-actions button {
  min-width: 110px;
}

.patient-details-grid {
  display: grid;
  gap: 12px;
  margin: 18px 0;
}

.patient-details-grid div {
  align-items: center;
  background-color: #ffffff;
  border: 1px solid #8dbbfb;
  border-radius: 14px;
  display: grid;
  gap: 10px;
  grid-template-columns: 150px minmax(0, 1fr);
  padding: 13px 16px;
}

.patient-details-grid dt {
  color: #343434;
  font-weight: 900;
}

.patient-details-grid dd {
  font-weight: 800;
  margin: 0;
}

.patient-progress {
  display: grid;
  gap: 14px;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  margin-top: 16px;
}

.patient-progress-step {
  align-items: center;
  background-color: #ffffff;
  border: 1px solid #8dbbfb;
  border-radius: 16px;
  color: #343434;
  display: flex;
  font-size: 14px;
  font-weight: 900;
  justify-content: center;
  min-height: 48px;
  padding: 8px;
  text-align: center;
}

.patient-progress-step.done {
  background-color: #dcecff;
  border-color: #0b63f6;
  color: #115bd2;
}

.patient-toast-message {
  background-color: #115bd2;
  border: 1px solid #0b63f6;
  border-radius: 18px;
  bottom: 24px;
  box-shadow: 0 14px 32px rgba(17, 91, 210, 0.24);
  color: #ffffff;
  font-weight: 900;
  inset-inline-start: 24px;
  padding: 12px 18px;
  position: fixed;
  z-index: 3000;
}

@media (max-width: 1160px) {
  .patient-stats-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 1030px) {
  .patient-portal-shell {
    grid-template-columns: 240px minmax(0, 1fr);
  }

  .patient-portal-content {
    gap: 26px;
    padding: 32px 24px 60px;
  }

  .patient-grid-two {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 820px) {
  .patient-filters-card,
  .patient-form-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 720px) {
  .patient-portal-shell {
    display: flex;
    flex-direction: column;
  }

  .patient-portal-content {
    gap: 24px;
    padding: 32px 18px 56px;
  }

  .patient-page-header {
    flex-direction: column;
  }

  .patient-page-header h1 {
    font-size: 26px;
  }

  .patient-dashboard-card,
  .patient-stat-card,
  .patient-filters-card,
  .patient-period-filter-card,
  .patient-profile-header-card {
    border-radius: 20px;
  }

  .patient-dashboard-card {
    padding: 22px;
  }

  .patient-table {
    border-spacing: 0;
    min-width: 0;
  }

  .patient-table thead {
    display: none;
  }

  .patient-table,
  .patient-table tbody,
  .patient-table tr,
  .patient-table td {
    display: block;
    width: 100%;
  }

  .patient-table tr {
    background-color: #ffffff;
    border: 1px solid #8dbbfb;
    border-radius: 18px;
    margin-bottom: 12px;
    padding: 10px 14px;
  }

  .patient-table td,
  .patient-table td:first-child,
  .patient-table td:last-child {
    align-items: center;
    background-color: transparent;
    border: 0;
    border-radius: 0;
    display: flex;
    gap: 18px;
    justify-content: space-between;
    padding: 10px 0;
    white-space: normal;
  }

  .patient-table td::before {
    color: #343434;
    content: attr(data-label);
    flex: 0 0 auto;
    font-weight: 900;
  }

  .patient-details-grid div {
    grid-template-columns: 1fr;
  }

  .patient-progress {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 560px) {
  .patient-portal-content {
    padding: 28px 14px 52px;
  }

  .patient-stats-grid {
    grid-template-columns: 1fr;
  }

  .patient-section-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .patient-period-filter-card {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .patient-filter-button {
    min-width: 0;
  }

  .patient-modal-overlay {
    padding: 16px;
  }

  .patient-modal,
  .patient-modal-sm {
    border-radius: 20px;
    padding: 28px 20px;
  }

  .patient-modal-question {
    font-size: 20px;
  }

  .patient-modal-actions {
    flex-direction: column;
  }

  .patient-modal-actions button,
  .patient-action-row .patient-action-button {
    width: 100%;
  }

  .patient-toast-message {
    inset-inline: 16px;
    text-align: center;
  }
}
</style>

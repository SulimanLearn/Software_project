<template>
  <div class="pharmacist-portal-page" dir="rtl">
    <NavBar />

    <div class="pharmacist-portal-shell">
      <PharmacistSidebar :pharmacist="pharmacist" @logout="showLogoutModal = true" />

      <main class="pharmacist-portal-content">
        <header class="pharmacist-page-header">
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

    <PharmacistModal
      v-if="showLogoutModal"
      title="تسجيل الخروج"
      size="sm"
      @close="showLogoutModal = false"
    >
      <p class="pharmacist-modal-question">هل أنت متأكد أنك تريد تسجيل الخروج؟</p>

      <template #actions>
        <button class="pharmacist-save-button" type="button" @click="confirmLogout">نعم</button>
        <button class="pharmacist-cancel-button" type="button" @click="showLogoutModal = false">لا</button>
      </template>
    </PharmacistModal>
  </div>
</template>

<script setup lang="ts">
import { pharmacistProfile } from '~/data/pharmacistPortal'

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
  pharmacist: {
    type: Object,
    default: () => pharmacistProfile
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
.pharmacist-portal-page {
  background-color: #ffffff;
  color: #101010;
  min-height: 100vh;
  overflow-x: hidden;
}

.pharmacist-portal-shell {
  display: grid;
  grid-template-columns: 290px minmax(0, 1fr);
  min-height: calc(100vh - 85px);
}

.pharmacist-portal-content {
  display: flex;
  flex-direction: column;
  gap: 28px;
  min-width: 0;
  padding: 36px 40px 64px;
}

.pharmacist-page-header {
  align-items: flex-start;
  display: flex;
  gap: 18px;
  justify-content: space-between;
  text-align: right;
}

.pharmacist-page-header p,
.pharmacist-eyebrow {
  color: #115bd2;
  font-size: 15px;
  font-weight: 900;
  margin: 0 0 8px;
}

.pharmacist-page-header h1 {
  font-size: 30px;
  font-weight: 900;
  margin: 0 0 8px;
}

.pharmacist-page-header span {
  color: #343434;
  display: block;
  font-size: 16px;
  font-weight: 700;
}

.pharmacist-sidebar {
  background-color: #eaf2fd;
  border-left: 1.5px solid #0b63f6;
  padding: 32px;
}

.pharmacist-sidebar-header {
  align-items: center;
  display: flex;
  gap: 16px;
  justify-content: center;
}

.pharmacist-profile-card {
  align-items: center;
  background-color: #eaf2fd;
  border: 1.5px solid #0b63f6;
  border-radius: 24px;
  display: flex;
  flex-direction: column;
  margin-bottom: 26px;
  min-height: 164px;
  padding: 18px 16px;
  text-align: center;
  width: 100%;
}

.pharmacist-avatar {
  align-items: center;
  background-color: #ffffff;
  border: 1px solid #8dbbfb;
  border-radius: 18px;
  display: flex;
  height: 70px;
  justify-content: center;
  margin-bottom: 12px;
  overflow: hidden;
  padding: 8px;
  width: 82px;
}

.pharmacist-avatar img {
  height: 100%;
  object-fit: contain;
  width: 100%;
}

.pharmacist-profile-card strong {
  font-size: 17px;
  font-weight: 900;
}

.pharmacist-profile-card span {
  color: #343434;
  font-size: 15px;
  margin-top: 4px;
}

.pharmacist-sidebar-toggle {
  display: none;
}

.pharmacist-sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.pharmacist-sidebar-link {
  align-items: center;
  border-radius: 8px;
  color: #0a0a0a;
  display: flex;
  font-size: 16px;
  font-weight: 800;
  gap: 10px;
  justify-content: center;
  min-height: 38px;
  text-decoration: none;
  transition: background-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
}

.pharmacist-sidebar-link:hover,
.pharmacist-sidebar-link.active {
  background-color: #5a99ef;
  box-shadow: inset 0 0 0 1px #0b63f6;
}

.pharmacist-sidebar-link:hover {
  transform: translateY(-1px);
}

.pharmacist-logout-link {
  background-color: transparent;
  border: 0;
  cursor: pointer;
  font-family: inherit;
  width: 100%;
}

.pharmacist-stats-grid {
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.pharmacist-stat-card,
.pharmacist-card,
.pharmacist-filters-card,
.pharmacist-profile-header-card {
  background-color: #eaf2fd;
  border: 1.5px solid #0b63f6;
  border-radius: 24px;
}

.pharmacist-stat-card {
  align-items: center;
  display: flex;
  gap: 18px;
  justify-content: space-between;
  min-height: 126px;
  padding: 24px;
  transition: box-shadow 0.2s ease, transform 0.2s ease;
}

.pharmacist-stat-card:hover,
.pharmacist-card:hover {
  box-shadow: 0 12px 26px rgba(17, 91, 210, 0.12);
}

.pharmacist-stat-card:hover {
  transform: translateY(-2px);
}

.pharmacist-stat-copy {
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.pharmacist-stat-copy strong {
  font-size: 28px;
  font-weight: 900;
}

.pharmacist-stat-copy span {
  font-size: 17px;
  font-weight: 800;
}

.pharmacist-stat-copy small {
  color: #536174;
  font-size: 13px;
  font-weight: 800;
}

.pharmacist-stat-icon,
.pharmacist-info-icon {
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

.pharmacist-card {
  padding: 26px;
}

.pharmacist-section-header {
  align-items: center;
  display: flex;
  gap: 16px;
  justify-content: space-between;
  margin-bottom: 20px;
}

.pharmacist-section-header h2 {
  font-size: 22px;
  font-weight: 900;
  margin: 0;
}

.pharmacist-section-header span,
.pharmacist-section-header a {
  color: #115bd2;
  font-size: 14px;
  font-weight: 900;
  text-decoration: none;
}

.pharmacist-grid-two {
  display: grid;
  gap: 28px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.pharmacist-stack {
  display: grid;
  gap: 28px;
}

.pharmacist-list {
  display: grid;
  gap: 14px;
}

.pharmacist-list-item,
.pharmacist-alert-card {
  background-color: #ffffff;
  border: 1px solid #8dbbfb;
  border-radius: 16px;
  display: grid;
  gap: 8px;
  padding: 16px 18px;
}

.pharmacist-list-item strong,
.pharmacist-alert-card strong {
  font-size: 16px;
  font-weight: 900;
}

.pharmacist-list-item p,
.pharmacist-list-item span,
.pharmacist-alert-card p,
.pharmacist-alert-card span {
  color: #343434;
  font-size: 15px;
  font-weight: 700;
  margin: 0;
}

.pharmacist-alert-grid {
  display: grid;
  gap: 14px;
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.pharmacist-alert-card {
  border-color: #fda29b;
}

.pharmacist-alert-heading {
  align-items: center;
  display: flex;
  gap: 10px;
}

.pharmacist-alert-heading svg {
  color: #ef4444;
}

.pharmacist-alert-message {
  background-color: #ffe4e4;
  border: 1px solid #ffd0d0;
  border-radius: 14px;
  color: #8a1f16;
  font-weight: 800;
  padding: 12px 14px;
  text-align: center;
}

.pharmacist-table-wrap {
  overflow-x: auto;
}

.pharmacist-table {
  border-collapse: separate;
  border-spacing: 0 12px;
  min-width: 980px;
  width: 100%;
}

.pharmacist-table th,
.pharmacist-table td {
  padding: 15px 16px;
  text-align: right;
  white-space: nowrap;
}

.pharmacist-table th {
  color: #343434;
  font-size: 15px;
  font-weight: 900;
}

.pharmacist-table td {
  background-color: #ffffff;
  border-bottom: 1px solid #8dbbfb;
  border-top: 1px solid #8dbbfb;
  font-size: 15px;
  font-weight: 800;
}

.pharmacist-table td:first-child {
  border-radius: 0 14px 14px 0;
  border-right: 1px solid #8dbbfb;
}

.pharmacist-table td:last-child {
  border-left: 1px solid #8dbbfb;
  border-radius: 14px 0 0 14px;
}

.pharmacist-status-badge {
  align-items: center;
  border-radius: 999px;
  display: inline-flex;
  font-size: 13px;
  font-weight: 900;
  justify-content: center;
  min-width: 92px;
  padding: 6px 12px;
}

.pharmacist-status-badge.new {
  background-color: #dcecff;
  color: #115bd2;
}

.pharmacist-status-badge.processing,
.pharmacist-status-badge.low {
  background-color: #fff2d8;
  color: #9a6507;
}

.pharmacist-status-badge.ready,
.pharmacist-status-badge.delivery {
  background-color: #ede9fe;
  color: #5b21b6;
}

.pharmacist-status-badge.completed,
.pharmacist-status-badge.available {
  background-color: #dff3e7;
  color: #137446;
}

.pharmacist-status-badge.rejected,
.pharmacist-status-badge.unavailable,
.pharmacist-status-badge.expired {
  background-color: #ffe4e4;
  color: #b42318;
}

.pharmacist-action-row {
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.pharmacist-action-button,
.pharmacist-save-button,
.pharmacist-cancel-button,
.pharmacist-outline-button,
.pharmacist-filter-button {
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

.pharmacist-action-button.primary,
.pharmacist-save-button {
  background-color: #115bd2;
  border: 1px solid #115bd2;
  color: #ffffff;
}

.pharmacist-action-button.soft {
  background-color: #5a99ef;
  border: 1px solid #0b63f6;
  color: #ffffff;
}

.pharmacist-action-button.outline,
.pharmacist-outline-button,
.pharmacist-cancel-button {
  background-color: #ffffff;
  border: 1px solid #0b63f6;
  color: #115bd2;
}

.pharmacist-action-button.danger {
  background-color: #ffffff;
  border: 1px solid #fda29b;
  color: #b42318;
}

.pharmacist-action-button:hover,
.pharmacist-save-button:hover,
.pharmacist-outline-button:hover,
.pharmacist-cancel-button:hover {
  box-shadow: 0 5px 12px rgba(17, 91, 210, 0.16);
  transform: translateY(-1px);
}

.pharmacist-action-button.primary:hover,
.pharmacist-action-button.soft:hover,
.pharmacist-save-button:hover {
  background-color: #0b4db8;
}

.pharmacist-action-button:disabled {
  cursor: not-allowed;
  opacity: 0.58;
  transform: none;
}

.pharmacist-filters-card {
  display: grid;
  gap: 18px;
  grid-template-columns: minmax(260px, 1.5fr) repeat(2, minmax(170px, 1fr));
  padding: 22px;
}

.pharmacist-form-grid {
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.pharmacist-form-field {
  display: grid;
  gap: 8px;
}

.pharmacist-form-field.full {
  grid-column: 1 / -1;
}

.pharmacist-form-field span {
  color: #343434;
  font-size: 14px;
  font-weight: 900;
}

.pharmacist-form-field input,
.pharmacist-form-field select,
.pharmacist-form-field textarea {
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

.pharmacist-form-field textarea {
  line-height: 1.8;
  padding: 12px 14px;
  resize: vertical;
}

.pharmacist-form-field input:focus,
.pharmacist-form-field select:focus,
.pharmacist-form-field textarea:focus {
  border-color: #0b63f6;
  box-shadow: 0 0 0 3px rgba(90, 153, 239, 0.2);
}

.pharmacist-profile-header-card {
  align-items: center;
  display: flex;
  gap: 22px;
  padding: 24px;
}

.pharmacist-profile-avatar {
  align-items: center;
  background-color: #ffffff;
  border: 1px solid #8dbbfb;
  border-radius: 22px;
  color: #115bd2;
  display: flex;
  height: 132px;
  justify-content: center;
  width: 148px;
}

.pharmacist-profile-heading h2 {
  font-size: 30px;
  font-weight: 900;
  margin: 0 0 8px;
}

.pharmacist-profile-heading p {
  color: #343434;
  font-size: 17px;
  font-weight: 800;
  margin: 0 0 14px;
}

.pharmacist-profile-meta {
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.pharmacist-profile-meta > span:not(.pharmacist-status-badge) {
  background-color: #ffffff;
  border: 1px solid #8dbbfb;
  border-radius: 999px;
  color: #343434;
  font-size: 14px;
  font-weight: 900;
  padding: 8px 14px;
}

.pharmacist-details-grid {
  display: grid;
  gap: 12px;
  margin: 18px 0;
}

.pharmacist-details-grid div {
  align-items: center;
  background-color: #ffffff;
  border: 1px solid #8dbbfb;
  border-radius: 14px;
  display: grid;
  gap: 10px;
  grid-template-columns: 160px minmax(0, 1fr);
  padding: 13px 16px;
}

.pharmacist-details-grid dt {
  color: #343434;
  font-weight: 900;
}

.pharmacist-details-grid dd {
  font-weight: 800;
  margin: 0;
}

.pharmacist-modal-overlay {
  align-items: center;
  backdrop-filter: blur(5px);
  background-color: rgba(6, 23, 52, 0.56);
  box-sizing: border-box;
  display: flex;
  inset: 0;
  justify-content: center;
  padding: 24px;
  position: fixed;
  z-index: 2000;
}

.pharmacist-modal {
  background-color: #eaf2fd;
  border: 1.5px solid #0b63f6;
  border-radius: 24px;
  box-sizing: border-box;
  box-shadow: 0 18px 45px rgba(0, 0, 0, 0.12);
  max-height: 90vh;
  max-width: min(760px, 90vw);
  overflow-x: hidden;
  overflow-y: auto;
  padding: 28px;
  width: 100%;
}

.pharmacist-modal-sm {
  max-width: min(560px, 90vw);
  padding: 42px 44px 34px;
  text-align: center;
}

.pharmacist-modal-lg {
  max-width: min(1040px, 90vw);
}

.pharmacist-modal-stock {
  max-width: min(600px, 90vw);
}

.pharmacist-modal-header {
  align-items: flex-start;
  display: flex;
  gap: 18px;
  justify-content: space-between;
  margin-bottom: 22px;
}

.pharmacist-modal-sm .pharmacist-modal-header {
  display: block;
}

.pharmacist-modal-header h2 {
  font-size: 26px;
  font-weight: 900;
  margin: 0 0 8px;
}

.pharmacist-modal-header p,
.pharmacist-modal-question {
  color: #343434;
  font-size: 15px;
  font-weight: 800;
  margin: 0;
}

.pharmacist-modal-question {
  font-size: 22px;
  margin-bottom: 30px;
}

.pharmacist-close-button {
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

.pharmacist-modal-sm .pharmacist-close-button {
  display: none;
}

.pharmacist-modal-actions {
  display: flex;
  gap: 14px;
  justify-content: flex-start;
  margin-top: 24px;
}

.pharmacist-modal-sm .pharmacist-modal-actions {
  justify-content: center;
  margin-top: 0;
}

.pharmacist-toast-message {
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

.pharmacist-error {
  background-color: #ffe4e4;
  border: 1px solid #fda29b;
  border-radius: 14px;
  color: #b42318;
  font-size: 14px;
  font-weight: 900;
  margin: 0;
  padding: 11px 14px;
}

@media (max-width: 1160px) {
  .pharmacist-stats-grid,
  .pharmacist-alert-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 1030px) {
  .pharmacist-portal-shell {
    grid-template-columns: 240px minmax(0, 1fr);
  }

  .pharmacist-portal-content {
    gap: 26px;
    padding: 32px 24px 60px;
  }

  .pharmacist-grid-two {
    grid-template-columns: 1fr;
  }

  .pharmacist-sidebar {
    padding: 24px 18px;
  }

  .pharmacist-sidebar-link {
    font-size: 14px;
  }
}

@media (max-width: 820px) {
  .pharmacist-filters-card,
  .pharmacist-form-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 720px) {
  .pharmacist-portal-shell {
    display: flex;
    flex-direction: column;
  }

  .pharmacist-sidebar {
    border-bottom: 1.5px solid #0b63f6;
    border-left: 0;
    padding: 18px;
  }

  .pharmacist-sidebar-header {
    justify-content: space-between;
  }

  .pharmacist-profile-card {
    align-items: center;
    flex: 1;
    flex-direction: row;
    gap: 12px;
    margin-bottom: 0;
    min-height: 76px;
    padding: 12px;
    text-align: right;
  }

  .pharmacist-avatar {
    height: 52px;
    margin-bottom: 0;
    width: 58px;
  }

  .pharmacist-sidebar-toggle {
    align-items: center;
    background-color: #5a99ef;
    border: 1px solid #0b63f6;
    border-radius: 8px;
    cursor: pointer;
    display: inline-flex;
    flex: 0 0 auto;
    flex-direction: column;
    gap: 5px;
    height: 40px;
    justify-content: center;
    padding: 0;
    width: 44px;
  }

  .pharmacist-sidebar-toggle span {
    background-color: #ffffff;
    border-radius: 999px;
    display: block;
    height: 2px;
    width: 22px;
  }

  .pharmacist-sidebar-nav {
    display: grid;
    gap: 10px;
    grid-template-columns: repeat(2, minmax(120px, 1fr));
    margin-top: 0;
    max-height: 0;
    opacity: 0;
    overflow: hidden;
    transition: max-height 0.25s ease, margin-top 0.25s ease, opacity 0.2s ease;
  }

  .pharmacist-sidebar-nav.is-open {
    margin-top: 18px;
    max-height: 760px;
    opacity: 1;
  }

  .pharmacist-portal-content {
    gap: 24px;
    padding: 32px 18px 56px;
  }

  .pharmacist-page-header,
  .pharmacist-section-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .pharmacist-page-header h1 {
    font-size: 26px;
  }

  .pharmacist-card,
  .pharmacist-stat-card,
  .pharmacist-filters-card,
  .pharmacist-profile-header-card {
    border-radius: 20px;
  }

  .pharmacist-card {
    padding: 22px;
  }

  .pharmacist-table {
    border-spacing: 0;
    min-width: 0;
  }

  .pharmacist-table thead {
    display: none;
  }

  .pharmacist-table,
  .pharmacist-table tbody,
  .pharmacist-table tr,
  .pharmacist-table td {
    display: block;
    width: 100%;
  }

  .pharmacist-table tr {
    background-color: #ffffff;
    border: 1px solid #8dbbfb;
    border-radius: 18px;
    margin-bottom: 12px;
    padding: 10px 14px;
  }

  .pharmacist-table td,
  .pharmacist-table td:first-child,
  .pharmacist-table td:last-child {
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

  .pharmacist-table td::before {
    color: #343434;
    content: attr(data-label);
    flex: 0 0 auto;
    font-weight: 900;
  }

  .pharmacist-details-grid div {
    grid-template-columns: 1fr;
  }

  .pharmacist-profile-header-card {
    align-items: flex-start;
    flex-direction: column;
  }
}

@media (max-width: 560px) {
  .pharmacist-portal-content {
    padding: 28px 14px 52px;
  }

  .pharmacist-stats-grid,
  .pharmacist-alert-grid,
  .pharmacist-sidebar-nav {
    grid-template-columns: 1fr;
  }

  .pharmacist-modal-overlay {
    padding: 12px;
  }

  .pharmacist-modal,
  .pharmacist-modal-sm {
    border-radius: 20px;
    max-height: 92vh;
    max-width: calc(100vw - 24px);
    padding: 24px 16px;
  }

  .pharmacist-modal-question {
    font-size: 20px;
  }

  .pharmacist-modal-actions,
  .pharmacist-action-row {
    flex-direction: column;
  }

  .pharmacist-modal-actions button,
  .pharmacist-action-row .pharmacist-action-button {
    width: 100%;
  }

  .pharmacist-toast-message {
    inset-inline: 16px;
    text-align: center;
  }
}
</style>

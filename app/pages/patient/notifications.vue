<template>
  <PatientPortalLayout title="الإشعارات" subtitle="متابعة تذكيرات المواعيد والوصفات والطلبات وخدمات التمريض.">
    <template #header-action>
      <button class="patient-save-button" type="button" @click="markAllAsRead">
        تعليم الكل كمقروء
      </button>
    </template>

    <section class="patient-dashboard-card" aria-labelledby="notifications-title">
      <div class="patient-section-header">
        <h2 id="notifications-title">كل الإشعارات</h2>
        <span>{{ unreadCount }} غير مقروءة</span>
      </div>

      <div class="notifications-list">
        <article
          v-for="notification in notifications"
          :key="notification.id"
          class="notification-card"
          :class="{ unread: notification.unread }"
        >
          <component :is="notification.icon" class="patient-notification-icon" :size="24" :stroke-width="2" aria-hidden="true" />
          <div>
            <strong>{{ notification.title }}</strong>
            <p>{{ notification.description }}</p>
            <span>{{ formatArabicDate(notification.date) }} - {{ notification.time }}</span>
          </div>
          <div class="patient-action-row">
            <button class="patient-action-button outline" type="button">{{ notification.action }}</button>
            <button class="patient-action-button soft" type="button" @click="notification.unread = !notification.unread">
              {{ notification.unread ? 'تعليم كمقروء' : 'تعليم كغير مقروء' }}
            </button>
          </div>
        </article>
      </div>
    </section>
  </PatientPortalLayout>
</template>

<script setup>
import { formatArabicDate, patientNotifications } from '~/data/patientPortal'

const notifications = ref(patientNotifications.map((notification) => ({ ...notification })))
const unreadCount = computed(() => notifications.value.filter((notification) => notification.unread).length)
const markAllAsRead = () => {
  notifications.value.forEach((notification) => {
    notification.unread = false
  })
}
</script>

<style scoped>
.notifications-list {
  display: grid;
  gap: 14px;
}

.notification-card {
  align-items: center;
  background-color: #ffffff;
  border: 1px solid #8dbbfb;
  border-radius: 18px;
  display: grid;
  gap: 16px;
  grid-template-columns: auto minmax(0, 1fr) auto;
  padding: 18px;
}

.notification-card.unread {
  border-color: #0b63f6;
  box-shadow: inset 4px 0 0 #115bd2;
}

.notification-card strong {
  font-size: 17px;
  font-weight: 900;
}

.notification-card p,
.notification-card span {
  color: #343434;
  font-weight: 800;
  margin: 5px 0 0;
}

@media (max-width: 820px) {
  .notification-card {
    grid-template-columns: 1fr;
  }
}
</style>

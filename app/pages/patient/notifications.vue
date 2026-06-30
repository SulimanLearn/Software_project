<template>
  <PatientPortalLayout title="الإشعارات" subtitle="متابعة تذكيرات المواعيد والوصفات والطلبات وخدمات التمريض.">
    <template #header-action>
      <button class="patient-save-button" type="button" :disabled="notificationsLoading || !unreadCount" @click="markAllAsRead">
        {{ notificationsLoading ? 'جاري التحميل...' : 'تعليم الكل كمقروء' }}
      </button>
    </template>

    <section class="patient-dashboard-card" aria-labelledby="notifications-title">
      <div class="patient-section-header">
        <h2 id="notifications-title">كل الإشعارات</h2>
        <span>{{ unreadCount }} غير مقروءة</span>
      </div>
      <p v-if="notificationsLoading" class="notifications-api-status">جاري تحميل الإشعارات...</p>
      <p v-else-if="notificationsError" class="notifications-api-status is-error">{{ notificationsError }}</p>

      <div class="notifications-list">
        <article
          v-for="notification in notifications"
          :key="notification.id"
          class="notification-card"
          :class="{ unread: !notification.isRead }"
        >
          <component
            :is="notificationIcons[notification.icon]"
            class="patient-notification-icon"
            :class="notification.color"
            :size="24"
            :stroke-width="2"
            aria-hidden="true"
          />
          <div>
            <strong>{{ notification.title }}</strong>
            <p>{{ notification.description }}</p>
            <span>{{ formatArabicDate(notification.date) }} - {{ notification.time }}</span>
          </div>
          <div class="patient-action-row">
            <button class="patient-action-button outline" type="button" @click="openNotification(notification)">
              {{ notification.action }}
            </button>
            <button class="patient-action-button soft" type="button" :disabled="notification.isRead" @click="toggleRead(notification.id)">
              {{ !notification.isRead ? 'تعليم كمقروء' : 'مقروءة' }}
            </button>
            <button class="patient-action-button danger" type="button" @click="deleteNotification(notification.id)">
              حذف
            </button>
          </div>
        </article>
      </div>
    </section>
  </PatientPortalLayout>
</template>

<script setup>
import {
  Bell,
  Calendar,
  ClipboardList,
  CreditCard,
  FileText,
  MessageCircle,
  Pill,
  XCircle
} from '@lucide/vue'
import { formatArabicDate } from '~/data/patientPortal'

const {
  notifications,
  unreadCount,
  notificationsLoading,
  notificationsError,
  fetchNotifications,
  toggleRead,
  markAllAsRead,
  deleteNotification
} = usePatientNotifications()

const notificationIcons = {
  calendar: Calendar,
  bell: Bell,
  fileText: FileText,
  pill: Pill,
  messageCircle: MessageCircle,
  clipboardList: ClipboardList,
  creditCard: CreditCard,
  xCircle: XCircle
}

const openNotification = async (notification) => {
  if (!notification.isRead) {
    await toggleRead(notification.id)
  }

  await navigateTo(notification.route || '/patient')
}

onMounted(() => {
  fetchNotifications()
})
</script>

<style scoped>
.notifications-list {
  display: grid;
  gap: 14px;
}

.notifications-api-status {
  color: #25604a;
  font-size: 14px;
  font-weight: 900;
  margin: 0 0 16px;
  text-align: center;
}

.notifications-api-status.is-error {
  color: #b42318;
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

.patient-notification-icon.blue {
  background: #eaf2ff;
  color: #0b63f6;
  stroke: #0b63f6;
}

.patient-notification-icon.purple {
  background: #f3e8ff;
  color: #7c3aed;
  stroke: #7c3aed;
}

.patient-notification-icon.green {
  background: #eafaf1;
  color: #16a34a;
  stroke: #16a34a;
}

.patient-notification-icon.orange {
  background: #fff4e6;
  color: #f97316;
  stroke: #f97316;
}

.patient-notification-icon.emerald {
  background: #e6fffa;
  color: #059669;
  stroke: #059669;
}

.patient-notification-icon.red {
  background: #fee2e2;
  color: #dc2626;
  stroke: #dc2626;
}

@media (max-width: 820px) {
  .notification-card {
    grid-template-columns: 1fr;
  }
}
</style>

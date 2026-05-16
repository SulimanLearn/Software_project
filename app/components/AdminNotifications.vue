<template>
  <div class="admin-notifications" dir="rtl">
    <button
      class="notification-button"
      type="button"
      aria-label="الإشعارات"
      @click="isOpen = !isOpen"
    >
      <span class="bell" aria-hidden="true">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M10 21h4" />
          <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
        </svg>
      </span>
      <span class="notification-count">{{ unreadCount }}</span>
    </button>

    <div v-if="isOpen" class="notifications-menu">
      <p
        v-for="notification in notifications"
        :key="notification"
      >
        {{ notification }}
      </p>
    </div>
  </div>
</template>

<script setup>
const isOpen = ref(false)

const notifications = [
  'يوجد موعد جديد',
  'طلب تمريض منزلي جديد',
  'مخزون دواء منخفض',
  'تم إلغاء موعد'
]

const unreadCount = computed(() => notifications.length)
</script>

<style scoped>
.admin-notifications {
  position: relative;
}

.notification-button {
  align-items: center;
  background-color: #eaf2fd;
  border: 1.5px solid #0b63f6;
  border-radius: 14px;
  color: #115bd2;
  cursor: pointer;
  display: inline-flex;
  height: 44px;
  justify-content: center;
  position: relative;
  width: 48px;
}

.bell,
.bell svg {
  display: block;
  height: 22px;
  width: 22px;
}

.notification-count {
  align-items: center;
  background-color: #115bd2;
  border-radius: 999px;
  color: #ffffff;
  display: inline-flex;
  font-size: 12px;
  font-weight: 900;
  height: 20px;
  justify-content: center;
  min-width: 20px;
  padding: 0 5px;
  position: absolute;
  right: -7px;
  top: -7px;
}

.notifications-menu {
  background-color: #eaf2fd;
  border: 1.5px solid #0b63f6;
  border-radius: 14px;
  box-shadow: 0 12px 28px rgba(17, 91, 210, 0.14);
  display: grid;
  gap: 8px;
  left: 0;
  min-width: 230px;
  padding: 14px;
  position: absolute;
  top: calc(100% + 10px);
  z-index: 50;
}

.notifications-menu p {
  border-bottom: 1px solid #8dbbfb;
  font-size: 14px;
  font-weight: 800;
  margin: 0;
  padding: 0 0 8px;
}

.notifications-menu p:last-child {
  border-bottom: 0;
  padding-bottom: 0;
}
</style>

<template>
  <aside class="patient-sidebar" aria-label="لوحة المريض">
    <div class="sidebar-header">
      <div class="patient-profile-card">
        <div class="patient-avatar" aria-hidden="true">
          <img v-if="patient.avatar" :src="patient.avatar" :alt="patient.name">
          <UserRound v-else :size="34" :stroke-width="2.2" />
        </div>
        <strong>{{ patient.name }}</strong>
        <span>{{ patient.role }}</span>
      </div>

      <button
        class="sidebar-toggle"
        type="button"
        :aria-expanded="isSidebarOpen"
        aria-controls="patient-sidebar-nav"
        aria-label="فتح وإغلاق قائمة المريض"
        @click="isSidebarOpen = !isSidebarOpen"
      >
        <span />
        <span />
        <span />
      </button>
    </div>

    <nav
      id="patient-sidebar-nav"
      class="sidebar-nav"
      :class="{ 'is-open': isSidebarOpen }"
    >
      <NuxtLink
        v-for="item in menuItems"
        :key="item.key"
        :to="item.to"
        class="sidebar-link"
        :class="{ active: isActive(item) }"
      >
        {{ item.label }}
      </NuxtLink>

      <button class="sidebar-link logout-link" type="button" @click="$emit('logout')">
        خروج
      </button>
    </nav>
  </aside>
</template>

<script setup>
import { UserRound } from '@lucide/vue'
import { patientProfile } from '~/data/patientPortal'

defineEmits(['logout'])

defineProps({
  patient: {
    type: Object,
    default: () => patientProfile
  }
})

const route = useRoute()
const isSidebarOpen = ref(false)

const menuItems = [
  { key: 'overview', label: 'نظرة عامة', to: '/patient', paths: ['/patient'] },
  { key: 'appointments', label: 'مواعيدي', to: '/patient/appointments', paths: ['/patient/appointments', '/patient/book-appointment', '/patient/booking'] },
  { key: 'records', label: 'السجل الطبي', to: '/patient/records', paths: ['/patient/records'] },
  { key: 'prescriptions', label: 'الوصفات الطبية', to: '/patient/prescriptions', paths: ['/patient/prescriptions'] },
  { key: 'orders', label: 'طلبات الأدوية', to: '/patient/orders', paths: ['/patient/orders'] },
  { key: 'nursing', label: 'التمريض المنزلي', to: '/patient/nursing', paths: ['/patient/nursing'] },
  { key: 'notifications', label: 'الإشعارات', to: '/patient/notifications', paths: ['/patient/notifications'] },
  { key: 'profile', label: 'ملفي', to: '/patient/profile', paths: ['/patient/profile'] }
]

const isActive = (item) => {
  if (item.key === 'overview') {
    return route.path === '/patient'
  }

  return item.paths.some((path) => route.path === path || route.path.startsWith(`${path}/`))
}
</script>

<style scoped>
.patient-sidebar {
  background-color: #eaf2fd;
  border-left: 1.5px solid #0b63f6;
  padding: 32px;
}

.sidebar-header {
  align-items: center;
  display: flex;
  gap: 16px;
  justify-content: center;
}

.patient-profile-card {
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

.patient-avatar {
  align-items: center;
  background-color: #ffffff;
  border: 1px solid #8dbbfb;
  border-radius: 18px;
  color: #115bd2;
  display: flex;
  height: 70px;
  justify-content: center;
  margin-bottom: 12px;
  overflow: hidden;
  padding: 8px;
  width: 82px;
}

.patient-avatar img {
  height: 100%;
  object-fit: contain;
  width: 100%;
}

.patient-profile-card strong {
  font-size: 17px;
  font-weight: 900;
}

.patient-profile-card span {
  color: #343434;
  font-size: 15px;
  margin-top: 4px;
}

.sidebar-toggle {
  display: none;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.sidebar-link {
  align-items: center;
  border-radius: 8px;
  color: #0a0a0a;
  display: flex;
  font-size: 16px;
  font-weight: 800;
  justify-content: center;
  min-height: 34px;
  text-decoration: none;
  transition: background-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
}

.sidebar-link:hover,
.sidebar-link.active {
  background-color: #5a99ef;
  box-shadow: inset 0 0 0 1px #0b63f6;
}

.sidebar-link:hover {
  transform: translateY(-1px);
}

.logout-link {
  background-color: transparent;
  border: 0;
  cursor: pointer;
  font-family: inherit;
  width: 100%;
}

@media (max-width: 720px) {
  .patient-sidebar {
    border-bottom: 1.5px solid #0b63f6;
    border-left: 0;
    padding: 18px;
  }

  .sidebar-header {
    justify-content: space-between;
  }

  .patient-profile-card {
    align-items: center;
    flex: 1;
    flex-direction: row;
    gap: 12px;
    margin-bottom: 0;
    min-height: 76px;
    padding: 12px;
    text-align: right;
  }

  .patient-avatar {
    height: 52px;
    margin-bottom: 0;
    width: 58px;
  }

  .patient-profile-card span {
    display: block;
  }

  .sidebar-toggle {
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

  .sidebar-toggle span {
    background-color: #ffffff;
    border-radius: 999px;
    display: block;
    height: 2px;
    width: 22px;
  }

  .sidebar-nav {
    display: grid;
    gap: 10px;
    grid-template-columns: repeat(2, minmax(120px, 1fr));
    margin-top: 0;
    max-height: 0;
    opacity: 0;
    overflow: hidden;
    transition: max-height 0.25s ease, margin-top 0.25s ease, opacity 0.2s ease;
  }

  .sidebar-nav.is-open {
    margin-top: 18px;
    max-height: 720px;
    opacity: 1;
  }
}

@media (max-width: 560px) {
  .sidebar-nav {
    grid-template-columns: 1fr;
  }
}
</style>

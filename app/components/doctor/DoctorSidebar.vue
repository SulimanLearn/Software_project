<template>
  <aside class="doctor-sidebar" aria-label="لوحة الطبيب">
    <div class="sidebar-header">
      <div class="doctor-profile-card">
        <img :src="doctor.avatar" :alt="doctor.name">
        <strong>{{ doctor.name }}</strong>
        <span>{{ doctor.specialization }}</span>
      </div>

      <button
        class="sidebar-toggle"
        type="button"
        :aria-expanded="isSidebarOpen"
        aria-controls="doctor-sidebar-nav"
        aria-label="فتح وإغلاق قائمة الطبيب"
        @click="isSidebarOpen = !isSidebarOpen"
      >
        <span />
        <span />
        <span />
      </button>
    </div>

    <nav
      id="doctor-sidebar-nav"
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
      <button
        class="sidebar-link logout-link"
        type="button"
        @click="$emit('logout')"
      >
        خروج
      </button>
    </nav>
  </aside>
</template>

<script setup>
defineEmits(['logout'])

defineProps({
  doctor: {
    type: Object,
    default: () => ({
      name: 'د. خالد السيد',
      specialization: 'أمراض القلب',
      avatar: '/images/doctor.png'
    })
  }
})

const route = useRoute()
const isSidebarOpen = ref(false)

const menuItems = [
  { key: 'dashboard', label: 'لوحة البيانات', to: '/doctor', paths: ['/doctor'] },
  { key: 'appointments', label: 'المواعيد', to: '/doctor/appointments', paths: ['/doctor/appointments'] },
  { key: 'schedule', label: 'جدول العمل', to: '/doctor/schedule', paths: ['/doctor/schedule'] },
  { key: 'profile', label: 'الملف الشخصي', to: '/doctor/profile', paths: ['/doctor/profile'] },
  { key: 'settings', label: 'الإعدادات', to: '/doctor/settings', paths: ['/doctor/settings'] }
]

const isActive = (item) => {
  if (item.key === 'dashboard') {
    return route.path === '/doctor'
  }

  return item.paths.some((path) => route.path === path || route.path.startsWith(`${path}/`))
}
</script>

<style scoped>
.doctor-sidebar {
  background-color: #eaf2fd;
  border-left: 1.5px solid #0b63f6;
  padding: 32px;
}

.sidebar-header {
  align-items: center;
  display: flex;
  justify-content: center;
  gap: 16px;
}

.doctor-profile-card {
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

.doctor-profile-card img {
  background-color: #ffffff;
  border: 1px solid #8dbbfb;
  border-radius: 18px;
  height: 70px;
  margin-bottom: 12px;
  object-fit: contain;
  padding: 8px;
  width: 82px;
}

.doctor-profile-card strong {
  font-size: 17px;
  font-weight: 900;
}

.doctor-profile-card span {
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
  .doctor-sidebar {
    border-left: 0;
    border-bottom: 1.5px solid #0b63f6;
    padding: 18px;
  }

  .sidebar-header {
    justify-content: space-between;
  }

  .doctor-profile-card {
    align-items: center;
    flex: 1;
    flex-direction: row;
    gap: 12px;
    margin-bottom: 0;
    min-height: 76px;
    padding: 12px;
    text-align: right;
  }

  .doctor-profile-card img {
    height: 52px;
    margin-bottom: 0;
    width: 58px;
  }

  .doctor-profile-card span {
    display: block;
  }

  .sidebar-toggle {
    align-items: center;
    background-color: #5a99ef;
    border: 1px solid #0b63f6;
    border-radius: 8px;
    cursor: pointer;
    display: inline-flex;
    flex-direction: column;
    flex: 0 0 auto;
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
    grid-template-columns: repeat(2, minmax(120px, 1fr));
    gap: 10px;
    max-height: 0;
    margin-top: 0;
    opacity: 0;
    overflow: hidden;
    transition: max-height 0.25s ease, margin-top 0.25s ease, opacity 0.2s ease;
  }

  .sidebar-nav.is-open {
    max-height: 640px;
    margin-top: 18px;
    opacity: 1;
  }
}

@media (max-width: 560px) {
  .sidebar-nav {
    grid-template-columns: 1fr;
  }
}
</style>

<template>
  <aside class="nurse-sidebar" aria-label="لوحة الممرض">
    <div class="sidebar-header">
      <div class="nurse-profile-card">
        <img :src="nurse.avatar || '/images/doctor.png'" :alt="nurse.name">
        <strong>{{ nurse.name }}</strong>
        <span>{{ nurse.jobTitle || 'ممرضة' }}</span>
      </div>

      <button
        class="sidebar-toggle"
        type="button"
        :aria-expanded="isOpen"
        aria-controls="nurse-navigation"
        aria-label="فتح وإغلاق قائمة الممرض"
        @click="isOpen = !isOpen"
      >
        <span />
        <span />
        <span />
      </button>
    </div>

    <nav id="nurse-navigation" class="sidebar-nav" :class="{ open: isOpen }">
      <NuxtLink
        v-for="item in menuItems"
        :key="item.label"
        class="sidebar-link"
        :class="{ active: isActive(item) }"
        :to="item.to"
        @click="isOpen = false"
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
defineEmits(['logout'])

defineProps({
  nurse: {
    type: Object,
    default: () => ({
      name: 'الممرضة ريم أبو شمالة',
      jobTitle: 'ممرضة',
      avatar: '/images/doctor.png'
    })
  }
})

const route = useRoute()
const isOpen = ref(false)
const menuItems = [
  { label: 'لوحة البيانات', to: '/nurse' },
  { label: 'طلبات التمريض المنزلي', to: '/nurse/requests' },
  { label: 'الملف الشخصي', to: '/nurse/profile' },
  { label: 'الإعدادات', to: '/nurse/settings' }
]

const isActive = item => route.path === item.to
</script>

<style scoped>
.nurse-sidebar {
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

.nurse-profile-card {
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

.nurse-profile-card img {
  background-color: #ffffff;
  border: 1px solid #8dbbfb;
  border-radius: 18px;
  height: 70px;
  margin-bottom: 12px;
  object-fit: contain;
  padding: 8px;
  width: 82px;
}

.nurse-profile-card strong {
  font-size: 17px;
  font-weight: 900;
}

.nurse-profile-card span {
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
  transition: background-color .2s ease, box-shadow .2s ease, transform .2s ease;
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

@media (max-width: 1030px) {
  .nurse-sidebar {
    padding: 24px 18px;
  }

  .nurse-profile-card {
    border-radius: 18px;
    min-height: 146px;
    padding: 15px 12px;
  }

  .nurse-profile-card img {
    height: 62px;
    width: 72px;
  }

  .nurse-profile-card strong {
    font-size: 15px;
  }

  .nurse-profile-card span,
  .sidebar-link {
    font-size: 14px;
  }

  .sidebar-nav {
    gap: 10px;
  }
}

@media (max-width: 720px) {
  .nurse-sidebar {
    border-left: 0;
    border-bottom: 1.5px solid #0b63f6;
    padding: 18px;
  }

  .sidebar-header {
    justify-content: space-between;
  }

  .nurse-profile-card {
    flex: 1;
    flex-direction: row;
    gap: 12px;
    margin-bottom: 0;
    min-height: 76px;
    padding: 12px;
    text-align: right;
  }

  .nurse-profile-card img {
    height: 52px;
    margin-bottom: 0;
    width: 58px;
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
    grid-template-columns: 1fr;
    gap: 10px;
    max-height: 0;
    margin-top: 0;
    opacity: 0;
    overflow: hidden;
    transition: max-height .25s ease, margin-top .25s ease, opacity .2s ease;
  }

  .sidebar-nav.open {
    max-height: 640px;
    margin-top: 18px;
    opacity: 1;
  }

  .sidebar-link {
    min-height: 42px;
    width: 100%;
  }
}
</style>

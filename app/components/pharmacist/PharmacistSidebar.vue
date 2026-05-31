<template>
  <aside class="pharmacist-sidebar" aria-label="لوحة الصيدلي">
    <div class="pharmacist-sidebar-header">
      <div class="pharmacist-profile-card">
        <div class="pharmacist-avatar" aria-hidden="true">
          <img :src="pharmacist.avatar" :alt="pharmacist.name">
        </div>
        <strong>{{ pharmacist.name }}</strong>
        <span>{{ pharmacist.role }}</span>
      </div>

      <button
        class="pharmacist-sidebar-toggle"
        type="button"
        :aria-expanded="isOpen"
        aria-controls="pharmacist-navigation"
        aria-label="فتح وإغلاق قائمة الصيدلي"
        @click="isOpen = !isOpen"
      >
        <span />
        <span />
        <span />
      </button>
    </div>

    <nav id="pharmacist-navigation" class="pharmacist-sidebar-nav" :class="{ 'is-open': isOpen }">
      <NuxtLink
        v-for="item in menuItems"
        :key="item.key"
        class="pharmacist-sidebar-link"
        :class="{ active: isActive(item) }"
        :to="item.to"
        @click="isOpen = false"
      >
        <component :is="item.icon" :size="18" :stroke-width="2.2" aria-hidden="true" />
        <span>{{ item.label }}</span>
      </NuxtLink>

      <button class="pharmacist-sidebar-link pharmacist-logout-link" type="button" @click="$emit('logout')">
        <LogOut :size="18" :stroke-width="2.2" aria-hidden="true" />
        <span>خروج</span>
      </button>
    </nav>
  </aside>
</template>

<script setup lang="ts">
import { Box, ClipboardList, Home, LogOut, UserRound } from '@lucide/vue'
import { markRaw } from 'vue'
import { pharmacistProfile } from '~/data/pharmacistPortal'

defineEmits(['logout'])

defineProps({
  pharmacist: {
    type: Object,
    default: () => pharmacistProfile
  }
})

const route = useRoute()
const isOpen = ref(false)

const menuItems = [
  { key: 'dashboard', label: 'لوحة البيانات', to: '/pharmacist', paths: ['/pharmacist'], icon: markRaw(Home) },
  { key: 'orders', label: 'طلبات الأدوية', to: '/pharmacist/orders', paths: ['/pharmacist/orders'], icon: markRaw(ClipboardList) },
  { key: 'inventory', label: 'إدارة المخزون', to: '/pharmacist/inventory', paths: ['/pharmacist/inventory', '/pharmacist/low-stock'], icon: markRaw(Box) },
  { key: 'profile', label: 'الملف الشخصي', to: '/pharmacist/profile', paths: ['/pharmacist/profile'], icon: markRaw(UserRound) }
]

const isActive = (item: { key: string, paths: string[] }) => {
  if (item.key === 'dashboard') return route.path === '/pharmacist'

  return item.paths.some(path => route.path === path || route.path.startsWith(`${path}/`))
}
</script>

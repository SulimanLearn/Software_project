<template>
  <nav class="navbar">
    <div class="logo-container">
      <NuxtLink to="/" class="logo">
        <img
          src="/images/logo.png"
          alt="MediConnect Logo"
          class="logo-img"
        />

        <span class="logo-text">
          مجمع الحياة الطبي
        </span>
      </NuxtLink>
    </div>
    <ul class="nav-links" :class="{ 'nav-active': isMenuOpen }">
      <li>
        <NuxtLink to="/" @click="closeMenu"> الرئيسية</NuxtLink>
      </li>

      <li>
        <NuxtLink to="/doctors" @click="closeMenu">الأطباء</NuxtLink>
      </li>

      <li>
        <NuxtLink to="/#specialties" @click.prevent="goToSpecialties"> التخصصات</NuxtLink>
      </li>

      <li>
        <NuxtLink to="/policy" @click="closeMenu"> سياسة الخصوصية</NuxtLink>
      </li>

      <!-- بعد تسجيل الدخول -->
      <template v-if="isLoggedIn">
        <li>
          <NuxtLink to="/patient" @click="closeMenu"> مواعيدي</NuxtLink>
        </li>

      </template>

      <!-- قبل تسجيل الدخول -->
      <template v-else>
        <li class="mobile-only">
          <NuxtLink to="/login" @click="closeMenu">
            تسجيل الدخول
          </NuxtLink>
        </li>

        <li class="mobile-only">
          <NuxtLink to="/register" @click="closeMenu">
            إنشاء حساب
          </NuxtLink>
        </li>
      </template>

    </ul>
    <div class="auth-container">
      <div class="auth-buttons">
        <template v-if="!isLoggedIn">

          <NuxtLink to="/login" class="btn filled desktop-only btn-hover">
            تسجيل الدخول
          </NuxtLink>

          <NuxtLink to="/register" class="btn filled desktop-only btn-hover">
            إنشاء حساب
          </NuxtLink>

        </template>
        <!-- بعد تسجيل الدخول -->
        <template v-else>
          <div ref="userMenuRef" class="user-menu">
            <button
              type="button"
              class="hello-button"
              :aria-expanded="isUserMenuOpen"
              aria-haspopup="menu"
              @click="toggleUserMenu"
            >
              <span>
                مرحبا {{ displayName }}
              </span>
              <ChevronDown
                class="hello-chevron"
                :class="{ 'is-open': isUserMenuOpen }"
                :size="16"
                :stroke-width="2.4"
                aria-hidden="true"
              />
            </button>

            <Transition name="user-menu">
              <div
                v-if="isUserMenuOpen"
                class="user-menu-dropdown"
                role="menu"
              >
                <button
                  type="button"
                  class="user-menu-item logout-menu-item"
                  role="menuitem"
                  @click="logout"
                >
                  <LogOut :size="18" :stroke-width="2.2" aria-hidden="true" />
                  <span>تسجيل خروج</span>
                </button>
              </div>
            </Transition>
          </div>

          <div ref="notificationMenuRef" class="notification-menu">
            <button
              type="button"
              class="notification-btn"
              aria-label="Notifications"
              :aria-expanded="isNotificationMenuOpen"
              aria-haspopup="menu"
              @click="toggleNotificationMenu"
            >
              <svg
                class="notification-icon"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 7h18s-3 0-3-7" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              <span v-if="unreadNotificationCount" class="notification-badge">
                {{ unreadNotificationCount }}
              </span>
            </button>

            <Transition name="notification-menu">
              <section
                v-if="isNotificationMenuOpen"
                class="notification-dropdown"
                aria-label="الإشعارات"
              >
                <header class="notification-dropdown-header">
                  <h2>الإشعارات</h2>
                  <button type="button" @click="goToNotifications">
                    عرض الكل
                  </button>
                </header>

                <div class="notification-list">
                  <button
                    v-for="notification in latestNotifications"
                    :key="notification.id"
                    type="button"
                    class="notification-item"
                    :class="{ unread: !notification.isRead }"
                    @click="markNotificationAsRead(notification)"
                  >
                    <span
                      class="notification-type-icon"
                      :class="notification.color"
                      aria-hidden="true"
                    >
                      <component
                        :is="notificationIcons[notification.icon]"
                        :size="20"
                        :stroke-width="2.1"
                      />
                    </span>
                    <span class="notification-content">
                      <strong>{{ notification.title }}</strong>
                      <span>{{ notification.description }}</span>
                      <small>{{ formatArabicDate(notification.date) }} - {{ notification.time }}</small>
                    </span>
                    <span
                      v-if="!notification.isRead"
                      class="notification-unread-dot"
                      aria-hidden="true"
                    />
                  </button>
                </div>
              </section>
            </Transition>
          </div>

        </template>
        <button
          class="menu-toggle"
          type="button"
          @click="isMenuOpen = !isMenuOpen">
          <span>☰</span>
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup>
import {
  Bell,
  Calendar,
  ChevronDown,
  ClipboardList,
  CreditCard,
  FileText,
  LogOut,
  MessageCircle,
  Pill,
  XCircle
} from '@lucide/vue'
import { formatArabicDate } from '~/data/patientPortal'

const isMenuOpen = ref(false)
const isUserMenuOpen = ref(false)
const isNotificationMenuOpen = ref(false)
const userMenuRef = ref(null)
const notificationMenuRef = ref(null)

const { isLoggedIn, user, logout: logoutUser } = useAuth()

const displayName = computed(() => {
  return user.value?.name || 'زائر'
})

const route = useRoute()
const router = useRouter()
const {
  latestNotifications,
  unreadCount: unreadNotificationCount,
  markAsRead,
  fetchNotifications
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

const closeMenu = () => {
  isMenuOpen.value = false
  isUserMenuOpen.value = false
  isNotificationMenuOpen.value = false
}

const closeUserMenuOnOutsideClick = (event) => {
  if (!userMenuRef.value?.contains(event.target)) {
    isUserMenuOpen.value = false
  }
}

const closeNotificationMenuOnOutsideClick = (event) => {
  if (!notificationMenuRef.value?.contains(event.target)) {
    isNotificationMenuOpen.value = false
  }
}

const toggleNotificationMenu = () => {
  isNotificationMenuOpen.value = !isNotificationMenuOpen.value
  isUserMenuOpen.value = false
}

const toggleUserMenu = () => {
  isUserMenuOpen.value = !isUserMenuOpen.value
  isNotificationMenuOpen.value = false
}

const markNotificationAsRead = async (notification) => {
  await markAsRead(notification.id)
}

const goToNotifications = async () => {
  isNotificationMenuOpen.value = false
  await navigateTo('/patient/notifications')
}

const scrollToSpecialties = () => {
  document.getElementById('specialties')?.scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  })
}

const goToSpecialties = async () => {
  closeMenu()

  if (route.path !== '/') {
    await router.push({ path: '/', hash: '#specialties' })
    await nextTick()
  } else if (route.hash !== '#specialties') {
    await router.replace({ hash: '#specialties' })
    await nextTick()
  }

  scrollToSpecialties()
}

const logout = async () => {
  await logoutUser()
  isMenuOpen.value = false
  isUserMenuOpen.value = false
  isNotificationMenuOpen.value = false
  await navigateTo('/login')
}

onMounted(() => {
  if (isLoggedIn.value) {
    fetchNotifications()
  }

  document.addEventListener('click', closeUserMenuOnOutsideClick)
  document.addEventListener('click', closeNotificationMenuOnOutsideClick)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', closeUserMenuOnOutsideClick)
  document.removeEventListener('click', closeNotificationMenuOnOutsideClick)
})

</script>

<style scoped>

.navbar {
  min-height: 85px;
  width: 100%;
  background-color: #448bef;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 40px;
  box-sizing: border-box;
  direction: rtl;
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  gap: 20px;
}

.logo-container,
.auth-container {
  display: flex;
  align-items: center;
  flex: 1;
}

.auth-container {
  justify-content: flex-end;
}

.logo {
  display: flex;
  align-items: center;
  text-decoration: none;
  cursor: pointer;
  white-space: nowrap;
}

.logo-text {
  color: #e6e8ec;
  background: linear-gradient( 90deg,#e6e8ec 45%,#b6a7f7 80%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;

  font-size: 20px;
  font-weight: bold;
  margin-right: 10px;
}

.logo-img {
  height: 80px;
  width: auto;
  object-fit: contain;
  transition: transform 0.3s ease;
}

.logo-img:hover {
  transform: scale(1.1);
}

.nav-links {
  display: flex;
  gap: 25px;
  list-style: none;
  margin: 0;
  padding: 0;
  justify-content: center;
  align-items: center;
}

.nav-links li a {
  color: #F2F0EF;
  text-decoration: none;
  font-size: 17px;
  font-weight: 500;
  position: relative;
  padding: 8px 12px;
  transition: all 0.3s ease;
  display: inline-block;
}

.nav-links li a:hover {
  color: #ffffff;
  transform: translateY(-2px);
}

.nav-links li a::after {
  content: '';
  position: absolute;
  width: 0;
  height: 2px;
  bottom: 0;
  right: 50%;
  transform: translateX(50%);
  background: linear-gradient(
    45deg,
    #e6e8ec 20%,
    #b6a7f7 85%
  );

  transition: width 0.3s ease;
}

.nav-links li a:hover::after {
  width: 100%;
}

.auth-buttons {
  display: flex;
  gap: 12px;
  align-items: center;
}

.btn {
  padding: 9px 22px;
  border-radius: 25px;
  font-size: 15px;
  text-decoration: none;
  font-weight: bold;
  white-space: nowrap;
  background-color: #006fd6;
  color: white;
  border: 1px solid #006fd6;
  transition: all 0.3s ease;
  cursor: pointer;
}

.btn-hover:hover {
  background-color: #005bb5;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  transform: scale(1.05);
}

.user-menu {
  position: relative;
  display: inline-flex;
  align-items: center;
}

.hello-button {
  border: none;
  background: transparent;
  color: #ffffff;
  font-size: 16px;
  font-weight: bold;
  font-family: inherit;
  white-space: nowrap;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 4px;
  transition: color 0.3s ease;
}

.hello-button:hover {
  color: #f7fbff;
}

.hello-chevron {
  flex: 0 0 auto;
  transition: transform 0.25s ease;
}

.hello-chevron.is-open {
  transform: rotate(180deg);
}

.user-menu-dropdown {
  position: absolute;
  top: calc(100% + 12px);
  inset-inline-end: 0;
  min-width: 156px;
  padding: 8px;
  background: #ffffff;
  border-radius: 14px;
  box-shadow: 0 16px 36px rgba(15, 23, 42, 0.18);
  z-index: 1100;
}

.user-menu-dropdown::before {
  content: '';
  position: absolute;
  top: -7px;
  inset-inline-end: 24px;
  width: 14px;
  height: 14px;
  background: #ffffff;
  transform: rotate(45deg);
  box-shadow: -2px -2px 4px rgba(15, 23, 42, 0.03);
}

.user-menu-item {
  position: relative;
  z-index: 1;
  width: 100%;
  border: none;
  background: transparent;
  border-radius: 10px;
  padding: 10px 12px;
  font-family: inherit;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 8px;
  text-align: right;
  transition: background-color 0.2s ease, transform 0.2s ease;
}

.logout-menu-item {
  color: #dc2626;
}

.logout-menu-item:hover {
  background-color: #fef2f2;
  transform: translateY(-1px);
}

.user-menu-enter-active,
.user-menu-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.user-menu-enter-from,
.user-menu-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

.notification-btn {
  position: relative;
  width: 42px;
  height: 42px;
  border-radius: 50%;
  border: 1px solid rgba(255,255,255,0.55);
  background-color: #006fd6;
  color: #ffffff;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.notification-btn:hover {
  background-color: #005bb5;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  transform: scale(1.05);
}

.notification-icon {
  width: 21px;
  height: 21px;
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 2;
}

.notification-menu {
  position: relative;
  display: inline-flex;
  align-items: center;
}

.notification-badge {
  position: absolute;
  top: -5px;
  inset-inline-end: -5px;
  min-width: 19px;
  height: 19px;
  padding: 0 5px;
  border-radius: 999px;
  background: #ef4444;
  color: #ffffff;
  border: 2px solid #448bef;
  font-size: 11px;
  font-weight: 800;
  line-height: 15px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.notification-dropdown {
  position: absolute;
  top: calc(100% + 14px);
  left: 0;
  right: auto;
  width: 400px;
  max-width: calc(100vw - 24px);
  max-height: 500px;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 20px 45px rgba(15, 23, 42, 0.2);
  z-index: 1100;
  direction: rtl;
  overflow: visible;
}

.notification-dropdown::before {
  content: '';
  position: absolute;
  top: -7px;
  left: 28px;
  width: 14px;
  height: 14px;
  background: #ffffff;
  transform: rotate(45deg);
  box-shadow: -2px -2px 4px rgba(15, 23, 42, 0.03);
}

.notification-dropdown-header {
  position: relative;
  z-index: 1;
  background: #ffffff;
}

.notification-dropdown-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 16px 18px 12px;
  border-bottom: 1px solid #eef2f7;
  border-radius: 16px 16px 0 0;
}

.notification-dropdown-header h2 {
  margin: 0;
  color: #111827;
  font-size: 18px;
  font-weight: 900;
}

.notification-dropdown-header button {
  border: none;
  background: transparent;
  font-family: inherit;
  cursor: pointer;
}

.notification-dropdown-header button {
  color: #0b63f6;
  font-size: 14px;
  font-weight: 800;
  padding: 6px 0;
}

.notification-dropdown-header button:hover {
  color: #004fb8;
}

.notification-list {
  position: relative;
  z-index: 1;
  max-height: 368px;
  overflow-y: auto;
  overscroll-behavior: contain;
  padding: 8px;
  scrollbar-color: #8bbdfc #dbeafeb8;
  scrollbar-gutter: stable;
  scrollbar-width: thin;
}

.notification-list::-webkit-scrollbar {
  width: 6px;
}

.notification-list::-webkit-scrollbar-track {
  border-radius: 100%;
  background: #dbeafeb8;
}

.notification-list::-webkit-scrollbar-thumb {
  border-radius: 100%;
  background: linear-gradient(180deg, #60a5fa, #2563eb);
}

.notification-list::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(180deg, #3b82f6, #1d4ed8);
}

.notification-item {
  width: 100%;
  border: none;
  background: transparent;
  border-radius: 12px;
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: start;
  gap: 12px;
  padding: 12px 10px;
  font-family: inherit;
  text-align: right;
  cursor: pointer;
  transition: background-color 0.2s ease, transform 0.2s ease;
}

.notification-item:hover {
  background: #f8fbff;
  transform: translateY(-1px);
}

.notification-item.unread {
  background: #f5f9ff;
}

.notification-type-icon {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.notification-type-icon.blue {
  background: #eaf2ff;
  color: #0b63f6;
}

.notification-type-icon.purple {
  background: #f3e8ff;
  color: #7c3aed;
}

.notification-type-icon.green {
  background: #eafaf1;
  color: #16a34a;
}

.notification-type-icon.orange {
  background: #fff4e6;
  color: #f97316;
}

.notification-type-icon.emerald {
  background: #e6fffa;
  color: #059669;
}

.notification-type-icon.red {
  background: #fee2e2;
  color: #dc2626;
}

.notification-content {
  min-width: 0;
  display: grid;
  gap: 4px;
}

.notification-content strong {
  color: #111827;
  font-size: 14px;
  font-weight: 900;
  line-height: 1.4;
}

.notification-content span {
  color: #4b5563;
  font-size: 13px;
  font-weight: 700;
  line-height: 1.5;
}

.notification-content small {
  color: #8a94a6;
  font-size: 12px;
  font-weight: 800;
}

.notification-unread-dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: #0b63f6;
  margin-top: 7px;
}

.notification-menu-enter-active,
.notification-menu-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.notification-menu-enter-from,
.notification-menu-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

.menu-toggle {
  display: none;
  background: none;
  border: none;
  background: linear-gradient( 270deg,#e6e8ec 45%,#b6a7f7 80%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-size: 28px;
  cursor: pointer;
}
.menu-toggle:hover {
  transform: scale(1.1);
}
.mobile-only {
  display: none !important;
}

@media (max-width: 1030px) {

  .logo-img {
    height: 55px;
  }

  .logo-container,
  .auth-container {
    flex: none;
  }

  .navbar {
    justify-content: space-between;
    padding: 0 20px;
  }

  .menu-toggle {
    display: block;
    z-index: 1001;
  }

  .nav-links {
    position: absolute;
    top: 85px;
    left: 0;
    right: 0;
    width: 100%;
    background-color: #5c9efb;
    flex-direction: column;
    padding: 20px 0;
    gap: 0;
    box-shadow: 0 10px 15px rgba(0,0,0,0.1);
    z-index: 1000;
    opacity: 0;
    visibility: hidden;
    transform: translateY(-10px);
    transition: all 0.4s ease;
  }

  .nav-active {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
  }

  .nav-links li {
    width: 100%;
    text-align: center;
    border-bottom: 1px solid rgba(255,255,255,0.1);
    padding: 12px 0;
  }

  .nav-links li:last-child {
    border-bottom: none;
  }

  .nav-links li a {
    width: 100%;
    padding: 10px 0;
  }
  .nav-links li a:hover::after {
  width: 150px;
}


}

@media (max-width: 600px) {

  .logo-text {
    font-size: 16px;
  }

  .desktop-only {
    display: none;
  }

  .mobile-only {
    display: block !important;
  }

  .auth-buttons {
    gap: 8px;
  }

  .hello-button {
    max-width: 118px;
    font-size: 14px;
    padding-inline: 2px;
  }

  .hello-button span {
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .notification-dropdown {
    position: fixed;
    top: 74px;
    left: 12px;
    right: 12px;
    width: calc(100vw - 24px);
    max-width: 420px;
    max-height: calc(100vh - 92px);
  }

  .notification-dropdown::before {
    left: 64px;
  }

  .notification-list {
    max-height: calc(100vh - 230px);
  }

  .notification-item {
    grid-template-columns: auto minmax(0, 1fr) auto;
    gap: 10px;
    padding: 11px 8px;
  }

  .notification-menu-enter-from,
  .notification-menu-leave-to {
    transform: translateY(-8px);
  }

}
</style>

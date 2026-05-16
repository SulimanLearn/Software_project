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

        <li class="mobile-only">
          <button
            class="mobile-logout"
            @click="logout"
          >
            تسجيل خروج
          </button>
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
          <button type="button" class="notification-btn" aria-label="Notifications"
          >
            <svg
              class="notification-icon"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 7h18s-3 0-3-7" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
          </button>

          <span class="hello-text desktop-only">
            مرحبا {{ displayName }}
          </span>

          <button
            class="btn filled desktop-only btn-hover logout-btn"
            @click="logout"
          >
            تسجيل خروج
          </button>

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
const isMenuOpen = ref(false)

const isLoggedIn = useState('isLoggedIn', () => false)

const user = useState('user', () => ({
  name: ''
}))

const displayName = computed(() => {
  return user.value.name || 'زائر'
})

const route = useRoute()
const router = useRouter()

const closeMenu = () => {
  isMenuOpen.value = false
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

  isLoggedIn.value = false

  user.value = {
    name: ''
  }
  isMenuOpen.value = false
  await navigateTo('/login')
}

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

.nav-links li a, 
.mobile-logout {
  color: #F2F0EF;
  text-decoration: none;
  font-size: 17px;
  font-weight: 500;
  position: relative;
  padding: 8px 12px;
  transition: all 0.3s ease;
  display: inline-block;
}

.nav-links li a:hover,
.mobile-logout:hover {
  color: #ffffff;
  transform: translateY(-2px);
}

.nav-links li a::after,
.mobile-logout::after {
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

.nav-links li a:hover::after,
.mobile-logout:hover::after {
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

.hello-text {
  color: #ffffff;
  font-size: 16px;
  font-weight: bold;
  white-space: nowrap;
}

.notification-btn {
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

.mobile-logout {
  background: none;
  border: none;
  color: white;
  font-size: 17px;
  font-weight: 500;
  font-family: inherit;
  cursor: pointer;
  width: 100%;
  padding: 10px 0;
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

  .nav-links li a,
  .mobile-logout {
    width: 100%;
    padding: 10px 0;
  }
  .nav-links li a:hover::after,
  .mobile-logout:hover::after {
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

}
</style>

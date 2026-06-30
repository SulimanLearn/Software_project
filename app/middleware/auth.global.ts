const protectedRoutePrefixes = [
  '/dashboard',
  '/doctor',
  '/nurse',
  '/nursing',
  '/patient',
  '/pharmacist',
]

const guestOnlyRoutes = [
  '/login',
  '/register',
]

export default defineNuxtRouteMiddleware(async (to) => {
  const { initializeAuth, isLoggedIn } = useAuth()

  await initializeAuth()

  const isProtectedRoute = protectedRoutePrefixes.some((prefix) =>
    to.path === prefix || to.path.startsWith(`${prefix}/`),
  )

  if (isProtectedRoute && !isLoggedIn.value) {
    return navigateTo({
      path: '/login',
      query: {
        redirect: to.fullPath,
      },
    })
  }

  if (guestOnlyRoutes.includes(to.path) && isLoggedIn.value) {
    return navigateTo('/patient')
  }
})

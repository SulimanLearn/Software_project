type AuthUser = {
  id?: number
  name?: string
  email?: string
  phone?: string
  [key: string]: unknown
}

type AuthResponse = {
  user: AuthUser
  token: string
}

type LoginPayload = {
  email: string
  password: string
}

type RegisterPayload = {
  name: string
  email: string
  password: string
}

const AUTH_TOKEN_COOKIE = 'clinic_auth_token'

export const useAuth = () => {
  const config = useRuntimeConfig()
  const token = useCookie<string | null>(AUTH_TOKEN_COOKIE, {
    maxAge: 60 * 60 * 24 * 30,
    sameSite: 'lax',
  })

  const user = useState<AuthUser | null>('user', () => null)
  const isLoggedIn = useState('isLoggedIn', () => false)
  const isAuthReady = useState('isAuthReady', () => false)
  const authLoading = useState('authLoading', () => false)

  const apiBaseUrl = computed(() => {
    const baseUrl = config.public.apiBaseUrl || 'https://clinic-app-2.onrender.com/api'
    return String(baseUrl).replace(/\/$/, '')
  })

  const setSession = (payload: AuthResponse) => {
    token.value = payload.token
    user.value = payload.user
    isLoggedIn.value = true
  }

  const clearSession = () => {
    token.value = null
    user.value = null
    isLoggedIn.value = false
  }

  const authFetch = <T>(path: string, options: Parameters<typeof $fetch<T>>[1] = {}) => {
    const headers = new Headers(options?.headers as HeadersInit)
    headers.set('Accept', 'application/json')

    if (token.value) {
      headers.set('Authorization', `Bearer ${token.value}`)
    }

    return $fetch<T>(`${apiBaseUrl.value}${path}`, {
      ...options,
      headers,
    })
  }

  const login = async (payload: LoginPayload) => {
    authLoading.value = true

    try {
      const response = await authFetch<AuthResponse>('/login', {
        method: 'POST',
        body: payload,
      })

      setSession(response)
      return response
    } finally {
      authLoading.value = false
    }
  }

  const register = async (payload: RegisterPayload) => {
    authLoading.value = true

    try {
      const response = await authFetch<AuthResponse>('/register', {
        method: 'POST',
        body: payload,
      })

      setSession(response)
      return response
    } finally {
      authLoading.value = false
    }
  }

  const fetchProfile = async () => {
    if (!token.value) {
      clearSession()
      return null
    }

    try {
      const profile = await authFetch<AuthUser>('/me')
      user.value = profile
      isLoggedIn.value = true
      return profile
    } catch (error) {
      clearSession()
      throw error
    }
  }

  const initializeAuth = async () => {
    if (isAuthReady.value) {
      return
    }

    if (!token.value) {
      clearSession()
      isAuthReady.value = true
      return
    }

    isLoggedIn.value = true

    if (!user.value) {
      try {
        await fetchProfile()
      } catch {
        clearSession()
      }
    }

    isAuthReady.value = true
  }

  const logout = async () => {
    try {
      if (token.value) {
        await authFetch('/logout', {
          method: 'POST',
        })
      }
    } catch {
      // Local logout should still work if the remote token is already invalid.
    } finally {
      clearSession()
    }
  }

  const forgotPassword = async (email: string) => {
    return authFetch<{ status: boolean; message: string; token?: string | number }>('/forgot-password', {
      method: 'POST',
      body: { email },
    })
  }

  const resetPassword = async (payload: { email: string; token: string; password: string }) => {
    return authFetch<{ status: boolean; message: string }>('/reset-password', {
      method: 'POST',
      body: payload,
    })
  }

  const getApiErrorMessage = (error: unknown, fallback = 'حدث خطأ، حاول مرة اخرى') => {
    const apiError = error as {
      data?: {
        message?: string
        errors?: Record<string, string[]>
      }
      message?: string
    }

    const firstValidationMessage = apiError.data?.errors
      ? Object.values(apiError.data.errors).flat()[0]
      : ''

    return firstValidationMessage || apiError.data?.message || apiError.message || fallback
  }

  return {
    user,
    token,
    isLoggedIn,
    isAuthReady,
    authLoading,
    authFetch,
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
    fetchProfile,
    initializeAuth,
    getApiErrorMessage,
  }
}

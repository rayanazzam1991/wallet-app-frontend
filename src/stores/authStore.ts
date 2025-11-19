import { defineStore } from 'pinia'
import { useRouter } from 'vue-router'
import { useLocalStorage } from '@vueuse/core'
import type { AuthUser, LoginPayload } from '@/types/user.ts'
import { computed, ref } from 'vue'
import { useApi } from '@/composable/useApi.ts'
import type { ApiResponse } from '@/types/api.ts'

export const useAuthStore = defineStore('authStore', ()=>{

  const router = useRouter()
  const {api} = useApi()
  const loading = ref(false)

  const user = useLocalStorage<AuthUser | null>('user', null, {
    serializer: {
      read: (v: string) => v ? JSON.parse(v) : null,
      write: (v: AuthUser | null) => JSON.stringify(v)
    }
  })

  async function login(request : LoginPayload) {
    const response = await api.post<ApiResponse<AuthUser>>('/auth/login', {
      email: request.email,
      password: request.password,
    })

  }

  const setUser = (newUser: AuthUser | null) => {
    user.value = newUser
  }

  const getUser = computed(() => user.value)
  const isAuthenticated = computed(() => !!user.value?.token)

  async function logout() {
    user.value = null
    await router.push('/')
  }

  return {
    logout,
    login,
    loading,
    isAuthenticated,
    setUser,
    getUser,
  }
})

import { defineStore } from 'pinia'
import { useRouter } from 'vue-router'
import { useLocalStorage } from '@vueuse/core'
import type { AuthUser, LoginPayload, User } from '@/types/user.ts'
import { computed, ref } from 'vue'
import { useApi } from '@/composable/useApi.ts'
import type { ApiResponse } from '@/types/api.ts'

export const useAuthStore = defineStore('authStore', ()=>{

  const router = useRouter()
  const {api} = useApi()
  const loading = ref(false)

  const userData = ref<User | null>(null)
  const authUser = useLocalStorage<AuthUser | null>('user', null, {
    serializer: {
      read: (v: string) => v ? JSON.parse(v) : null,
      write: (v: AuthUser | null) => JSON.stringify(v)
    }
  })

  async function login(request : LoginPayload) {
    try {
      loading.value = true
    const response = await api.post<ApiResponse<AuthUser>>('/auth/login', {
      email: request.email,
      password: request.password,
    })
    if(response.data){
      setUser(response.data)
    }
    }finally {
      loading.value = false
    }

  }
  async function fetchUserData(){
    const response = await api.get<ApiResponse<User>>('/auth/me')
    if(response.data){
      setUserData(response.data)
    }
  }
  const setUserData = (newUser: User | null) => {
    userData.value = newUser
  }
  const setUser = (newUser: AuthUser | null) => {
    authUser.value = newUser
  }

  const getAuthUser = computed(() => authUser.value)
  const getUserData = computed(() => userData.value)
  const isAuthenticated = computed(() => !!authUser.value?.token)

  async function logout() {
    authUser.value = null
    await router.push('/login')
  }

  return {
    logout,
    login,
    loading,
    isAuthenticated,
    setUser,
    fetchUserData,
    getAuthUser,
    getUserData
  }
})

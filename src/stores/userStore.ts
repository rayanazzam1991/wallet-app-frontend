import { defineStore } from 'pinia'

import type { User } from '@/types/user.ts'
import { computed, ref } from 'vue'
import { useApi } from '@/composable/useApi.ts'
import type { ApiResponse } from '@/types/api.ts'

export const useUserStore = defineStore('userStore', ()=>{

  const {api} = useApi()
  const loading = ref(false)

  const profile = ref<User | null>(null)

  const users = ref<User[]>()
  const receivers = ref<User[]>()

  async function fetchReceivers(){
    const response = await api.get<ApiResponse<User[]>>('/users/receivers')
    if(response.data){
      receivers.value = response.data
    }
  }

  async function fetchUserData(){
    const response = await api.get<ApiResponse<User>>('/auth/me')
    if(response.data){
      setUserData(response.data)
    }
  }
  const setUserData = (newUser: User | null) => {
    profile.value = newUser
  }

  const getUserData = computed(() => profile.value)
  const getReceivers = computed(() => receivers.value)
  const getUserBalance = computed(() =>  profile.value?.balance)

  return {
    loading,
    fetchReceivers,
    getReceivers,
    fetchUserData,
    getUserData,
    getUserBalance
  }
})

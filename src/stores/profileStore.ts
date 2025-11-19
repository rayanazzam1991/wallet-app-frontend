import { defineStore } from 'pinia'

import type { User } from '@/types/user.ts'
import { computed, ref } from 'vue'
import { useApi } from '@/composable/useApi.ts'
import type { ApiResponse } from '@/types/api.ts'

export const useProfileStore = defineStore('profileStore', ()=>{

  const {api} = useApi()
  const loading = ref(false)

  const profile = ref<User | null>(null)

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
  const getUserBalance = computed(() =>  profile.value?.balance)
  return {
    loading,
    fetchUserData,
    getUserData,
    getUserBalance
  }
})

import { defineStore } from 'pinia'

import type { User } from '@/types/user.ts'
import { computed, ref } from 'vue'
import { useApi } from '@/composable/useApi.ts'
import type { ApiResponse } from '@/types/api.ts'

export const useUserStore = defineStore('userStore', ()=>{

  const {api} = useApi()
  const loading = ref(false)
  const receivers = ref<User[]>()

  async function fetchReceivers(){
    const response = await api.get<ApiResponse<User[]>>('/users/receivers')
    if(response.data){
      receivers.value = response.data
    }
  }
  const getReceivers = computed(() => receivers.value)

  return {
    loading,
    fetchReceivers,
    getReceivers,
  }
})

import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { Transaction, TransferMoney } from '@/types/transaction.ts'
import { useApi } from '@/composable/useApi.ts'
import type { ApiResponse, PaginationResponse } from '@/types/api.ts'



export const useTransactionStore = defineStore('transactions', ()=>{
  const transactions = ref<Transaction[]>()
  const pagination = ref<PaginationResponse >()
  const loading = ref(false)

  const { api } = useApi();
  async function fetchTransactions(page: number = 1) {
    try {
      loading.value= true
      const response =  await api.get<ApiResponse<Transaction[]>>('/transactions',{
        params: { page },
      })
      if(response.data){
        transactions.value = response.data
        pagination.value = response.pagination
      }
    } finally {
      loading.value= false
    }

  }
  async function transferMoney(request : TransferMoney){
    await api.post('/transactions',request)
  }



  const getTransactions = computed(()=>transactions.value)
  const getPagination = computed(()=>pagination.value)

  return{
    transactions,
    pagination,
    getPagination,
    getTransactions,
    fetchTransactions,
    transferMoney,
    loading
  }
})

import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { Transaction, TransactionStat } from '@/types/transaction.ts'
import { useApi } from '@/composable/useApi.ts'
import type { ApiResponse, PaginationResponse } from '@/types/api.ts'



export const useTransactionStore = defineStore('transactions', ()=>{
  const transactions = ref<Transaction[]>()
  const pagination = ref<PaginationResponse >()


  const { api } = useApi();
  async function fetchTransactions(page: number = 1) {
      const response =  await api.get<ApiResponse<Transaction[]>>('/transactions',{
        params: { page },
      })
      if(response.data){
        transactions.value = response.data
        pagination.value = response.pagination
      }
  }

  const getTransactions = computed(()=>transactions.value)
  const getPagination = computed(()=>pagination.value)

  return{
    transactions,
    pagination,
    getPagination,
    getTransactions,
    fetchTransactions
  }
})

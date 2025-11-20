import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { Transaction, TransferMoney, TransferMoneyStart } from '@/types/transaction.ts'
import { useApi } from '@/composable/useApi.ts'
import type { ApiResponse, PaginationResponse } from '@/types/api.ts'

export const useTransactionStore = defineStore('transactions', ()=>{
  const transactions = ref<Transaction[]>()
  const pagination = ref<PaginationResponse >()
  const loading = ref(false)
  const transactionStatus = ref('') // Start with empty string
  const transactionRequestID = ref()

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
    // Reset status when starting new transfer
    transactionStatus.value = 'pending'
    const response = await api.post<ApiResponse<TransferMoneyStart>>('/transactions',request)
    if(response.data){
      console.log("response.data",response.data)
      transactionStatus.value = response.data.status
      transactionRequestID.value = response.data.request_id
    }
  }

  // Add function to reset transaction status
  function resetTransactionStatus() {
    transactionStatus.value = ''
  }

  async function updateTransactionStatus(requestID : string, status :string){
    console.log("requestID",transactionRequestID.value)
    if(requestID == transactionRequestID.value){
      console.log("inside",[requestID,status])
      await setTransactionStatus(status)
    }
  }

  async function setTransactionStatus (status : string){
    console.log("stat",status)
    transactionStatus.value = status
  }

  const getTransactions = computed(()=>transactions.value)
  const getPagination = computed(()=>pagination.value)

  const getIsTransferPending = computed(()=>transactionStatus.value === 'pending')
  const getIsTransferSuccess = computed(()=>transactionStatus.value === 'success')

  return{
    transactions,
    pagination,
    getPagination,
    getTransactions,
    fetchTransactions,
    transferMoney,
    resetTransactionStatus, // Export the reset function
    loading,
    transactionStatus,
    transactionRequestID,
    getIsTransferPending,
    getIsTransferSuccess,
    updateTransactionStatus
  }
})

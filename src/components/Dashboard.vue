<script setup lang="ts">
import { ref, computed, onMounted, watch, unref } from 'vue'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useTransactionStore } from '@/stores/transactionStore.js'
import { storeToRefs } from 'pinia'
import { currencyFormat } from '../utils/currencyFormat.js'
import type { Transaction } from '@/types/transaction.ts'
import { useProfileStore } from '@/stores/profileStore.ts'
import Pusher from 'pusher-js'
import { useAuthStore } from '@/stores/authStore.ts'
import { useMoneyTransferChannel } from '@/composable/useMoneyTransferChannel.ts'


const page = ref(1)
const transactionStore = useTransactionStore()
const profileStore = useProfileStore()
const authStore = useAuthStore()
const { getUserBalance, getUserData } = storeToRefs(profileStore)

useMoneyTransferChannel();

const latestTransactions = ref<Transaction[]>([])
onMounted(async ()=>{
  await profileStore.fetchUserData()
  await transactionStore.fetchTransactions(page.value)

  if (allTransactions.value?.length && latestTransactions.value.length === 0) {
    latestTransactions.value = allTransactions.value.slice(0, 3)
  }
})
const {getTransactions : allTransactions,getPagination } = storeToRefs(transactionStore)


watch(()=>page.value,
  async (newPage)=>{
    await transactionStore.fetchTransactions(newPage)
  })
const totalPages = computed(() => getPagination.value?.max_page ?? 0)

const nextPage = () => {
  if (page.value < totalPages.value) page.value++
}

const prevPage = () => {
  if (page.value > 1) page.value--
}
</script>

<template>
  <div class="min-h-screen bg-gray-100 p-6">
    <!-- Header Stats -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
      <Card class="p-6 shadow-xl rounded-2xl bg-white">
        <CardContent>
          <h2 class="text-gray-500 text-sm mb-2">User Balance</h2>
          <p class="text-3xl font-bold">{{getUserBalance}}</p>
        </CardContent>
      </Card>
    </div>

    <!-- Latest Transactions -->
    <Card class="p-6 shadow-xl rounded-2xl bg-white mb-10">
      <CardContent>
        <h2 class="text-xl font-semibold mb-4">Latest Transactions</h2>
        <table class="w-full text-left border-collapse">
          <thead>
          <tr class="border-b text-gray-700">
            <th class="py-2">ID</th>
            <th class="py-2">Customer</th>
            <th class="py-2">Amount</th>
            <th class="py-2">Type</th>
            <th class="py-2">Date</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="t in latestTransactions" :key="t.id" class="border-b hover:bg-gray-50">
            <td class="py-2">{{ t.id }}</td>
            <td class="py-2">{{ t.receiver.name }}</td>
            <td class="py-2">{{ currencyFormat(t.amount) }}</td>
            <td class="py-2">
                <span :class="t.type === 'Sent' ? 'text-red-500' : 'text-green-600'">
                  {{ t.type }}
                </span>
            </td>
            <td class="py-2">{{ t.created_at }}</td>
          </tr>
          </tbody>
        </table>
      </CardContent>
    </Card>

    <!-- All Transactions with Pagination -->
    <Card class="p-6 shadow-xl rounded-2xl bg-white">
      <CardContent>
        <h2 class="text-xl font-semibold mb-4">All Transactions</h2>

        <table class="w-full text-left border-collapse mb-4">
          <thead>
          <tr class="border-b text-gray-700">
            <th class="py-2">ID</th>
            <th class="py-2">Customer</th>
            <th class="py-2">Amount</th>
            <th class="py-2">Type</th>
            <th class="py-2">Date</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="t in allTransactions" :key="t.id" class="border-b hover:bg-gray-50">
            <td class="py-2">{{ t.id }}</td>
            <td class="py-2">{{ t.receiver.name }}</td>
            <td class="py-2">{{ t.amount }}</td>
            <td class="py-2">
                <span :class="t.type === 'Sent' ? 'text-red-500' : 'text-green-600'">
                  {{ t.type }}
                </span>
            </td>
            <td class="py-2">{{ t.created_at }}</td>
          </tr>
          </tbody>
        </table>

        <!-- Pagination -->
        <div class="flex justify-between items-center">
          <Button @click="prevPage" :disabled="page === 1">Previous</Button>
          <span class="text-gray-600">Page {{ page }} of {{ totalPages }}</span>
          <Button @click="nextPage" :disabled="page === totalPages">Next</Button>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<style scoped>
</style>

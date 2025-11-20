<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useTransactionStore } from '@/stores/transactionStore.js'
import { storeToRefs } from 'pinia'
import { currencyFormat } from '../utils/currencyFormat.js'
import { useMoneyTransferChannel } from '@/composable/useMoneyTransferChannel.ts'
import {
  ArrowUpIcon,
  ArrowDownIcon,
  CalendarIcon,
  CreditCardIcon,
  ChevronLeftIcon,
  ChevronRightIcon, Loader2Icon
} from 'lucide-vue-next'
import { useAuthStore } from '@/stores/authStore.ts'


const page = ref(1)
const transactionStore = useTransactionStore()
const {loading} = storeToRefs(transactionStore)
const authStore = useAuthStore()
const { getUserBalance } = storeToRefs(authStore)

// this composable handle the real time pusher
useMoneyTransferChannel();

const isLoading = ref(false)

const { transactions: allTransactions, getPagination } = storeToRefs(transactionStore)

onMounted(async () => {
  isLoading.value = true
  await authStore.fetchUserData()
  await transactionStore.fetchTransactions(page.value)

  isLoading.value = false
})


watch(() => page.value, async (newPage) => {
  isLoading.value = true
  await transactionStore.fetchTransactions(newPage)
  isLoading.value = false
})

const totalPages = computed(() => getPagination.value?.max_page ?? 0)

const nextPage = () => {
  if (page.value < totalPages.value) page.value++
}

const prevPage = () => {
  if (page.value > 1) page.value--
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const stats = computed(() => [
  {
    title: 'Total Balance',
    value: getUserBalance.value,
    icon: CreditCardIcon,
    color: 'from-blue-500 to-cyan-500',
    description: 'Current available balance'
  }
])
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/30 dark:from-slate-900 dark:via-blue-950/30 dark:to-indigo-900/30 p-6">
    <!-- Animated background -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-40 -right-32 w-80 h-80 bg-purple-200/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
      <div class="absolute -bottom-40 -left-32 w-80 h-80 bg-cyan-200/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-2000"></div>
    </div>

    <div class="relative z-10 max-w-full px-20 mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-slate-900 dark:text-white mb-2">Dashboard</h1>
        <p class="text-slate-600 dark:text-slate-400">Welcome back! Here's your financial overview</p>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card
          v-for="stat in stats"
          :key="stat.title"
          class="p-6 border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl hover-lift transition-all duration-300 group"
        >
          <CardContent class="p-0">
            <div class="flex items-start justify-between mb-4">
              <div class="p-3 rounded-xl bg-gradient-to-r" :class="stat.color">
                <component :is="stat.icon" class="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 class="text-slate-500 dark:text-slate-400 text-sm font-medium mb-2">{{ stat.title }}</h3>
            <p class="text-2xl font-bold text-slate-900 dark:text-white mb-1">{{ stat.value }}</p>
            <p class="text-sm text-slate-500 dark:text-slate-400">{{ stat.description }}</p>
          </CardContent>
        </Card>
      </div>

      <div class="grid grid-cols-1 gap-8">
        <!-- All Transactions -->
        <Card class="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl hover-lift transition-all duration-300">
          <CardContent class="p-6">
            <div class="flex items-center justify-between mb-6">
              <div>
                <h2 class="text-xl font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                  <CreditCardIcon class="w-5 h-5 text-purple-500" />
                  All Transactions
                </h2>
                <p class="text-slate-500 dark:text-slate-400 text-sm mt-1">Complete transaction history</p>
              </div>
            </div>

            <div v-if="allTransactions && allTransactions?.length>0">
              <!-- Transactions List -->
              <div class="h-96">
                <div v-if="loading" class="flex items-center justify-center h-96"> <!-- Fixed height -->
                  <div class="text-center">
                    <Loader2Icon class="w-8 h-8 animate-spin mx-auto mb-2 text-slate-500" />
                    <p class="text-slate-500 dark:text-slate-400">Loading transactions...</p>
                  </div>
                </div>
                <div v-else class="space-y-3 mb-6 max-h-96 overflow-y-auto custom-scrollbar">
                  <div
                    v-for="t in allTransactions"
                    :key="t.id"
                    class="flex items-center justify-between p-4 rounded-xl bg-slate-50/50 dark:bg-slate-700/30 hover:bg-slate-100/50 dark:hover:bg-slate-700/50 transition-all duration-300 group border border-transparent hover:border-slate-200 dark:hover:border-slate-600"
                  >
                    <div class="flex items-center space-x-4">
                      <div
                        class="p-2 rounded-lg transition-all duration-300 group-hover:scale-110"
                        :class="t.type === 'Sent' ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' : 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'"
                      >
                        <component
                          :is="t.type === 'Sent' ? ArrowUpIcon : ArrowDownIcon"
                          class="w-4 h-4"
                        />
                      </div>
                      <div>
                        <p class="font-medium text-slate-900 dark:text-white text-sm">{{ t.receiver.name }}</p>
                        <div class="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400 mt-1">
                          <CalendarIcon class="w-3 h-3" />
                          <span>{{ formatDate(t.created_at) }}</span>
                        </div>
                      </div>
                    </div>
                    <div class="text-right">
                      <p
                        class="font-semibold"
                        :class="t.type === 'Sent' ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'"
                      >
                        {{ t.type === 'Sent' ? '-' : '+' }}{{ currencyFormat(t.amount) }} <span class="text-xs">({{t.fees}})</span>
                      </p>
                      <Badge
                        variant="secondary"
                        class="mt-1 text-xs"
                        :class="t.type === 'Sent' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'"
                      >
                        {{ t.type }}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
              <!-- Pagination -->
              <div class="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
                <Button
                  @click="prevPage"
                  :disabled="page === 1"
                  variant="outline"
                  class="rounded-lg border-slate-200 dark:border-slate-700 transition-all duration-300 hover:scale-105"
                  :class="page === 1 ? 'opacity-50 cursor-not-allowed' : ''"
                >
                  <ChevronLeftIcon class="w-4 h-4 mr-2" />
                  Previous
                </Button>

                <div class="flex items-center space-x-2">
                <span class="text-sm text-slate-600 dark:text-slate-400 font-medium">
                  Page <span class="text-slate-900 dark:text-white">{{ page }}</span> of {{ totalPages }}
                </span>
                </div>

                <Button
                  @click="nextPage"
                  :disabled="page === totalPages"
                  variant="outline"
                  class="rounded-lg border-slate-200 dark:border-slate-700 transition-all duration-300 hover:scale-105"
                  :class="page === totalPages ? 'opacity-50 cursor-not-allowed' : ''"
                >
                  Next
                  <ChevronRightIcon class="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
            <div v-else class="text-2xl text-center">
              No transactions
            </div>

          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</template>

<style scoped>
.hover-lift:hover {
  transform: translateY(-4px);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(148, 163, 184, 0.1);
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(148, 163, 184, 0.3);
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(148, 163, 184, 0.5);
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}
</style>

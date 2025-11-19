<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useTransactionStore } from '@/stores/transactionStore.js'
import { storeToRefs } from 'pinia'
import { currencyFormat } from '../utils/currencyFormat.js'
import type { Transaction } from '@/types/transaction.ts'
import { useUserStore } from '@/stores/userStore.ts'
import { useMoneyTransferChannel } from '@/composable/useMoneyTransferChannel.ts'
import {
  ArrowUpIcon,
  ArrowDownIcon,
  CalendarIcon,
  CreditCardIcon,
  TrendingUpIcon,
  DownloadIcon,
  FilterIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  SparklesIcon
} from 'lucide-vue-next'

const page = ref(1)
const transactionStore = useTransactionStore()
const userStore = useUserStore()
const { getUserBalance } = storeToRefs(userStore)

useMoneyTransferChannel();

const latestTransactions = ref<Transaction[]>([])
const isLoading = ref(false)

onMounted(async () => {
  isLoading.value = true
  await userStore.fetchUserData()
  await transactionStore.fetchTransactions(page.value)

  if (allTransactions.value?.length && latestTransactions.value.length === 0) {
    latestTransactions.value = allTransactions.value.slice(0, 3)
  }
  isLoading.value = false
})

const { getTransactions: allTransactions, getPagination } = storeToRefs(transactionStore)

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
    trend: '+2.5%',
    description: 'Current available balance'
  },
  {
    title: 'Monthly Income',
    value: '$12,458',
    icon: TrendingUpIcon,
    color: 'from-green-500 to-emerald-500',
    trend: '+12.3%',
    description: 'This month'
  },
  {
    title: 'Monthly Expenses',
    value: '$8,245',
    icon: ArrowDownIcon,
    color: 'from-orange-500 to-red-500',
    trend: '-3.2%',
    description: 'This month'
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

    <div class="relative z-10 max-w-7xl mx-auto">
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
              <Badge
                :class="stat.trend.startsWith('+') ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'"
                class="transition-all duration-300 group-hover:scale-105"
              >
                {{ stat.trend }}
              </Badge>
            </div>
            <h3 class="text-slate-500 dark:text-slate-400 text-sm font-medium mb-2">{{ stat.title }}</h3>
            <p class="text-2xl font-bold text-slate-900 dark:text-white mb-1">{{ stat.value }}</p>
            <p class="text-sm text-slate-500 dark:text-slate-400">{{ stat.description }}</p>
          </CardContent>
        </Card>
      </div>

      <div class="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <!-- Latest Transactions -->
        <Card class="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl hover-lift transition-all duration-300">
          <CardContent class="p-6">
            <div class="flex items-center justify-between mb-6">
              <div>
                <h2 class="text-xl font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                  <SparklesIcon class="w-5 h-5 text-blue-500" />
                  Latest Transactions
                </h2>
                <p class="text-slate-500 dark:text-slate-400 text-sm mt-1">Recent financial activities</p>
              </div>
            </div>

            <div class="space-y-4">
              <div
                v-for="t in latestTransactions"
                :key="t.id"
                class="flex items-center justify-between p-4 rounded-xl bg-slate-50/50 dark:bg-slate-700/30 hover:bg-slate-100/50 dark:hover:bg-slate-700/50 transition-all duration-300 group border border-transparent hover:border-slate-200 dark:hover:border-slate-600"
              >
                <div class="flex items-center space-x-4">
                  <div
                    class="p-3 rounded-xl transition-all duration-300 group-hover:scale-110"
                    :class="t.type === 'Sent' ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' : 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'"
                  >
                    <component
                      :is="t.type === 'Sent' ? ArrowUpIcon : ArrowDownIcon"
                      class="w-5 h-5"
                    />
                  </div>
                  <div>
                    <p class="font-medium text-slate-900 dark:text-white">{{ t.receiver.name }}</p>
                    <div class="flex items-center space-x-2 text-sm text-slate-500 dark:text-slate-400 mt-1">
                      <CalendarIcon class="w-4 h-4" />
                      <span>{{ formatDate(t.created_at) }}</span>
                    </div>
                  </div>
                </div>
                <div class="text-right">
                  <p
                    class="font-semibold text-lg"
                    :class="t.type === 'Sent' ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'"
                  >
                    {{ t.type === 'Sent' ? '-' : '+' }}{{ currencyFormat(t.amount) }}
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
          </CardContent>
        </Card>

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

            <!-- Loading State -->
            <div v-if="isLoading" class="space-y-4">
              <div v-for="n in 5" :key="n" class="flex items-center justify-between p-4 rounded-xl bg-slate-50/50 dark:bg-slate-700/30 animate-pulse">
                <div class="flex items-center space-x-4">
                  <div class="w-12 h-12 bg-slate-200 dark:bg-slate-600 rounded-xl"></div>
                  <div class="space-y-2">
                    <div class="w-24 h-4 bg-slate-200 dark:bg-slate-600 rounded"></div>
                    <div class="w-20 h-3 bg-slate-200 dark:bg-slate-600 rounded"></div>
                  </div>
                </div>
                <div class="space-y-2 text-right">
                  <div class="w-16 h-4 bg-slate-200 dark:bg-slate-600 rounded ml-auto"></div>
                  <div class="w-12 h-3 bg-slate-200 dark:bg-slate-600 rounded ml-auto"></div>
                </div>
              </div>
            </div>

            <!-- Transactions List -->
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
                    {{ t.type === 'Sent' ? '-' : '+' }}{{ currencyFormat(t.amount) }}
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

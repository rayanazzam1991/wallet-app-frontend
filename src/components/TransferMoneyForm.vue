<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { z } from 'zod'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
  SelectGroup
} from '@/components/ui/select'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import {
  UserIcon,
  DollarSign,
  SendIcon,
  ShieldIcon,
  ZapIcon,
  SparklesIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  Loader2Icon
} from 'lucide-vue-next'
import { useUserStore } from '@/stores/userStore.js'
import { storeToRefs } from 'pinia'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { toast } from 'vue-sonner'
import type { TransferMoney } from '@/types/transaction.ts'
import { useTransactionStore } from '@/stores/transactionStore.ts'

const transactionStore = useTransactionStore()
const userStore = useUserStore()
const { getReceivers } = storeToRefs(userStore)
const isSubmitting = ref(false)
const transferComplete = ref(false)

onMounted(async () => {
  await userStore.fetchReceivers()
})

const form = reactive<TransferMoney>({
  receiver_id: 0,
  amount: 0
})

// Zod validation schema
const transferSchema = z.object({
  receiverId: z.number('Receiver is required'),
  amount: z
    .number('Amount must be a number')
    .positive('Amount must be greater than 0')
    .min(1, 'Amount must be at least $1')
})

const { handleSubmit, resetForm } = useForm({
  validationSchema: toTypedSchema(transferSchema)
})

const submit = handleSubmit(async (values) => {
  isSubmitting.value = true
  form.receiver_id = Number(values.receiverId)
  form.amount = values.amount

  try {
    await transactionStore.transferMoney(form)
    transferComplete.value = true
    toast.success('Transfer Successful!', {
      description: `$${form.amount} has been sent successfully.`,
      style: {
        background: '#10b981',
        color: 'white'
      }
    })

    // Reset form after success
    setTimeout(() => {
      resetForm()
      transferComplete.value = false
    }, 2000)
  } catch (error: any) {
    toast.error('Transfer Failed', {
      description: error.message,
      style: {
        background: '#ef4444',
        color: 'white'
      }
    })
  } finally {
    isSubmitting.value = false
  }
})

const features = [
  {
    icon: ShieldIcon,
    title: 'Secure Transfer',
    description: 'Bank-level encryption'
  },
  {
    icon: ZapIcon,
    title: 'Instant Delivery',
    description: 'Real-time processing'
  },
  {
    icon: SparklesIcon,
    title: 'Zero Fees',
    description: 'No hidden charges'
  }
]
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/30 dark:from-slate-900 dark:via-blue-950/30 dark:to-indigo-900/30 p-6">
    <!-- Animated background -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-40 -right-32 w-80 h-80 bg-purple-200/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
      <div class="absolute -bottom-40 -left-32 w-80 h-80 bg-cyan-200/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-2000"></div>
      <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-200/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-4000"></div>
    </div>

    <div class="relative z-10 max-w-6xl mx-auto">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center min-h-screen">
        <!-- Left Side - Features -->
        <div class="hidden lg:block">
          <div class="max-w-lg">
            <div class="flex items-center space-x-3 mb-8">
              <div class="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <SendIcon class="w-6 h-6 text-white" />
              </div>
              <span class="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                QuickTransfer
              </span>
            </div>

            <h1 class="text-5xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
              Send Money
              <span class="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent block">
                Instantly
              </span>
            </h1>
            <p class="text-xl text-slate-600 dark:text-slate-300 mb-12 leading-relaxed">
              Transfer funds securely to anyone, anywhere. Fast, reliable, and completely free.
            </p>

            <!-- Features Grid -->
            <div class="grid grid-cols-1 gap-6">
              <div
                v-for="feature in features"
                :key="feature.title"
                class="flex items-center space-x-4 p-4 rounded-2xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 hover-lift transition-all duration-300 group"
              >
                <div class="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <component :is="feature.icon" class="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 class="font-semibold text-slate-900 dark:text-white">{{ feature.title }}</h3>
                  <p class="text-slate-600 dark:text-slate-400 text-sm">{{ feature.description }}</p>
                </div>
              </div>
            </div>

            <!-- Stats -->
            <div class="flex space-x-8 mt-12 pt-8 border-t border-slate-200/50 dark:border-slate-700/50">
              <div class="text-center">
                <div class="text-2xl font-bold text-slate-900 dark:text-white">$2.1M+</div>
                <div class="text-sm text-slate-600 dark:text-slate-400">Transferred</div>
              </div>
              <div class="text-center">
                <div class="text-2xl font-bold text-slate-900 dark:text-white">50K+</div>
                <div class="text-sm text-slate-600 dark:text-slate-400">Users</div>
              </div>
              <div class="text-center">
                <div class="text-2xl font-bold text-slate-900 dark:text-white">99.9%</div>
                <div class="text-sm text-slate-600 dark:text-slate-400">Success Rate</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Side - Transfer Form -->
        <div class="flex justify-center">
          <Card class="w-full max-w-md border-0 shadow-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl hover-lift transition-all duration-500 overflow-hidden">
            <!-- Success State Overlay -->
            <div
              v-if="transferComplete"
              class="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center z-20 transition-all duration-500"
            >
              <div class="text-center text-white p-8">
                <CheckCircleIcon class="w-16 h-16 mx-auto mb-4 animate-bounce" />
                <h3 class="text-2xl font-bold mb-2">Transfer Complete!</h3>
                <p class="text-green-100">Your money has been sent successfully.</p>
              </div>
            </div>

            <!-- Gradient border effect -->
            <div class="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-5"></div>

            <CardHeader class="text-center pb-6 pt-8 relative z-10">
              <CardTitle class="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Transfer Money
              </CardTitle>
              <p class="text-slate-600 dark:text-slate-400 mt-2">
                Send money securely to your contacts
              </p>
            </CardHeader>

            <CardContent class="relative z-10 pb-8">
              <form @submit.prevent="submit" class="space-y-6">
                <!-- Receiver Select -->
                <FormField v-slot="{ componentField }" name="receiverId">
                  <FormItem>
                    <FormLabel class="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Select Receiver
                    </FormLabel>
                    <FormControl>
                      <div class="relative group">
                        <div class="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur opacity-0 group-focus-within:opacity-20 transition-opacity duration-300"></div>
                        <div class="relative">
                          <UserIcon class="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400 z-10 transition-colors duration-300 group-focus-within:text-blue-600"/>
                          <Select v-bind="componentField">
                            <SelectTrigger
                              class="w-full pl-10 pr-4 py-6 border-2 border-slate-200 dark:border-slate-600 bg-white/50 dark:bg-slate-700/50 backdrop-blur-sm transition-all duration-300 focus:border-blue-500 focus:ring-0 focus:bg-white dark:focus:bg-slate-600 rounded-xl"
                            >
                              <SelectValue placeholder="Choose a receiver"/>
                            </SelectTrigger>
                            <SelectContent class="rounded-xl border-0 shadow-xl bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl">
                              <SelectGroup>
                                <SelectItem
                                  v-for="r in getReceivers"
                                  :key="r.id"
                                  :value="r.id"
                                  class="rounded-lg transition-colors duration-200 focus:bg-slate-100 dark:focus:bg-slate-700"
                                >
                                  <div class="flex items-center space-x-3">
                                    <div class="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                                      <UserIcon class="w-4 h-4 text-white" />
                                    </div>
                                    <span>{{ r.name }}</span>
                                  </div>
                                </SelectItem>
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage class="text-red-500 text-sm mt-2" />
                  </FormItem>
                </FormField>

                <!-- Amount Input -->
                <FormField v-slot="{ componentField }" name="amount">
                  <FormItem>
                    <FormLabel class="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Amount
                    </FormLabel>
                    <FormControl>
                      <div class="relative group">
                        <div class="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur opacity-0 group-focus-within:opacity-20 transition-opacity duration-300"></div>
                        <div class="relative">
                          <DollarSign class="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400 transition-colors duration-300 group-focus-within:text-blue-600"/>
                          <Input
                            type="number"
                            step="0.01"
                            v-bind="componentField"
                            placeholder="0.00"
                            class="pl-10 pr-4 py-6 border-2 border-slate-200 dark:border-slate-600 bg-white/50 dark:bg-slate-700/50 backdrop-blur-sm transition-all duration-300 focus:border-blue-500 focus:ring-0 focus:bg-white dark:focus:bg-slate-600 rounded-xl text-lg font-semibold"
                          />
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage class="text-red-500 text-sm mt-2" />
                  </FormItem>
                </FormField>

                <!-- Submit Button -->
                <Button
                  type="submit"
                  :disabled="isSubmitting"
                  class="w-full group relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl py-6 text-white font-semibold text-lg transition-all duration-500 transform hover:scale-[1.02] hover:shadow-2xl border-0 mt-2"
                >
                  <!-- Animated background -->
                  <div class="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  <div class="relative flex items-center justify-center space-x-3">
                    <Loader2Icon
                      v-if="isSubmitting"
                      class="w-5 h-5 animate-spin"
                    />
                    <SendIcon
                      v-else
                      class="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
                    />
                    <span class="font-semibold">
                      {{ isSubmitting ? 'Processing...' : 'Send Money' }}
                    </span>
                    <ArrowRightIcon
                      v-if="!isSubmitting"
                      class="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 opacity-0 group-hover:opacity-100"
                    />
                  </div>
                </Button>
              </form>

              <!-- Security Note -->
              <div class="mt-6 p-4 rounded-xl bg-slate-50/50 dark:bg-slate-700/30 border border-slate-200/50 dark:border-slate-600/50">
                <div class="flex items-center space-x-3 text-sm text-slate-600 dark:text-slate-400">
                  <ShieldIcon class="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span>Your transaction is secured with bank-level encryption</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.hover-lift:hover {
  transform: translateY(-8px);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}
</style>

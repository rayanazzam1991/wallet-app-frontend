<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { z } from 'zod'
import { Card, CardContent } from '@/components/ui/card'
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
  DollarSign
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
const {getReceivers} = storeToRefs(userStore)
onMounted(async ()=>{
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
})

const {handleSubmit} = useForm({
  validationSchema: toTypedSchema(transferSchema)
})

const submit = handleSubmit( (values) => {
  form.receiver_id = Number(values.receiverId)
  form.amount = values.amount

  try {
transactionStore.transferMoney(form)
  }catch (error : any) {
    toast('Login failed', {
      style: {
        color: 'white',
        background: '#FF5733'
      },
      description: error.message,
      descriptionClass:'text-white'
    })
  }
})
</script>
<template>
  <div class="min-h-screen bg-gray-100 p-6 flex justify-center items-start">
    <Card class="w-full max-w-xl p-8 shadow-xl rounded-2xl bg-white">
      <CardContent>
        <h2 class="text-2xl font-bold mb-6 text-center">Transfer Money</h2>

        <form @submit.prevent="submit" class="space-y-6">
          <!-- Receiver Select -->
            <FormField v-slot="{ componentField }" name="receiverId">
              <FormItem>
                <FormLabel>Receiver</FormLabel>
                <FormControl>
                  <div class="relative">
                    <UserIcon
                      class="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400 z-10"/>
                    <Select v-bind="componentField">
                      <SelectTrigger class="w-full pl-9">
                        <SelectValue placeholder="Select receiver"/>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem
                            v-for="r in getReceivers"
                            :key="r.id"
                            :value="r.id"
                          >
                            {{ r.name }}
                          </SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </FormControl>
                <FormMessage/>
              </FormItem>
            </FormField>
          <!-- Amount -->
          <FormField v-slot="{ componentField }" name="amount">
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <div class="relative">
                  <DollarSign
                    class="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400"/>
                  <Input
                    type="number"
                    v-bind="componentField"
                    placeholder="Amount to send"
                    class="pl-9"
                  />
                </div>
              </FormControl>
              <FormMessage/>
            </FormItem>
          </FormField>

          <!-- Action Button -->
          <Button type="submit" class="w-full py-2 text-lg">Send Money</Button>
        </form>
      </CardContent>
    </Card>
  </div>
</template>
<style scoped>
</style>

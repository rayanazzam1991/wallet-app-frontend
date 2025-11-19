<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

import {toast} from "vue-sonner"
import {useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore.ts'
import type {LoginPayload, User } from '@/types/user.ts'
import {
  Mail,
  EyeIcon,
  Loader2
} from 'lucide-vue-next'
import * as z from 'zod'
import {useForm} from "vee-validate";
import {toTypedSchema} from "@vee-validate/zod";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import { storeToRefs } from 'pinia'


const form = reactive<LoginPayload>({
  email:"",
  password:""
})

const router = useRouter()
const authStore = useAuthStore()
const {loading} = storeToRefs(authStore)


// validation schema
const loginSchema = z.object({
  email: z.string(),
  password: z.string()
})
const {handleSubmit} = useForm({
  validationSchema: toTypedSchema(loginSchema)
})

const login = handleSubmit( (values) => {
  form.email = values.email
  form.password = values.password

try {
   authStore.login(form)
   router.push('/')
}catch (error : any) {
  toast('Login failed', {
    style: {
      color: 'white',
      background: '#ef4444'
    },
    description: error.message,
    class:'text-white'
  })
}
})

</script>

<template>
  <div class="flex justify-center pt-14">
  <Card class="w-full max-w-md border-0 shadow-2xl bg-white/90 backdrop-blur-sm relative overflow-hidden">
      <CardTitle class="text-center">Login Form</CardTitle>
      <CardContent class="space-y-6 relative z-10 pb-8">
        <form @submit.prevent="login">
          <FormField v-slot="{ componentField }" name="email">
            <FormItem>
              <FormLabel>Email address</FormLabel>
              <FormControl>
                <div class="relative">
                  <Mail class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="email"
                    v-bind="componentField"
                    type="email"
                    placeholder="Enter your email"
                    class="w-full pl-8"
                    required
                  />
                </div>
              </FormControl>
              <FormMessage/>
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="password">
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <div class="relative">
                  <EyeIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="password"
                    v-bind="componentField"
                    type="password"
                    placeholder="Enter your password"
                    class="w-full pl-8"
                    required
                  />
                </div>
              </FormControl>
              <FormMessage/>
            </FormItem>
          </FormField>
          <div class="pt-4">
            <Button
              type="submit"
              :disabled="loading"
              class="w-full group bg-gradient-to-r from-blue-600 to-purple-600  rounded-lg"
            >
              <div v-if="loading"
                   class="flex items-center justify-center w-full space-x-2">
                <Loader2 class="w-5 h-5 animate-spin"/>
                <span class="font-medium">Logging...</span>
              </div>
              <div v-else class="flex items-center justify-center w-full space-x-2">
                <span class="font-medium text-white py-2">Login</span>
              </div>
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { Card, CardContent, CardTitle, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

import { toast } from "vue-sonner"
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore.ts'
import type { LoginPayload, User } from '@/types/user.ts'
import {
  Mail,
  Lock,
  EyeIcon,
  EyeOffIcon,
  Loader2,
  Sparkles,
  Shield,
  Zap
} from 'lucide-vue-next'
import * as z from 'zod'
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import { storeToRefs } from 'pinia'

const form = reactive<LoginPayload>({
  email: "",
  password: ""
})

const router = useRouter()
const authStore = useAuthStore()
const { loading } = storeToRefs(authStore)
const showPassword = ref(false)
const isHovered = ref(false)

// Enhanced validation schema
const loginSchema = z.object({
  email: z.email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
})

const { handleSubmit } = useForm({
  validationSchema: toTypedSchema(loginSchema)
})

const login = handleSubmit(async (values) => {
  form.email = values.email
  form.password = values.password

  try {
    await authStore.login(form)
    await router.push('/')
  } catch (error: any) {
    toast('Login failed', {
      style: {
        color: 'white',
        background: '#FF5733'
      },
      description: error.message,
      descriptionClass: '!text-blue-500'
    })
  }
})

// Animation states
const features = ref([
  { icon: Shield, text: 'Enterprise Security' },
  { icon: Zap, text: 'Lightning Fast' },
  { icon: Sparkles, text: 'Real Time Update' }
])
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-blue-950 dark:to-indigo-900 overflow-hidden">
    <!-- Animated background elements -->
    <div class="absolute inset-0 overflow-hidden">
      <div class="absolute -top-40 -right-32 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
      <div class="absolute -bottom-40 -left-32 w-80 h-80 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse animation-delay-2000"></div>
      <div class="absolute top-40 left-1/2 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse animation-delay-4000"></div>
    </div>

    <div class="relative z-10 flex min-h-screen">
      <!-- Left side - Feature showcase -->
      <div class="hidden lg:flex lg:flex-1 flex-col justify-center px-12 xl:px-24 py-12">
        <div class="max-w-lg mx-auto">
          <div class="flex items-center space-x-3 mb-8">
            <div class="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <Sparkles class="w-6 h-6 text-white" />
            </div>
            <span class="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Wallety
            </span>
          </div>

          <h1 class="text-5xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
            Welcome to the
            <span class="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Future
            </span>
          </h1>
          <p class="text-xl text-slate-600 dark:text-slate-300 mb-12 leading-relaxed">
            Join thousands of teams already using our platform to transform their money transfer.
          </p>

          <!-- Features list -->
          <div class="space-y-6">
            <div
              v-for="(feature, index) in features"
              :key="feature.text"
              class="flex items-center space-x-4 group cursor-pointer transform transition-all duration-300 hover:translate-x-2"
            >
              <div class="w-12 h-12 bg-white/80 dark:bg-slate-800/80 rounded-xl flex items-center justify-center group-hover:shadow-lg transition-all duration-300 backdrop-blur-sm">
                <component
                  :is="feature.icon"
                  class="w-6 h-6 text-blue-600 group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <span class="text-lg font-medium text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                {{ feature.text }}
              </span>
            </div>
          </div>

          <!-- Stats -->
          <div class="flex space-x-8 mt-12 pt-8 border-t border-slate-200 dark:border-slate-700">
            <div class="text-center">
              <div class="text-2xl font-bold text-slate-900 dark:text-white">50K+</div>
              <div class="text-sm text-slate-600 dark:text-slate-400">Active Users</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-slate-900 dark:text-white">99.9%</div>
              <div class="text-sm text-slate-600 dark:text-slate-400">Uptime</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-slate-900 dark:text-white">24/7</div>
              <div class="text-sm text-slate-600 dark:text-slate-400">Support</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right side - Login form -->
      <div class="flex-1 flex flex-col justify-center px-6 py-12 lg:px-12 xl:px-24">
        <div class="mx-auto w-full max-w-md">
          <!-- Mobile logo -->
          <div class="lg:hidden flex justify-center mb-12">
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Sparkles class="w-6 h-6 text-white" />
              </div>
              <span class="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Wallety
              </span>
            </div>
          </div>

          <Card class="w-full border-0 shadow-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl relative overflow-hidden transition-all duration-500 hover:shadow-3xl">
            <!-- Gradient border effect -->
            <div class="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-5"></div>

            <!-- Animated background pattern -->
            <div class="absolute inset-0 opacity-5">

        </div>

        <CardHeader class="text-center pb-8 pt-10 relative z-10">
          <CardTitle class="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Welcome Back
          </CardTitle>
          <p class="text-slate-600 dark:text-slate-400 mt-3">
            Sign in to your account to continue
          </p>
        </CardHeader>

        <CardContent class="space-y-6 relative z-10 pb-10">
          <form @submit.prevent="login" class="space-y-6">
            <FormField v-slot="{ componentField }" name="email">
              <FormItem>
                <FormLabel class="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Email address
                </FormLabel>
                <FormControl>
                  <div class="relative group">
                    <div class="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-0 group-focus-within:opacity-20 transition-opacity duration-300"></div>
                    <div class="relative">
                      <Mail class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400 transition-colors duration-300 group-focus-within:text-blue-600" />
                      <Input
                        v-bind="componentField"
                        type="email"
                        placeholder="Enter your email"
                        class="w-full pl-10 pr-4 py-6 border-2 border-slate-200 dark:border-slate-600 bg-white/50 dark:bg-slate-700/50 backdrop-blur-sm transition-all duration-300 focus:border-blue-500 focus:ring-0 focus:bg-white dark:focus:bg-slate-600"
                      />
                    </div>
                  </div>
                </FormControl>
                <FormMessage class="text-red-500 text-sm mt-2" />
              </FormItem>
            </FormField>

            <FormField v-slot="{ componentField }" name="password">
              <FormItem>
                <FormLabel class="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Password
                </FormLabel>
                <FormControl>
                  <div class="relative group">
                    <div class="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-0 group-focus-within:opacity-20 transition-opacity duration-300"></div>
                    <div class="relative">
                      <Lock class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400 transition-colors duration-300 group-focus-within:text-blue-600" />
                      <Input
                        v-bind="componentField"
                        :type="showPassword ? 'text' : 'password'"
                        placeholder="Enter your password"
                        class="w-full pl-10 pr-12 py-6 border-2 border-slate-200 dark:border-slate-600 bg-white/50 dark:bg-slate-700/50 backdrop-blur-sm transition-all duration-300 focus:border-blue-500 focus:ring-0 focus:bg-white dark:focus:bg-slate-600"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        class="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-transparent"
                        @click="showPassword = !showPassword"
                      >
                        <EyeOffIcon v-if="showPassword" class="h-4 w-4 text-slate-400" />
                        <EyeIcon v-else class="h-4 w-4 text-slate-400" />
                      </Button>
                    </div>
                  </div>
                </FormControl>
                <FormMessage class="text-red-500 text-sm mt-2" />
              </FormItem>
            </FormField>

            <div class="pt-2">
              <Button
                type="submit"
                :disabled="loading"
                class="w-full group relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl py-6 text-white font-semibold transition-all duration-500 transform hover:scale-[1.02] hover:shadow-2xl border-0"
                @mouseenter="isHovered = true"
                @mouseleave="isHovered = false"
              >
                <!-- Animated background -->
                <div class="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                <!-- Ripple effect -->
                <div
                  v-if="isHovered"
                  class="absolute inset-0 bg-white/20 animate-ping rounded-xl"
                  style="animation-duration: 1s;"
                ></div>

                <div class="relative flex items-center justify-center space-x-2">
                  <Loader2
                    v-if="loading"
                    class="w-5 h-5 animate-spin"
                  />
                  <span class="text-lg font-semibold">
                        {{ loading ? 'Signing in...' : 'Sign in' }}
                      </span>
                </div>
              </Button>
            </div>

          </form>
        </CardContent>
        </Card>

        <!-- Footer -->
        <div class="text-center mt-8 text-sm text-slate-500 dark:text-slate-400">
          © 2025 Wallety. All rights reserved.
        </div>
      </div>
    </div>
  </div>
  </div>
</template>

<style scoped>
[data-sonner-toast][data-styled='true'] [data-description]{
  color: #ffffff !important;
}
.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

.hover-lift {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.hover-lift:hover {
  transform: translateY(-4px);
}
</style>

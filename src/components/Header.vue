<script setup lang="ts">
import { useAuthStore } from '@/stores/authStore.ts'
import { storeToRefs } from 'pinia'
import { Button } from '@/components/ui/button'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const {isAuthenticated,getUser} = storeToRefs(authStore)
const {logout} = authStore

const router = useRouter()
const gotoLoginPage = async ()=>{
  await router.push('/login')
}
</script>

<template>
  <header class="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">

    <div class="container mx-auto px-4 sm:px-6">
      <div class="flex h-16 items-center justify-between">
        <div class="flex items-center gap-8">
          <nav class="hidden md:flex items-center gap-6">
            <RouterLink to="/" class="text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors duration-200 relative group">
              My Wallet
              <div class="absolute -bottom-6 left-0 w-full h-0.5 bg-blue-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></div>
            </RouterLink>
            <RouterLink to="/transfer" class="text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors duration-200 relative group">
              Transfer Money
              <div class="absolute -bottom-6 left-0 w-full h-0.5 bg-blue-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></div>
            </RouterLink>
          </nav>
        </div>

        <div class="flex items-center gap-3">

          <div class="flex items-center gap-2 pl-2 border-l border-slate-200">
            <div class="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors duration-200 cursor-pointer group">
              <div v-if="isAuthenticated">
              <div  class="hidden sm:block">
                <div class="flex items-center gap-1">
                  <span class="text-sm font-medium text-slate-800">{{ getUser?.name}}</span>
                  </div>
                <span class="text-xs text-slate-500">Admin</span>
              <Button
                @click="logout"
                class="flex items-center gap-1">Logout</Button>
              </div>
              </div>
              <div v-else class="hidden sm:block">
                <div class="flex items-center gap-1">
                  <Button
                    @click="gotoLoginPage"
                    class="text-sm font-medium text-white">Login</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
/* Smooth transitions for header elements */
header {
  transition: all 0.3s ease;
}

/* Custom scrollbar for mobile navigation */
nav::-webkit-scrollbar {
  display: none;
}

nav {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* Animation for header load */
.header-load {
  opacity: 0;
  transform: translateY(-10px);
  animation: headerSlideIn 0.6s ease forwards;
}

@keyframes headerSlideIn {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>

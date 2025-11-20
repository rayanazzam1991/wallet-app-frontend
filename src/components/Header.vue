<script setup lang="ts">
import { useAuthStore } from '@/stores/authStore.ts'
import { storeToRefs } from 'pinia'
import { Button } from '@/components/ui/button'
import { useRouter } from 'vue-router'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import {
  Sheet,
  SheetContent,
  SheetTrigger
} from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Menu, LogOut, User, Wallet, Send } from 'lucide-vue-next'
import { ref } from 'vue'

const authStore = useAuthStore()
const { isAuthenticated  } = storeToRefs(authStore)
const { logout } = authStore
const {getUserInitials,getAuthUser} = storeToRefs(authStore)
const router = useRouter()
const gotoLoginPage = async () => {
  await router.push('/login')
}
const isScrolled = ref(false)

const handleScroll = () => {
  isScrolled.value = window.scrollY > 10
}

if (typeof window !== 'undefined') {
  window.addEventListener('scroll', handleScroll)
}
</script>

<template>
  <header
    class="sticky top-0 z-50 w-full border-b transition-all duration-300 ease-out"
    :class="[
      isScrolled
        ? 'bg-background/95 backdrop-blur-xl border-border/40 shadow-sm'
        : 'bg-background/80 backdrop-blur-lg border-border/20'
    ]"
  >
    <div class="w-full px-4 sm:px-6 lg:px-20">
      <div class="flex w-full h-16 items-center justify-between">
        <!-- Left Section: Logo & Navigation -->
        <div class="flex items-center gap-8 flex-1">
          <!-- Logo -->
          <RouterLink
            to="/"
            class="flex items-center gap-2 group"
          >
            <div class="relative">
              <div class="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                <Wallet class="w-4 h-4 text-white" />
              </div>
              <div class="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg blur-sm opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
            </div>
            <span class="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Wallety
            </span>
          </RouterLink>

          <!-- Desktop Navigation -->
          <nav class="hidden lg:flex items-center gap-1">
            <RouterLink
              to="/"
              class="relative px-4 py-2 rounded-lg text-sm font-medium text-slate-700 hover:text-slate-900 transition-all duration-200 group"
            >
              <div class="flex items-center gap-2">
                <Wallet class="w-4 h-4" />
                <span>My Wallet</span>
              </div>
              <div class="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg scale-95 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-300"></div>
            </RouterLink>

            <RouterLink
              to="/transfer"
              class="relative px-4 py-2 rounded-lg text-sm font-medium text-slate-700 hover:text-slate-900 transition-all duration-200 group"
            >
              <div class="flex items-center gap-2">
                <Send class="w-4 h-4" />
                <span>Transfer Money</span>
              </div>
              <div class="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg scale-95 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-300"></div>
            </RouterLink>
          </nav>
        </div>

        <!-- Right Section: User Menu & Mobile Menu -->
        <div class="flex items-center gap-3">
          <!-- Desktop User Menu -->
          <div class="hidden lg:flex items-center gap-3">
            <div class="flex items-center gap-2 pl-2 border-l border-slate-200">
              <DropdownMenu v-if="isAuthenticated">
                <DropdownMenuTrigger as-child>
                  <Button variant="ghost" class="relative h-9 px-3 rounded-lg hover:bg-slate-100 transition-colors duration-200 group">
                    <div class="flex items-center gap-3">
                      <Avatar class="w-8 h-8">
                        <AvatarFallback class="text-black text-xl">
                          {{ getUserInitials }}
                        </AvatarFallback>
                      </Avatar>
                      <div class="flex flex-col items-start">
                        <Badge variant="secondary" class="text-xs h-5">
                          Admin
                        </Badge>
                      </div>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent class="w-56" align="end">
                  <DropdownMenuLabel class="flex flex-col">
                    <span class="text-sm font-medium">{{ getAuthUser?.name }}</span>
                    <span class="text-xs text-slate-500 font-normal">Administrator</span>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem @click="logout" class="text-red-600 cursor-pointer">
                    <LogOut class="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                v-else
                @click="gotoLoginPage"
                class="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
              >
                <User class="w-4 h-4 mr-2" />
                Login
              </Button>
            </div>
          </div>

          <!-- Mobile Menu -->
          <div class="flex lg:hidden">
            <Sheet>
              <SheetTrigger as-child>
                <Button variant="ghost" size="sm" class="h-9 w-9 p-0">
                  <Menu class="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" class="w-[280px] sm:w-[350px]">
                <div class="flex flex-col gap-6 mt-8">
                  <div class="flex items-center gap-3 pb-4 border-b">
                    <Avatar class="w-10 h-10">
                      <AvatarFallback
                        v-if="isAuthenticated"
                        class="text-black text-xl"
                      >
                        {{ getUserInitials }}
                      </AvatarFallback>
                      <AvatarFallback v-else class="bg-slate-100">
                        <User class="w-4 h-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div class="flex flex-col">
                      <Badge v-if="isAuthenticated" variant="secondary" class="w-fit text-xs">
                        Admin
                      </Badge>
                    </div>
                  </div>

                  <nav class="flex flex-col gap-2">
                    <RouterLink
                      to="/"
                      class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors duration-200"
                    >
                      <Wallet class="w-4 h-4" />
                      My Wallet
                    </RouterLink>
                    <RouterLink
                      to="/transfer"
                      class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors duration-200"
                    >
                      <Send class="w-4 h-4" />
                      Transfer Money
                    </RouterLink>
                  </nav>

                  <div class="pt-4 border-t">
                    <Button
                      v-if="isAuthenticated"
                      @click="logout"
                      variant="outline"
                      class="w-full justify-start gap-2"
                    >
                      <LogOut class="w-4 h-4" />
                      Logout
                    </Button>
                    <Button
                      v-else
                      @click="gotoLoginPage"
                      class="w-full justify-start gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      <User class="w-4 h-4" />
                      Login
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
/* Smooth transitions for all interactive elements */
* {
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}

/* Custom gradient animation for header */
header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgb(59 130 246 / 0.4), transparent);
  opacity: 0;
  transition: opacity 0.3s ease;
}

header:hover::before {
  opacity: 1;
}

/* Mobile menu animations */
:deep(.sheet-content) {
  animation: slideInRight 0.3s ease-out;
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}

/* Dropdown menu animations */
:deep(.dropdown-menu-content) {
  animation: scaleIn 0.2s ease-out;
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(-10px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}
</style>

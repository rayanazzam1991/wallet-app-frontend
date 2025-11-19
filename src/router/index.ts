import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: {
        showHeader: true,
        middleware: ["auth"]
      }
    },
    {
      path: '/login',
      name: 'login',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/LoginView.vue'),
      meta: {
        showHeader: false
      }
    },
    {
      path: '/transfer',
      name: 'transfer',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/TransferMoneyView.vue'),
      meta: {
        showHeader: true,
        middleware: ["auth"]
      }
    },
  ],
})

// --- middleware system ---
// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
const middlewares: Record<string, Function> = {
  //@ts-ignore
  auth: (to, from, next) => {
    const user = localStorage.getItem("user")
    console.log("user",user)
    if(!user) return next("/login")

    const isLoggedIn  = JSON.parse(user)?.token
    if (!isLoggedIn) return next("/login")
    next()
  },
}

router.beforeEach((to, from, next) => {
  if (!to.meta.middleware) return next()

  const mws = Array.isArray(to.meta.middleware) ? to.meta.middleware : [to.meta.middleware]
  for (const mw of mws) {
    if (middlewares[mw]) {
      return middlewares[mw](to, from, next)
    }
  }
  next()
})

export default router

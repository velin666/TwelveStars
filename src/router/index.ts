import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/*',
      redirect: '/',
    },
    {
      path: '/',
      name: 'Home',
      component: () => import('@/views/Home/index.vue'),
      meta: {
        title: '',
      },
    },
  ],
  scrollBehavior: () => {
    return { top: 0 }
  },
})

router.afterEach((to) => {
  document.title = to.meta.title + ''
})

export default router

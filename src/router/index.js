import { createRouter, createWebHashHistory } from 'vue-router';

const Desktop = () => import('@/components/os/Desktop.vue');

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'desktop',
      component: Desktop,
    },
    {
      path: '/app/:appId',
      name: 'app',
      component: Desktop,
      props: true,
    },
    {
      path: '/computer/:path(.*)*',
      name: 'computer',
      component: Desktop,
      props: true,
    },
    {
      path: '/:catchAll(.*)',
      redirect: '/',
    },
  ],
});

export default router;

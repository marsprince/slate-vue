import VueRouter from 'vue-router'
import Vue from 'vue'
Vue.use(VueRouter)

export const routes = [
  {
    path: '/plaintext',
    name: '/plaintext',
    component: () => import('../pages/plaintext')
  },
  {
    path: '/richtext',
    name: '/richtext',
    component: () => import('../pages/richtext')
  },
  {
    path: '/huge-document',
    name: '/hugeDocument',
    component: () => import('../pages/hugeDocument')
  },
  {
    path: '/readonly',
    name: '/readonly',
    component: () => import('../pages/readonly')
  },
  {
    path: '/links',
    name: '/links',
    component: () => import('../pages/links')
  },
  {
    path: '/images',
    name: '/images',
    component: () => import('../pages/images')
  },
]

export const router = new VueRouter({
  mode: 'history',
  routes
})

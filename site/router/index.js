import VueRouter from 'vue-router'
import Vue from 'vue'
Vue.use(VueRouter)

export const routes = [
  {
    path: '/plaintext',
    name: '/plaintext',
    component: () => import('../pages/plaintext/index')
  },
  {
    path: '/richtext',
    name: '/richtext',
    component: () => import('../pages/richtext/index')
  }
]

export const router = new VueRouter({
  mode: 'history',
  routes
})

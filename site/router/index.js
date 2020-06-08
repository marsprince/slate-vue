import VueRouter from 'vue-router'
import Vue from 'vue'
Vue.use(VueRouter)

export const routes = [
  {
    path: '/plaintext',
    name: 'plaintext',
    component: () => import('../pages/plaintext')
  },
  {
    path: '/richtext',
    name: 'richtext',
    component: () => import('../pages/richtext')
  },
  {
    path: '/huge-document',
    name: 'hugeDocument',
    component: () => import('../pages/hugeDocument')
  },
  {
    path: '/readonly',
    name: 'readonly',
    component: () => import('../pages/readonly')
  },
  {
    path: '/links',
    name: 'links',
    component: () => import('../pages/links')
  },
  {
    path: '/images',
    name: 'images',
    component: () => import('../pages/images')
  },
  {
    path: '/mentions',
    name: 'mentions',
    component: () => import('../pages/mentions')
  },
  {
    path: '/check-lists',
    name: 'check-lists',
    component: () => import('../pages/check-lists')
  },
  {
    path: '/embeds',
    name: 'embeds',
    component: () => import('../pages/embeds')
  },
  {
    path: '/forced-layout',
    name: 'forced-layout',
    component: () => import('../pages/forced-layout')
  },
  {
    path: '/hovering-toolbar',
    name: 'hovering-toolbar',
    component: () => import('../pages/hovering-toolbar')
  },
  {
    path: '/search-highlighting',
    name: 'search-highlighting',
    component: () => import('../pages/search-highlighting')
  },
  {
    path: '/markdown-preview',
    name: 'markdown-preview',
    component: () => import('../pages/markdown-preview')
  },
  {
    path: '/markdown-shortcuts',
    name: 'markdown-shortcuts',
    component: () => import('../pages/markdown-shortcuts')
  },
  {
    path: '/paste-html',
    name: 'paste-html',
    component: () => import('../pages/paste-html')
  },
]

export const router = new VueRouter({
  mode: 'history',
  routes
})

import VueRouter from 'vue-router'
import Vue from 'vue'
Vue.use(VueRouter)

export const routes = [
  {
    path: '/check-lists',
    name: 'Checklists',
    component: () => import('../pages/check-lists')
  },
  {
    path: '/editable-voids',
    name: 'Editable Voids',
    component: () => import('../pages/editable-voids')
  },
  {
    path: '/embeds',
    name: 'Embeds',
    component: () => import('../pages/embeds')
  },
  {
    path: '/forced-layout',
    name: 'Forced Layout',
    component: () => import('../pages/forced-layout')
  },
  {
    path: '/hovering-toolbar',
    name: 'Hovering Toolbar',
    component: () => import('../pages/hovering-toolbar')
  },
  {
    path: '/huge-document',
    name: 'Huge Document',
    component: () => import('../pages/hugeDocument')
  },
  {
    path: '/images',
    name: 'Images',
    component: () => import('../pages/images')
  },
  {
    path: '/links',
    name: 'Links',
    component: () => import('../pages/links')
  },
  {
    path: '/markdown-preview',
    name: 'Markdown Preview',
    component: () => import('../pages/markdown-preview')
  },
  {
    path: '/markdown-shortcuts',
    name: 'Markdown Shortcuts',
    component: () => import('../pages/markdown-shortcuts')
  },
  {
    path: '/mentions',
    name: 'Mentions',
    component: () => import('../pages/mentions')
  },
  {
    path: '/paste-html',
    name: 'Paste HTML',
    component: () => import('../pages/paste-html')
  },
  {
    path: '/plaintext',
    name: 'Plain Text',
    component: () => import('../pages/plaintext')
  },
  {
    path: '/readonly',
    name: 'Read-only',
    component: () => import('../pages/readonly')
  },
  {
    path: '/richtext',
    name: 'Rich Text',
    component: () => import('../pages/richtext')
  },
  {
    path: '/search-highlighting',
    name: 'Search Highlighting',
    component: () => import('../pages/search-highlighting')
  },
  {
    path: '/',
    redirect: 'richtext'
  },
]

export const router = new VueRouter({
  mode: 'hash',
  routes
})

import VueRouter from 'vue-router'
import Vue from 'vue'
Vue.use(VueRouter)

export const routes = [
  {
    path: '/check-lists',
    name: 'Checklists',
    component: () => import(/* webpackChunkName: "check-lists" */ '../pages/check-lists')
  },
  {
    path: '/editable-voids',
    name: 'Editable Voids',
    component: () => import(/* webpackChunkName: "editable-voids" */'../pages/editable-voids')
  },
  {
    path: '/embeds',
    name: 'Embeds',
    component: () => import(/* webpackChunkName: "embeds" */'../pages/embeds')
  },
  {
    path: '/forced-layout',
    name: 'Forced Layout',
    component: () => import(/* webpackChunkName: "forced-layout" */'../pages/forced-layout')
  },
  {
    path: '/hovering-toolbar',
    name: 'Hovering Toolbar',
    component: () => import(/* webpackChunkName: "hovering-toolbar" */'../pages/hovering-toolbar')
  },
  {
    path: '/huge-document',
    name: 'Huge Document',
    component: () => import(/* webpackChunkName: "hugeDocument" */'../pages/hugeDocument')
  },
  {
    path: '/images',
    name: 'Images',
    component: () => import(/* webpackChunkName: "images" */'../pages/images')
  },
  {
    path: '/links',
    name: 'Links',
    component: () => import(/* webpackChunkName: "links" */'../pages/links')
  },
  {
    path: '/markdown-preview',
    name: 'Markdown Preview',
    component: () => import(/* webpackChunkName: "markdown-preview" */'../pages/markdown-preview')
  },
  {
    path: '/markdown-shortcuts',
    name: 'Markdown Shortcuts',
    component: () => import(/* webpackChunkName: "markdown-shortcuts" */'../pages/markdown-shortcuts')
  },
  {
    path: '/mentions',
    name: 'Mentions',
    component: () => import(/* webpackChunkName: "mentions" */'../pages/mentions')
  },
  {
    path: '/paste-html',
    name: 'Paste HTML',
    component: () => import(/* webpackChunkName: "paste-html" */'../pages/paste-html')
  },
  {
    path: '/plaintext',
    name: 'Plain Text',
    component: () => import(/* webpackChunkName: "plaintext" */'../pages/plaintext')
  },
  {
    path: '/readonly',
    name: 'Read-only',
    component: () => import(/* webpackChunkName: "readonly" */'../pages/readonly')
  },
  {
    path: '/richtext',
    name: 'Rich Text',
    component: () => import(/* webpackChunkName: "richtext" */'../pages/richtext')
  },
  {
    path: '/search-highlighting',
    name: 'Search Highlighting',
    component: () => import(/* webpackChunkName: "search-highlighting" */'../pages/search-highlighting')
  },
  {
    path: '/table',
    name: 'Tables',
    component: () => import(/* webpackChunkName: "table" */'../pages/table')
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

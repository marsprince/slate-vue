import Vue from 'vue'
import app from './app'
import { SlatePlugin } from 'slate-vue';
import './index.css'
import {router} from './router'

Vue.use(SlatePlugin)

new Vue({
  el: '#app',
  router,
  render: (h) => h(app)
})

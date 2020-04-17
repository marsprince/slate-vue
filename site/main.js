import Vue from 'vue'
import app from './app'
import { SlatePlugin } from 'slate-vue';
import './index.css'

Vue.use(SlatePlugin)

new Vue({
  el: '#app',
  render: (h) => h(app)
})

import Vue from 'vue'
import app from './pages/plaintext'
import { SlatePlugin } from 'slate-vue';

Vue.use(SlatePlugin)

new Vue({
  el: '#app',
  render: (h) => h(app)
})

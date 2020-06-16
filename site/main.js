import Vue from 'vue'
import app from './app'
import { SlatePlugin } from 'slate-vue';
import './index.css'
import {router} from './router'
import { withHistory } from 'slate-history'

Vue.use(SlatePlugin, {
  editorCreated(editor) {
    withHistory(editor)
  }
})

new Vue({
  el: '#app',
  router,
  render: (h) => h(app)
})

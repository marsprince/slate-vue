import { createEditor, Operation } from 'slate';
import {hooks} from './vue-hooks';
import {withVue} from './with-vue';
import {fragment} from '../components/fragment';
import Vue from 'vue'
export const gvm = new Vue()

export interface SlatePluginOptions {

}

// for element and element[]
export const elementWatcherPlugin = (vm) => {
  const update = vm._watcher.update;
  vm._watcher.update = () => {
    const op: Operation = vm.$editor._operation;
    // some op doesn't change element, so prevent updating
    if(op.type === 'remove_text' || op.type === 'insert_text' || op.type === 'set_selection') {
      return
    }
    update.call(vm._watcher)
  }
  gvm.$on('forceUpdate', ()=>{
    update.call(vm._watcher)
  })
}

export const SlateMixin = {
  mounted() {
    const editor = this.$editor
    editor._state.__ob__.dep.addSub(this._watcher)
  }
}

export const SlatePlugin = {
  install(Vue, options) {
    Vue.prototype.$editor = withVue(createEditor());
    Vue.component('fragment', fragment)
    Vue.use(hooks)
  }
}

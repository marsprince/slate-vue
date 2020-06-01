import { createEditor, Operation } from 'slate';
import {hooks} from './vue-hooks';
import {withVue} from './with-vue';
import {fragment} from '../components/fragment';
import Vue from 'vue'
import {NODE_TO_KEY} from '..';

// an vm for focused and so on
export const gvm = new Vue({
  data: {
    // If editor is focused
    focused: false,
    // selected element key
    selected: {}
  }
})

export interface SlatePluginOptions {

}

// for element and element[]
export const elementWatcherPlugin = (vm, type) => {
  const update = vm._watcher.update;
  vm._watcher.update = () => {
    const op: Operation = vm.$editor._operation;
    // some op doesn't change element, so prevent updating
    if(op) {
      if(op.type === 'remove_text' || op.type === 'insert_text') {
        return
      }
      // use gvm.selected, so element does't update
      if(op.type === 'set_selection' && type === 'element') {
        return
      }
      if(op.type === 'remove_node' && type === 'element') {
        return
      }
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

export const SelectedMixin = {
  computed: {
    selected() {
      if(this.element) {
        return gvm.selected[NODE_TO_KEY.get(this.element).id]
      } else {
        return false
      }
    }
  },
}

export const FocusedMixin = {
  computed: {
    focused() {
      return gvm.focused
    }
  }
}

export const SlatePlugin = {
  install(Vue, options) {
    Vue.prototype.$editor = withVue(createEditor());
    Vue.component('fragment', fragment)
    Vue.use(hooks)
  }
}

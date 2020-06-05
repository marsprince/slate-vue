import { createEditor, Operation, Editor, Range } from 'slate';
import {hooks} from './vue-hooks';
import {withVue} from './with-vue';
import {fragment} from '../components/fragment';
import Vue from 'vue'
import { NODE_TO_KEY } from '../utils/weak-maps';
import {VueEditor} from './vue-editor'
import { withHistory } from 'slate-history'

// an vm for focused and so on
export const gvm = new Vue({
  data: {
    // If editor is focused
    focused: false,
    // selected element key
    selected: {
      elements: []
    },
    readOnly: false
  },
  methods: {
    updateSelected() {
      const editor = this.$editor
      const {selection} = editor
      if(selection) {
        this.selected.elements.forEach(node => {
          const key = NODE_TO_KEY.get(node)
          if(key) {
            const {id} = key
            const p = VueEditor.findPath(editor, node)
            const range = Editor.range(editor, p)
            const selected = Range.intersection(range, selection)
            this.$set(this.selected, id, !!selected)
          }
        })
      }
    }
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
      if(op.type === 'remove_text' || op.type === 'insert_text' || op.type === 'set_selection') {
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
  created() {
    const element = this.element || this.node
    gvm.selected.elements.push(element)
  },
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

export const ReadOnlyMixin = {
  computed: {
    readOnly() {
      return gvm.readOnly
    }
  }
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
    Vue.prototype.$editor = withHistory(withVue(createEditor()));
    Vue.component('fragment', fragment)
    Vue.use(hooks)
  }
}

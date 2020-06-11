import { createEditor, Operation, Editor, Range } from 'slate';
import {hooks} from './vue-hooks';
import {withVue} from './with-vue';
import Vue from 'vue'
import { NODE_TO_KEY, EDITOR_TO_GVM, GVM_TO_EDITOR } from '../utils/weak-maps';
import {VueEditor} from './vue-editor'
import { withHistory } from 'slate-history'

const createGvm = () => {
  return new Vue({
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
        const editor = GVM_TO_EDITOR.get(this)
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
}

export const getGvm = (editor: VueEditor) => {
  return EDITOR_TO_GVM.get(editor)
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
  // gvm.$on('forceUpdate', ()=>{
  //   update.call(vm._watcher)
  // })
}

export const SlateMixin = {
  mounted() {
    const editor = this.$editor
    editor._state.__ob__.dep.addSub(this._watcher)
  }
}

export const SelectedMixin = {
  created() {
    const gvm = getGvm(this.$editor)
    const element = this.element || this.node
    gvm.selected.elements.push(element)
  },
  computed: {
    selected() {
      if(this.element) {
        const gvm = getGvm(this.$editor)
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
      const gvm = getGvm(this.$editor)
      return gvm.readOnly
    }
  }
}

export const FocusedMixin = {
  computed: {
    focused() {
      const gvm = getGvm(this.$editor)
      return gvm.focused
    }
  }
}

export const createEditorInstance = () => {
  const editor = withHistory(withVue(createEditor()))
  const gvm = createGvm()
  EDITOR_TO_GVM.set(editor, gvm)
  GVM_TO_EDITOR.set(gvm, editor)
  return editor
}

export const SlatePlugin = {
  install(Vue) {
    Vue.mixin({
      beforeCreate() {
        // assume that the editor's root starts from the component which is using Slate
        if(this.$options.components.Slate) {
          this.$editor = createEditorInstance()
        } else {
          this.$editor = this.$parent && this.$parent.$editor
        }
      }
    })
    Vue.use(hooks)
  }
}

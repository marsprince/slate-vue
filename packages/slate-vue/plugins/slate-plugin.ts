import * as tsx from 'vue-tsx-support'
import { createEditor, Operation, Editor, Range } from 'slate';
import {hooks} from './vue-hooks';
import Vue from 'vue'
import { NODE_TO_KEY, EDITOR_TO_GVM, GVM_TO_EDITOR, withVue } from 'slate-vue-shared';
import {VueEditor} from './vue-editor'

const createGvm = () => {
  return new Vue({
    data: {
      // If editor is focused
      focused: false,
      // selected element key
      selected: {
        elements: []
      }
    },
    methods: {
      updateSelected() {
        const editor = GVM_TO_EDITOR.get(this) as VueEditor
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
export const elementWatcherPlugin = (vm: any, type: string) => {
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

export const SlateMixin = tsx.component({
  mounted() {
    const editor = this.$editor
    // vue internal
    editor._state.__ob__.dep.addSub((this as any)._watcher)
  }
})

export const SelectedMixin = tsx.component({
  created() {
    const gvm = getGvm(this.$editor)
    const element = (this as any).element || (this as any).node
    gvm.selected.elements.push(element)
  },
  computed: {
    selected() {
      if((this as any).element) {
        const gvm = getGvm(this.$editor)
        const key = NODE_TO_KEY.get((this as any).element)
        if(!key) return false
        return gvm.selected[key.id]
      } else {
        return false
      }
    }
  },
})

// just compat old version ...
export const ReadOnlyMixin = tsx.component({
  computed: {
    readOnly() {
      // must be consistent with readonly props in editable
      return VueEditor.isReadOnly(this.$editor)
    }
  }
})

export const FocusedMixin = tsx.component({
  computed: {
    focused() {
      const gvm = getGvm(this.$editor)
      return gvm.focused
    }
  }
})

export const createEditorInstance = () => {
  const editor = withVue(createEditor())
  const gvm = createGvm()
  EDITOR_TO_GVM.set(editor, gvm)
  GVM_TO_EDITOR.set(gvm, editor)
  return editor
}

interface SlatePluginOptions {
  editorCreated?: (editor: VueEditor) => any
}

export const SlatePlugin = {
  install(Vue: any, options?: SlatePluginOptions) {
    Vue.mixin({
      beforeCreate() {
        if(!this.$editor) {
          // assume that the editor's root starts from the component which is using Slate
          if(this.$options.components.Slate) {
            this.$editor = createEditorInstance()
            if(options?.editorCreated) {
              options.editorCreated.call(this, this.$editor)
            }
          } else {
            this.$editor = this.$parent && this.$parent.$editor
          }
        }
      }
    })
    Vue.use(hooks)
  }
}

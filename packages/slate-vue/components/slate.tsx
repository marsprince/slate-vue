/**
 * A wrapper around the provider to handle `onChange` events, because the $editor
 * is a mutable singleton so it won't ever register as "changed" otherwise.
 */
import * as tsx from 'vue-tsx-support'
import {EDITOR_TO_ON_CHANGE} from 'slate-vue-shared';
import Vue from 'vue';
import { VueEditor, getGvm } from '../plugins';
import {fragment} from './fragment'

interface SlateData {
  name: string | null
}

export const Slate = tsx.component({
  name: 'slate',
  props: {
    value: String,
  },
  components: {
    fragment
  },
  data():SlateData {
    return {
      name: null
    }
  },
  created() {
    // This method is forked from Vuex, but is not an efficient methods, still need to be improved
    // prepare two objects, one for immer, the other for vue
    // when we get immer result, patch it to vue
    this.renderSlate()
    this.$editor.clear = () => {
      this.renderSlate(JSON.stringify([
        {
          children: [
            { text: '' },
          ],
        },
      ]))
    }
  },
  watch: {
    value(newVal, oldVal) {
      if(newVal!==oldVal) {
        this.renderSlate(newVal)
      }
    }
  },
  methods: {
    genUid() {
      return Math.floor(Date.now() * Math.random()).toString(16)
    },
    /**
     * force slate render by change fragment name
     * @param newVal
     */
    renderSlate(newVal?: any) {
      const value = newVal || this.value
      const editor = this.$editor
      editor.children = JSON.parse(value);
      const $$data = JSON.parse(value);
      editor._state= Vue.observable($$data)

      this.clearEditor();
      this.name = this.genUid()
    },
    clearEditor() {
      this.$editor.selection = null
    }
  },
  render() {
    EDITOR_TO_ON_CHANGE.set(this.$editor,()=>{
      // patch to update all use
      // update editable manual
      // notify all update
      this.$editor._state.__ob__.dep.notify()
      // update focus manual
      const gvm = getGvm(this.$editor)
      gvm.focused = VueEditor.isFocused(this.$editor)
      let op = this.$editor._operation
      if(op && op.type === 'set_selection') {
        gvm.updateSelected()
      }
      // emit onchange event
      this.$emit('onChange')
    })
    return (
      <fragment name={this.name}>
        {this.$scopedSlots.default && this.$scopedSlots.default({})}
      </fragment>
    )
  }
})

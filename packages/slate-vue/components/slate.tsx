/**
 * A wrapper around the provider to handle `onChange` events, because the $editor
 * is a mutable singleton so it won't ever register as "changed" otherwise.
 */
import * as tsx from 'vue-tsx-support'
import {EDITOR_TO_ON_CHANGE} from '../utils/weak-maps';
import Vue from 'vue';
import { VueEditor, getGvm } from '../plugins';
import {fragment} from './fragment'

export const Slate = tsx.component({
  name: 'slate',
  props: {
    value: String,
  },
  components: {
    fragment
  },
  data() {
    return {
      name: null
    }
  },
  created() {
    // This method is forked from Vuex, but is not an efficient methods, still need to be improved
    // prepare two objects, one for immer, the other for vue
    // when we get immer result, patch it to vue
    ;(this as any).renderSlate()
  },
  watch: {
    value(newVal, oldVal) {
      if(newVal!==oldVal) {
        if(!newVal) {
          // slate empty
          newVal = JSON.stringify([
            {
              children: [
                { text: '' },
              ],
            },
          ])
        }
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
    renderSlate(newVal: any) {
      const value = newVal || this.value
      ;(this as any).$editor.children = JSON.parse(value);
      const $$data = JSON.parse(value);
      ;(this as any).$editor._state= Vue.observable($$data)
      ;(this as any).name = this.genUid()
    }
  },
  render() {
    EDITOR_TO_ON_CHANGE.set((this as any).$editor,()=>{
      // patch to update all use
      // update editable manual
      // notify all update
      ;(this as any).$editor._state.__ob__.dep.notify()
      // update focus manual
      const gvm = getGvm((this as any).$editor)
      gvm.focused = VueEditor.isFocused((this as any).$editor)
      let op = (this as any).$editor._operation
      if(op && op.type === 'set_selection') {
        gvm.updateSelected()
      }
      // emit onchange event
      this.$emit('onChange')
    })
    return (
      <fragment name={this.name}>
        {(this as any).$scopedSlots.default()}
      </fragment>
    )
  }
})

/**
 * A wrapper around the provider to handle `onChange` events, because the editor
 * is a mutable singleton so it won't ever register as "changed" otherwise.
 */
import * as tsx from 'vue-tsx-support'
import {EDITOR_TO_ON_CHANGE} from '../utils/weak-maps';
import {patch} from '../utils/patch'
import Vue from 'vue';

export const Slate = tsx.component({
  props: {
    value: String
  },
  data() {
    return {
      state: {}
    }
  },
  created() {
    // This method is forked from Vuex, but is not an efficient methods, still need to be improved
    // prepare two objects, one for immer, other for vue
    // when we get immer result, patch it to vue
    this.$editor.children = JSON.parse(this.value);
    const $$data = JSON.parse(this.value);
    this.$editor._state = Vue.observable({
      $$data
    })
  },
  render() {
    EDITOR_TO_ON_CHANGE.set(this.$editor,()=>{
      patch(this.$editor.children, this.$editor)
    })
    return this.$scopedSlots.default()
  }
})

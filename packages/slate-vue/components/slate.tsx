/**
 * A wrapper around the provider to handle `onChange` events, because the editor
 * is a mutable singleton so it won't ever register as "changed" otherwise.
 */
import * as tsx from 'vue-tsx-support'
import {EDITOR_TO_ON_CHANGE} from '../utils/weak-maps';
// provide global state
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
    this.$editor.children = JSON.parse(this.value);
  },
  render() {
    // an ugly hack
    const update = (component) => {
      component.$forceUpdate()
      if(component.$children && component.$children.length > 0) {
        component.$children.forEach(child => update(child))
      }
    }
    EDITOR_TO_ON_CHANGE.set(this.$editor,()=>{
      update(this)
    })
    return this.$scopedSlots.default()
  }
})

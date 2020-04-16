/**
 * A wrapper around the provider to handle `onChange` events, because the editor
 * is a mutable singleton so it won't ever register as "changed" otherwise.
 */
import * as tsx from 'vue-tsx-support'
// provide global state
export const Slate = tsx.component({
  props: {
    value: [Object, Array]
  },
  data() {
    return {
      state: []
    }
  },
  render() {
    this.$set(this, 'state', this.value || []);
    this.$editor.children = this.state;
    return this.$scopedSlots.default()
  }
})

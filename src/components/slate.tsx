/**
 * A wrapper around the provider to handle `onChange` events, because the editor
 * is a mutable singleton so it won't ever register as "changed" otherwise.
 */
export const Slate = {
  props: {
    value: [Object, Array]
  },
  render() {
    this.$editor.children = this.value;
    return this.$scopedSlots.default()
  }
}

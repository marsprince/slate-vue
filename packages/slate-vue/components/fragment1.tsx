import * as tsx from 'vue-tsx-support'
export const fragment = tsx.component({
  render() {
    return this.$scopedSlots.default()
  }
})

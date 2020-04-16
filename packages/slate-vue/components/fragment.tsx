import * as tsx from 'vue-tsx-support'
export default tsx.component({
  render() {
    return this.$scopedSlots.default()
  }
})

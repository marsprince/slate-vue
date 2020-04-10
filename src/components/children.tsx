import * as tsx from "vue-tsx-support";
// render all children
const Children: tsx.TsxComponent<Vue, {}> =  tsx.component({
  props: {
    node: Object
  },
  render() {
    return (
      <div></div>
    )
  }
});

export default Children

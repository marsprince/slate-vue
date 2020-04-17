import Children from './children';
import * as tsx from "vue-tsx-support";

// the contentEditable div
export const Editable = tsx.component({
  // some global props will provide for child component
  props: {
    renderLeaf: Function,
    renderElement: Function,
    readOnly: Boolean
  },
  components: {
    Children
  },
  provide() {
    return {
      'renderLeaf': this.renderLeaf,
      'renderElement': this.renderElement,
      'readOnly': this.readOnly
    }
  },
  render() {
    const editor = this.$editor
    const decorate = (arr) => []
    const decorations = decorate([this.$editor, []])
    return (
      <div
        contenteditable={true}
        style={{
         // Prevent the default outline styles.
         outline: 'none',
         // Preserve adjacent whitespace and new lines.
         whiteSpace: 'pre-wrap',
         // Allow words to break if they are too long.
         wordWrap: 'break-word',
         // Allow for passed-in styles to override anything.
         // ...style,
        }}
        >
        <Children
          node={editor}
          decorate={decorate}
          decorations={decorations}/>
      </div>
    )
  }
})

import Children from './children';
import * as tsx from "vue-tsx-support";

// the contentEditable div
export const Editable: tsx.TsxComponent<Vue, {}> = tsx.component({
  components:{
    Children
  },
  render() {
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
       }}>
        <Children/>
      </div>
    )
  }
})

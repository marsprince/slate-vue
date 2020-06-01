// For slate text, A text may contains many leaves
// under text is just render logic, so provide isLast, parent ,text for children

import * as tsx from 'vue-tsx-support'
import { Range, Element, Text as SlateText } from 'slate'

import leaf from './leaf'
import { VueEditor } from '../index'
// import { RenderLeafProps } from './editable'
import {
  KEY_TO_ELEMENT,
  NODE_TO_ELEMENT,
  ELEMENT_TO_NODE,
} from '../utils/weak-maps'
import { useRef, useEffect } from '../plugins/vue-hooks';

/**
 * Text.
 */

const Text = tsx.component({
  props: {
    text: Object,
    isLast: Boolean,
    parent: Object,
    decorations: Array
  },
  components: {
    leaf
  },
  provide() {
    return {
      'text': this.text,
      'isLast': this.isLast,
      'parent': this.parent
    }
  },
  hooks() {
    const ref = this.ref = useRef(null);
    const {text} = this;
    const editor = this.$editor;
    const key = VueEditor.findKey(editor, text)
    const initRef = () => {
      useEffect(()=>{
        if (ref.current) {
          KEY_TO_ELEMENT.set(key, ref.current)
          NODE_TO_ELEMENT.set(text, ref.current)
          ELEMENT_TO_NODE.set(ref.current, text)
        } else {
          KEY_TO_ELEMENT.delete(key)
          NODE_TO_ELEMENT.delete(text)
        }
      })
    };

    initRef()
  },
  render(h, ctx) {
    const { text } = this
    const leaves = SlateText.decorations(text, this.decorations)
    const children = []
    for (let i = 0; i < leaves.length; i++) {
      const leaf = leaves[i];
      children.push(
        <leaf
          leaf={leaf}
        />
        )
    }
    return (
      <span data-slate-node="text" ref={this.ref.id}>
        {children}
      </span>
    )
  }
})

export default Text

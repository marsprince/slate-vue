// For slate text, A text may contains many leaves
// under text is just render logic, so provide isLast, parent ,text for children

import * as tsx from 'vue-tsx-support'
import { Range, Element, Text as SlateText } from 'slate'

import leaf from './leaf'
import { ReactEditor } from '../index'
// import { RenderLeafProps } from './editable'
import {
  KEY_TO_ELEMENT,
  NODE_TO_ELEMENT,
  ELEMENT_TO_NODE,
} from '../utils/weak-maps'

/**
 * Text.
 */

const Text = tsx.component({
  props: {
    text: Object,
    isLast: Boolean,
    parent: Object,
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
  render(h, ctx) {
    const { text } = this
    const leaves = SlateText.decorations(text, [])
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
      <span data-slate-node="text">
        {children}
      </span>
    )
  }
})

export default Text

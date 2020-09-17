// For slate text, A text may contains many leaves
// under text is just render logic, so provide isLast, parent ,text for children

import * as tsx from 'vue-tsx-support'
import { Text as SlateText, Node, Editor } from 'slate';

import leaf from './leaf'
import { VueEditor } from '../plugins';

import {
  KEY_TO_ELEMENT,
  NODE_TO_ELEMENT,
  ELEMENT_TO_NODE, PLACEHOLDER_SYMBOL,
} from '../utils/weak-maps';
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
  inject: ['decorate', 'placeholder'],
  provide() {
    return {
      'text': this.text,
      'isLast': this.isLast,
      'parent': this.parent
    }
  },
  hooks() {
    const ref = (this as any).ref = useRef(null);
    const {text} = this;
    const editor = (this as any).$editor;
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
    const { text, placeholder } = this as any
    let decorations: any = this.decorations;
    if(!decorations) {
      const editor = (this as any).$editor
      const p = VueEditor.findPath(editor, text)
      decorations = (this as any).decorate([text, p])

      // init placeholder
      if (
        placeholder &&
        editor.children.length === 1 &&
        Array.from(Node.texts(editor)).length === 1 &&
        Node.string(editor) === ''
      ) {
        const start = Editor.start(editor, [])
        decorations.push({
          [PLACEHOLDER_SYMBOL]: true,
          placeholder,
          anchor: start,
          focus: start,
        })
      }
    }
    const leaves = SlateText.decorations(text, decorations)
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
      <span data-slate-node="text" ref={(this as any).ref.id}>
        {children}
      </span>
    )
  }
})

export default Text

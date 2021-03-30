// For slate text, A text may contains many leaves
// under text is just render logic, so provide isLast, parent ,text for children

import * as tsx from 'vue-tsx-support'
import { Text as SlateText, Node, Editor, Element, Range } from 'slate';

import leaf from './leaf'
import { VueEditor } from '../plugins';

import {
  KEY_TO_ELEMENT,
  NODE_TO_ELEMENT,
  ELEMENT_TO_NODE, PLACEHOLDER_SYMBOL,
} from 'slate-vue-shared';
import { useRef, useEffect } from '../plugins/vue-hooks';
import { providedByEditable, UseRef } from '../types';
import { PropType, VNode } from 'vue';

/**
 * Text.
 */

const Text = tsx.component({
  props: {
    text: {
      type: Object as PropType<SlateText>
    },
    isLast: Boolean,
    parent: {
      type: Object as PropType<Element>
    },
    decorations: {
      type: Array as PropType<Array<Range>>
    },
  },
  components: {
    leaf
  },
  inject: ['decorate', 'placeholder'],
  provide(): object {
    return {
      'text': this.text,
      'isLast': this.isLast,
      'parent': this.parent
    }
  },
  data(): Pick<providedByEditable, 'placeholder' | 'decorate'> & UseRef {
    return {
      ref: null
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
  render(h, ctx): VNode {
    const { text, placeholder } = this
    let decorations: Array<any> = this.decorations;
    if(!decorations) {
      const editor = this.$editor
      const p = VueEditor.findPath(editor, text)
      if(this.decorate) {
        decorations = this.decorate([text, p])
      }

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
      <span data-slate-node="text" ref={this.ref!.id}>
        {children}
      </span>
    )
  }
})

export default Text

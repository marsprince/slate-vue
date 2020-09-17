/**
 * interface Element {
 *  children: Node[]
 * }
 */
import * as tsx from "vue-tsx-support"
import { Editor, Node } from 'slate'
// @ts-ignore
import getDirection from 'direction'

import Text from './text'
import Children from './children'
import { elementWatcherPlugin, useEffect, useRef, ReadOnlyMixin, VueEditor } from '../plugins';
import { NODE_TO_PARENT, NODE_TO_INDEX, KEY_TO_ELEMENT, NODE_TO_ELEMENT, ELEMENT_TO_NODE } from '../utils/weak-maps';
import { RenderElementProps } from '../types';

/**
 * Element.
 */

export const Element = tsx.component({
  props: {
    element: Object
  },
  inject: ['renderElement'],
  components:{
    Children
  },
  mixins: [ReadOnlyMixin],
  mounted() {
    elementWatcherPlugin(this, 'element')
  },
  hooks() {
    const ref = (this as any).ref = useRef(null);
    const element = this.element
    const key = VueEditor.findKey((this as any).$editor, element)

    useEffect(()=>{
      if (ref.current) {
        KEY_TO_ELEMENT.set(key, ref.current)
        NODE_TO_ELEMENT.set(element, ref.current)
        ELEMENT_TO_NODE.set(ref.current, element)
      } else {
        KEY_TO_ELEMENT.delete(key)
        NODE_TO_ELEMENT.delete(element)
      }
    })
  },
  render(h) {
    // call renderElement with children, attribute and element
    const {element, renderElement = DefaultElement, ref} = this as any;
    const editor = (this as any).$editor
    const isInline = editor.isInline(element)
    let children: JSX.Element | null = (
      <Children
        node={element}
      />
    )
    const attributes: {
      'data-slate-node': 'element'
      'data-slate-void'?: true
      'data-slate-inline'?: true
      contentEditable?: false
      dir?: 'rtl'
    } = {
      'data-slate-node': 'element'
    };
    if (isInline) {
      attributes['data-slate-inline'] = true
    }

    // If it's a block node with inline children, add the proper `dir` attribute
    // for text direction.
    if (!isInline && Editor.hasInlines(editor, element)) {
      const text = Node.string(element)
      const dir = getDirection(text)

      if (dir === 'rtl') {
        attributes.dir = dir
      }
    }

    // If it's a void node, wrap the children in extra void-specific elements.
    if (Editor.isVoid(editor, element)) {
      attributes['data-slate-void'] = true

      if (!(this as any).readOnly && isInline) {
        attributes.contentEditable = false
      }

      const Tag = isInline ? 'span' : 'div'
      const [[text]] = Node.texts(element)

      children = (this as any).readOnly ? null : (
        <Tag
          data-slate-spacer
          style={{
            height: '0',
            color: 'transparent',
            outline: 'none',
            position: 'absolute',
          }}
        >
          <Text decorations={[]} isLast={false} parent={element} text={text} />
        </Tag>
      )

      NODE_TO_INDEX.set(text, 0)
      NODE_TO_PARENT.set(text, element)
    }

    return h(renderElement({
      element,
      attributes,
      children
    }), {ref: ref.id})
  }
})

/**
 * The default element renderer.
 */

export const DefaultElement = (props: RenderElementProps) => {
  return tsx.component({
    render() {
      const { attributes, children, element } = props
      const editor = (this as any).$editor
      const Tag = editor.isInline(element) ? 'span' : 'div'
      return (
        <Tag {...{attrs: attributes}} style={{ position: 'relative' }}>
          {children}
        </Tag>
      )
    }
  })
}

export default Element

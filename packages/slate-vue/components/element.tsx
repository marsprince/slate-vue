/**
 * interface Element {
 *  children: Node[]
 * }
 */
import * as tsx from "vue-tsx-support"
import { Editor, Node, Range, NodeEntry, Element as SlateElement } from 'slate'

import Text from './text'
import Children from './children'

/**
 * Element.
 */

export const Element = tsx.component({
  props: {
    element: Object
  },
  provide: ['renderElement'],
  components:{
    Children
  },
  render(h) {
    // call renderElement with children, attribute and element
    const {element, renderElement = DefaultElement} = this;
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
      ref?: any
    } = {
      'data-slate-node': 'element',
    };
    return h(renderElement({
      element,
      attributes,
      children
    }))
  }
})

/**
 * The default element renderer.
 */

export const DefaultElement = (props) => {
  return tsx.component({
    render() {
      const { attributes, children, element } = props
      const editor = this.$editor
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

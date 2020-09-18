import * as tsx from 'vue-tsx-support'

import string from './string'
import { PLACEHOLDER_SYMBOL } from '../utils/weak-maps'
import { RenderLeafProps } from '../types'
import {fragment} from './fragment';

/**
 * Individual leaves in a text node with unique formatting.
 */

const Leaf = tsx.component({
  props: {
    text: Object,
    leaf: Object
  },
  inject: ['renderLeaf'],
  components: {
    string,
    fragment
  },
  render(h) {
    const { renderLeaf = DefaultLeaf, text, leaf} = this as any;
    let children =  (
      <string text={text} editor={(this as any).$editor} leaf={leaf}/>
      );
    if (leaf[PLACEHOLDER_SYMBOL]) {
      children = (
        <fragment>
          <span
            contenteditable={false}
            style={{
              pointerEvents: 'none',
              display: 'inline-block',
              verticalAlign: 'text-top',
              width: '0',
              maxWidth: '100%',
              whiteSpace: 'nowrap',
              opacity: '0.333',
            }}
          >
            {leaf.placeholder}
          </span>
          {children}
        </fragment>
      )
    }

    const attributes: {
     'data-slate-leaf': true
    } = {
     'data-slate-leaf': true,
    };
    const renderChildren = renderLeaf({
      children,
      attributes,
      leaf,
      text
    })
    return h(renderChildren)
  }
});

/**
 * The default custom leaf renderer.
 */

const DefaultLeaf = (props: RenderLeafProps) => {
  return tsx.component({
    render() {
      const { attributes, children } = props
      return <span {...{attrs: attributes}}>{children}</span>
    }
  })
}

export default Leaf

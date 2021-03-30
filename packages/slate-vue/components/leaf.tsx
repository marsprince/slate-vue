import * as tsx from 'vue-tsx-support'

import string from './string'
import { PLACEHOLDER_SYMBOL } from 'slate-vue-shared'
import { providedByEditable } from '../types';
import { RenderLeafProps } from 'slate-vue-shared'
import {fragment} from './fragment';
import { VNode, VueConstructor, PropType } from 'vue';
import { Text } from 'slate';

/**
 * Individual leaves in a text node with unique formatting.
 */

const Leaf = tsx.component({
  props: {
    text: {
      type: Object as PropType<Text>
    },
    leaf:  {
      type: Object as PropType<Text>
    },
  },
  inject: ['renderLeaf'],
  components: {
    string,
    fragment
  },
  // For types
  data(): Pick<providedByEditable, 'renderLeaf'> {
    return {}
  },
  render(h): VNode {
    const { renderLeaf = DefaultLeaf, text, leaf} = this;
    let children =  (
      <string text={text} editor={this.$editor} leaf={leaf}/>
      );
    if ((leaf as any)[PLACEHOLDER_SYMBOL]) {
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
            {(leaf as any).placeholder}
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

const DefaultLeaf = (props: RenderLeafProps): VueConstructor => {
  return tsx.component({
    render() {
      const { attributes, children } = props
      return <span {...{attrs: attributes}}>{children}</span>
    }
  })
}

export default Leaf

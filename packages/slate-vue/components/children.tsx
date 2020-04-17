// functional children component to render node
// node is an union type: editor, element,text
import * as tsx from "vue-tsx-support";
import { Editor, Range, Element, NodeEntry, Ancestor, Descendant } from 'slate'
import TextComponent from './text'
import {ReactEditor} from '../index';
import { NODE_TO_INDEX, NODE_TO_PARENT } from '../utils/weak-maps';
import Fragment from './fragment'

/**
 * Children.
 */

const Children = tsx.component({
  props: {
    node: Object,
    decorate: Function,
    decorations: Array
  },
  components: {
    TextComponent,
    Fragment
  },
  render() {
    const editor: any = this.$editor;
    const {node, decorate,decorations} = this
    const isLeafBlock =
      Element.isElement(node) &&
      !editor.isInline(node) &&
      Editor.hasInlines(editor, node)
    const children = []
    const path = ReactEditor.findPath(editor, node)
    for(let i=0;i<editor.children.length;i++) {
      // const p = path.concat(i)
      const n = node.children[i] as Descendant
      // const ds = decorate([n, p])
      // const range = Editor.range(editor, p)
      children.push(
        <TextComponent
          isLast={isLeafBlock && i === node.children.length - 1}
          parent={node}
          text={n}
        />
      )
      // set n and its index in children
      NODE_TO_INDEX.set(n, i)
      // set n and its parent
      NODE_TO_PARENT.set(n, node)
    }
    return <Fragment>{children}</Fragment>;
  }
});

export default Children

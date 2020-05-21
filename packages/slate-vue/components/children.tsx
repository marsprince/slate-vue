// functional children component to render node
// node is an union type: editor, element,text
import * as tsx from "vue-tsx-support";
import { Editor, Range, Element, NodeEntry, Ancestor, Descendant, Operation } from 'slate';
import TextComponent from './text'
import ElementComponent from './element'
import {VueEditor} from '../index';
import { NODE_TO_INDEX, NODE_TO_PARENT } from '../utils/weak-maps';

/**
 * Children.
 */

const Children = tsx.component({
  props: {
    node: Object,
    decorations: Array
  },
  components: {
    TextComponent,
    ElementComponent
  },
  inject: ['decorate'],
  render() {
    const editor: any = this.$editor;
    const {node, decorations} = this;
    const path = VueEditor.findPath(editor, node)
    const isLeafBlock =
      Element.isElement(node) &&
      !editor.isInline(node) &&
      Editor.hasInlines(editor, node)
    const children = []
    const childArr = Editor.isEditor(node) ? node._state.$$data :node.children
    for(let i=0;i<childArr.length;i++) {
      const n = childArr[i] as Descendant;
      const p = path.concat(i);
      const ds = this.decorate([n, p]);
      const range = Editor.range(editor, p)
      for (const dec of decorations) {
        const d = Range.intersection(dec, range)

        if (d) {
          ds.push(d)
        }
      }
      if(Element.isElement(n)) {
        children.push(
          <ElementComponent
            element={n}
            decorations={ds}
          />)
      } else {
        children.push(
          <TextComponent
            isLast={isLeafBlock && i === childArr.length - 1}
            parent={node}
            text={n}
            decorations={ds}
          />
        )
      }
      // set n and its index in children
      NODE_TO_INDEX.set(n, i)
      // set n and its parent
      NODE_TO_PARENT.set(n, node)
    }
    return <fragment>{children}</fragment>;
  }
});

export default Children

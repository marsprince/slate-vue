// functional children component to render node
// node is an union type: editor, element,text
import * as tsx from "vue-tsx-support";
import { Editor, Range, Element, NodeEntry, Ancestor, Descendant, Operation, Path } from 'slate';
import TextComponent from './text'
import ElementComponent from './element'
import { gvm, SlateMixin, VueEditor } from '../index';
import { KEY_TO_VNODE, NODE_TO_INDEX, NODE_TO_KEY, NODE_TO_PARENT } from '../utils/weak-maps';
import {elementWatcherPlugin} from '../plugins/slate-plugin';

/**
 * Children.
 */

const Children = tsx.component({
  props: {
    node: Object,
    decorations: Array,
    selection: Object
  },
  components: {
    TextComponent,
    ElementComponent
  },
  inject: ['decorate'],
  mixins: [SlateMixin],
  mounted() {
    elementWatcherPlugin(this, 'children')
  },
  render() {
    const editor: any = this.$editor;
    const {node, decorations, selection} = this;
    const path = VueEditor.findPath(editor, node)
    const isLeafBlock =
      Element.isElement(node) &&
      !editor.isInline(node) &&
      Editor.hasInlines(editor, node)
    const children = []
    const childArr = Editor.isEditor(node) ? node._state :node.children
    // cacheVnode in manual to reuse
    let cacheVnode = null;
    for(let i=0;i<childArr.length;i++) {
      const n = childArr[i] as Descendant;
      const key = VueEditor.findKey(editor, n)
      const p = path.concat(i);
      const ds = this.decorate([n, p]);
      const range = Editor.range(editor, p)
      const sel = selection && Range.intersection(range, selection)
      for (const dec of decorations) {
        const d = Range.intersection(dec, range)

        if (d) {
          ds.push(d)
        }
      }
      // set n and its index in children
      NODE_TO_INDEX.set(n, i)
      // set n and its parent
      NODE_TO_PARENT.set(n, node)
      // when modify vnode, only new vnode or spliting vnode must be update, others will be reuse
      if(editor._operation) {
        const operationPath = editor._operation.path
        // split_node
        if(editor._operation.type === 'split_node') {
          // only sibling
          if(Path.isSibling(p, operationPath)) {
            if(!Path.equals(p, operationPath) && !Path.equals(p, Path.next(operationPath))) {
              cacheVnode = KEY_TO_VNODE.get(key)
              children.push(cacheVnode)
              continue;
            }
          }
        }
        // merge_node
        if(editor._operation.type === 'merge_node') {
          const parentPath = Path.parent(operationPath)
          if(Path.isSibling(p, parentPath)) {
            if(!Path.isParent(p, operationPath)) {
              cacheVnode = KEY_TO_VNODE.get(key)
              children.push(cacheVnode)
              continue;
            }
          }
        }
        // remove_node
        if(editor._operation.type === 'remove_node') {
          if(Path.isSibling(p, operationPath)) {
            if(!Path.equals(p, operationPath)) {
              cacheVnode = KEY_TO_VNODE.get(key)
              children.push(cacheVnode)
              continue;
            }
          }
        }
      }
      if(Element.isElement(n)) {
        // set selected, nexttick is ugly, and will be corrected if I have enough time
        this.$nextTick(()=>{
          gvm.$set(gvm.selected, key.id, !!sel)
        })
        cacheVnode =
          <ElementComponent
            element={n}
            decorations={ds}
            key={key.id}
          />
        children.push(cacheVnode)
      } else {
        cacheVnode = <TextComponent
          isLast={isLeafBlock && i === childArr.length - 1}
          parent={node}
          text={n}
          decorations={ds}
          key={key.id}
        />
        children.push(cacheVnode)
      }
      // set key and vnode
      KEY_TO_VNODE.set(key, cacheVnode)
    }
    return <fragment>{children}</fragment>;
  }
});

export default Children

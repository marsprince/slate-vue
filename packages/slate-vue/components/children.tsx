// functional children component to render node
// node is an union type: editor, element,text
import * as tsx from "vue-tsx-support";
import { Editor, Range, Element, NodeEntry, Ancestor, Descendant, Operation, Path, Node } from 'slate';
import TextComponent from './text'
import {Element as ElementComponent} from './element'
import { VueEditor, elementWatcherPlugin, SlateMixin } from '../plugins';
import { KEY_TO_VNODE, NODE_TO_INDEX, NODE_TO_KEY, NODE_TO_PARENT } from 'slate-vue-shared';
import {fragment} from './fragment';
import { PropType } from 'vue';

/**
 * Children.
 */

export const Children: any = tsx.component({
  props: {
    // only element or editor
    node: {
      type: Object as PropType<Ancestor>
    }
  },
  components: {
    TextComponent,
    ElementComponent,
    fragment
  },
  mixins: [SlateMixin],
  mounted() {
    elementWatcherPlugin(this, 'children')
  },
  render() {
    const editor = this.$editor;
    const {node} = this;
    const path = VueEditor.findPath(editor, node)
    const isLeafBlock =
      Element.isElement(node) &&
      !editor.isInline(node) &&
      Editor.hasInlines(editor, node)
    const children = []
    const childArr: any = Editor.isEditor(node) ? (node as VueEditor)._state : (node as Element).children
    // cacheVnode in manual to reuse
    let cacheVnode = null;
    for(let i=0;i<childArr.length;i++) {
      const n = childArr[i] as Descendant;
      const key = VueEditor.findKey(editor, n)
      const p = path.concat(i);
      const range = Editor.range(editor, p)
      // set n and its index in children
      NODE_TO_INDEX.set(n, i)
      // set n and its parent
      NODE_TO_PARENT.set(n, node)
      // when modify vnode, only new vnode or spliting vnode must be update, others will be reuse
      // #62, #63: sometimes(like paste) no cacheVnode but have key, avoid getting in
      if(editor._operation && KEY_TO_VNODE.get(key)) {
        const operationPath = (editor._operation as any).path as Path
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
        // set selected
        cacheVnode =
          <ElementComponent
            element={n}
            key={key.id}
          />
        children.push(cacheVnode)
      } else {
        cacheVnode = <TextComponent
          isLast={isLeafBlock && i === childArr.length - 1}
          parent={node}
          text={n}
          key={key.id}
        />
        children.push(cacheVnode)
      }
      // set key and vnode
      KEY_TO_VNODE.set(key, cacheVnode as any)
    }
    return <fragment>{children}</fragment>;
  }
});

// export default Children

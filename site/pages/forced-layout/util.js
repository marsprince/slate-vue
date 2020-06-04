import {Transforms} from 'slate-vue';
import {Node} from 'slate';

export const withLayout = editor => {
  const { normalizeNode } = editor

  editor.normalizeNode = ([node, path]) => {
    if (path.length === 0) {
      if (editor.children.length < 1) {
        const title = { type: 'title', children: [{ text: 'Untitled' }] }
        Transforms.insertNodes(editor, title, { at: path.concat(0) })
      }

      if (editor.children.length < 2) {
        const paragraph = { type: 'paragraph', children: [{ text: '' }] }
        Transforms.insertNodes(editor, paragraph, { at: path.concat(1) })
      }

      for (const [child, childPath] of Node.children(editor, path)) {
        const type = childPath[0] === 0 ? 'title' : 'paragraph'

        if (child.type !== type) {
          Transforms.setNodes(editor, { type }, { at: childPath })
        }
      }
    }

    return normalizeNode([node, path])
  }

  return editor
}

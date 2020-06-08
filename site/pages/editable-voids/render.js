import {Transforms} from 'slate-vue';
import EditableVoidElement from './editableVoidElement'

const insertEditableVoid = editor => {
  const text = { text: '' }
  const voidNode = { type: 'editable-void', children: [text] }
  Transforms.insertNodes(editor, voidNode)
}

export const withEditableVoids = editor => {
  const { isVoid } = editor

  editor.isVoid = element => {
    return element.type === 'editable-void' ? true : isVoid(element)
  }

  return editor
}

export const renderElement = ({ attributes, children, element }) => {
  return {
    components: {
      EditableVoidElement
    },
    render() {
      switch (element.type) {
        case 'editable-void':
          return <EditableVoidElement {...{attrs: attributes}} element={element}>{children}</EditableVoidElement>
        default:
          return <p {...{attrs: attributes}}>{children}</p>
      }
    }
  }
}

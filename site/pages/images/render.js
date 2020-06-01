import ImageElement from './imageElement'
import {Transforms} from 'slate';
import {gvm} from 'slate-vue';

export const renderElement = ({ attributes, children, element }) => {
  return {
    components: {
      ImageElement
    },
    render() {
      switch (element.type) {
        case 'image':
          return <ImageElement element={element} {...{attrs: attributes}}>{children}</ImageElement>
        default:
          return <p {...{attrs: attributes}}>{children}</p>
      }
    }
  }
}

export const insertImage = (editor, url) => {
  const text = { text: '' }
  const image = { type: 'image', url, children: [text] }
  Transforms.insertNodes(editor, image)
}

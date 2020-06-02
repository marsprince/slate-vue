import { FocusedMixin, SelectedMixin } from 'slate-vue';
import MentionElement from './mentions'

export const renderElement = ({ attributes, children, element }) => {
  return {
    components: {
      MentionElement
    },
    render() {
      switch (element.type) {
        case 'mention':
          return (
            <MentionElement {...{attrs: attributes}} element={element}>{children}</MentionElement>
          )
        default:
          return <p {...{attrs: attributes}}>{children}</p>
      }
    }
  }
}

import CheckListItemElement from './checkListItem'

export const renderElement = props => {
  return {
    components: {
      CheckListItemElement
    },
    render() {
      const { attributes, children, element } = props

      switch (element.type) {
        case 'check-list-item':
          return <CheckListItemElement {...{attrs: attributes}} element={element}>{children}</CheckListItemElement>
        default:
          return <p {...{attrs: attributes}}>{children}</p>
      }
    }
  }
}

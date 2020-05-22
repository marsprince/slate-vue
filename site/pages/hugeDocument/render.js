export const renderElement = ({ attributes, children, element }) => {
  return {
    render() {
      switch (element.type) {
        case 'heading':
          return <h1 {...{attrs: attributes}}>{children}</h1>
        default:
          return <p {...{attrs: attributes}}>{children}</p>
      }
    }
  }
}

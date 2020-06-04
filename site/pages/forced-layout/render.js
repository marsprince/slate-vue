export const renderElement = ({ attributes, children, element }) => {
  return {
    render() {
      switch (element.type) {
        case 'title':
          return <h2 {...{attrs: attributes}}>{children}</h2>
        case 'paragraph':
          return <p {...{attrs: attributes}}>{children}</p>
      }
    }
  }
}

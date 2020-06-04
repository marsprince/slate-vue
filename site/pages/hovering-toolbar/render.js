export const renderLeaf = ({ attributes, children, leaf }) => {
  return {
    render() {
      if (leaf.bold) {
        children = <strong>{children}</strong>
      }

      if (leaf.italic) {
        children = <em>{children}</em>
      }

      if (leaf.underlined) {
        children = <u>{children}</u>
      }

      return <span {...{attrs: attributes}}>{children}</span>
    }
  }
}

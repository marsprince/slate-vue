export const renderLeaf = ({ attributes, children, leaf }) => {
  return {
    render() {
      if (leaf.bold) {
        children = <strong>{children}</strong>
      }

      if (leaf.code) {
        children = <code>{children}</code>
      }

      if (leaf.italic) {
        children = <em>{children}</em>
      }

      if (leaf.underline) {
        children = <u>{children}</u>
      }

      return <span {...{attrs: attributes}}>{children}</span>
    }
  }
}

export const renderElement = ({ attributes, children, element }) => {
  return {
    render() {
      switch (element.type) {
        case 'block-quote':
          return <blockquote {...{attrs: attributes}}>{children}</blockquote>
        case 'bulleted-list':
          return <ul {...{attrs: attributes}}>{children}</ul>
        case 'heading-one':
          return <h1 {...{attrs: attributes}}>{children}</h1>
        case 'heading-two':
          return <h2 {...{attrs: attributes}}>{children}</h2>
        case 'list-item':
          return <li {...{attrs: attributes}}>{children}</li>
        case 'numbered-list':
          return <ol {...{attrs: attributes}}>{children}</ol>
        default:
          return <p {...{attrs: attributes}}>{children}</p>
      }
    }
  }
}

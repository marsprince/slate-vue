import { Transforms, Editor, Range } from 'slate';

export const renderElement = ({ attributes, children, element }) => {
  return {
    render() {
      switch (element.type) {
        case 'link':
          return (
            <a {...{attrs: attributes}} href={element.url}>
              {children}
            </a>
          )
        default:
          return <p {...{attrs: attributes}}>{children}</p>
      }
    }
  }
}

export const isLinkActive = editor => {
  const [link] = Editor.nodes(editor, { match: n => n.type === 'link' })
  return !!link
}
export const wrapLink = (editor, url) => {
  if (isLinkActive(editor)) {
    unwrapLink(editor)
  }

  const { selection } = editor
  const isCollapsed = selection && Range.isCollapsed(selection)
  const link = {
    type: 'link',
    url,
    children: isCollapsed ? [{ text: url }] : [],
  }

  if (isCollapsed) {
    Transforms.insertNodes(editor, link)
  } else {
    Transforms.wrapNodes(editor, link, { split: true })
    Transforms.collapse(editor, { edge: 'end' })
  }
}
export const unwrapLink = editor => {
  Transforms.unwrapNodes(editor, { match: n => n.type === 'link' })
}

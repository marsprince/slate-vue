import {Transforms} from 'slate-vue';
import ImageElement from '../images/imageElement';
import {jsx} from 'slate-hyperscript'

const ELEMENT_TAGS = {
  A: el => ({ type: 'link', url: el.getAttribute('href') }),
  BLOCKQUOTE: () => ({ type: 'quote' }),
  H1: () => ({ type: 'heading-one' }),
  H2: () => ({ type: 'heading-two' }),
  H3: () => ({ type: 'heading-three' }),
  H4: () => ({ type: 'heading-four' }),
  H5: () => ({ type: 'heading-five' }),
  H6: () => ({ type: 'heading-six' }),
  IMG: el => ({ type: 'image', url: el.getAttribute('src') }),
  LI: () => ({ type: 'list-item' }),
  OL: () => ({ type: 'numbered-list' }),
  P: () => ({ type: 'paragraph' }),
  PRE: () => ({ type: 'code' }),
  UL: () => ({ type: 'bulleted-list' }),
}

// COMPAT: `B` is omitted here because Google Docs uses `<b>` in weird ways.
const TEXT_TAGS = {
  CODE: () => ({ code: true }),
  DEL: () => ({ strikethrough: true }),
  EM: () => ({ italic: true }),
  I: () => ({ italic: true }),
  S: () => ({ strikethrough: true }),
  STRONG: () => ({ bold: true }),
  U: () => ({ underline: true }),
}

export const deserialize = el => {
  if (el.nodeType === 3) {
    return el.textContent
  } else if (el.nodeType !== 1) {
    return null
  } else if (el.nodeName === 'BR') {
    return '\n'
  }

  const { nodeName } = el
  let parent = el

  if (
    nodeName === 'PRE' &&
    el.childNodes[0] &&
    el.childNodes[0].nodeName === 'CODE'
  ) {
    parent = el.childNodes[0]
  }
  const children = Array.from(parent.childNodes)
  .map(deserialize)
  .flat()

  if (el.nodeName === 'BODY') {
    return jsx('fragment', {}, children)
  }

  if (ELEMENT_TAGS[nodeName]) {
    const attrs = ELEMENT_TAGS[nodeName](el)
    return jsx('element', attrs, children)
  }

  if (TEXT_TAGS[nodeName]) {
    const attrs = TEXT_TAGS[nodeName](el)
    return children.map(child => jsx('text', attrs, child))
  }

  return children
}

export const withHtml = editor => {
  const { insertData, isInline, isVoid } = editor

  editor.isInline = element => {
    return element.type === 'link' ? true : isInline(element)
  }

  editor.isVoid = element => {
    return element.type === 'image' ? true : isVoid(element)
  }

  editor.insertData = data => {
    const html = data.getData('text/html')

    if (html) {
      const parsed = new DOMParser().parseFromString(html, 'text/html')
      const fragment = deserialize(parsed.body)
      Transforms.insertFragment(editor, fragment)
      return
    }

    insertData(data)
  }

  return editor
}

export const renderElement = ({ attributes, children, element }) => {
  return {
    components: {
      ImageElement
    },
    render() {
      switch (element.type) {
        default:
          return <p {...{attrs: attributes}}>{children}</p>
        case 'quote':
          return <blockquote {...{attrs: attributes}}>{children}</blockquote>
        case 'code':
          return (
            <pre><code {...{attrs: attributes}}>{children}</code></pre>
          )
        case 'bulleted-list':
          return <ul {...{attrs: attributes}}>{children}</ul>
        case 'heading-one':
          return <h1 {...{attrs: attributes}}>{children}</h1>
        case 'heading-two':
          return <h2 {...{attrs: attributes}}>{children}</h2>
        case 'heading-three':
          return <h3 {...{attrs: attributes}}>{children}</h3>
        case 'heading-four':
          return <h4 {...{attrs: attributes}}>{children}</h4>
        case 'heading-five':
          return <h5 {...{attrs: attributes}}>{children}</h5>
        case 'heading-six':
          return <h6 {...{attrs: attributes}}>{children}</h6>
        case 'list-item':
          return <li {...{attrs: attributes}}>{children}</li>
        case 'numbered-list':
          return <ol {...{attrs: attributes}}>{children}</ol>
        case 'link':
          return (
            <a href={element.url} {...{attrs: attributes}}>
              {children}
            </a>
          )
        case 'image':
          return <ImageElement {...{attrs: attributes}} element={element}>{children}</ImageElement>
      }
    }
  }
}

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

      if (leaf.underlined) {
        children = <u>{children}</u>
      }

      if (leaf.strikethrough) {
        children = <del>{children}</del>
      }

      return <span {...{attrs: attributes}}>{children}</span>
    }
  }
}

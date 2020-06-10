import {Point, Editor, Range} from 'slate';

export const renderLeaf = ({ attributes, children, leaf }) => {
  return {
    render() {
      if (leaf.bold) {
        children = <strong>{children}</strong>
      }

      return <span {...{attrs: attributes}}>{children}</span>
    }
  }
}

export const renderElement = ({ attributes, children, element }) => {
  return {
    render() {
      switch (element.type) {
        case 'table':
          return (
            <table>
              <tbody {...{attrs: attributes}}>{children}</tbody>
            </table>
          )
        case 'table-row':
          return <tr {...{attrs: attributes}}>{children}</tr>
        case 'table-cell':
          return <td {...{attrs: attributes}}>{children}</td>
        default:
          return <p {...{attrs: attributes}}>{children}</p>
      }
    }
  }
}

export const withTables = editor => {
  const { deleteBackward, deleteForward, insertBreak } = editor

  editor.deleteBackward = unit => {
    const { selection } = editor

    if (selection && Range.isCollapsed(selection)) {
      const [cell] = Editor.nodes(editor, {
        match: n => n.type === 'table-cell',
      })

      if (cell) {
        const [, cellPath] = cell
        const start = Editor.start(editor, cellPath)

        if (Point.equals(selection.anchor, start)) {
          return
        }
      }
    }

    deleteBackward(unit)
  }

  editor.deleteForward = unit => {
    const { selection } = editor

    if (selection && Range.isCollapsed(selection)) {
      const [cell] = Editor.nodes(editor, {
        match: n => n.type === 'table-cell',
      })

      if (cell) {
        const [, cellPath] = cell
        const end = Editor.end(editor, cellPath)

        if (Point.equals(selection.anchor, end)) {
          return
        }
      }
    }

    deleteForward(unit)
  }

  editor.insertBreak = () => {
    const { selection } = editor

    if (selection) {
      const [table] = Editor.nodes(editor, { match: n => n.type === 'table' })

      if (table) {
        return
      }
    }

    insertBreak()
  }

  return editor
}

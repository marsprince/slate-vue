import { Editor, Operation, Node, Path, Text, Descendant, NodeEntry, Transforms as SlateTransforms, Location } from 'slate';
import { NODE_TO_KEY } from 'slate-vue-shared';
import Vue from 'vue'

export const getChildren = (node: Node): any => {
  return Editor.isEditor(node) ? (node as any)._state: (node as any).children
}

export const clone = (node: any): any => {
  return JSON.parse(JSON.stringify(node))
}

// a minimum version of Editor.transform for runtime
export const transform = function(editor: Editor, op: Operation) {
  switch (op.type) {
    case 'insert_node': {
      const { path, node } = op
      const parent = Node.parent(editor, path)
      const index = path[path.length - 1]
      getChildren(parent).splice(index, 0, clone(node))

      break
    }

    case 'insert_text': {
      const { path, offset, text } = op
      const node = Node.leaf(editor, path)
      const before = node.text.slice(0, offset)
      const after = node.text.slice(offset)
      node.text = before + text + after

      break
    }

    case 'merge_node': {
      const { path } = op
      const node = Node.get(editor, path)
      const prevPath = Path.previous(path)
      const prev = Node.get(editor, prevPath)
      const parent = Node.parent(editor, path)
      const index = path[path.length - 1]

      if (Text.isText(node) && Text.isText(prev)) {
        prev.text += node.text
      } else if (!Text.isText(node) && !Text.isText(prev)) {
        getChildren(prev).push(...getChildren(node))
      } else {
        throw new Error(
          `Cannot apply a "merge_node" operation at path [${path}] to nodes of different interaces: ${node} ${prev}`
        )
      }

      getChildren(parent).splice(index, 1)

      break
    }

    case 'move_node': {
      const { path, newPath } = op

      if (Path.isAncestor(path, newPath)) {
        throw new Error(
          `Cannot move a path [${path}] to new path [${newPath}] because the destination is inside itself.`
        )
      }

      const node = Node.get(editor, path)
      const parent = Node.parent(editor, path)
      const index = path[path.length - 1]

      // This is tricky, but since the `path` and `newPath` both refer to
      // the same snapshot in time, there's a mismatch. After either
      // removing the original position, the second step's path can be out
      // of date. So instead of using the `op.newPath` directly, we
      // transform `op.path` to ascertain what the `newPath` would be after
      // the operation was applied.
      getChildren(parent).splice(index, 1)
      const truePath = Path.transform(path, op)!
      const newParent = Node.get(editor, Path.parent(truePath))
      const newIndex = truePath[truePath.length - 1]

      getChildren(newParent).splice(newIndex, 0, node)

      break
    }

    case 'remove_node': {
      const { path } = op
      NODE_TO_KEY.delete(Node.get(editor, path))
      const index = path[path.length - 1]
      const parent = Node.parent(editor, path)
      getChildren(parent).splice(index, 1)

      break
    }

    case 'remove_text': {
      const { path, offset, text } = op
      const node = Node.leaf(editor, path)
      const before = node.text.slice(0, offset)
      const after = node.text.slice(offset + text.length)
      node.text = before + after

      break
    }

    case 'set_node': {
      const { path, newProperties } = op

      if (path.length === 0) {
        throw new Error(`Cannot set properties on the root node!`)
      }

      const node = Node.get(editor, path)

      for (const key in newProperties) {
        if (key === 'children' || key === 'text') {
          throw new Error(`Cannot set the "${key}" property of nodes!`)
        }

        const value = (newProperties as any)[key]

        if (value == null) {
          Vue.delete(node, key)
        } else {
          Vue.set(node, key, value)
        }
      }

      break
    }

    case 'set_selection': {
      break
    }

    case 'split_node': {
      const { path, position, properties } = op

      if (path.length === 0) {
        throw new Error(
          `Cannot apply a "split_node" operation at path [${path}] because the root node cannot be split.`
        )
      }

      const node = Node.get(editor, path)
      const parent = Node.parent(editor, path)
      const index = path[path.length - 1]
      let newNode: Descendant

      if (Text.isText(node)) {
        const before = node.text.slice(0, position)
        const after = node.text.slice(position)
        node.text = before
        newNode = {
          ...node,
          ...(properties as Partial<Text>),
          text: after,
        }
      } else {
        const before = node.children.slice(0, position)
        const after = node.children.slice(position)
        node.children = before

        newNode = {
          ...node,
          ...(properties as Partial<Element>),
          children: after,
        }
      }

      getChildren(parent).splice(index + 1, 0, newNode)

      break
    }
  }
}

// a minimum version of Node for runtime
export const runtimeNode = {
  child(root: Node, index: number): Descendant  {
    if (Text.isText(root)) {
      throw new Error(
        `Cannot get the child of a text node: ${JSON.stringify(root)}`
      )
    }

    const c = getChildren(root)[index] as Descendant

    if (c == null) {
      throw new Error(
        `Cannot get child at index \`${index}\` in node: ${JSON.stringify(
          root
        )}`
      )
    }

    return c
  },
  has(root: Node, path: Path): boolean {
    let node = root

    for (let i = 0; i < path.length; i++) {
      const p = path[i]
      const children = getChildren(node)
      if (Text.isText(node) || !children[p]) {
        return false
      }

      node = children[p]
    }

    return true
},
  get(root: Node, path: Path): Node {
    let node = root

    for (let i = 0; i < path.length; i++) {
      const p = path[i]
      const children = getChildren(node)

      if (Text.isText(node) || !children[p]) {
        throw new Error(
          `Cannot find a descendant at path [${path}] in node: ${JSON.stringify(
            root
          )}`
        )
      }

      node = children[p]
    }

    return node
  },
  first(root: Node, path: Path): NodeEntry {
    const p = path.slice()
    let n = Node.get(root, p)
    const children = getChildren(n)

    while (n) {
      if (Text.isText(n) || children.length === 0) {
        break
      } else {
        n = children[0]
        p.push(0)
      }
    }

    return [n, p]
  },
  last(root: Node, path: Path): NodeEntry {
    const p = path.slice()
    let n = Node.get(root, p)
    const children = getChildren(n)

    while (n) {
      if (Text.isText(n) || children.length === 0) {
        break
      } else {
        const i = children.length - 1
        n = children[i]
        p.push(i)
      }
    }

    return [n, p]
  },
  *nodes(
    root: Node,
    options: {
      from?: Path
      to?: Path
      reverse?: boolean
      pass?: (entry: NodeEntry) => boolean
    } = {}
  ): Generator<NodeEntry> {
    const { pass, reverse = false } = options
    const { from = [], to } = options
    const visited = new Set()
    let p: Path = []
    let n = root

    while (true) {
      if (to && (reverse ? Path.isBefore(p, to) : Path.isAfter(p, to))) {
        break
      }

      if (!visited.has(n)) {
        yield [n, p]
      }

      // If we're allowed to go downward and we haven't decsended yet, do.
      if (
        !visited.has(n) &&
        !Text.isText(n) &&
        getChildren(n).length !== 0 &&
        (pass == null || pass([n, p]) === false)
      ) {
        visited.add(n)
        let nextIndex = reverse ? getChildren(n).length - 1 : 0

        if (Path.isAncestor(p, from)) {
          nextIndex = from[p.length]
        }

        p = p.concat(nextIndex)
        n = Node.get(root, p)
        continue
      }

      // If we're at the root and we can't go down, we're done.
      if (p.length === 0) {
        break
      }

      // If we're going forward...
      if (!reverse) {
        const newPath = Path.next(p)

        if (Node.has(root, newPath)) {
          p = newPath
          n = Node.get(root, p)
          continue
        }
      }

      // If we're going backward...
      if (reverse && p[p.length - 1] !== 0) {
        const newPath = Path.previous(p)
        p = newPath
        n = Node.get(root, p)
        continue
      }

      // Otherwise we're going upward...
      p = Path.parent(p)
      n = Node.get(root, p)
      visited.add(n)
    }
  }
}

export const isVueObject = (obj: any) => {
  return obj.__ob__
}

// a Transform version for runtime
export const Transforms = (() => {
  const {select} = SlateTransforms
  SlateTransforms.select = (editor: Editor, target: Location) => {
    if(isVueObject(target)) {
      target = clone(target)
    }
    return select(editor, target)
  }
  return SlateTransforms
})()

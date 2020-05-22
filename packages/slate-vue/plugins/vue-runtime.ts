// in vue runtime, we must change same slate original behavior

// same
import { Editor, Node, Path, Text } from 'slate';

const runtime = () => {
  const {get} = Node
  Node.get = (root: Node, path: Path): Node => {
    let node = root

    for (let i = 0; i < path.length; i++) {
      const p = path[i]
      const children = Editor.isEditor(node) ? node._state: node.children

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
  }
  // Text.isText = (value: any): value is Text => {
  //   return typeof value.text === 'string'
  // };
  return () => {
    Node.get = get
  }
}

export const vueRuntimeFunc = (func): any => {
  return (...args) => {
    const restore = runtime()
    const result = func(...args)
    restore()
    return result
  }
}

export const vueRuntime = (func, ...args): any => {
  const restore = runtime()
  const result = func(...args)
  restore()
  return result
}

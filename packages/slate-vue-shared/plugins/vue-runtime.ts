// in vue runtime, we must change same slate original behavior

// same
import { Node } from 'slate';
import {runtimeNode} from './runtime-util';

const runtime = () => {
  const {get, nodes, has, first, child, last} = Node
  Node.child = runtimeNode.child
  Node.has = runtimeNode.has
  Node.get = runtimeNode.get
  Node.first = runtimeNode.first
  Node.last = runtimeNode.last
  Node.nodes = runtimeNode.nodes
  return () => {
    Node.get = get
    Node.nodes = nodes
    Node.has = has
    Node.first = first
    Node.child = child
    Node.last = last
  }
}

export const vueRuntimeFunc = (func: any): any => {
  return (...args: any) => {
    const restore = runtime()
    const result = func(...args)
    restore()
    return result
  }
}

export const vueRuntime = (func: any, ...args: any): any => {
  const restore = runtime()
  const result = func(...args)
  restore()
  return result
}

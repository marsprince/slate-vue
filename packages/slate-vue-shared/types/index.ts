import { Element, Text } from 'slate';

interface o {
  [key: string]: any
}

type Observable<T> = T extends o ? (T & PickObservableObject): T;

interface PickObservableObject {
  __ob__: any
}

export type FlatObservableArray<T> = T extends (infer U)[] ? Observable<U> : T;

export interface RenderLeafProps {
  children: any
  leaf: Text
  text: Text | undefined
  attributes: {
    'data-slate-leaf': true
  }
}

export interface RenderElementAttributes {
  'data-slate-node': 'element'
  'data-slate-void'?: true
  'data-slate-inline'?: true
  contentEditable?: false
  dir?: 'rtl'
}

export interface RenderElementProps {
  children: any
  element: Element
  attributes: RenderElementAttributes
}
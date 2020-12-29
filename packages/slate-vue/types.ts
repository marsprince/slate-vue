import "vue-tsx-support/enable-check"
import Vue, { RenderContext, VueConstructor } from 'vue';
import { VueEditor } from './plugins';
import { Node, Path } from 'Slate';
import {
  RenderLeafProps, RenderElementProps
} from 'slate-vue-shared';

declare module 'vue/types/options' {
  interface ComponentOptions<V extends Vue> {
    hooks?: Function,
    abstract?: Boolean
  }
}

declare module 'vue/types/vue' {
  interface Vue {
    // editor instance
    $editor: VueEditor
  }
}

// vue provide by editable component
export interface providedByEditable {
  readOnly?: boolean
  placeholder?: string | boolean
  renderLeaf?: (props: RenderLeafProps) => VueConstructor
  renderElement?: (props: RenderElementProps) => VueConstructor,
  decorate?: (props: [Node, Path]) => Array<any>
}

// vue provide by text component
export interface providedByText {
  isLast?: boolean
  text?: Node
  parent?: Node
}

export interface UseRef {
  ref: null | {
    current: any,
    id: string
  }
}

type Maybe<T> = T | undefined | null

export type TsxComponent<Props> = (
  args: Partial<RenderContext<Props>> & {
    [k in keyof Props]: Maybe<Props[k]>
  }
) => VueTsxSupport.JSX.Element;

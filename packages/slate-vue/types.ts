import "vue-tsx-support/enable-check"
import Vue from 'vue'
declare module 'vue/types/options' {
  interface ComponentOptions<V extends Vue> {
    hooks?: Function,
    abstract?: Boolean
  }
}

export interface RenderElementProps {
  children: any
  element: Element
  attributes: {
    'data-slate-node': 'element'
    'data-slate-inline'?: true
    'data-slate-void'?: true
    dir?: 'rtl'
    ref: any
  }
}

export interface RenderLeafProps {
  children: any
  leaf: Text
  text: Text
  attributes: {
    'data-slate-leaf': true
  }
}

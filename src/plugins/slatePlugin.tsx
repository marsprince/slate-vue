import { createEditor } from 'slate'

export interface SlatePluginOptions {

}

export const SlatePlugin = {
  install(Vue, options) {
    Vue.prototype.$editor = createEditor()
  }
}

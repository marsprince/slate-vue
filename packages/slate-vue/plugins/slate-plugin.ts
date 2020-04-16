import { createEditor } from 'slate'

export interface SlatePluginOptions {

}

export default {
  install(Vue, options) {
    Vue.prototype.$editor = createEditor()
  }
}

import { createEditor } from 'slate'
import {hooks} from './vue-hooks';
import {withVue} from './with-vue';

export interface SlatePluginOptions {

}

export default {
  install(Vue, options) {
    Vue.prototype.$editor = withVue(createEditor());
    Vue.use(hooks)
  }
}

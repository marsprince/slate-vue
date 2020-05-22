import { createEditor, Operation } from 'slate';
import {hooks} from './vue-hooks';
import {withVue} from './with-vue';
import {fragment} from '../components/fragment';

export interface SlatePluginOptions {

}

export const SlateMixin = {
  mounted() {
    const editor = this.$editor
    editor._state.__ob__.dep.addSub(this._watcher)
  }
}

export const SlatePlugin = {
  install(Vue, options) {
    Vue.prototype.$editor = withVue(createEditor());
    Vue.component('fragment', fragment)
    Vue.use(hooks)
  }
}

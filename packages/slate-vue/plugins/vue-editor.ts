/**
 * a copy of slate-react
 */
import {
  VueEditor
} from 'slate-vue-shared'
import { vueRuntimeFunc } from './vue-runtime';

VueEditor.toDOMRange = vueRuntimeFunc(VueEditor.toDOMRange)

export {
  VueEditor
}

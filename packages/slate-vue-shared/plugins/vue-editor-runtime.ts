/**
 * a copy of slate-react
 */
import {
  VueEditor
} from './vue-editor'
import { vueRuntimeFunc } from './vue-runtime';

VueEditor.toDOMRange = vueRuntimeFunc(VueEditor.toDOMRange)

export {
  VueEditor
}
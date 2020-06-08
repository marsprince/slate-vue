## Start

import
```javascript
import Vue from 'vue'
import { SlatePlugin } from 'slate-vue';
Vue.use(SlatePlugin)
```

use
```javascript
<Slate :value="JSON.stringify(initialValue)">
  <Editable placeholder="Enter some plain text..." :renderElement="renderElement"></Editable>
</Slate>
```

## Usage

Vue's [jsx](https://github.com/vuejs/jsx) and [tsx](https://github.com/wonderful-panda/vue-tsx-support) grammar is recommend, but SFC is also supported.

Most of the usage is same with [slate-react](https://github.com/ianstormtaylor/slate/tree/master/packages/slate-react). Here are same difference:

### get editor instance

```javascript
this.$editor
```

Slate-history is already init in it.

### renderElement, renderLeaf

ReturnType must be any legal type which is equal with the first argument in Vue's createElement, please [see](https://vuejs.org/v2/guide/render-function.html#createElement-Arguments).

### select, focus , readonly

use Vue.mixin
```javascript
import {SelectedMixin, FocusedMixin, ReadOnlyMixin} from 'slate-vue'
```
And you will get selected, focused, readOnly data in your component

### useEffect, useRef

```javascript
import {useEffect, useRef} from 'slate-vue'
```

Same as react hooks. Forked from [vue-hooks](https://github.com/yyx990803/vue-hooks).

### fragment

```javascript
import {fragment} from 'slate-vue'
```

Forked from [vue-fragment](https://github.com/Thunberg087/vue-fragment)

## Problems

### Doesn't change?

If your component is related to the editor(like toolbar), you must add slateMixin for rerender:

```javascript
import {SlateMixin} from 'slate-vue'
```

# Slate-vue

An implement for [slate](https://github.com/ianstormtaylor/slate) supported vue2 and vue3. Most of the slate-react's components can be easily migrated by no code change.

All slate-react's example is supported now.

For principles's question, Please read slate's [docs](https://docs.slatejs.org/) first!

## Install

in npm

```javascript
npm install slate-vue
```

in yarn

```javascript
yarn add slate-vue
```

## Usage

import

```javascript
import Vue from 'vue'
import { SlatePlugin } from 'slate-vue';
Vue.use(SlatePlugin)
```

use

```vue
<template>
  <Slate :value="JSON.stringify(initialValue)">
    <Editable placeholder="Enter some plain text..."></Editable>
  </Slate>
</template>

<script>
import {Slate, Editable} from 'slate-vue'

// this value is for editor
const initialValue = [
{
  children: [
    { text: 'This is editable plain text, just like a <textarea>!' },
  ],
},
]
export default {
name: 'index',
components: {
  Slate,
  Editable
},
data() {
  return {
    initialValue
  }
}
};
</script>
```

See full vue2.x document in [slate-vue](https://github.com/marsprince/slate-vue/tree/master/packages/slate-vue)

## Examples

See all examples in [online example](https://marsprince.github.io/slate-vue).

See all example code in [pages](https://github.com/marsprince/slate-vue/tree/master/site/pages)

## Issues

You can use this [codesandbox template](https://codesandbox.io/s/2984l) to reproduce problems.

## License

[MIT](LICENSE) © marsprince

const babelConfigure = require('@razors/build-babel')
const config = babelConfigure({ lib: 'vue' }, {
  "presets": [
    ["@vue/babel-preset-jsx", {
      "injectH": false
    }]]
})

module.exports = config

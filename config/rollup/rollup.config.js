const rollupConfigure = require('@razors/build-rollup')
const SlaveVue = require('../../packages/slate-vue/package.json')

const babelOptions = {
  presets: [
    ["@vue/babel-preset-jsx", {
        "injectH": false
    }]],
}

export default [
  rollupConfigure(SlaveVue, {
    target: 'es',
    useTypescript: true,
    useVue: true
  }, {
    babel: babelOptions
  }),
  rollupConfigure(SlaveVue, {
    target: 'cjs',
    useTypescript: true,
    useVue: true
  }, {
    babel: babelOptions
  })
]

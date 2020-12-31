const rollupConfigure = require('@razors/build-rollup')
const SlateVue = require('../../packages/slate-vue/package.json')
const SlateVueShared = require('../../packages/slate-vue-shared/package.json')

const babelOptions = {
  presets: [
    ["@vue/babel-preset-jsx", {
        "injectH": false
    }]],
}

export default [
  rollupConfigure(SlateVue, {
    target: 'es',
    useTypescript: true,
    useVue: true
  }, {
    babel: babelOptions
  }),
  rollupConfigure(SlateVue, {
    target: 'cjs',
    useTypescript: true,
    useVue: true
  }, {
    babel: babelOptions
  }),
  rollupConfigure(SlateVueShared, {
    target: 'es',
    useTypescript: true
  }, {
    babel: babelOptions
  }),
  rollupConfigure(SlateVueShared, {
    target: 'cjs',
    useTypescript: true
  }, {
    babel: babelOptions
  })
]

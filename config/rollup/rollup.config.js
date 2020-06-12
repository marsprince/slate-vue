// This is for sdk
import path from "path"
import typescript from "rollup-plugin-typescript2";
import babel from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import SlateVue from '../../packages/slate-vue/package.json'

const packagesPath = path.join(__dirname, '../../packages')

function configure(pkg, target) {
  const {name, dependencies} = pkg
  const rootDir = path.join(packagesPath, name)
  const isCjs = target === 'cjs'
  const isEs = target === 'es'

  let babelPresetOptions = {
    modules: false,
    useBuiltIns: false,
    exclude: [
      '@babel/plugin-transform-regenerator',
      '@babel/transform-async-to-generator',
    ],
  }

  const plugins = [
    typescript({
      exclude: "node_modules/**",
      tsconfig: path.join(__dirname, '../../packages/slate-vue/tsconfig.json'),
    }),
    commonjs(),
    babel({
      babelHelpers: 'bundled',
      extensions: ['.ts', '.tsx'],
      presets: [
        ["@vue/babel-preset-app", babelPresetOptions],
        ["@vue/babel-preset-jsx", {
          "injectH": false
        }]],
    })
  ]
  const input = path.join(rootDir, 'index.ts')
  const external = Object.keys(dependencies).concat(['vue-tsx-support/enable-check', 'vue'])


  if(isCjs) {
    return {
      plugins,
      input,
      external,
      output: {
        file: path.resolve(rootDir, `dist/index.${target}.js`),
        format: target,
        exports: 'named',
        sourcemap: true
      }
    }
  }

  if(isEs) {
    return {
      plugins,
      input,
      external,
      output: {
        file: path.resolve(rootDir, `dist/index.${target}.js`),
        format: target,
        sourcemap: true
      }
    }
  }
}

export default [
  configure(SlateVue, 'es'),
  configure(SlateVue, 'cjs'),
]

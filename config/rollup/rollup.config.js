// This is for sdk
import path from "path"
import typescript from "rollup-plugin-typescript2";
import babel from '@rollup/plugin-babel'
// import commonjs from '@rollup/plugin-commonjs'

export default {
  plugins: [
    typescript({
      exclude: "node_modules/**",
      tsconfig: path.join(__dirname, '../../packages/slate-vue/tsconfig.json'),
    }),
    // commonjs({
    //   namedExports: {
    //     'node_modules/vue-fragment/dist/vue-fragment.min.js': [ 'Plugin' ]
    //   }
    // }),
    babel({
      extensions: ['.ts', '.tsx'],
    })
  ],
  input: path.join(__dirname, '../../packages/slate-vue/index.ts'),
  output: [{
    // dir: path.resolve(__dirname, '../../packages/slate-vue/dist'),
    file: path.resolve(__dirname, '../../packages/slate-vue/dist/index.es.js'),
    format: "es",
    sourcemap: true
  }, {
    // dir: path.resolve(__dirname, '../../packages/slate-vue/dist'),
    file: path.resolve(__dirname, '../../packages/slate-vue/dist/index.cjs.js'),
    format: 'cjs',
    exports: 'named',
    sourcemap: true
  }]
};

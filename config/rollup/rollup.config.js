// This is for sdk
import typescript from "rollup-plugin-typescript2";
import babel from 'rollup-plugin-babel'
import path from "path"

export default {
  plugins: [
    typescript({
      exclude: "node_modules/**",
      tsconfig: path.join(__dirname, '../../packages/slate-vue/tsconfig.json'),
    }),
    babel({
      runtimeHelpers: true,
      extensions: ['.ts', '.tsx'],
    })
  ],
  input: path.join(__dirname, '../../packages/slate-vue/index.ts'),
  output: {
    file: path.resolve(__dirname, '../../packages/slate-vue/dist/index.es.js'),
    format: "es",
    sourcemap: true
  }
};

const merge = require('webpack-merge');
const base = require('./webpack.base.conf');
const path= require('path')

module.exports = merge(base ,{
  mode: 'production',
  entry: path.join(__dirname, '../../../packages/slate-vue/index.ts'),
  output: {
    path: path.resolve(__dirname, '../../../packages/slate-vue/dist'),
    filename: 'index.js',
    libraryTarget: 'umd'
  },
  externals: {
    vue: {
      commonjs: 'vue',
      commonjs2: 'vue',
      amd: 'vue',
      root: 'vue'
    }
  }
})

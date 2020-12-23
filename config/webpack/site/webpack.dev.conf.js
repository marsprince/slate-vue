const merge = require('webpack-merge').merge;
const base = require('./webpack.base.conf')

module.exports = merge(base ,{
  mode: 'development',
  devServer: {
    open: true,
    contentBase: '../../../site/public',
    historyApiFallback: true,
    port: 3000
  }
})

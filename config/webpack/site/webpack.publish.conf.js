const base = require('./webpack.base.conf')
const merge = require('webpack-merge').merge;
const path = require('path')

module.exports = merge(base, {
  mode: 'production',
  output: {
    path: path.resolve('./', 'docs')
  }
})

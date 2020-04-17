const path = require('path')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const HTMLWebpackPlugin = require('html-webpack-plugin');
const site = path.join(__dirname, '../../../site');

module.exports = {
  entry: path.join(site, 'main.js'),
  module: {
    rules: [
      { test: /\.js$/, use: 'babel-loader', exclude: /node_modules/},
      { test: /\.vue$/, use: 'vue-loader' },
      { test: /\.tsx$/, use: ['babel-loader','ts-loader']},
      { test: /\.ts$/, use: ['babel-loader','ts-loader']},
      { test: /\.css$/, use: ['style-loader', 'css-loader']},
      { test: /\.less$/, use: ['style-loader', 'css-loader', 'less-loader']},
    ]
  },
  resolve:{
    extensions:['.js','.ts','.tsx','.vue']
  },
  plugins: [
    new VueLoaderPlugin(),
    new HTMLWebpackPlugin({
      template: path.resolve(site, './public/index.html')
    })
  ]
};

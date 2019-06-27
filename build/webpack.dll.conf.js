const path = require('path')
const webpack = require('webpack')
module.exports = {
  entry: {
    dll: ['vue/dist/vue.esm.js', 'vue-router', 'vuex', 'element-ui', 'axios']
  },
  output: {
    path: path.resolve(__dirname, '../static/js'),
    filename: '[name].js',
    library: '[name]',
  },
  plugins: [
    new webpack.DllPlugin({
      path: path.resolve(__dirname, '../static/js', '[name]-manifest.json'),
      name: '[name]'
    })
  ]
}

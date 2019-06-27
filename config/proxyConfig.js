module.exports = {
  proxyList: {
    '/': {
      target: 'http://localhost:9193',
      changeOrigin: true,
      pathRewrite: {
        '^/': ''
      }
    }
  }
}

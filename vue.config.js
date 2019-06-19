module.exports = {
  publicPath: './',
  // 开发配置
  devServer: {
    proxy: {
      '/api': {
        target: 'http://192.168.1.103:8888/', // 在这里输入代理地址
        // target: 'http://localhost:8888/',
        changeOrigin: true,
        pathRewrite: {
          '^/api': '/api'
        }
      }
    },
    host: '0.0.0.0',  // 开发时运行的地址
    port: 8080,       // 开发时运行地址的端口
  }
}
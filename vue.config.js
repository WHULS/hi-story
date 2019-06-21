module.exports = {
  publicPath: './',
  // 开发配置
  devServer: {
    proxy: {
      '/api': {
        target: 'http://study.rsgis.whu.edu.cn/', // 在这里输入代理地址
        // target: 'http://localhost:8888/',
        changeOrigin: true,
        pathRewrite: {
          '^/api': '/hi_story'
        }
      }
    },
    host: '0.0.0.0',  // 开发时运行的地址
    port: 8080,       // 开发时运行地址的端口
  }
}
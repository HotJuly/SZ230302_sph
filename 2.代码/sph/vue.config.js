const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  devServer: {
    // proxy: 'http://sph-h5-api.atguigu.cn'
    proxy: {
      "/dev-api": {
        target: "http://sph-h5-api.atguigu.cn",
        changeOrigin: true,
        pathRewrite: {
          "^/dev-api":""
        },
      },
      "/api": {
        target: "http://sph-h5-api.atguigu.cn",
        changeOrigin: true,
      },
      // "/v2":{
      //   target: "http://www.baidu.com",
      //   changeOrigin: true,
      //   pathRewrite: {},
      // }
    },
  },
});

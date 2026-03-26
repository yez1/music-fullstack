const path = require('path')
const CracoLessPlugin = require('craco-less')

//dirname指向当前文件夹,当传进来dir目录，就和当前的目录拼接成一个绝对路径
const resolve = (dir) => path.resolve(__dirname, dir)
module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options:{
        lessLoaderOptions:{
          lessOptions:{
            javascriptEnabled:true
          }
        }
      }
    }
  ],
  webpack: {
    alias: {
      '@': resolve('src')
    },
    configure: (webpackConfig) => {
      webpackConfig.module.unknownContextCritical = false
      // 屏蔽 @huggingface/transformers 触发的 import.meta 关键依赖警告
      webpackConfig.ignoreWarnings = [
        ...(webpackConfig.ignoreWarnings || []),
        /Critical dependency/,
      ]
      return webpackConfig
    }
  }
}

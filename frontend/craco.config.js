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
    }
  }
}

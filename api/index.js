const fs = require('fs')
const path = require('path')
const os = require('os')

// 懒加载 + 缓存 Express app 实例，避免每次请求都重新构建
let appPromise = null

function getApp() {
  if (!appPromise) {
    const tmpPath = os.tmpdir()
    const tokenPath = path.resolve(tmpPath, 'anonymous_token')
    if (!fs.existsSync(tokenPath)) {
      try { fs.writeFileSync(tokenPath, '', 'utf-8') } catch (e) {}
    }
    const { constructServer } = require('../server')
    appPromise = constructServer()
  }
  return appPromise
}

module.exports = async (req, res) => {
  try {
    // 去掉 /api 前缀，让 Express 内部路由正确匹配
    // 例如：前端请求 /api/banner → Express 看到 /banner
    if (req.url.startsWith('/api')) {
      req.url = req.url.slice(4) || '/'
    }

    const app = await getApp()
    return app(req, res)
  } catch (err) {
    console.error('Entry error:', err)
    res.status(500).send(err.message)
  }
}

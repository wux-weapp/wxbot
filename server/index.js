const Koa = require('koa')
const consola = require('consola')
const { Nuxt, Builder } = require('nuxt')
const bodyParser = require('koa-bodyparser')
const jwtKoa = require('koa-jwt')
const logger = require('./util/logger')
const app = new Koa()
const config = require('../nuxt.config.js')
config.dev = app.env !== 'production'
app.use(bodyParser({ extendTypes: ['json', 'text', 'form'] }))
async function start() {
  // Instantiate nuxt.js
  const nuxt = new Nuxt(config)
  const {
    host = process.env.HOST || '127.0.0.1',
    port = process.env.PORT || 3001
  } = nuxt.options.server
  await nuxt.ready()
  app.use(require('./middleware/resformat')('^/api'))
  const api = require('./routes/api')
  app.use(api.routes(), api.allowedMethods())
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  }
  app.use((ctx) => {
    ctx.status = 200
    ctx.respond = false
    ctx.req.ctx = ctx
    nuxt.render(ctx.req, ctx.res)
  })
  app.listen(port, host)
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}
//error
app.use(async (ctx, next) => {
  const startT = new Date()
  let ms
  try {
    await next().catch(err => {
      if (err.status === 401) {
        ctx.body = { errcode: 401, errmsg: 'Authentication' }
      } else { throw err }
    })
    ms = new Date() - startT;
  } catch (error) {
    console.log(error)
    ms = new Date() - startT
    logger.logError(ctx, error, ms)
  }
})
app.use(jwtKoa({ secret: require('../config').secret }).unless({
  path: [
    /^\/api\/auth\/login/,
    /^\/api\/auth\/logout/,
    /^\/api\/robot\/login/,
    /^((?!\/api).)*$/
  ]
}));
require('./config/db').connect()
const { baseLogPath, appenders } = require('./config/log4js')
const fs = require('fs');
const confirmPath = function (pathStr) {
  if (!fs.existsSync(pathStr)) fs.mkdirSync(pathStr)
}
/**
 * init log
 */
const initLogPath = function () {
  if (baseLogPath) {
    confirmPath(baseLogPath)
    for (var i = 0, len = appenders.length; i < len; i++) {
      if (appenders[i].path) {
        confirmPath(baseLogPath + appenders[i].path);
      }
    }
  }
}
start()
initLogPath()

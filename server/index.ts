import Koa from 'koa'
import consola from 'consola'
import { Nuxt, Builder } from 'nuxt'
import bodyParser from 'koa-bodyparser'
// import jwtKoa from 'koa-jwt'
// import logger from './util/logger'
const app = new Koa()
import config from '../nuxt.config'
(config as any).dev = app.env !== 'production'
app.use(bodyParser({ enableTypes: ['json', 'text', 'form'] }))
async function start() {
  // Instantiate nuxt.js
  const nuxt = new Nuxt(config)
  const {
    host = process.env.HOST || '127.0.0.1',
    port = process.env.PORT || 3001
  } = nuxt.options.server
  // await nuxt.ready()
  // app.use(require('./middleware/resformat')('^/api'))
  // const api = require('./routes/api')
  // app.use(api.routes())
  // app.use(api.allowedMethods())
  // if ((config as any).dev) {
  //   const builder = new Builder(nuxt)
  //   await builder.build()
  // }
  // app.use((ctx: Koa.Context) => {
  //   ctx.status = 200
  //   ctx.respond = false
  //   // ctx.req.ctx = ctx
  //   nuxt.render(ctx.req, ctx.res)
  // })
  app.listen(port, host)
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}
//error
app.use(async (ctx, next) => {
  const startT = new Date() as any
  let ms
  try {
    await next().catch(err => {
      if (err.status === 401) {
        ctx.body = { errcode: 401, errmsg: 'Authentication' }
      } else { throw err }
    })
    ms = new Date() as any - startT;
  } catch (error) {
    console.log(error)
    ms = new Date() as any - startT
    // logger.logError(ctx, error, ms)
  }
})
// app.use(jwtKoa({ secret: require('../config').secret }).unless({
//   path: [
//     /^\/api\/auth\/login/,
//     /^\/api\/auth\/logout/,
//     /^\/api\/robot\/login/,
//     /^((?!\/api).)*$/
//   ]
// }));
// require('./config/db').connect()
// import { baseLogPath, appenders } from './config/log4js'
// import fs from 'fs'
// const confirmPath = function (pathStr: string) {
//   if (!fs.existsSync(pathStr)) fs.mkdirSync(pathStr)
// }
/**
 * init log
 */
// const initLogPath = function () {
//   if (baseLogPath) {
//     confirmPath(baseLogPath)
//     for (var i = 0, len = (appenders as any).length; i < len; i++) {
//       if ((appenders as any)[i].path) {
//         confirmPath(baseLogPath + (appenders as any)[i].path);
//       }
//     }
//   }
// }
start()
// initLogPath()

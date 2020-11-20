import fs from 'fs'
import Koa, { Context, Next } from 'koa'
import consola from 'consola'
import { Nuxt, Builder } from 'nuxt'
import bodyParser from 'koa-bodyparser'
import jwtKoa from 'koa-jwt'
import NuxtConfig from '../nuxt.config'
import config from '../config'
import logger from './util/logger'
import api from './routes/api'
import resformat from './middleware/resformat'
import { connect } from './config/db'
import logConfig from './config/log4js'
const app = new Koa()
NuxtConfig.dev = app.env !== 'production'
app.use(bodyParser({ enableTypes: ['json', 'text', 'form'] }))
async function start () {
  // Instantiate nuxt.js
  const nuxt = new Nuxt(NuxtConfig)
  const { host = process.env.HOST || '127.0.0.1', port = process.env.PORT || 3001 } = nuxt.options.server
  await nuxt.ready()
  app.use(resformat('^/api/'))
  app.use(api.routes())
  app.use(api.allowedMethods())
  if (NuxtConfig.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  }
  app.use((ctx: Koa.Context) => {
    ctx.status = 200
    ctx.respond = false
    // ctx.req.ctx = ctx
    nuxt.render(ctx.req, ctx.res)
  })
  app.listen(port, host)
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true,
  })
}
// error
app.use(async (ctx: Context, next: Next) => {
  const startT = new Date() as any
  let ms: number
  try {
    await next().catch((err) => {
      if (err.status === 401) {
        ctx.body = { errcode: 401, errmsg: 'Authentication' }
      } else {
        throw err
      }
    })
    ms = (new Date() as any) - startT
  } catch (error) {
    console.log(error)
    ms = (new Date() as any) - startT
    logger.logError(ctx, error, ms)
  }
})
app.use(
  jwtKoa({ secret: config.secret }).unless({
    path: [/^\/api\/auth\/login/, /^\/api\/auth\/logout/, /^\/api\/robot\/login/, /^((?!\/api\/).)*$/],
  }),
)
connect()
const { baseLogPath, appenders } = logConfig
const confirmPath = function (pathStr: string) {
  if (!fs.existsSync(pathStr)) {
    fs.mkdirSync(pathStr)
  }
}
/**
 * init log
 */
const initLogPath = function () {
  if (baseLogPath) {
    confirmPath(baseLogPath)
    for (let i = 0, len = (appenders as any).length; i < len; i++) {
      if ((appenders as any)[i].path) {
        confirmPath(baseLogPath + (appenders as any)[i].path)
      }
    }
  }
}
start()
initLogPath()

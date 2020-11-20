import { Context, Next } from 'koa'
import { verifyToken } from '../util'
export default function () {
  return async function (ctx: Context, next: Next) {
    const res: any = verifyToken(ctx.header.authorization)
    if (ctx.method === 'GET') {
      ctx.query.user = res.id
    } else {
      ctx.request.body.user = res.id
    }
    await next()
  }
}

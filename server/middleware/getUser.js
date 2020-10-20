const { verifyToken } = require('../util')
module.exports = function () {
  return async function (ctx, next) {
    const res = verifyToken(ctx.header.authorization)
    if (ctx.method == 'GET') {
      ctx.query.user = res.id
    } else {
      ctx.request.body.user = res.id
    }
    await next();
  }
}
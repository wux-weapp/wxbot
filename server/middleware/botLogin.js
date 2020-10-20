module.exports = function () {
  return async function (ctx, next) {
    if (!global.bot) throw {message:'机器人已掉线，请重新登录'}
    await next();
  }
}
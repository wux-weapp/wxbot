/*
 * @Desc: 好友申请自动通过
 * @Author: skyvow
 * @Date: 2020-08-13 15:56:57
 * @LastEditors: skyvow
 * @LastEditTime: 2020-08-13 16:09:52
 */
const DEFAULT_CONFIG = {
  blackId: [],//黑名单
  keyword: [],//关键字
  reply: "",//通过后回复
}
const PASSALL = false

module.exports = function FriendPass(config = {}) {
  config = Object.assign({}, DEFAULT_CONFIG, config)
  if (config.keyword === "*") PASSALL = true
  if (typeof config.keyword === "string") config.keyword = [config.keyword]
  if (typeof config.blackId === "string") config.blackId = [config.blackId]
  return (bot) => {
    // 好友添加监听
    bot.on("friendship", async (friendship) => {
      // 校验是否存在黑名单中
      if (config.blackId.some((v) => v == friendship.payload.contactId)) return
      let logMsg
      switch (friendship.type()) {
        // 新的好友请求
        case bot.Friendship.Type.Receive:
          if (config.keyword.some((v) => v == friendship.hello()) || PASSALL) {
            logMsg = `自动通过验证，因为验证消息是"${friendship.hello()}"`
            // 通过验证
            await friendship.accept()
          } else {
            logMsg = "不自动通过，因为验证消息是: " + friendship.hello()
          }
          break
        // 友谊确认
        case bot.Friendship.Type.Confirm:
          logMsg = "已通过好友申请：" + friendship.contact().name()
          if (config.reply) {
            friendship.contact().say(config.reply)
          }
          break
      }
      console.log(logMsg)
    })
  }
}
/*
 * @Desc: 加群邀请
 * @Author: skyvow
 * @Date: 2020-08-13 16:18:43
 * @LastEditors: skyvow
 * @LastEditTime: 2020-08-13 16:20:16
 */
const DEFAULT_CONFIG = {
  keyword: ["加群"],
  reply: "",
  roomList: [],
}

module.exports = function RoomInvite(config = {}) {
  config = Object.assign({}, DEFAULT_CONFIG, config)
  if (typeof config.keyword === "string") config.keyword = [config.keyword]
  return (bot) => {
    // 消息监听
    bot.on("message", async (msg) => {
      if (msg.self()) return
      for (let i = 0; i < config.roomList.length; i++) {
        if (
          config.roomList[i].name == msg.text() ||
          config.roomList[i].code == msg.text()
        ) {
          if (config.roomList[i].close == true) {
            msg.say("此群已关闭自动拉取功能")
            return
          }
          await roomInvite(bot, msg, config.roomList[i].roomId)
          return
        }
      }
      if (msg.type() === bot.Message.Type.Text && !msg.room()) {
        // 校验关键字
        if (config.keyword.some((c) => c == msg.text())) {
          if (config.roomList.length == 1) {
            await roomInvite(bot, msg, config.roomList[0].roomId)
            return
          }
          let info
          if (config.reply) {
            info = config.reply
          } else {
            info = `${bot.options.name}管理的群聊有${config.roomList.length}个，回复群聊名或编号(【】中为编号)即可加入哦\n\n`
            config.roomList.map((item) => {
              info += `【${item.alias}】${item.name} (${item.label})\n`
            })
          }
          msg.say(info)
        }
      }
    })
  }
}

/**
 * @description 房间邀请
 * @param {Object} bot 实例对象
 * @param {Object} msg 消息实例
 * @param {Object} roomId 房间id
 * @return {}
 */
async function roomInvite(bot, msg, roomId) {
  // 通过群聊id获取到该群聊实例
  const room = await bot.Room.find({ id: roomId })
  // 判断是否在房间中 在-提示并结束
  if (await room.has(msg.from())) {
    await msg.say("您已经在房间中了")
    return
  }
  // 发送群邀请
  await room.add(msg.from())
  await msg.say("已发送群邀请")
  return
}
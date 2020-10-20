/*
 * @Desc: 入群欢迎
 * @Author: skyvow
 * @Date: 2020-08-13 16:17:31
 * @LastEditors: skyvow
 * @LastEditTime: 2020-08-13 16:39:35
 */ 

const DEFAULT_CONFIG = {
  reply: "你好，欢迎加入!",
}
module.exports = function RoomJoin(config = {}) {
  config = Object.assign({}, DEFAULT_CONFIG, config)
  return (bot) => {
    bot.on("room-join", async (room, inviteeList, inviter) => {
      if (!config.reply) return
      if (typeof config.reply === "string")
        inviteeList.map((c) => room.say(config.reply, c))
      if (Array.isArray(config.reply)) {
        config.reply.map((item) => {
          if (item.roomId == room.id) {
            inviteeList.map((c) => {
              room.say(item.reply, c)
            })
          }
        })
      }
    })
  }
}
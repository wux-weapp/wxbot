/*
 * @Desc: 移出群聊
 * @Author: skyvow
 * @Date: 2020-08-13 16:22:37
 * @LastEditors: skyvow
 * @LastEditTime: 2020-08-13 16:35:24
 */

const DEFAULT_CONFIG = {
  keyword: ["👊", "踢"],
  adminList: [],
  time: 3000,
  replyInfo: function (msg) {
    return `您一定是违反了群的相关规则，${this.time / 1000}s后您将被移出本群，操作管理员：${msg.from().name()}`
  },
  replyDone: "done",
  replyNoPermission: "",
}

module.exports = function RoomRemove(config = {}) {
  config = Object.assign({}, DEFAULT_CONFIG, config)
  if (typeof config.keyword === "string") config.keyword = [config.keyword]
  if (typeof config.replyInfo === "string") {
    let info = config.replyInfo
    config.replyInfo = () => info
  }
  return (bot) => {
    // 消息监听
    bot.on("message", async (msg) => {
      if (msg.self()) return
      // 校验消息类型为文本 且 来自群聊
      if (msg.type() === bot.Message.Type.Text && msg.room()) {
        // 获取群聊实例
        const room = await msg.room()
        // 是否为@的用户列表
        if (msg.mentionList()) {
          // 获取在群中@的用户列表
          let contactList = await msg.mentionList()
          let sendText = msg.text(),
            aite = ""
          for (let i = 0; i < contactList.length; i++) {
            // 获取@ +  群聊别称 || 名字
            let name =
              (await room.code(contactList[i])) || contactList[i].name()
            aite = "@" + name
            // 匹配删除名字信息
            sendText = sendText.replace(aite, "")
          }
          // 删除首尾空格
          sendText = sendText.replace(/(^\s*)|(\s*$)/g, "")
          if (config.keyword.some((v) => v === sendText)) {
            if (config.adminList.some((v) => v.id == msg.from().id)) {
              room.say(config.replyInfo(msg), ...contactList)
              setTimeout(async () => {
                contactList.map(async (item) => {
                  try {
                    await room.del(item)
                  } catch (e) {
                    console.error(e)
                  }
                  room.say(config.replyDone)
                })
              }, config.time)
            } else {
              if (config.replyNoPermission) {
                room.say(config.replyNoPermission, msg.from())
              }
            }
          }
        }
      }
    })
  }
}
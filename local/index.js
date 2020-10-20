/*
 * @Desc: 本地插件版
 * @Author: skyvow
 * @Date: 2020-08-13 15:20:49
 * @LastEditors: skyvow
 * @LastEditTime: 2020-08-13 17:15:06
 */

const { Wechaty } = require('wechaty')
const { PuppetPadplus } = require('wechaty-puppet-padplus')
const { PUPPET_PADPLUS_TOKEN, BOT_NAME } = require('./config')
const FriendPass = require('./plugin/friends-pass')
const RoomJoin = require('./plugin/room-join')
const RoomInvite = require('./plugin/room-invite')
const RoomRemove = require('./plugin/room-remove')
const AutoReply = require('./plugin/auto-reply')

const {
  QRCodeTerminal,
  EventLogger
} = require('wechaty-plugin-contrib') //官方插件
// 初始化
const bot = new Wechaty({
  puppet: new PuppetPadplus({
    token: PUPPET_PADPLUS_TOKEN,
  }),
  name: BOT_NAME,
})
//登录二维码
bot.use(QRCodeTerminal({ small: false }))
//日志输出
bot.use(EventLogger())
//好友自动通过
bot.use(FriendPass({
  keyword: [
    '加群',
    '机器人',
  ],
  reply: `你好，我是机器人${BOT_NAME} \n\n 加入技术交流群请回复【加群】`,
  blackId: [],
})
)
// 加入房间欢迎
bot.use(RoomJoin({
  reply: [
    {
      name: '机器人测试',
      roomId: 'xxx@chatroom',
      reply: `\n 你好，欢迎加入`,
    },
  ],
})
)
//加入房间邀请
bot.use(RoomInvite({
  keyword: ['加群', '入群'],
  reply: '',
  roomList: [
    {
      name: '机器人测试',
      roomId: 'xxx@chatroom',
      code: 'A',//群编号
      label: '标签',
    },
  ],
})
)
// 指令踢人
bot.use(RoomRemove({
  keyword: ['👊', '踢', '👎'],
  adminList: [
    {
      name: '小小',
      id: 'wxid_xxxxx', //管理员id
    },
  ],
  time: 3000,
  replyDone: 'done',
  replyNoPermission: '没有踢人权限哦',
})
)
//关键词自动回复
bot.use(AutoReply({
  keywords: [{ keyword: '测试', content: 'test' }]
})
)

bot.on('error', (error) => {
  console.error(error)
}).start()
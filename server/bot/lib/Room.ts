/*
 * @Desc: room
 * @Author: skyvow
 * @Date: 2020-04-30 19:33:58
 * @LastEditors: skyvow
 * @LastEditTime: 2020-05-14 12:34:25
 */

/**
 * 进入房间
 * @param {String} room   群聊
 * @param {*} inviteeList 受邀者名单
 * @param {*} inviter 邀请者
 */
import { Group } from '../../models/group'
async function onRoomJoin (room: any, inviteeList: any[], inviter: any) {
  const group = await Group.findOne({ id: room.id }, { roomJoinReply: 1 })
  if (!group) {
    room.payload.robotId = global.bot.id
    await Group.create(room.payload)
    room.say(
      `大家好，我是机器人${global.bot.options.name}\n欢迎大家找我聊天或者玩游戏哦。比如 @${global.bot.options.name} 成语接龙`,
    )
    return
  }
  inviteeList.forEach((c) => {
    room.say('\n' + group.roomJoinReply, c)
  })
}
/**
 * 踢出房间,此功能仅限于bot踢出房间,如果房间用户自己退出不会触发
 * @param {*} room
 * @param {*} leaverList
 */
async function onRoomLeave (room: any, leaverList: any[]) {
  const isrobot = leaverList.find((item: any) => item.id === global.bot.id)
  if (isrobot) {
    await Group.deleteOne({ id: room.id })
    return
  }
  const group = Group.findOne({ id: room.id }, { id: 1 })
  if (group) {
    leaverList.forEach((c: any) => {
      room.say(`「${c.name()}」离开了群聊`)
    })
  }
}
export { onRoomJoin, onRoomLeave }

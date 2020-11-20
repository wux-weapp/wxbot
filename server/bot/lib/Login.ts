/*
 * @Desc: 登录
 * @Author: skyvow
 * @Date: 2020-04-29 18:51:49
 * @LastEditors: skyvow
 * @LastEditTime: 2020-05-15 18:15:23
 */
import logger from '../../util/logger'
import { Robot } from '../../models/robot'
import { Group } from '../../models/group'
import { Friend } from '../../models/friend'
import { init, stop } from './Task'
/**
 * 登录
 * @param {object} bot
 * @param {string} _id
 * @param {object} user
 */
const onLogin = async (bot: any, robotId: string, user: any) => {
  const robot = await Robot.findOne({ _id: robotId }, { startSay: 1, nickName: 1 })
  if (!robot) { return }
  logger.info(`机器人${robot.nickName} 登陆啦!!!`)
  console.log(`机器人${robot.nickName} 登陆啦!!!`)
  await Robot.updateOne(
    { _id: robotId },
    {
      status: 1,
      lastLoginT: new Date(),
      name: user.payload.name,
      id: user.id,
      weixin: user.payload.weixin,
      avatar: user.payload.avatar,
    },
  )
  bot.id = user.id
  // 初始化群聊
  const roomList = await bot.Room.findAll()
  for (let i = 0; i < roomList.length; i++) {
    const group = await Group.findOne({ id: roomList[i].id }, { _id: 1 })
    if (!group) {
      roomList[i].payload.robotId = user.id
      await Group.create(roomList[i].payload)
    } else {
      await Group.updateOne({ _id: group._id }, roomList[i].payload)
    }
  }
  // 初始化好友
  const friends = await bot.Contact.findAll()
  const friendsA: any[] = []
  const notids = ['filehelper', 'fmessage', user.id]
  friends.forEach((item: any) => {
    if (item.payload.friend && !notids.includes(item.payload.id)) {
      item.payload.robotId = user.id
      friendsA.push(item.payload)
    }
  })
  for (let j = 0; j < friendsA.length; j++) {
    const friend = await Friend.findOne({ id: friendsA[j].id }, { _id: 1 })
    if (!friend) {
      await Friend.create(friendsA[j])
    } else {
      await Friend.updateOne({ _id: friend._id }, friendsA[j])
    }
  }
  global.bot = bot
  await bot.say(robot.startSay)
  init()
  return { isLogin: true }
}
/**
 * 退出
 * @param {String} user
 */
async function onLogout (user: string) {
  await Robot.updateOne({ id: global.bot.id }, { status: 0 })
  stop()
  delete global.bot
  logger.info(`机器人${user} 退出`)
}
export { onLogin, onLogout }

/* eslint-disable */
declare global {
  namespace NodeJS {
    interface Global {
      bot: any
    }
  }
}

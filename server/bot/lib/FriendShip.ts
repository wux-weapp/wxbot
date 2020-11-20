/*
 * @Desc: 友谊关系
 * @Author: skyvow
 * @Date: 2020-04-29 17:31:10
 * @LastEditors: skyvow
 * @LastEditTime: 2020-05-14 15:34:06
 */
import { Friendship } from 'wechaty'
import logger from '../../util/logger'
import { Robot } from '../../models/robot'
const onFriendShip = async (friendship: Friendship) => {
  let log: string
  try {
    log = '添加好友' + friendship.contact().name()
    logger.info(log)
    const robot = await Robot.findOne({ id: global.bot.id }, { addFriendKeywords: 1, addFriendReply: 1 })
    if (!robot) { return }
    switch (friendship.type()) {
      /**
       * 1.新的好友请求
       * 通过'request.hello()'获取验证消息
       * 通过'request.accept()'接受请求
       */
      case Friendship.Type.Receive:
        if (robot.addFriendKeywords.some((str: string) => str === friendship.hello())) {
          log = `自动添加好友成功,因为验证消息是"${friendship.hello()}"`
          // 通过验证
          await friendship.accept()
        } else {
          log = `没有通过验证:因为关键词"${friendship.hello()}"不匹配`
        }
        break
      /**
       * 确认添加
       */
      case Friendship.Type.Confirm:
        log = `${friendship.contact().name()}已经添加你为好友`
        // 发个提示
        global.bot.say(`${friendship.contact().name()}添加了你为好友`)
        if (robot.addFriendReply) {
          await friendship.contact().say(robot.addFriendReply)
        }
        break
    }
  } catch (e) {
    log = e.message
  }
  logger.info(log)
}
export default onFriendShip

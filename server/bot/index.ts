/*
 * @Desc: robot
 * @Author: skyvow
 * @Date: 2020-04-29 19:03:52
 * @LastEditors: skyvow
 * @LastEditTime: 2020-05-14 15:34:40
 */
import { Wechaty } from 'wechaty'
import { ScanStatus } from 'wechaty-puppet'
import logger from '../util/logger'
import { Robot } from '../models/robot'
import { onLogin, onLogout } from './lib/Login'
import onFriendShip from './lib/FriendShip'
import onMessage from './lib/Message'
import { onRoomJoin, onRoomLeave } from './lib/Room'
import { ContactSelf } from 'wechaty/dist/src/user/mod'
class Bot {
  _id: string
  debug: boolean
  constructor (_id: string, debug: boolean = false) {
    this._id = _id
    this.debug = debug
  }

  log (...args: any[]) {
    if (this.debug) {
      console.log(...args)
    }
  }

  // 启动
  async start () {
    if (process.env.NODE_ENV === 'development' && process.env.ONLY_SITE === 'true') {
      const info = '已启动站点调式模式，机器人相关操作被静止'
      logger.info(info)
      console.log(info)
      return {
        info,
      }
    }
    const robot = await Robot.findOne({ _id: this._id }, { token: 1, nickName: 1, id: 1 })
    if (!robot) {
      throw { message: '机器人不存在' }
    }
    if (!robot.token) {
      throw { message: '缺少协议token' }
    }
    const bot = new Wechaty({
      puppet: 'wechaty-puppet-service',
      puppetOptions: {
        token: robot.token,
      },
      name: robot.nickName,
    })
    const res = await new Promise((resolve) => {
      bot
        .on('scan', (qrcode, status) => {
          if (status === ScanStatus.Waiting) {
            resolve({ qrcode })
          }
        })
        .on('login', async (user: ContactSelf) => {
          const res = await onLogin(bot, this._id, user)
          resolve(res)
        })
        .on('message', onMessage)
        .on('friendship', onFriendShip)
        .on('room-join', onRoomJoin)
        .on('room-leave', onRoomLeave)
        .on('error', (error) => {
          logger.error('机器故障，error：' + error)
        })
        .on('logout', onLogout)
        .start()
    })
    return res
  }
}
export default Bot

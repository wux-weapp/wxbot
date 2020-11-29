/*
 * @Desc: robot
 * @Author: skyvow
 * @Date: 2020-04-24 21:09:47
 * @LastEditors: skyvow
 * @LastEditTime: 2020-05-12 15:49:06
 */
import { Context } from 'koa'
import Bot from '../bot'
import { Robot } from '../models/robot'
import { Group } from '../models/group'
class Index {
  /**
   * @apiDefine Header
   * @apiHeader {String} Authorization jsonwebtoken
   */

  /**
   * @apiDefine Success
   * @apiSuccess {Boolean} success 标识码，true表示成功，false表示失败
   * @apiSuccess {Object} data 数据内容
   */

  /**
   * @api {post} /robot/login 机器人登录
   * @apiDescription 机器人登录
   * @apiName login
   * @apiGroup robot
   *
   * @apiParam {String} id 机器人id
   *
   * @apiPermission none
   * @apiSampleRequest /robot/login
   *
   * @apiUse Header
   * @apiUse Success
   *
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *       "success": true,
   *       "data": {}
   *     }
   */
  static async login (ctx: Context) {
    try {
      if (!ctx.request.body.id) {
        throw { message: '缺少id' }
      }
      const bot = new Bot(ctx.request.body.id)
      const result = await bot.start()
      ctx.body = result
    } catch (err) {
      throw err
    }
  }

  /**
   * @api {post} /robot/logout 机器人登出
   * @apiDescription 机器人登出
   * @apiName logout
   * @apiGroup robot
   *
   * @apiParam {String} id 机器人id
   *
   * @apiPermission none
   * @apiSampleRequest /robot/logout
   *
   * @apiUse Header
   * @apiUse Success
   *
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *       "success": true,
   *       "data": {}
   *     }
   */
  static logout = async (ctx: Context) => {
    try {
      if (!global.bot) {
        await Robot.updateOne({ _id: ctx.request.body.id }, { status: 0 })
        delete global.bot
        return (ctx.body = {})
      }
      await global.bot.logout()
      ctx.body = {}
    } catch (err) {
      throw err
    }
  }

  /**
   * @api {post} /robot/friend/say 发送消息给好友
   * @apiDescription 发送消息给好友
   * @apiName friendSay
   * @apiGroup robot
   *
   * @apiParam {String} id 好友id
   * @apiParam {String} content 消息内容
   *
   * @apiPermission none
   * @apiSampleRequest /robot/friend/say
   *
   * @apiUse Header
   * @apiUse Success
   *
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *       "success": true,
   *       "data": {}
   *     }
   */
  static friendSay = async (ctx: Context) => {
    try {
      const contact = await global.bot.Contact.find({
        id: ctx.request.body.id,
      })
      await contact.say(ctx.request.body.content)
      ctx.body = {}
    } catch (err) {
      throw err
    }
  }

  /**
   * @api {post} /robot/room/say 发送群消息
   * @apiDescription 发送群消息
   * @apiName roomSay
   * @apiGroup robot
   *
   * @apiParam {String} id 群id
   * @apiParam {String} content 消息内容
   *
   * @apiPermission none
   * @apiSampleRequest /robot/room/say
   *
   * @apiUse Header
   * @apiUse Success
   *
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *       "success": true,
   *       "data": {}
   *     }
   */
  static roomSay = async (ctx: Context) => {
    try {
      const room = await global.bot.Room.find({ id: ctx.request.body.id })
      await room.say(ctx.request.body.content)
      ctx.body = {}
    } catch (err) {
      throw err
    }
  }

  /**
   * @api {get} /robot/room/:id 获取群名称&群公告
   * @apiDescription 获取群名称&群公告
   * @apiName getRoom
   * @apiGroup robot
   *
   * @apiParam {String} id 群id
   *
   * @apiPermission none
   * @apiSampleRequest /robot/room/:id
   *
   * @apiUse Header
   * @apiUse Success
   *
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *       "success": true,
   *       "data": {}
   *     }
   */
  static getRoom = async (ctx: Context) => {
    try {
      const room = await global.bot.Room.find({ id: ctx.params.id })
      const topic = await room.topic()
      const announce = await room.announce()
      ctx.body = { topic, announce }
    } catch (err) {
      throw err
    }
  }

  /**
   * @api {put} /robot/room/:id 设置群名称&群公告
   * @apiDescription 设置群名称&群公告
   * @apiName updateRoom
   * @apiGroup robot
   *
   * @apiParam {String} id 群id
   * @apiParam {String} topic 群名称
   * @apiParam {String} announce 群公告
   *
   * @apiPermission none
   * @apiSampleRequest /robot/room/:id
   *
   * @apiUse Header
   * @apiUse Success
   *
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *       "success": true,
   *       "data": {}
   *     }
   */
  static updateRoom = async (ctx: Context) => {
    try {
      const room = await global.bot.Room.find({ id: ctx.params.id })
      if (ctx.request.body.topic) {
        await room.topic(ctx.request.body.topic)
        await Group.updateOne({ id: ctx.params.id }, { topic: ctx.request.body.topic })
      }
      if (ctx.request.body.announce) {
        await room.announce(ctx.request.body.announce)
      }
      ctx.body = {}
    } catch (err) {
      throw { message: '没有权限，不是群主或者管理员' }
    }
  }

  /**
   * @api {post} /robot/room/quit 退群
   * @apiDescription 退群
   * @apiName roomQuit
   * @apiGroup robot
   *
   * @apiParam {String} id 群id
   *
   * @apiPermission none
   * @apiSampleRequest /robot/room/quit
   *
   * @apiUse Header
   * @apiUse Success
   *
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *       "success": true,
   *       "data": {}
   *     }
   */
  static roomQuit = async (ctx: Context) => {
    try {
      const room = await global.bot.Room.find({ id: ctx.request.body.id })
      if (room) {
        await Group.deleteOne({ id: ctx.request.body.id })
        await room.quit()
      }
      ctx.body = {}
    } catch (err) {
      throw err
    }
  }
}

export default Index

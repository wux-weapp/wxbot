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
   * @apiSuccess {Object} meta 状态描述
   * @apiSuccess {Number} meta.code 标识码，0表示成功，1表示失败
   * @apiSuccess {String} meta.message 标识信息
   * @apiSuccess {Object} data 数据内容
   */

  /**
   * @api {post} /robot/login 机器人登录
   * @apiDescription 机器人登录
   * @apiName login
   * @apiGroup robot
   *
   * @apiParam {String} [page=1] 指定第几页
   * @apiParam {String} [limit=10] 指定每页的记录数
   * @apiParam {String} [pagination] 是否显示分页
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
   *       "meta": {
   *        "code": 0,
   *        "message": "调用成功"
   *       },
   *       "data": []
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

  static loginOut = async (ctx: Context) => {
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

  static roomSay = async (ctx: Context) => {
    try {
      const room = await global.bot.Room.find({ id: ctx.request.body.id })
      await room.say(ctx.request.body.content)
      ctx.body = {}
    } catch (err) {
      throw err
    }
  }

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

  static roomQuit = async (ctx: Context) => {
    try {
      const room = await global.bot.Room.find({ id: ctx.request.body.id })
      await room.quit()
      ctx.body = {}
    } catch (err) {
      throw err
    }
  }
}

export default Index

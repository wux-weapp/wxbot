import { Context } from 'koa'
import * as authDB from '../models/auth'
import * as groupDB from '../models/group'
import * as friendDB from '../models/friend'
import * as replyDB from '../models/reply'
import * as taskDB from '../models/task'

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
   * @api {post} /auth/login 平台用户登录
   * @apiDescription 平台用户登录
   * @apiName login
   * @apiGroup admin.auth
   *
   * @apiParam {String} username 用户名
   * @apiParam {String} password 用户密码
   *
   * @apiPermission none
   * @apiSampleRequest /auth/login
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
  static login = async (ctx: Context) => {
    try {
      const result = await authDB.Dao.login(ctx.request.body)
      ctx.body = result
    } catch (err) {
      throw err
    }
  }

  /**
   * @api {post} /auth/logout 平台用户登出
   * @apiDescription 平台用户登出
   * @apiName logout
   * @apiGroup admin.auth
   *
   * @apiPermission none
   * @apiSampleRequest /auth/logout
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
    ctx.body = null
  }

  /**
   * @api {get} /auth/user 获取平台用户信息
   * @apiDescription 获取平台用户信息
   * @apiName getUser
   * @apiGroup admin.auth
   *
   * @apiPermission none
   * @apiSampleRequest /auth/user
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
  static getUser = async (ctx: Context) => {
    try {
      const result = await authDB.Dao.getUser(ctx.query.user)
      ctx.body = { user: result }
    } catch (err) {
      throw err
    }
  }

  /**
   * @api {get} /admin/robot/:id 获取指定机器人的信息
   * @apiDescription 获取指定机器人的信息
   * @apiName getRobot
   * @apiGroup admin.robot
   *
   * @apiParam {String} id 机器人id
   *
   * @apiPermission none
   * @apiSampleRequest /admin/robot/:id
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
  static getRobot = async (ctx: Context) => {
    try {
      const result = await authDB.Dao.getRobot(ctx.params.id)
      ctx.body = result
    } catch (err) {
      throw err
    }
  }

  /**
   * @api {post} /admin/robot 新增一个机器人的信息
   * @apiDescription 新增一个机器人的信息
   * @apiName addRobot
   * @apiGroup admin.robot
   *
   * @apiParam {String} nickName 机器人名称
   * @apiParam {String} startSay 启动提示语
   * @apiParam {String} unknownSay 知识盲区回复
   * @apiParam {String[]} addFriendKeywords 好友通过关键字
   * @apiParam {String} addFriendReply 好友通过自动回复
   * @apiParam {String} token 协议Token
   *
   * @apiPermission none
   * @apiSampleRequest /admin/robot
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
  static addRobot = async (ctx: Context) => {
    try {
      const result = await authDB.Dao.addRobot(ctx.request.body)
      ctx.body = result
    } catch (err) {
      throw err
    }
  }

  /**
   * @api {put} /admin/robot/:id 更新指定机器人的信息
   * @apiDescription 更新指定机器人的信息
   * @apiName updateRobot
   * @apiGroup admin.robot
   *
   * @apiParam {String} id 机器人id
   * @apiParam {String} nickName 机器人名称
   * @apiParam {String} startSay 启动提示语
   * @apiParam {String} unknownSay 知识盲区回复
   * @apiParam {String[]} addFriendKeywords 好友通过关键字
   * @apiParam {String} addFriendReply 好友通过自动回复
   * @apiParam {String} token 协议Token
   *
   * @apiPermission none
   * @apiSampleRequest /admin/robot/:id
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
  static updateRobot = async (ctx: Context) => {
    try {
      const result = await authDB.Dao.updateRobot(ctx.params.id, ctx.request.body)
      ctx.body = result
    } catch (err) {
      throw err
    }
  }

  /**
   * @api {get} /admin/group 获取群列表
   * @apiDescription 获取群列表
   * @apiName getGroups
   * @apiGroup admin.group
   *
   * @apiPermission none
   * @apiSampleRequest /admin/group
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
  static getGroups = async (ctx: Context) => {
    try {
      const result = await groupDB.Dao.myGroups(ctx.query)
      ctx.body = result
    } catch (err) {
      throw err
    }
  }

  /**
   * @api {put} /admin/group/:id 更新指定群的信息
   * @apiDescription 更新指定群的信息
   * @apiName updateGroup
   * @apiGroup admin.group
   *
   * @apiParam {String} id 群id
   * @apiParam {String} roomJoinReply 入群欢迎语
   * @apiParam {Boolean} autojoin 是否开启自动加群
   * @apiParam {String} joinCode 群编码(字母)，用于私聊自动回复“加群”匹配
   * @apiParam {Number} maxFoul 群员违规上限
   * @apiParam {Boolean} control 是否开启机器人控制
   *
   * @apiPermission none
   * @apiSampleRequest /admin/group/:id
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
  static updateGroup = async (ctx: Context) => {
    try {
      const result = await groupDB.Dao.update(ctx.params.id, ctx.request.body)
      ctx.body = result
    } catch (err) {
      throw err
    }
  }

  /**
   * @api {get} /admin/friend 获取好友列表
   * @apiDescription 获取好友列表
   * @apiName getFriends
   * @apiGroup admin.friend
   *
   * @apiPermission none
   * @apiSampleRequest /admin/friend
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
  static getFriends = async (ctx: Context) => {
    try {
      const result = await friendDB.Dao.list(ctx.query)
      ctx.body = result
    } catch (err) {
      throw err
    }
  }

  /**
   * @api {get} /admin/reply 获取自动回复列表
   * @apiDescription 获取自动回复列表
   * @apiName getReplys
   * @apiGroup admin.reply
   *
   * @apiPermission none
   * @apiSampleRequest /admin/reply
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
  static getReplys = async (ctx: Context) => {
    try {
      const result = await replyDB.Dao.list(ctx.query)
      ctx.body = result
    } catch (err) {
      throw err
    }
  }

  /**
   * @api {post} /admin/reply 新增一个自动回复
   * @apiDescription 新增一个自动回复
   * @apiName addReply
   * @apiGroup admin.reply
   *
   * @apiParam {String} robotId 机器人id
   * @apiParam {String} keyword 关键词
   * @apiParam {String} content 回复内容
   * @apiParam {Number} type 类型 0:普通消息，1:发送群邀请(仅在私聊触发)  2:踢人指令(仅在群聊触发)
   * @apiParam {Number} factor 触发场景 0:通用，1:私聊  2:群聊  3:通用群聊
   * @apiParam {Number} status 状态 0停用 1启用
   * @apiParam {String} roomId 群id
   * @apiParam {String} remark 备注
   *
   * @apiPermission none
   * @apiSampleRequest /admin/reply
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
  static addReply = async (ctx: Context) => {
    try {
      if (!ctx.request.body.robotId) {
        throw { message: '未绑定机器人' }
      }
      const result = await replyDB.Dao.add(ctx.request.body)
      ctx.body = result
    } catch (err) {
      throw err
    }
  }

  /**
   * @api {put} /admin/reply/:id 更新指定的自动回复
   * @apiDescription 更新指定的自动回复
   * @apiName updateReply
   * @apiGroup admin.reply
   *
   * @apiParam {String} id 自动回复id
   * @apiParam {String} robotId 机器人id
   * @apiParam {String} keyword 关键词
   * @apiParam {String} content 回复内容
   * @apiParam {Number} type 类型 0:普通消息，1:发送群邀请(仅在私聊触发)  2:踢人指令(仅在群聊触发)
   * @apiParam {Number} factor 触发场景 0:通用，1:私聊  2:群聊  3:通用群聊
   * @apiParam {Number} status 状态 0停用 1启用
   * @apiParam {String} roomId 群id
   * @apiParam {String} remark 备注
   *
   * @apiPermission none
   * @apiSampleRequest /admin/reply/:id
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
  static updateReply = async (ctx: Context) => {
    try {
      const result = await replyDB.Dao.update(ctx.params.id, ctx.request.body)
      ctx.body = result
    } catch (err) {
      throw err
    }
  }

  /**
   * @api {post} /admin/reply 批量删除指定的自动回复
   * @apiDescription 批量删除指定的自动回复
   * @apiName deleteReply
   * @apiGroup admin.reply
   *
   * @apiParam {String[]} ids 自动回复id
   *
   * @apiPermission none
   * @apiSampleRequest /admin/reply
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
  static deleteReply = async (ctx: Context) => {
    try {
      const result = await replyDB.Dao.delete(ctx.query['ids[]'])
      ctx.body = result
    } catch (err) {
      throw err
    }
  }

  /**
   * @api {get} /admin/task 获取定时任务列表
   * @apiDescription 获取定时任务列表
   * @apiName getTasks
   * @apiGroup admin.task
   *
   * @apiPermission none
   * @apiSampleRequest /admin/task
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
  static getTasks = async (ctx: Context) => {
    try {
      const result = await taskDB.Dao.list(ctx.query)
      ctx.body = result
    } catch (err) {
      throw err
    }
  }

  /**
   * @api {post} /admin/task 新增一个定时任务
   * @apiDescription 新增一个定时任务
   * @apiName addTask
   * @apiGroup admin.task
   *
   * @apiParam {String} robotId 机器人id
   * @apiParam {String} name 名称
   * @apiParam {Number} type 类型 0:普通消息，1:其他
   * @apiParam {String} content 发送内容
   * @apiParam {Number} factor 触发场景 0:个人，1:群聊，2:通用群聊
   * @apiParam {Number} status 状态 0停用 1启用
   * @apiParam {String} friendId 联系人
   * @apiParam {String} roomId 群id
   * @apiParam {String} cron cron表达式，优先级高于 rule(dayOfWeek,month...) 指定的时间
   * @apiParam {Number} unit 时间单位 0:每分钟，1:每小时，2:每天，3:自定义
   * @apiParam {Number} dayOfWeek 指定周几
   * @apiParam {Number} month 指定某月
   * @apiParam {Number} dayOfMonth 指定某天
   * @apiParam {Number} hour 指定某时
   * @apiParam {Number} minute 指定某分
   * @apiParam {Number} second 指定某秒
   *
   * @apiPermission none
   * @apiSampleRequest /admin/task
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
  static addTask = async (ctx: Context) => {
    try {
      if (!ctx.request.body.robotId) {
        throw { message: '未绑定机器人' }
      }
      const result = await taskDB.Dao.add(ctx.request.body)
      ctx.body = result
    } catch (err) {
      throw err
    }
  }

  /**
   * @api {put} /admin/task/:id 更新指定的定时任务
   * @apiDescription 更新指定的定时任务
   * @apiName updateTask
   * @apiGroup admin.task
   *
   * @apiParam {String} id 定时任务id
   * @apiParam {String} robotId 机器人id
   * @apiParam {String} name 名称
   * @apiParam {Number} type 类型 0:普通消息，1:其他
   * @apiParam {String} content 发送内容
   * @apiParam {Number} factor 触发场景 0:个人，1:群聊，2:通用群聊
   * @apiParam {Number} status 状态 0停用 1启用
   * @apiParam {String} friendId 联系人
   * @apiParam {String} roomId 群id
   * @apiParam {String} cron cron表达式，优先级高于 rule(dayOfWeek,month...) 指定的时间
   * @apiParam {Number} unit 时间单位 0:每分钟，1:每小时，2:每天，3:自定义
   * @apiParam {Number} dayOfWeek 指定周几
   * @apiParam {Number} month 指定某月
   * @apiParam {Number} dayOfMonth 指定某天
   * @apiParam {Number} hour 指定某时
   * @apiParam {Number} minute 指定某分
   * @apiParam {Number} second 指定某秒
   *
   * @apiPermission none
   * @apiSampleRequest /admin/task/:id
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
  static updateTask = async (ctx: Context) => {
    try {
      const result = await taskDB.Dao.update(ctx.params.id, ctx.request.body)
      ctx.body = result
    } catch (err) {
      throw err
    }
  }

  /**
   * @api {post} /admin/task 批量删除指定的定时任务
   * @apiDescription 批量删除指定的定时任务
   * @apiName deleteTask
   * @apiGroup admin.task
   *
   * @apiParam {String[]} ids 定时任务id
   *
   * @apiPermission none
   * @apiSampleRequest /admin/task
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
  static deleteTask = async (ctx: Context) => {
    try {
      const result = await taskDB.Dao.delete(ctx.query['ids[]'])
      ctx.body = result
    } catch (err) {
      throw err
    }
  }
}

export default Index

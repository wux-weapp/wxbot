import { Context } from 'koa'
import * as authDB from '../models/auth'
import * as groupDB from '../models/group'
import * as friendDB from '../models/friend'
import * as replyDB from '../models/reply'
import * as taskDB from '../models/task'

export default {
  login: async (ctx: Context) => {
    try {
      const result = await authDB.Dao.login(ctx.request.body)
      ctx.body = result
    } catch (err) {
      throw err
    }
  },
  getUser: async (ctx: Context) => {
    try {
      const result = await authDB.Dao.getUser(ctx.query.user)
      ctx.body = { user: result }
    } catch (err) {
      throw err
    }
  },
  getRobot: async (ctx: Context) => {
    try {
      const result = await authDB.Dao.getRobot(ctx.params.id)
      ctx.body = result
    } catch (err) {
      throw err
    }
  },
  addRobot: async (ctx: Context) => {
    try {
      const result = await authDB.Dao.addRobot(ctx.request.body)
      ctx.body = result
    } catch (err) {
      throw err
    }
  },
  updateRobot: async (ctx: Context) => {
    try {
      const result = await authDB.Dao.updateRobot(ctx.params.id, ctx.request.body)
      ctx.body = result
    } catch (err) {
      throw err
    }
  },
  getGroups: async (ctx: Context) => {
    try {
      const result = await groupDB.Dao.myGroups(ctx.query)
      ctx.body = result
    } catch (err) {
      throw err
    }
  },
  updateGroup: async (ctx: Context) => {
    try {
      const result = await groupDB.Dao.update(ctx.params.id, ctx.request.body)
      ctx.body = result
    } catch (err) {
      throw err
    }
  },
  getFriends: async (ctx: Context) => {
    try {
      const result = await friendDB.Dao.list(ctx.query)
      ctx.body = result
    } catch (err) {
      throw err
    }
  },
  getReplys: async (ctx: Context) => {
    try {
      const result = await replyDB.Dao.list(ctx.query)
      ctx.body = result
    } catch (err) {
      throw err
    }
  },
  addReply: async (ctx: Context) => {
    try {
      if (!ctx.request.body.robotId) {
        throw { message: '未绑定机器人' }
      }
      const result = await replyDB.Dao.add(ctx.request.body)
      ctx.body = result
    } catch (err) {
      throw err
    }
  },
  updateReply: async (ctx: Context) => {
    try {
      const result = await replyDB.Dao.update(ctx.params.id, ctx.request.body)
      ctx.body = result
    } catch (err) {
      throw err
    }
  },
  deleteReply: async (ctx: Context) => {
    try {
      const result = await replyDB.Dao.delete(ctx.query['ids[]'])
      ctx.body = result
    } catch (err) {
      throw err
    }
  },
  getTasks: async (ctx: Context) => {
    try {
      const result = await taskDB.Dao.list(ctx.query)
      ctx.body = result
    } catch (err) {
      throw err
    }
  },
  addTask: async (ctx: Context) => {
    try {
      if (!ctx.request.body.robotId) {
        throw { message: '未绑定机器人' }
      }
      const result = await taskDB.Dao.add(ctx.request.body)
      ctx.body = result
    } catch (err) {
      throw err
    }
  },
  updateTask: async (ctx: Context) => {
    try {
      const result = await taskDB.Dao.update(ctx.params.id, ctx.request.body)
      ctx.body = result
    } catch (err) {
      throw err
    }
  },
  deleteTask: async (ctx: Context) => {
    try {
      const result = await taskDB.Dao.delete(ctx.query['ids[]'])
      ctx.body = result
    } catch (err) {
      throw err
    }
  },
}

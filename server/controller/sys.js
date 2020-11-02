const authDB = require('../models/auth')
const groupDB = require('../models/group')
const friendDB = require('../models/friend')
const replyDB = require('../models/reply')
const taskDB = require('../models/task')
module.exports = {
  login: async (ctx) => {
    try {
      const result = await authDB.Dao.login(ctx.request.body)
      ctx.body = result
    } catch (err) { throw err }
  },
  getUser: async (ctx) => {
    try {
      const result = await authDB.Dao.getUser(ctx.query.user)
      ctx.body = { user: result }
    } catch (err) { throw err }
  },
  getRobot: async (ctx) => {
    try {
      const result = await authDB.Dao.getRobot(ctx.params.id)
      ctx.body = result
    } catch (err) { throw err }
  },
  addRobot: async (ctx) => {
    try {
      const result = await authDB.Dao.addRobot(ctx.request.body)
      ctx.body = result
    } catch (err) { throw err }
  },
  updateRobot: async (ctx) => {
    try {
      const result = await authDB.Dao.updateRobot(ctx.params.id, ctx.request.body)
      ctx.body = result
    } catch (err) { throw err }
  },
  getGroups: async (ctx) => {
    try {
      const result = await groupDB.Dao.myGroups(ctx.query)
      ctx.body = result
    } catch (err) { throw err }
  },
  updateGroup: async (ctx) => {
    try {
      const result = await groupDB.Dao.update(ctx.params.id, ctx.request.body)
      ctx.body = result
    } catch (err) { throw err }
  },
  getFriends: async (ctx) => {
    try {
      const result = await friendDB.Dao.list(ctx.query)
      ctx.body = result
    } catch (err) { throw err }
  },
  getReplys: async (ctx) => {
    try {
      const result = await replyDB.Dao.list(ctx.query)
      ctx.body = result
    } catch (err) { throw err }
  },
  addReply: async (ctx) => {
    try {
      if(!ctx.request.body.robotId) throw {message:'未绑定机器人'}
      const result = await replyDB.Dao.add(ctx.request.body)
      ctx.body = result
    } catch (err) { throw err }
  },
  updateReply: async (ctx) => {
    try {
      const result = await replyDB.Dao.update(ctx.params.id, ctx.request.body)
      ctx.body = result
    } catch (err) { throw err }
  },
  deleteReply: async (ctx) => {
    try {
      const result = await replyDB.Dao.delete(ctx.query['ids[]'])
      ctx.body = result
    } catch (err) { throw err }
  },
  getTasks: async (ctx) => {
    try {
      const result = await taskDB.Dao.list(ctx.query)
      ctx.body = result
    } catch (err) { throw err }
  },
  addTask: async (ctx) => {
    try {
      if(!ctx.request.body.robotId) throw {message:'未绑定机器人'}
      const result = await taskDB.Dao.add(ctx.request.body)
      ctx.body = result
    } catch (err) { throw err }
  },
  updateTask: async (ctx) => {
    try {
      const result = await taskDB.Dao.update(ctx.params.id, ctx.request.body)
      ctx.body = result
    } catch (err) { throw err }
  },
  deleteTask: async (ctx) => {
    try {
      const result = await taskDB.Dao.delete(ctx.query['ids[]'])
      ctx.body = result
    } catch (err) { throw err }
  },
}

/*
 * @Desc: 定时消息
 * @Author: skyvow
 * @Date: 2020-05-06 19:06:00
 * @LastEditors: skyvow
 * @LastEditTime: 2020-05-15 11:08:16
 */
const { mongoose } = require('../config/db')
const Schema = mongoose.Schema
const schema = new Schema({
  name: String, //名称
  type: { type: Number, default: 0 },//类型 0:普通消息
  content: String, //发送内容
  factor: { type: Number, default: 0 },//触发场景 0:个人，1:群聊
  status: { type: Number, default: 1 }, //状态 0停用 1启用
  friendId: String, //联系人
  roomId: String, //群id
  robotId: String, //机器人id
  cron: String, //cron表达式
  unit: Number, //时间单位 
  dayOfWeek: Number,
  month: Number,
  dayOfMonth: Number,
  hour: Number,
  minute: Number,
  second: Number,

})
const Task = mongoose.model('task', schema, 'task')
const { parseSearch } = require('../util')
module.exports = {
  Task,
  Dao: {
    list: async (params) => {
      try {
        const page = Number(params.page || 1)
        const limit = Number(params.pageSize || 10)
        const start = (page - 1) * limit
        const condition = parseSearch(params)
        const sortF = { skip: start, limit: limit, sort: { '_id': 1 } }
        const fields = {};
        const total = await Task.countDocuments(condition)
        const list = await Task.find(condition, fields, sortF)
        return { total, list }
      } catch (err) { throw err }
    },
    add: async (params) => {
      try {
        const result = await Task.create(params)
        await require('../bot/lib/Task').restart(result)
        return result
      } catch (err) { throw err }
    },
    update: async (_id, params) => {
      try {
        const result = await Task.findByIdAndUpdate({ _id }, params, { new: true })
        await require('../bot/lib/Task').restart(result)
        return result
      } catch (err) { throw err }
    },
    delete: async (ids) => {
      try {
        const result = await Task.deleteMany({ _id: { $in: ids } })
        ids.forEach((item) => require('../bot/lib/Task').stop(item))
        return result
      } catch (err) { throw err }
    }
  }
}

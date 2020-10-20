/*
 * @Desc: 自动回复
 * @Author: skyvow
 * @Date: 2020-05-06 18:24:06
 * @LastEditors: skyvow
 * @LastEditTime: 2020-05-15 11:08:25
 */
const { mongoose } = require('../config/db')
const Schema = mongoose.Schema
const schema = new Schema({
  keyword: String,//关键词
  content: String, //回复内容
  type: { type: Number, default: 0 },//类型 0:普通消息，1:发送群邀请(仅在私聊触发)  2:踢人指令(仅在群聊触发)
  factor: { type: Number, default: 0 },//触发场景 0:通用，1:私聊  2:群聊  3:通用群聊
  status: { type: Number, default: 1 }, //状态 0停用 1启用
  roomId: String, //群id
  robotId: String, //机器人id
  remark: String //备注
})

const Reply = mongoose.model('reply', schema, 'reply')
const { parseSearch } = require('../util')
module.exports = {
  Reply,
  Dao: {
    list: async (params) => {
      try {
        const page = Number(params.page || 1)
        const limit = Number(params.pageSize || 10)
        const start = (page - 1) * limit
        const condition = parseSearch(params)
        const sortF = { skip: start, limit: limit, sort: { '_id': 1 } }
        const fields = {};
        const total = await Reply.countDocuments(condition)
        const list = await Reply.find(condition, fields, sortF)
        return { total, list }
      } catch (err) { throw err }
    },
    add: async (params) => {
      try {
        let query = {keyword:params.keyword,factor:params.factor,robotId:params.robotId}
        if(params.factor==2){
          query.roomId = params.roomId
        }
        const ishave = await Reply.findOne(query,{_id:1})
        if(ishave) throw {message:'同一关键字同一场景只能存在1个'}
        const result = await Reply.create(params)
        return result
      } catch (err) { throw err }
    },
    update: async (_id, params) => {
      try {
        const result = await Reply.updateOne({ _id }, params)
        return result
      } catch (err) { throw err }
    },
    delete: async (ids) => {
      try {
        const result = await Reply.deleteMany({ _id: { $in: ids } })
        return result
      } catch (err) { throw err }
    }
  }

}
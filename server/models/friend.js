/*
 * @Desc: 好友
 * @Author: skyvow
 * @Date: 2020-04-30 15:39:55
 * @LastEditors: skyvow
 * @LastEditTime: 2020-05-06 18:45:47
 */
const { mongoose } = require('../config/db')
const Schema = mongoose.Schema
const schema = new Schema({
  id: { type: String }, //唯一
  name: String, //昵称
  alias: String, //备注
  avatar: String,//头像
  province: String, //省份
  city: String,//城市
  gender: Number, //性别
  weixin: String, //微信
  robotId: String, //机器人id
})

const Friend = mongoose.model('friend', schema, 'friend')
const { parseSearch } = require('../util')
module.exports = {
  Friend,
  Dao: {
    list: async (params) => {
      try {
        const page = Number(params.page || 1)
        const limit = Number(params.pageSize || 10)
        const start = (page - 1) * limit
        const condition = parseSearch(params)
        const sortF = { skip: start, limit: limit, sort: { '_id': 1 } }
        const fields = {};
        const total = await Friend.countDocuments(condition)
        const list = await Friend.find(condition, fields, sortF)
        return { total, list }
      } catch (err) { throw err }
    }
  }

}
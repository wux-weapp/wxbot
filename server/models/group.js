const { mongoose } = require('../config/db')
const Schema = mongoose.Schema
const schema = new Schema({
  id: String, //群id
  adminIdList:Array,
  avatar:String,
  ownerId:String,
  topic:String,
  memberIdList:{ type: Array },
  robotId:String, //机器人id
  roomJoinReply:{type:String,default:'你好，欢迎加入!'},
  autojoin: { type: Boolean, default: false },
  joinCode:String,
  maxFoul:{ type: Number, default: 3 },
  control: { type: Boolean, default: false },
})
const Group = mongoose.model('group', schema, 'group')
const { parseSearch } = require('../util')
module.exports = {
  Group,
  Dao:{
    myGroups:async(params)=>{
      try { 
        const condition = parseSearch(params)
        const sortF = { sort: { 'control': -1, 'joinCode': 1 } }
        const fields = {};
        const result = await Group.find(condition, fields, sortF)
        return result
      } catch (err) { throw err }
    },
    update:async(id,params)=>{
      try {
        const result = await Group.findByIdAndUpdate(id, params, {
          new: true
        }).exec();
        return result
      } catch (err) { throw err }
    },
  }
}
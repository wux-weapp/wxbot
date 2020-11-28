import { IRobotInfo } from '@/typings'
import { mongoose } from '../config/db'
const Schema = mongoose.Schema
const schema = new Schema({
  nickName: String,
  startSay: String,
  unknownSay: String,
  addFriendKeywords: Array,
  addFriendReply: String,
  name: String,
  avatar: String,
  id: String,
  weixin: String,
  status: { type: Number, default: 0 }, // 状态 0未启动 1已启动
  user: { type: Schema.Types.ObjectId, ref: 'auth' },
  createTime: { type: Date, default: new Date() },
  modifyTime: { type: Date, default: new Date() },
  token: String,
  lastLoginT: Date,
  lastLoginIp: String,
})

export interface IRobotModel extends IRobotInfo, mongoose.Document {}

const Robot = mongoose.model<IRobotModel>('robot', schema, 'robot')
export { Robot }

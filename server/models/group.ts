import { IGroupInfo, IQueryInfo } from '@/typings'
import { mongoose } from '../config/db'
import { parseSearch } from '../util'
const Schema = mongoose.Schema
const schema = new Schema({
  id: String, // 群id
  adminIdList: Array,
  avatar: String,
  ownerId: String,
  topic: String,
  memberIdList: { type: Array },
  robotId: String, // 机器人id
  roomJoinReply: { type: String, default: '你好，欢迎加入!' },
  autojoin: { type: Boolean, default: false },
  joinCode: String,
  maxFoul: { type: Number, default: 3 },
  control: { type: Boolean, default: false },
})

export interface IGroupModel extends IGroupInfo, mongoose.Document {}

const Group = mongoose.model<IGroupModel>('group', schema, 'group')
const Dao = {
  myGroups: async (params: IQueryInfo) => {
    try {
      const condition = parseSearch(params)
      const sortF = { sort: { control: -1, joinCode: 1 } }
      const fields = {}
      const result = await Group.find(condition, fields, sortF)
      return result
    } catch (err) {
      throw err
    }
  },
  update: async (id: string, params: IGroupInfo) => {
    try {
      const result = await Group.findByIdAndUpdate(id, params, {
        new: true,
      }).exec()
      return result
    } catch (err) {
      throw err
    }
  },
}
export { Group, Dao }

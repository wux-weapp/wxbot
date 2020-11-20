/*
 * @Desc: 机器人记忆
 * @Author: skyvow
 * @Date: 2020-05-08 19:10:38
 * @LastEditors: skyvow
 * @LastEditTime: 2020-05-08 19:42:52
 */
import { IMemoryInfo } from '@/typings'
import { mongoose } from '../config/db'
const Schema = mongoose.Schema
const schema = new Schema({
  person: String, // 联系人
  cmd: String, // 指令
  roomId: String, // 群id
  remark: String, // 备注
})

interface IMemoryModel extends IMemoryInfo, mongoose.Document {}

const Memory = mongoose.model<IMemoryModel>('memory', schema, 'memory')
export { Memory }

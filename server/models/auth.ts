import { IAuthInfo, IRobotInfo } from '@/typings'
import { mongoose } from '../config/db'
import { encryptPassword, createToken } from '../util'
import { Robot } from './robot'
const Schema = mongoose.Schema
const schema = new Schema({
  username: {
    type: String,
    required: true,
  },
  password: String,
  salt: String,
  createTime: { type: Date, default: new Date() },
  lastLoginT: Date,
  loginIp: String,
})

export interface IAuthModel extends IAuthInfo, mongoose.Document {}

const Auth = mongoose.model<IAuthModel>('auth', schema, 'auth')

const Dao = {
  login: async (params: IAuthInfo) => {
    try {
      const user = await Auth.findOne({ username: params.username })
      if (!user) {
        throw { message: '用户不存在' }
      }
      if (user.password !== encryptPassword(user.salt, params.password)) {
        throw { message: '密码有误' }
      }
      return { token: createToken({ id: user.id }) }
    } catch (err) {
      throw err
    }
  },
  getUser: async (userId: string) => {
    try {
      const user = await Auth.findOne({ _id: userId }, { username: 1 })
      if (!user) {
        throw { message: '用户不存在' }
      }
      const robot = await Robot.findOne({ user: user._id }, { id: 1 })
      return {
        username: user.username,
        robotId: (robot && robot.id) || null,
        robot_id: (robot && robot._id) || null,
      }
    } catch (err) {
      throw err
    }
  },
  getRobot: async (_id: string) => {
    try {
      const result = await Robot.findOne({ _id })
      return result
    } catch (err) {
      throw err
    }
  },
  addRobot: async (params: IRobotInfo) => {
    try {
      const result = await Robot.create(params)
      return result
    } catch (err) {
      throw err
    }
  },
  updateRobot: async (_id: string, params: IAuthInfo) => {
    try {
      const result = await Robot.updateOne({ _id }, params)
      return result
    } catch (err) {
      throw err
    }
  },
}

export { Auth, Dao }

const init = async () => {
  const exists = await Auth.exists({})
  if (!exists) {
    await Auth.create({
      username: 'admin',
      salt: '123456',
      password: '146123f005da382f342c4e593eb5bf5192d2267c',
    })
    // await Auth.create({ username: 'admin', salt: '123456', password: encryptPassword('123456', '111111') })
    // await Auth.create({ username: 'guest', salt: '123456', password: encryptPassword('123456', '111111') })
  }
}
init()

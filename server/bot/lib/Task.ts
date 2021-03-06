/*
 * @Desc: 定时任务
 * @Author: skyvow
 * @Date: 2020-05-09 17:03:09
 * @LastEditors: skyvow
 * @LastEditTime: 2020-05-15 16:56:40
 */
import schedule from 'node-schedule'
import logger from '../../util/logger'
import { ITaskModel, Task } from '../../models/task'
import { Group } from '../../models/group'
import { getReply } from '../../util/ajax'
import { ITaskRuleInfo } from '~/typings'

const tasks: {
  [key: string]: schedule.Job
} = {}
/**
 * 初始化任务列表
 */
const init = async () => {
  stop()
  logger.info('初始化任务...')
  const list = await Task.find({ status: 1, robotId: global.bot.id })
  for (let i = 0; i < list.length; i++) {
    await start(list[i])
  }
  logger.info(`已初始化 ${list.length} 个任务`)
}
/**
 * 重启任务
 * @param {object} data
 */
const restart = async (data: ITaskModel) => {
  try {
    if (!global.bot) {
      throw { message: '机器人已掉线，请重新登录' }
    }
    const task = tasks[data._id]
    if (task) {
      stop(data._id)
      if (data.status === 0) {
        logger.info(`${data.name} 定时任务已关闭------`)
      }
      return
    }
    await start(data)
  } catch (err) {
    throw err
  }
}
/**
 * 开启任务
 * @param {object} data
 */
const start = async (data: ITaskModel) => {
  try {
    const rule: ITaskRuleInfo = {
      second: data.second,
    }
    if (data.minute || data.minute === 0) {
      rule.minute = data.minute
    }
    if (data.hour || data.hour === 0) {
      rule.hour = data.hour
    }
    if (data.dayOfWeek) {
      rule.dayOfWeek = data.dayOfWeek
    }
    if (data.dayOfMonth) {
      rule.dayOfMonth = data.dayOfMonth
    }
    const sc = schedule.scheduleJob(data.cron ? data.cron : rule, async () => {
      logger.info(`${data.name} 定时任务已启动------`)
      if (data.factor === 0) {
        const contact = await global.bot.Contact.find({ id: data.friendId })
        const msg = await getReply(data.content, 'task')
        await contact.say(msg)
      }
      if (data.factor === 1) {
        const room = await global.bot.Room.find({ id: data.roomId })
        const msg = await getReply(data.content, 'task')
        await room.say(msg)
      }
      if (data.factor === 2) {
        const groups = await Group.find({ control: true }, { id: 1 })
        const msg = await getReply(data.content, 'task')
        for (let i = 0, len = groups.length; i < len; i++) {
          const room = await global.bot.Room.find({ id: groups[i].id })
          await room.say(msg)
        }
      }
    })
    tasks[data._id] = sc
  } catch (err) {
    throw err
  }
}
/**
 * 停止任务
 *
 * 当 id 存在时，停止指定的任务，否则停止所有任务
 * @param {string} id
 */
const stop = async (id?: string) => {
  try {
    if (!id) {
      for (const key in tasks) {
        tasks[key].cancel()
        delete tasks[key]
      }
    } else {
      tasks[id].cancel()
      delete tasks[id]
    }
  } catch (err) {
    console.log(err)
  }
}
export { init, start, restart, stop }

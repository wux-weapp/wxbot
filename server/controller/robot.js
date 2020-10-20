/*
 * @Desc: robot
 * @Author: skyvow
 * @Date: 2020-04-24 21:09:47
 * @LastEditors: skyvow
 * @LastEditTime: 2020-05-12 15:49:06
 */
const Bot = require('../bot')
const { Robot } = require('../models/robot')
const {Group} = require('../models/group')
module.exports = {
  login: async (ctx) => {
    try {
      if (!ctx.request.body.id) throw { message: '缺少id' }
      const bot = new Bot(ctx.request.body.id)
      const result = await bot.start()
      ctx.body = result
    } catch (err) { throw err }
  },
  loginOut: async (ctx) => {
    try {
      if (!global.bot) {
        await Robot.updateOne({ _id: ctx.request.body.id }, { status: 0 })
        delete global.bot
        return ctx.body = {}
      }
      await bot.logout()
      ctx.body = {}
    } catch (err) { throw err }
  },
  friendSay: async (ctx) => {
    try {
      const contact = await bot.Contact.find({ id: ctx.request.body.id })
      await contact.say(ctx.request.body.content)
      ctx.body = {}
    } catch (err) { throw err }
  },
  roomSay: async (ctx) => {
    try {
      const room = await bot.Room.find({ id: ctx.request.body.id })
      await room.say(ctx.request.body.content)
      ctx.body = {}
    } catch (err) { throw err }
  },
  getRoom: async (ctx) => {
    try {
      const room = await bot.Room.find({ id: ctx.params.id })
      const topic = await room.topic()
      const announce = await room.announce()
      ctx.body = {topic,announce}
    } catch (err) { throw err }
  },
  updateRoom: async (ctx) => {
    try {
      const room = await bot.Room.find({ id: ctx.params.id })
      if(ctx.request.body.topic) {
        await room.topic(ctx.request.body.topic)
        await Group.updateOne({id:ctx.params.id},{topic:ctx.request.body.topic})
      }
      if(ctx.request.body.announce) {
        await room.announce(ctx.request.body.announce)
      }
      ctx.body = {}
    } catch (err) {throw {message:'没有权限，不是群主或者管理员'} }
  },
  roomQuit: async (ctx) => {
    try {
      const room = await bot.Room.find({ id: ctx.request.body.id })
      await room.quit()
      ctx.body = {}
    } catch (err) { throw err }
  }


}

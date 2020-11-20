/*
 * @Desc: 消息监听
 * @Author: skyvow
 * @Date: 2020-04-26 15:27:24
 * @LastEditors: skyvow
 * @LastEditTime: 2020-05-31 18:02:12
 */
import { Message } from 'wechaty'
import { IMemoryInfo } from '@/typings'
import { Group } from '../../models/group'
import { Robot } from '../../models/robot'
import { Reply } from '../../models/reply'
import { Memory } from '../../models/memory'
import { getReply } from '../../util/ajax'

async function onMessage (msg: Message) {
  if (msg.self()) {
    return
  }
  console.log('=============================')
  console.log(`msg : ${msg}`)
  console.log(`from: ${msg.from() ? msg.from()?.name() : null}: ${msg.from() ? msg.from()?.id : null}`)
  if (msg.type() === Message.Type.Text) {
    // 来自群聊
    const room = msg.room()
    if (room) {
      const group = await Group.findOne({ id: room.id }, { control: 1 })
      if (!group || !group.control) {
        return
      }
      if (await msg.mentionSelf()) {
        // @自己
        let self = ''
        self = '@' + global.bot.name()
        let sendText = msg.text().replace(self, '')
        sendText = sendText.trim()
        // 获取需要回复的内容
        let content = await keyWordReply(sendText, room.id)
        if (!content) {
          content = await getReply(sendText, 'normal')
        }
        console.log(`reply: ${content}`)
        room.say(content)
        return
      }
      // @成员
      let sendText = msg.text()
      let person = ''
      if (sendText.indexOf('@') === 0) {
        const str = sendText.replace('@', '').split(' ')
        if (!str[1]) {
          return
        }
        person = str[0].trim()
        sendText = str[1].trim()
      }
      let content = await keyWordReply(sendText, room.id, person, room)
      if (content) {
        if (person) {
          content = `@${person} ${content}`
        } else {
          content = `「${msg.from()?.name()}：${msg.text()}」\n- - - - - - - - - - - - - - -\n${content}`
        }
        console.log(`reply: ${content}`)
        room.say(content)
      }
      return
    }
    // 私聊
    if (await isRoomName(msg)) {
      return
    }
    let content = await keyWordReply(msg.text())
    if (!content) {
      content = await getReply(msg.text(), 'normal')
    }
    console.log(`reply: ${content}`)
    await msg.say(content)
  }
}
/**
 * @description 收到消息是否群聊名称
 * @param {Object} bot 实例对象
 * @param {Object} msg 消息对象
 * @return {Bool}
 */
async function isRoomName (msg: any): Promise<boolean> {
  const group = await Group.findOne({ joinCode: msg.text() }, { id: 1 })
  if (group) {
    // 通过群聊id获取群聊实例
    const room = await global.bot.Room.find({ id: group.id })
    if (await room.has(msg.from())) {
      await msg.say('您已经在群聊中了')
      return true
    }
    await room.add(msg.from())
    await msg.say('已发送群邀请')
    return true
  }
  return false
}
/**
 * 自定义回复
 * @param {string} keyword 关键字
 * @param {string} roomId 群聊id
 * @param {string} person 艾特的群成员
 * @param {string} room 群聊
 */
async function keyWordReply (keyword?: string, roomId?: string, person?: string, room?: any) {
  try {
    const res = await Reply.findOne({ keyword, status: 1 }, { content: 1, type: 1, factor: 1, roomId: 1 })
    if (!res) {
      return false
    }
    if (roomId) {
      // 群聊
      if (res.type === 0) {
        if (res.factor === 0 || res.factor === 3) {
          return getReply(res.content, 'keyword')
        }
        if (res.factor === 2 && roomId === res.roomId) {
          return getReply(res.content, 'keyword')
        }
      }
      if (res.type === 2) {
        if (person) {
          const group = await Group.findOne({ id: roomId }, { maxFoul: 1 })
          if (!group) { return }
          let foulCount = await Memory.countDocuments({
            person,
            cmd: keyword,
            roomId,
          })
          if (group.maxFoul - 1 === foulCount) {
            const contact = await global.bot.Contact.find({ name: person })
            await room.del(contact)
            await Memory.deleteMany({ person, roomId })
          } else {
            await Memory.create({ person, cmd: keyword, roomId } as IMemoryInfo)
            foulCount++
            return `您一定是违反了群的相关规则，如果再收到${group.maxFoul - foulCount}次同类消息，您将被移出本群。`
          }
        }
      }
      return false
    }
    // 私聊
    if (res.type === 1) {
      const robot = await Robot.findOne({ id: global.bot.id }, { id: 1, nickName: 1 })
      if (!robot) { return }
      const roomList = await Group.find({ robotId: robot.id, autojoin: true }, { topic: 1, id: 1, joinCode: 1 })
      if (!roomList) { return }
      let content = `${robot.nickName}管理群聊有${roomList.length}个：\n\n`
      roomList.forEach((item: any) => {
        content += `${item.joinCode}：【${item.topic}】\n`
      })
      content += '\n回复字母即可加入对应的群哦，比如发送 ' + roomList[0].joinCode
      return content
    }
    if (res.factor === 0 || res.factor === 1) {
      return getReply(res.content, 'keyword')
    }
    return false
  } catch (err) {
    return false
  }
}

export default onMessage

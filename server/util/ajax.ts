import crypto from 'crypto'
import { FileBox } from 'file-box'
import urllib from 'urllib'
import { v1 } from 'node-uuid'
import config from '../../config'
import { getTGImage } from './tiangou'
const md5 = crypto.createHash('md5')
const uniqueId = md5.update(v1()).digest('hex')

const { tianApiUrl, tianApiKey } = config
const articleTypes = ['__JUEJIN__', '掘金早报', '__TIANGOU__', '舔狗日记', '__ZHIHU__', '知乎日报']

function getDateString (split = ['-', '-', '']) {
  return `${new Date().getFullYear()}${split[0]}${new Date().getMonth() + 1}${split[1]}${new Date().getDate()}${
    split[2]
  }`
}

async function request (url: string, params: any = {}) {
  const pkg = {
    method: params.method || 'get',
    headers: {
      'Content-Type': 'application/json',
    },
    data: params.data || {},
    encoding: null,
    timeout: 5000,
  }
  /* eslint prefer-const: "off" */
  let { status, data } = await urllib.request(url, pkg)
  if (status !== 200) {
    return '不好意思，我断网了'
  }
  data = JSON.parse(data.toString())
  // if (data.code !== 200) return '我累啦，等我休息好再来哈'
  // console.log(data)
  return data
}

/**
 * 掘金早报
 *
 * @see https://juejin.im/
 *
 * @returns
 */
async function getArticleFromJUEJIN () {
  const data = await request('https://apinew.juejin.im/recommend_api/v1/article/recommend_all_feed', {
    method: 'POST',
    data: {
      id_type: 2,
      client_type: 2608,
      sort_type: 200,
      cursor: '0',
      limit: 20,
    },
  })
  if (data && data.err_no === 0) {
    const result = data.data
      .filter((v: any) => v.item_info.article_info)
      .slice(0, 5)
      .reduce(
        (acc: any[], item: any, i: number) => {
          const articleInfo = item.item_info.article_info
          return [...acc, `${i + 1}.${articleInfo.title} - https://juejin.im/post/${articleInfo.article_id}`]
        },
        [`掘金早报 - ${getDateString()}`],
      )
      .join('\n')
    return result
  }
  return null
}

/**
 * 舔狗日记
 *
 * @see https://www.tianapi.com/gethttp/180
 *
 * @returns
 */
async function getArticleFromTIANGOU (args: any[] = []) {
  const day = new Date().getDate()
  const month = new Date().getMonth() + 1
  const d = `${month}月${day}日`
  const [type = 'P', date = d, weather = '晴', content] = args
  let data: string = content
  if (!content) {
    const res = await request(tianApiUrl + 'tiangou/index', {
      data: { key: tianApiKey },
    })
    if (res.code !== 200) {
      return '我累啦，等我休息好再来哈'
    }
    data = res.newslist[0].content
  }
  if (type !== 'P') { return data }
  const dataUrl = await getTGImage(data, {
    date,
    weather
  })
  const fileBox = FileBox.fromDataURL(dataUrl, 'tgrj.png')
  return fileBox
}

/**
 * 知乎日报
 *
 * @see https://daily.zhihu.com/
 *
 * @returns
 */
async function getArticleFromZHIHU () {
  const data = await request('https://news-at.zhihu.com/api/4/news/latest')
  if (!data.stories) {
    return '我累啦，等我休息好再来哈'
  }
  const result = data.stories
    .slice(0, 5)
    .reduce(
      (acc: any[], item: any, i: number) => {
        return [...acc, `${i + 1}.${item.title} - ${item.url}`]
      },
      [`知乎日报 - ${getDateString()}`],
    )
    .join('\n')
  return result
}

/**
 * 机器人回复内容
 *
 * @see https://www.tianapi.com/apiview/47
 *
 * @param {String} keyword 收到消息
 * @returns
 */
async function getReplyToMSG (keyword: string) {
  const url = tianApiUrl + 'robot/'
  const pkg = {
    method: 'get',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      key: tianApiKey,
      question: keyword,
      mode: 1,
      datatype: 0,
      userid: uniqueId,
      limit: 1,
    },
    encoding: null,
    timeout: 5000,
  }
  const data = await request(url, pkg)
  if (data.code !== 200) {
    return '我累啦，等我休息好再来哈'
  }
  return data.newslist[0].reply
}

async function getArticle (type: string, args: any[] = []) {
  let result: any = '不好意思，我断网了'
  switch (type) {
    case '__JUEJIN__':
    case '掘金早报':
      result = await getArticleFromJUEJIN()
      break
    case '__TIANGOU__':
    case '舔狗日记':
      result = await getArticleFromTIANGOU(args)
      break
    case '__ZHIHU__':
    case '知乎日报':
      result = await getArticleFromZHIHU()
      break
  }
  return result
}

getArticle('__TIANGOU__', ['P', '2.25', '小雨'])

/**
 * 针对自定义内容进行回复
 *
 * @param {String} content 自定义内容
 */
async function getReplyToContent (content: string, args: any[] = []) {
  const [type = '', ...argsH] = content ? content.split(' ') : []
  if (type && articleTypes.includes(type)) {
    try {
      const msg = await getArticle(type, argsH.length ? argsH : args)
      return msg
    } catch (err) {
      console.log(err)
    }
  }
  return type
}

/**
 * 机器人回复内容
 *
 * @param {String} msg 收到消息
 * @param {Number} type 消息类型, normal: 普通消息回复, keyword: 关键词内容回复, task: 定时任务内容回复
 */
async function getReply (msg: string = '', type: 'normal' | 'keyword' | 'task' = 'normal', args?) {
  switch (type) {
    case 'keyword':
    case 'task':
      return await getReplyToContent(msg, args)
    default:
      return await getReplyToMSG(msg)
  }
}

export { getReplyToMSG, getReplyToContent, getReply }

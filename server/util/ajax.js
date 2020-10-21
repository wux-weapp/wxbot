const request = require('request')
const TXHOST = 'http://api.tianapi.com/txapi/'
const { tianApiKey } = require('../../config')
const urllib = require('urllib')

const articleTypes = [
  '__JUEJIN__',
  '__TIANGOU__'
]

function getDateString (split = ['-', '-', '']) {
  return `${new Date().getFullYear()}${split[0]}${new Date().getMonth() + 1}${split[1]}${new Date().getDate()}${split[2]}`
}

function handleRequestByPromise(options) {
  const op = Object.assign(
    {},
    {
      url: "",
      method: "GET",
      encoding: null
    },
    options
  )

  if (op.url === "") {
    throw new Error("请求的url地址不正确")
  }

  const promise = new Promise(function(resolve, reject) {
    request(op, (err, response, body) => {
      if (err) reject(err)

      if (response && response.statusCode === 200) {
        resolve(body)
      } else {
        reject(`请求✿✿✿${url}✿✿✿失败`)
      }
    })
  })

  return promise
}

/**
 * 掘金早报
 *
 * @returns
 */
async function getArticleFromJUEJIN () {
  const res = await handleRequestByPromise({
    url: 'https://apinew.juejin.im/recommend_api/v1/article/recommend_all_feed',
    method: 'POST',
    json: {
      'id_type': 2,
      'client_type': 2608,
      'sort_type': 200,
      'cursor': '0',
      'limit': 20
    }
  })
  if (res && res.err_no === 0) {
    const result = res.data
      .filter((v) => v.item_info.article_info)
      .slice(0, 5)
      .reduce((acc, item, i) => {
        const article_info = item.item_info.article_info
        return [
          ...acc, 
          `${i+1}.${article_info.title} - https://juejin.im/post/${article_info.article_id}`
        ]
      }, [`掘金早报 - ${getDateString()}`])
      .join('\n')
    // console.log(result)
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
async function getArticleFromTIANGOU () {
  let url = TXHOST + 'tiangou/index';
  const pkg = {
    method: 'get',
    headers: {
      'Content-Type': 'application/json'
    },
    data: {
      key: tianApiKey
    },
    encoding: null,
    timeout: 5000,
  }
  let { status, data } = await urllib.request(url, pkg)
  if (status !== 200) return '不好意思，我断网了'
  data = JSON.parse(data.toString())
  if (data.code != 200) return '我累啦，等我休息好再来哈'
  const result = [`舔狗日记 - ${getDateString(['年', '月', '日']).slice(5)}`, data.newslist[0].content].join('\n')
  // console.log(result)
  return result
}

async function getArticle (type) {
  if (type === '__JUEJIN__') {
    return await getArticleFromJUEJIN()
  } else if (type === '__TIANGOU__') {
    return await getArticleFromTIANGOU()
  }
  return '不好意思，我断网了'
}

module.exports = {
  getArticle,
  articleTypes
}
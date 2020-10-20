const request = require("request")
const articleTypes = [
  '__JUEJIN__'
]
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
      }, [`掘金早报 - ${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`])
      .join('\n')
    // console.log(result)
    return result
  }
  return null
}

async function getArticle (type) {
  if (type === '__JUEJIN__') {
    return await getArticleFromJUEJIN()
  }
}

module.exports = {
  getArticle,
  articleTypes
}
import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import config from '../../config'
const { secret } = config
const encryptPassword = (salt: string, password: string) => {
  const str = salt + password
  const md5 = crypto.createHash('sha1')
  md5.update(str)
  return md5.digest('hex')
}
const generateStr = (len: number, charType: string) => {
  len = len || 6
  charType = charType || 'number'
  const chars1 = 'ABCDEFGHJKMNPQRSTUVWXYabcdefghjkmnpqrstuvwxy'
  const chars2 = '0123456789'
  const chars = charType === 'string' ? chars1 : chars2
  const maxPos = chars.length
  let str = ''
  for (let i = 0; i < len; i++) {
    str += chars.charAt(Math.floor(Math.random() * maxPos))
  }
  return str
}
const createToken = (payload = {}, expiresIn: string = '24h') => {
  return jwt.sign(payload, secret, { expiresIn })
}
const verifyToken = (token: string) => {
  return jwt.verify(token.split(' ')[1], secret)
}
const parseSearch = function (params: any) {
  const result: any = {}
  for (const key in params) {
    if (key.indexOf('search') === 0 && key.split('$$').length >= 3 && params[key] !== '') {
      const field = key.split('$$')[1]
      // 搜索字段
      const sType = key.split('$$')[2]
      // 搜索方式
      let value = params[key] || ''
      // 值
      if (value !== 'undefined' && value !== '' && value !== 'null') {
        switch (sType) {
          case 'all':
            value = {
              $all: [new RegExp('.*' + value + '.*', 'gi')],
            }
            for (let i = 0; i < field.split('|').length; i++) {
              result[field.split('|')[i]] = value
            }
            break
          case 'orAndall':
            let tempRegExp
            const params: any[] = []
            for (let i = 0; i < field.split('|').length; i++) {
              for (let j = 0; j < value.split('|').length; j++) {
                const item: any = {}
                tempRegExp = {
                  $all: [new RegExp('.*' + value.split('|')[j] + '.*', 'gi')],
                }
                item[field.split('|')[i]] = tempRegExp
                params.push(item)
              }
            }
            result.$or = params
            break
          case 'or':
            for (let i = 0; i < field.split('|').length; i++) {
              const params: any[] = []
              for (let j = 0; j < value.split('|').length; j++) {
                params.push(value.split('|')[j])
              }
              result[field.split('|')[i]] = {
                $in: params,
              }
            }
            break
          case 'gte':
            for (let i = 0; i < field.split('|').length; i++) {
              result[field.split('|')[i]] = {
                $gte: value,
              }
            }
            break
          case 'lte':
            for (let i = 0; i < field.split('|').length; i++) {
              result[field.split('|')[i]] = {
                $lte: value,
              }
            }
            break
          case 'between':
            const values = value.split('|')
            if (values.length === 2) {
              for (let i = 0; i < field.split('|').length; i++) {
                if (values[0] !== '' && values[1] !== '') {
                  result[field.split('|')[i]] = {
                    $gte: values[0],
                    $lte: values[1],
                  }
                } else if (values[0] !== '') {
                  result[field.split('|')[i]] = {
                    $gte: values[0],
                  }
                } else if (values[1] !== '') {
                  result[field.split('|')[i]] = {
                    $lte: values[1],
                  }
                }
              }
            }
            break
          default:
            for (let i = 0; i < field.split('|').length; i++) {
              result[field.split('|')[i]] = value
            }
            break
        }
      }
    }
  }
  return result
}
export { encryptPassword, generateStr, createToken, verifyToken, parseSearch }

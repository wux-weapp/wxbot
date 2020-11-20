/*
 * @Desc: logger
 * @Author: skyvow
 * @Date: 2020-04-26 14:28:26
 * @LastEditors: skyvow
 * @LastEditTime: 2020-05-15 18:29:05
 */
import { Context } from 'koa'
import log4js from 'log4js'
import logConfig from '../config/log4js'
// 加载配置文件
log4js.configure(logConfig)
const logUtil: {
  logError: (ctx: Context, error: Error, resTime: number) => void
  error: (err: string) => void
  info: (info: string) => void
  logResponse: (ctx: Context, resTime: number) => void
  logInfo: (info: any) => void
} = {
  logError () {},
  error () {},
  info () {},
  logResponse () {},
  logInfo () {},
}
// 调用预先定义的日志名称
const resLogger = log4js.getLogger('resLogger')
const errorLogger = log4js.getLogger('errorLogger')
const infoLogger = log4js.getLogger('infoLogger')
const consoleLogger = log4js.getLogger()
// 封装错误日志
logUtil.logError = function (ctx, error, resTime) {
  if (ctx && error) {
    errorLogger.error(formatError(ctx, error, resTime))
  }
}
logUtil.error = function (err) {
  errorLogger.error(err)
}
logUtil.info = function (info) {
  infoLogger.info(info)
}
// 封装响应日志
logUtil.logResponse = function (ctx, resTime) {
  if (ctx) {
    resLogger.info(formatRes(ctx, resTime))
  }
}
logUtil.logInfo = function (info) {
  if (info) {
    consoleLogger.info(formatInfo(info))
  }
}
const formatInfo = function (info: any) {
  let logText = ''
  logText += '\n' + '***************info log start ***************' + '\n'
  logText += 'info detail: ' + '\n' + JSON.stringify(info) + '\n'
  logText += '*************** info log end ***************' + '\n'
  return logText
}
// 格式化响应日志
const formatRes = function (ctx: Context, resTime: number) {
  let logText = ''
  logText += '\n' + '*************** response log start ***************' + '\n'
  logText += formatReqLog(ctx.request, resTime)
  logText += 'response status: ' + ctx.status + '\n'
  logText += 'response body: ' + '\n' + JSON.stringify(ctx.body) + '\n'
  logText += '*************** response log end ***************' + '\n'
  return logText
}
// 格式化错误日志
const formatError = function (ctx: Context, err: Error, resTime: number) {
  let logText = ''
  logText += '\n' + '*************** error log start ***************' + '\n'
  logText += formatReqLog(ctx.request, resTime)
  logText += 'err name: ' + err.name + '\n'
  logText += 'err message: ' + err.message + '\n'
  logText += 'err stack: ' + err.stack + '\n'
  logText += '*************** error log end ***************' + '\n'
  return logText
}
// 格式化请求日志
const formatReqLog = function (req: any, resTime: number) {
  let logText = ''
  const method = req.method
  logText += 'request method: ' + method + '\n'
  logText += 'request originalUrl:  ' + req.originalUrl + '\n'
  logText += 'request client ip:  ' + req.ip + '\n'
  if (method === 'GET') {
    logText += 'request query:  ' + JSON.stringify(req.query) + '\n'
  } else {
    logText += 'request body: ' + '\n' + JSON.stringify(req.body) + '\n'
  }
  // 服务器响应时间
  logText += 'response time: ' + resTime + '\n'
  return logText
}
export default logUtil

/*
 * @Desc: logger
 * @Author: skyvow
 * @Date: 2020-04-26 14:28:26
 * @LastEditors: skyvow
 * @LastEditTime: 2020-05-15 18:29:05
 */
const log4js = require('log4js');
let log_config = require('../config/log4js');
//加载配置文件
log4js.configure(log_config);
let logUtil = {};
//调用预先定义的日志名称
const resLogger = log4js.getLogger("resLogger");
const errorLogger = log4js.getLogger("errorLogger");
const infoLogger = log4js.getLogger("infoLogger");
const consoleLogger = log4js.getLogger();
//封装错误日志
logUtil.logError = function (ctx, error, resTime) {
  if (ctx && error) {
    errorLogger.error(formatError(ctx, error, resTime));
  }
};
logUtil.error = function (err) {
  errorLogger.error(err);
};
logUtil.info = function (info) {
  infoLogger.info(info);
};
//封装响应日志
logUtil.logResponse = function (ctx, resTime) {
  if (ctx) {
    resLogger.info(formatRes(ctx, resTime));
  }
};
logUtil.logInfo = function (info) {
  if (info) {
    consoleLogger.info(formatInfo(info));
  }
};
const formatInfo = function (info) {
  let logText = new String();
  logText += "\n" + "***************info log start ***************" + "\n";
  logText += "info detail: " + "\n" + JSON.stringify(info) + "\n";
  logText += "*************** info log end ***************" + "\n";
  return logText;
}
//格式化响应日志
const formatRes = function (ctx, resTime) {
  let logText = new String();
  logText += "\n" + "*************** response log start ***************" + "\n";
  logText += formatReqLog(ctx.request, resTime);
  logText += "response status: " + ctx.status + "\n";
  logText += "response body: " + "\n" + JSON.stringify(ctx.body) + "\n";
  logText += "*************** response log end ***************" + "\n";
  return logText;
}
//格式化错误日志
const formatError = function (ctx, err, resTime) {
  let logText = new String();
  logText += "\n" + "*************** error log start ***************" + "\n";
  logText += formatReqLog(ctx.request, resTime);
  logText += "err name: " + err.name + "\n";
  logText += "err message: " + err.message + "\n";
  logText += "err stack: " + err.stack + "\n";
  logText += "*************** error log end ***************" + "\n";
  return logText;
};
//格式化请求日志
const formatReqLog = function (req, resTime) {
  let logText = new String();
  const method = req.method;
  logText += "request method: " + method + "\n";
  logText += "request originalUrl:  " + req.originalUrl + "\n";
  logText += "request client ip:  " + req.ip + "\n";
  if (method === 'GET') {
    logText += "request query:  " + JSON.stringify(req.query) + "\n";
  } else {
    logText += "request body: " + "\n" + JSON.stringify(req.body) + "\n";
  }
  //服务器响应时间
  logText += "response time: " + resTime + "\n";
  return logText;
}
module.exports = logUtil;
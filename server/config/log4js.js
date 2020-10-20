const path = require('path');
//日志根目录
const baseLogPath = path.resolve(__dirname, '../../logs')
//错误日志目录
const errorPath = "/error";
//错误日志文件名
const errorFileName = "error";
//错误日志输出完整路径
const errorLogPath = baseLogPath + errorPath + "/" + errorFileName;
//var errorLogPath = path.resolve(__dirname, "../logs/error/error");
//响应日志目录
const responsePath = "/response";
//响应日志文件名
const responseFileName = "response";
//响应日志输出完整路径
const responseLogPath = baseLogPath + responsePath + "/" + responseFileName;
//var responseLogPath = path.resolve(__dirname, "../logs/response/response");
//响应日志目录
const infoPath = "/info";
//响应日志文件名
const infoFileName = "info";
//响应日志输出完整路径
const infoLogPath = baseLogPath + infoPath + "/" + infoFileName;
module.exports = {
  //日志格式等设置
  appenders:
  {
    "rule-console": { "type": "console" },
    "errorLogger": {
      "type": "dateFile",
      "filename": errorLogPath,
      "pattern": "-yyyy-MM-dd.log",
      "alwaysIncludePattern": true,
      "encoding": "utf-8",
      "maxLogSize": 10000,
      "numBackups": 3,
      "path": errorPath
    },
    "resLogger": {
      "type": "dateFile",
      "filename": responseLogPath,
      "pattern": "-yyyy-MM-dd.log",
      "alwaysIncludePattern": true,
      "encoding": "utf-8",
      "maxLogSize": 10000,
      "numBackups": 3,
      "path": responsePath
    },
    "infoLogger": {
      "type": "dateFile",
      "filename": infoLogPath,
      "pattern": "-yyyy-MM-dd.log",
      "alwaysIncludePattern": true,
      "encoding": "utf-8",
      "maxLogSize": 10000,
      "numBackups": 3,
      "path": infoPath
    },
  },
  //供外部调用的名称和对应设置定义
  categories: {
    "default": { "appenders": ["rule-console"], "level": "all" },
    "resLogger": { "appenders": ["resLogger"], "level": "info" },
    "errorLogger": { "appenders": ["errorLogger"], "level": "error" },
    "infoLogger": { "appenders": ["infoLogger"], "level": "info" },
    "http": { "appenders": ["resLogger"], "level": "info" }
  },
  pm2: true,
  //replaceConsole: true,
  "baseLogPath": baseLogPath
}
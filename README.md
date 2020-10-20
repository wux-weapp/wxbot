# wechat-robot
基于 nodejs，nuxt, wechaty 开发的个人微信号机器人平台，现代化 UI 和用户体验

[![Powered by Wechaty](https://img.shields.io/badge/Powered%20By-Wechaty-green.svg)](https://github.com/chatie/wechaty)
[![Wechaty开源激励计划](https://img.shields.io/badge/Wechaty-开源激励计划-green.svg)](https://github.com/juzibot/Welcome/wiki/Everything-about-Wechaty)
## 界面预览
* 首页
![首页](http://pic.loveyh.com/wxbot-1.png)
* 后台管理
![控制台](http://pic.666up.cn/wxbot/1.png)
![自动回复](http://pic.666up.cn/wxbot/2.png)
![我的好友](http://pic.666up.cn/wxbot/3.png)
![我的群聊](http://pic.666up.cn/wxbot/4.png)
![定时任务](http://pic.666up.cn/wxbot/5.png)

## 在线实例
 [http://94.191.126.174:8081](http://94.191.126.174:8081)    
 用户名：guest   密码：111111
 #### 实现功能
 
+ 控制台
   - 绑定机器人
   - 登录
   - 自动通过好友验证关键词设置，当有人添加机器人时，关键词匹配后直接通过
   - 好友验证通过自动回复
   - 退出
+ 自动回复
  + 普通消息
    - 针对好友/某个群聊/所有群聊 设置关键词自动回复
  + 加群邀请
    - 机器人回复群聊列表，好友可以选择性进群
  + 踢人指令
    - 机器人识别指令，自动把成员移出群聊
+ 我的好友
  - 单独对某个好友送消息
+ 我的群聊
  - 群聊列表，管理所有群聊
  - 设置群聊名称，发布公告，发送群消息
  - 设置群聊基本信息，入群欢迎语，成员违规次数上限，是否受机器人控制
+ 定时任务
  - 针对好友/某个群聊/所有群聊设置定时任务，机器人在指定时间会触发消息推送
+ 智能聊天
  - 低智商对话
  - 成语接龙，查天气，查酒店，歇后语...

## 实际效果
![首页](http://pic.666up.cn/wxbot/chat.png)

## 技术构成
* 服务端 [Node.js](https://nodejs.org/)
* SSR框架 [NuxtJS](https://nuxtjs.org/)
* 前端框架 [Vue](https://vuejs.org/)
* UI组件 [Ant Design of Vue](https://www.antdv.com/docs/vue/introduce-cn/)
* 持久化 [MongoDB](https://www.mongodb.org/)
* ipad协议 [wechaty-puppet-padplus](https://github.com/wechaty/wechaty-puppet-padplus/)

## 快速开始

### 准备条件

安装 [Node.js](https://nodejs.org/en/download/) (v10 以上版本)、[MongoDB](https://www.mongodb.org/downloads/)。  
推荐安装 [cnpm](https://cnpmjs.org/) 

### 安装依赖
```Shell
$ cnpm i
```
## 本地单机插件版本

`直接进入local目录，也可将此目录单独移出至其他地方，修改配置文件config.js，再node index 启动即可`

## web版本

### 启动站点

* 开发模式

```Shell
$ npm run dev
```

* 生产模式

先编译项目
```shell
$ npm run build
```

再启动站点
```shell
$ npm start
```

打开浏览器，访问 [http://localhost:3000/](http://localhost:3000)


## 系统设置

根据实际情况修改 `config.js` 配置文件，修改后需要重启服务器才能生效。  
参数说明：

#### host
`String` 类型，主机名，配置为 `0.0.0.0` 表示监听任意主机。

#### port
`Number` 类型，端口号。

#### mongoUrl
`String` 类型，MongoDB 链接。

#### secret
`String` 类型，[JWT](https://github.com/auth0/node-jsonwebtoken) 秘钥。

#### tianApiKey
`String` 天行api秘钥

## 线上部署

### 使用PM2
推荐使用 [pm2](https://pm2.keymetrics.io/) 进行 Node.js 的进程管理和持久运行。

#### 安装
```Shell
$ cnpm i -g pm2
```
#### 启动
```Shell
$ pm2 start pm2.config.js
```

## 最后

##### 有兴趣的朋友可以赏个star

前后将近折腾了一个月时间，还有很多可以完善的功能，代码上也有些不妥之处，欢迎大家多给意见，共同学习，让平台更完善。

好玩的东西总要先体验一把，扫码加我的小助手，验证消息写 `机器人` 即可直接通过啦，也可以加群交流。也可以把机器人加到你的群聊中来玩耍哦，
登陆上面的在线实例，设置关键字就能体验啦。

![WechatIMG127](http://pic.666up.cn/wxbot/qrcode.png)

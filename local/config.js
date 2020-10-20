const config = {
  PUPPET_PADPLUS_TOKEN: "协议Token",
  BOT_NAME: "机器人名字",
}

if (process.env.NODE_ENV == 'development') {
  Object.assign(config, require('../.local.config'))
}

module.exports = config
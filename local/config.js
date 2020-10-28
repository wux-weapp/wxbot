const config = {
  PUPPET_PADPLUS_TOKEN: "协议Token",
  BOT_NAME: "机器人名字",
}

if (process.env.NODE_ENV === 'test') {
  try {
    Object.assign(config, require('../.local.config'))
  } catch (e) {
    console.error(e)
  }
}

module.exports = config
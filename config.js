const local = {
  port: 3000,
  host: '0.0.0.0',
  mongoUrl: 'mongodb://localhost:27017/wxrobot',
  secret: '123456',
  tianApiUrl: 'http://api.tianapi.com/txapi/',
  tianApiKey: 'b763560bb7c00141e22975caab915455'
}
const development = {
}
const production = {
  port: 8081,
  mongoUrl:'mongodb://username:password@ip:port/wxrobot',
}
let config = Object.assign(local, development)
if (process.env.NODE_ENV == 'production') {
  config = Object.assign(local, production)
}
module.exports = config
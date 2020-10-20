
import { message } from 'ant-design-vue'
export default function ({ store, redirect, app: { $axios } }) {
  // request拦截器
  $axios.onRequest(config => {
  })
  $axios.onError(error => {
    console.log('axios请求错误')
    console.log(error)
  })
  //response拦截器，数据返回后，你可以先在这里进行一个简单的判断
  $axios.interceptors.response.use(response => {
    const { success, errcode } = response.data
    if (typeof (errcode) !== 'undefined' && !success) {
      if (response.config.url != '/auth/user') message.error(response.data.errmsg)
      if (errcode === 401) redirect('/auth/login')
      return false
    }
    return response.data
  }, error => {
    message.error('网络连接失败，请检查网络状态和系统代理设置')
  })

}
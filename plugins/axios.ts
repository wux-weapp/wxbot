import { message } from 'ant-design-vue'
import { AxiosError, AxiosResponse, AxiosRequestConfig } from 'axios'
import { IAsyncResult } from '@/typings'
export default function ({ store, redirect, app: { $axios } }) {
  // request拦截器
  $axios.onRequest((config: AxiosRequestConfig) => {})
  $axios.onError((error: AxiosError<any>) => {
    console.log('axios请求错误')
    console.log(error)
  })
  // response拦截器，数据返回后，你可以先在这里进行一个简单的判断
  $axios.interceptors.response.use(
    (response: AxiosResponse<IAsyncResult<any>>) => {
      const { success, errcode, errmsg } = response.data
      if (typeof errcode !== 'undefined' && !success) {
        if (response.config.url !== '/auth/user') {
          message.error(errmsg as string)
        }
        if (errcode === 401) {
          redirect('/auth/login')
        }
        return false
      }
      return response.data
    },
    (error: AxiosError<any>) => {
      console.error(error)
      message.error('网络连接失败，请检查网络状态和系统代理设置')
    },
  )
}

import axios from 'axios'
import NProgress from 'nprogress'

const baseURL = 'http://vue-shop-api.itheima.net'
axios.defaults.baseURL = `${baseURL}/api/private/v1`
axios.interceptors.request.use(config => {
  NProgress.start()
  // 为请求头对象，添加token验证的Authorization字段
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
axios.interceptors.response.use(config => {
  NProgress.done()
  return config
})
export { axios, baseURL }

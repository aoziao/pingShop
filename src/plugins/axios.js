import axios from 'axios'
const baseURL = 'http://vue-shop-api.itheima.net'
axios.defaults.baseURL = `${baseURL}/api/private/v1`
axios.interceptors.request.use(config => {
  // 为请求头对象，添加token验证的Authorization字段
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
export { axios, baseURL }

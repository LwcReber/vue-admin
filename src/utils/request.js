import axios from 'axios'
import { MessageSingle as Message } from '@/element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
const duration = 3000
// create an axios instance

const baseURL = process.env.NODE_ENV === 'development' ? '/' : process.env.VUE_APP_BASE_URL

const service = axios.create({
  baseURL: baseURL, // process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 30000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['mg-cms-env'] = store.getters.env
      config.headers['mg-cms-token'] = getToken()
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

const handleCode = (code, error) => {
  try {
    let message = ''
    switch (code) {
      case 401:
        // 清空
        store.dispatch('user/logout')
        location.reload()
        message = ''
        break
        // 跳转
      case 400:
        message = '错误请求'
        break
      case 403:
        message = '拒绝访问'
        break
      case 404:
        message = '请求错误'
        break
      case 405:
        console.log(error)
        message = 'Method Not Supported'
        break
      case 500:
        message = '服务端出错'
        break
      case 502:
        message = 'Bad Gateway'
        break
    }
    if (message) {
      Message({ dangerouslyUseHTMLString: true, message: `<div>${message}</div>`, duration, type: 'error' })
    }
  } catch (error) {
    return Promise.reject(error)
  }
  // 对响应错误做点什么
  return Promise.reject(error)
}

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data
    console.log(res)
    // 导出文件直接原样返回
    if (response.config.responseType === 'blob' && res.type !== 'application/json') {
      return response
    }
    // if the custom code is not 20000, it is judged as an error.
    if (res.code !== 0) {
      Message({
        message: res.msg,
        type: 'error',
        duration
      })
      // 导出文件错误处理
      // if (response.config.responseType === 'blob') {
      //   let res = response.data
      //   if (res.type === 'application/json') {
      //     const enc = new TextDecoder('utf-8')
      //     // 将blob文件流转换为json
      //     res.arrayBuffer().then(buffer => {
      //       const data = JSON.parse(enc.decode(new Uint8Array(buffer))) || {}
      //       console.log(data, 'blob')
      //       res = data
      //       handleCode(res.code, res, response)
      //     })
      //   }
      // } else {
      //   handleCode(res.code, res, response)
      // }

      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      // if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
      //   // to re-login
      //   MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
      //     confirmButtonText: 'Re-Login',
      //     cancelButtonText: 'Cancel',
      //     type: 'warning'
      //   }).then(() => {
      //     store.dispatch('user/resetToken').then(() => {
      //       location.reload()
      //     })
      //   })
      // } else if (res.code) { console.log(res) }

      return Promise.reject(new Error(res.msg || 'Error'))
    } else {
      return res
    }
  },
  error => {
    return handleCode(error.response.status, error)
    // console.log('err' + error) // for debug
    // Message({
    //   message: '服务异常',
    //   type: 'error',
    //   duration
    // })
    // return Promise.reject(error)
  }
)

export default service

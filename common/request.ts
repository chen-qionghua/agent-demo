/**
 * request 网络请求工具
 * 更详细的 api 文档: https://github.com/umijs/umi-request
 */
import { extend } from 'umi-request'
import { notification } from 'antd'
import { ipHost } from './ip'
import Router from 'next/router'

const codeMessage: any = {
  201: '操作异常',
  202: '未登录',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
}

interface ResponseData {
  data: any
  msg: string
  rescode: number
  result: string
}

/**
 * 异常处理程序
 */
const errorHandler = (error: { response: ResponseData }): ResponseData => {
  // const router = useRouter()
  const { response } = error
  const { msg, rescode } = response

  if (rescode) {
    const errorText = codeMessage[rescode] || msg
    if (rescode === 201) {
      notification.error({
        message: `请求错误 ${msg}`,
        description: errorText,
      })
    } else if (rescode === 202) {
      notification.error({
        message: `请求错误 ${msg}`,
        description: errorText,
      })
      // clearLogin() // 清除缓存数据
      // window.location.href = '/user/login';
      // Router.push('/login')
    }
  } else if (!response) {
    notification.error({
      description: '您的网络发生异常，无法连接服务器',
      message: '网络异常',
    })
  }
  return response
}

/**
 * 配置request请求时的默认参数
 */
const request = extend({
  credentials: 'include', // 默认请求是否带上cookie
  headers: {
    Accept: 'application/json',
  },
})

// @ts-ignore
request.interceptors.request.use((url, options:any = {}): any => {
  if (url.indexOf('http') < 0) {
    url = ipHost + url
  }
  const { headers = {}, body } = options
  if (!(body instanceof FormData)) {
    headers['Content-Type'] = 'application/json; charset=utf-8'
  }
  const opt = {
    url,
    options: {
      ...options,
      headers: {
        ...headers,
        Authorization: localStorage.getItem('token'),
      },
    },
  }
  return opt
})

// @ts-ignore
request.interceptors.response.use((response: Response, options: any) => {
  if (options.parseResponse === false) {
    return response
  }
  return response.json()
})
// @ts-ignore
request.interceptors.response.use((response: Response, options: any): any => {
  // 导出的时候需要判断
  if (options.parseResponse === false) {
    return response
  }
  const res = response as unknown as ResponseData

  const { rescode } = res
  if (rescode === 200) {
    return res
  }
  return errorHandler({ response: res })
})

export default request

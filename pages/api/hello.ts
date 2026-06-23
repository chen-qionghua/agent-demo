import type { NextApiRequest, NextApiResponse } from 'next'
import axios, { AxiosError } from 'axios'

// 严格遵循要求的响应类型
type ApiResponse = {
  code: number
  data: Object
  message: string
}

const YAPI_URL = process.env.YAPI_BASE_URL || 'http://172.21.143.35:3000'
const API_INTERFACE_PATH = '/api/interface/get'
const YAPI_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjYzMCwiaWF0IjoxNzQ0MDExOTk3LCJleHAiOjE3NDQ2MTY3OTd9.XOuWbPBEzx72XGgAwHTSdZ63MN4oUUMDoc--BeIlt3A; _yapi_uid=630'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  // 统一响应格式的辅助函数
  const sendResponse = (
    code: number,
    message: string,
    data: Object = {}
  ) => {
    res.status(200).json({ code, data, message })
  }

  // 方法限制
  // if (req.method !== 'GET') {
  //   res.setHeader('Allow', ['GET'])
  //   return sendResponse(405, 'Method Not Allowed')
  // }

  try {
    // 环境变量校验
    if (!YAPI_TOKEN) {
      throw new Error('YAPI token not configured')
    }

    const {id,token,url}= JSON.parse(req.body)

    // 参数校验
    if (!id || Array.isArray(id)) {
      return sendResponse(400, 'Missing or invalid interface ID')
    }

    const response = await axios.get(`${url || YAPI_URL}${API_INTERFACE_PATH}`, {
      params: { id },
      headers: {
        Cookie: `_yapi_token=${token || YAPI_TOKEN}`,
      },
      timeout: 5000
    })

    // 处理 YAPI 业务错误
    if (response.data.errcode !== 0) {
      return sendResponse(
        response.data.errcode || 400,
        response.data.errmsg || 'Interface request failed',
        []
      )
    }

    // 成功响应
     sendResponse(200, 'Success', Array.isArray(response.data.data) 
     ? response.data.data 
     : response.data.data)
  } catch (error) {
    console.error('API Error:', error)

    // 错误处理
    let code = 500
    let message = 'Internal Server Error'

    if (axios.isAxiosError(error)) {
      code = error.response?.status || 500
      message = error.response?.data?.message || error.message
    } else if (error instanceof Error) {
      message = error.message
      code = 400 // 普通错误给400状态
    }

    sendResponse(code, message)
  }
}
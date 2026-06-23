// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import {
  setData,
} from '@/common/utilsNode'
import axios from 'axios'

type Data = {
  code: number
  data: Array<any>
  message: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { url, group, controller } = JSON.parse(req.body)

  const url_ = url + 'v2/api-docs?group=' + encodeURI(group)
  axios.get(url_)
    .then((resData) => {
      const { data } = resData
      const dataList = setData(data, controller)
      if(dataList.length === 0){

        res.send({
          code: 201, 
          data: [],
          message: '暂无数据',
        })
        return
      }
      res.send({
        code: 200,
        data: dataList,
        message: '操作成功',
      })
    }).catch((err:any) => {
      res.send({
        code: 201,
        data: [],
        message: err,
      })
    });
}

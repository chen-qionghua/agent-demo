// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { BaseResponse, request } from 'common/index'

type Data = {
  code: number,
  data: Array<any>,
  message: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {

    const {url}= JSON.parse(req.body)

    if(!url){
      res.send({
        code: 1,
        message: '请输入url',
        data: []
      })
      return
    }
    const url_= url+'/swagger-resources'
  
    request<BaseResponse<undefined>>(url_, {
        method: 'get',
      }).then((resData:any)=>{
        res.send({
             data: resData,
             code: 200,
             message: '操作成功'
            });
      }).catch((err:any) => {
        res.send({
          code: 201,
          data: [],
          message: err,
        })
      });
}


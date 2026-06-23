// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import {
  upperFirstChar,
  setData,
  mkdirFilesTsItem,
  mkdirFilesTs,
  createFun,
} from '@/common/utilsNode'
import getViewJS from '@/modules/createFile/ts'
import axios from 'axios'
const asyncs = require('neo-async');

type Data = {
  code: number
  data: Array<any>
  message: string
}
const pathFile = './modules/build/ts'

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { url, group, controller, fileName } = JSON.parse(req.body)

  const url_ = url + 'v2/api-docs?group=' + encodeURI(group)
  const _fileName = upperFirstChar(fileName)

  // 判断文件夹是否生成
  axios.get(url_)
    .then((resData) => {
      const { data } = resData
      const dataList = setData(data, controller)
      if(dataList.length === 0){

        res.send({
          code: 201,
          data: [],
          message: '',
        })
        return
      }
      mkdirFilesTs(fileName)
      //生成service文件
      const htmlService= getViewJS(dataList,fileName,_fileName)
      // mkdirFilesTsItem(fileName)
      const servicesTask=function async(callback:any){
     const res=   createFun(pathFile+'/'+_fileName+'/bean.ts',htmlService)
     callback(res)
      }
      asyncs.series([servicesTask],function(err:any){
        if (err) {
          res.send({
            code: 201,
            data: [],
            message: err,
          })
        }

        res.send({
          code: 200,
          data: [],
          message: '操作成功',
        })
      })
     

    }).catch((err) => {
      res.send({
        code: 201,
        data: [],
        message: err,
      })
      // console.error(err);
    });
}

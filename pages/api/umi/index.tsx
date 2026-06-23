// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import {
  upperFirstChar,
  setData,
  mkdirFilesHomeUmi,
  mkdirUmiModules,
  createFun
} from '@/common/utilsNode'

import getIndexJS from '@/modules/createFile/umi/createIndex'
import getViewJS from '@/modules/createFile/umi/createService'
import getTs from '@/modules/createFile/ts'
import getCreate from '@/modules/createFile/umi/createCreate'
import createAddModal from '@/modules/createFile/umi/createAddModal'
import createDetail from '@/modules/createFile/umi/createDetail'


import axios from 'axios'
import async from 'async'
var asyncs = require("neo-async");
var fs = require("fs-extra");


type Data = {
  code: number
  data: Array<any>
  message: string
}
const pathFile = './modules/build/umi'
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { addType, newApiData, url, group, controller, fileName, add, controllerDelete = 'delete', detail, pageList } = JSON.parse(req.body)

  const url_ = url + '/v2/api-docs?group=' + encodeURI(group)
  const _fileName = upperFirstChar(fileName)

  // 判断文件夹是否生成
  axios.get(url_)
    .then((resData) => {
      const { data } = resData
      const dataList = setData(data, controller)
      if (dataList.length === 0) {
        res.send({
          code: 201,
          data: [],
          message: '暂无数据',
        })
        return
      }
      mkdirFilesHomeUmi(fileName)//生成项目文件夹
      mkdirUmiModules(fileName)//生成项目文件夹/models、/create、/detail
      //生成modules/list.tsx文件
      const htmlListIndex = getIndexJS(newApiData, fileName, _fileName, controller, pageList, controllerDelete, addType)
      const listIndexTask = function async(callback: any) {
        const res = createFun(pathFile + '/' + fileName + '/index.tsx', htmlListIndex)
        callback(res)
      }

      const htmlService = getViewJS(dataList, fileName, _fileName, add, controllerDelete, detail, pageList)
      const servicesTask = function async(callback: any) {
        const res = createFun(pathFile + '/' + fileName + '/services/' + fileName + '.ts', htmlService)
        callback(res)
      }

      // 生成ts文件 
      const htmlCreateTs = getTs(dataList, fileName, _fileName)
      const tsTask = function async(callback: any) {
        const res = createFun(pathFile + '/' + fileName + '/services/' + 'data.ts', htmlCreateTs)
        callback(res)
      }


      const seriesTaskList = [listIndexTask, servicesTask, tsTask]
      if (addType === 1) {  //1、新建新增页面 其他、新建弹框页面

        // // 生成Create/Index.tsx文件 
        const htmlCreateIndex = getCreate(newApiData, fileName, _fileName, add)
        const createTask = function async(callback: any) {
          const res = createFun(pathFile + '/' + fileName + '/create/' + 'index.tsx', htmlCreateIndex)
          callback(res)
        }
        seriesTaskList.push(createTask)

      } else {
        const htmlCreateIndex = createAddModal(newApiData, fileName, _fileName, add)
        const createTask = function async(callback: any) {
          const res = createFun(pathFile + '/' + fileName + '/create/'  + '/index.tsx', htmlCreateIndex)
          callback(res)
        }
        seriesTaskList.push(createTask)
      }

         //  生成detail文件
         const htmlCreateDetail = createDetail(newApiData, fileName, _fileName,detail)
         const detailTask = function async(callback: any) {
           const res = createFun(pathFile + '/' + fileName + '/detail/' + 'index.tsx', htmlCreateDetail)
           callback(res)
         }


         seriesTaskList.push(detailTask)
      async.series(seriesTaskList, function (err: any, result: any) {

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
    });

  // res.send(url_);

}

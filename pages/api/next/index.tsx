// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import {
  upperFirstChar,
  setData,
  mkdirFilesHomeNext,
  mkdirNextModules,
  mkdirNextPages,
  createFun,
  mkdirNextService
} from '@/common/utilsNode'

import getIndexJS from '@/modules/createFile/next/createList'
import createPagesIndex from '@/modules/createFile/next/createPagesIndex'
import createPagesAdd from '@/modules/createFile/next/createPagesAdd'
import createPagesUpdate from '@/modules/createFile/next/createPagesUpdate'
import getViewJS from '@/modules/createFile/next/createService'
import getCreate from '@/modules/createFile/next/createAdd'
import getTs from '@/modules/createFile/ts'
import getIp from '@/modules/createFile/next/ip'
import createAddModal from '@/modules/createFile/next/createAddModal'
import createDetail from '@/modules/createFile/next/createDetail'
import createPagesDetail from '@/modules/createFile/next/createPagesDetail'


import axios from 'axios'
import async from 'async'
var asyncs = require("neo-async");
var fs = require("fs-extra");


const test = true
type Data = {
  code: number
  data: Array<any>
  message: string
}
const pathFile = './modules/build/next'
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
      mkdirFilesHomeNext(fileName)//生成项目文件夹
      mkdirNextModules(fileName)//生成项目文件夹/modules
      mkdirNextPages(fileName)//生成项目文件夹/pages
      //生成modules/list.tsx文件
      const htmlListIndex = getIndexJS(newApiData, fileName, _fileName, controller, pageList, controllerDelete,addType)
      const listIndexTask = function async(callback: any) {
        const res = createFun(pathFile + '/' + fileName + '/modules/' + fileName + '/list.tsx', htmlListIndex)
        callback(res)
      }



      //生成pages/index.tsx文件
      const htmlPagesIndex = createPagesIndex(fileName, _fileName)
      const pagesIndexTask = function async(callback: any) {
        const res = createFun(pathFile + '/' + fileName + '/pages/' + fileName + '/index.tsx', htmlPagesIndex)
        callback(res)
      }





      //生成service文件
      mkdirNextService(fileName)
      const htmlService = getViewJS(dataList, fileName, _fileName, add, controllerDelete, detail, pageList)
      const servicesTask = function async(callback: any) {
        const res = createFun(pathFile + '/' + fileName + '/modules/' + '/services/' + fileName + '.ts', htmlService)
        callback(res)
      }




      // // 生成ts文件 
      const htmlCreateTs = getTs(dataList, fileName, _fileName)
      const tsTask = function async(callback: any) {
        const res = createFun(pathFile + '/' + fileName + '/modules/' + '/services/' + 'data.ts', htmlCreateTs)
        callback(res)
      }

      // // 生成ip地址文件：主要用作调用接口展示用，正常发开不需要生成 
      const htmlCreateIp = getIp(url)
      const ipTask = function async(callback: any) {
        const res = createFun('./common/' + 'ip.ts', htmlCreateIp)
        callback(res)
      }

         //  生成detail文件
         const htmlCreateDetail = createDetail(newApiData, fileName, _fileName,detail)
         const detailTask = function async(callback: any) {
           const res = createFun(pathFile + '/' + fileName + '/modules/' + fileName + '/detail.tsx', htmlCreateDetail)
           callback(res)
         }

         const htmlPagesDeatil = createPagesDetail(fileName, _fileName)
         const pagesDeatilTask = function async(callback: any) {
           const res = createFun(pathFile + '/' + fileName + '/pages/' + fileName + '/detail.tsx', htmlPagesDeatil)
           callback(res)
         }

      const seriesTaskList = [listIndexTask, pagesIndexTask, servicesTask, tsTask, ipTask,detailTask,pagesDeatilTask]
      if (addType === 1) {  //1、新建新增页面 其他、新建弹框页面
        // // 生成Create/Index.tsx文件 
        const htmlCreateIndex = getCreate(newApiData, fileName, _fileName, add)
        const createTask = function async(callback: any) {
          const res = createFun(pathFile + '/' + fileName + '/modules/' + fileName + '/add.tsx', htmlCreateIndex)
          callback(res)
        }
        //生成pages/add.tsx文件
        const htmlPagesAdd = createPagesAdd(fileName, _fileName)
        const pagesAddTask = function async(callback: any) {
          const res = createFun(pathFile + '/' + fileName + '/pages/' + fileName + '/add.tsx', htmlPagesAdd)
          callback(res)
        }

              //生成pages/update.tsx文件
        const htmlPagesUpdate = createPagesUpdate(fileName, _fileName)
        const pagesUpdateTask = function async(callback: any) {
          const res = createFun(pathFile + '/' + fileName + '/pages/' + fileName + '/update.tsx', htmlPagesUpdate)
          callback(res)
        }
          seriesTaskList.push(createTask)
          seriesTaskList.push(pagesAddTask)
          seriesTaskList.push(pagesUpdateTask)

      } else {

        const htmlCreateIndex = createAddModal(newApiData, fileName, _fileName, add)
        const createTask = function async(callback: any) {
          const res = createFun(pathFile + '/' + fileName + '/modules/' + fileName + '/add.tsx', htmlCreateIndex)
          callback(res)
        }
        seriesTaskList.push(createTask)
      }



      async.series(seriesTaskList, function (err: any, result: any) {
        //如果是测试时，直接复制该项目带对应的目录中
        if (test) {
          fs.copy(pathFile + '/' + fileName + '/modules/services', './modules/' + fileName + '/services', function (err: any) {

          });
          fs.copy(pathFile + '/' + fileName + '/modules/' + fileName, './modules/' + fileName + '/pages', function (err: any) {

          });
          fs.copy(pathFile + '/' + fileName + '/pages/' + fileName, './pages/' + fileName, function (err: any) {

          });

        }
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

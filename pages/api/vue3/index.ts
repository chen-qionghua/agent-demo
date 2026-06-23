// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import {
  upperFirstChar,
  setData,
  mkdirFilesHomeNext,
  mkdirNextModules,
  mkdirVueService,
  createFun,
  mkdirNextService,
} from '@/common/utilsNode'

import getIndexJS from '@/modules/createFile/vue3/createIndex'

import createDetailIndex from '@/modules/createFile/vue3/createDetailIndex'
import createAdd from '@/modules/createFile/vue3/createAdd'
import createAddForm from '@/modules/createFile/vue3/createAddForm'



import axios from 'axios'
import async from 'async'
var asyncs = require('neo-async')
var fs = require('fs-extra')

const test = true
type Data = {
  code: number
  data: Array<any>
  message: string
}
const pathFile = './modules/build/vue3'
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { operateColumn, pageListSource, fileName, detailSource,addSource ,addType} = JSON.parse(
    req.body
  )

  const _fileName = upperFirstChar(fileName)

  mkdirVueService(fileName) //生成项目文件夹/pages
  //生成modules/list.tsx文件

  const htmlListIndex = getIndexJS(pageListSource, fileName, operateColumn,addType)
  const listIndexTask = function async(callback: any) {
    const res = createFun(
      pathFile + '/' + fileName + '/index.vue',
      htmlListIndex
    )
    callback(res)
  }

  //生成detail/index.vue文件
  const htmlDetailIndex = createDetailIndex(detailSource)
  const pagesIndexTask = function async(callback: any) {
    const res = createFun(
      pathFile + '/' + fileName + '/details/index.vue',
      htmlDetailIndex
    )
    callback(res)
  }

  //生成components/dialogCom.vue文件
  const htmlAddDialogIndex = createAdd(addSource)
  const pagesAddDialogTask = function async(callback: any) {
    const res = createFun(
      pathFile + '/' + fileName + '/components/dialogCom.vue',
      htmlAddDialogIndex
    )
    callback(res)
  }

    //生成components/dialogCom.vue文件
    const htmlAddIndex = createAddForm(addSource)
    const pagesAddTask = function async(callback: any) {
      const res = createFun(
        pathFile + '/' + fileName + '/components/formCom.vue',
        htmlAddIndex
      )
      callback(res)
    }
  


  const seriesTaskList = [listIndexTask, pagesIndexTask]
  if(addType == 1){
    seriesTaskList.push(pagesAddDialogTask)
  }else{
    seriesTaskList.push(pagesAddTask)
  }

  async.series(seriesTaskList, function (err: any, result: any) {
    //如果是测试时，直接复制该项目带对应的目录中
    if (test) {
      fs.copy(
        pathFile + '/' + fileName + '/modules/services',
        './modules/' + fileName + '/services',
        function (err: any) {}
      )
      fs.copy(
        pathFile + '/' + fileName + '/modules/' + fileName,
        './modules/' + fileName + '/pages',
        function (err: any) {}
      )
      fs.copy(
        pathFile + '/' + fileName + '/pages/' + fileName,
        './pages/' + fileName,
        function (err: any) {}
      )
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

  // res.send(url_);
}

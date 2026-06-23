import { notification } from 'antd'

//生成ts页面模板
export const getTs = (
  data: any,
  fileName: string,
  isDownload: number,
  isTemp: number,
  setSpinning: any,
) => {
  fetch('/api/ts', {
    method: 'POST',
    body: JSON.stringify({ ...data, fileName }),
  })
    .then((res) => res.json())
    .then((res: any) => {
      setSpinning(false)
        if (res.code !== 200) {
            notification.warning({
              message: `提示`,
              description:
                '没有查到对应接口，请查看【接口大类】和【接口小类】是否操作正确',
            })
           
            return
          }
          notification.success({
            message: `提示`,
            description: '生成结束',
          })
          if (isDownload) {
            down(fileName, isTemp)
          }
    })
    .catch((err) => {
      setSpinning(false)
    })
}

//生成next页面模板
export const getNext = (
  data: any,
  fileName: string,
  isDownload: number,
  isTemp: number,
  newApiData: any,
  setSpinning: any,
) => {
  fetch('/api/next', {
    method: 'POST',
    body: JSON.stringify({ ...data, fileName,newApiData }),
  })
    .then((res) => res.json())
    .then((res: any) => {
      setSpinning(false)
      if (res.code !== 200) {
        notification.warning({
          message: `提示`,
          description:
            '没有查到对应接口，请查看【接口大类】和【接口小类】是否操作正确',
        })
        return
      }
      notification.success({
        message: `提示`,
        description: '生成结束',
      })
      if (isDownload) {
        down(fileName, isTemp)
      }
    })
    .catch((err) => {
      setSpinning(false)
    })
}

//生成vue页面模板
export const getVue = (
    data: any,
    fileName: string,
    isDownload: number,
    isTemp: number,
    pageListSource: any,
    setSpinning: any,
    operateColumn:any,
    detailSource: any,
    addSource: any
  ) => {
    fetch('/api/vue3', {
      method: 'POST',
      body: JSON.stringify({ ...data, fileName,pageListSource,operateColumn,detailSource,addSource }),
    })
      .then((res) => res.json())
      .then((res: any) => {
        setSpinning(false)
        notification.success({
          message: `提示`,
          description: '生成结束',
        })
        if (isDownload) {
          down(fileName, isTemp)
        }
      })
      .catch((err) => {
        setSpinning(false)
      })
  }

 //生成reactUmi页面模板
 export const getReact = (
    data: any,
    fileName: string,
    isDownload: number,
    isTemp: number,
    newApiData:any,
    setSpinning: any,
  ) => {
    fetch('/api/umi', {
      method: 'POST',
      body: JSON.stringify({ ...data, fileName,newApiData }),
    })
      .then((res) => res.json())
      .then((res: any) => {
        setSpinning(false)
        if (res.code !== 200) {
          notification.warning({
            message: `提示`,
            description:
              '没有查到对应接口，请查看【接口大类】和【接口小类】是否操作正确',
          })
          return
        }
        notification.success({
          message: `提示`,
          description: '生成结束',
        })
        if (isDownload) {
          down(fileName, isTemp)
        }
      })
      .catch((err) => {
        setSpinning(false)
      })
  }
//下载到本地
function down(fileName: string, isTemp: number) {
  var a = document.createElement('a')
  if (isTemp == 2) {
    a.href = '/api/vue3/dowon?fileName=' + fileName
  } else if (isTemp == 3) {
    a.href = '/api/next/dowon?fileName=' + fileName
  } else if (isTemp == 4) {
    a.href = '/api/ts/dowon?fileName=' + fileName
  } else {
    // a.href = '/api/users/dowon?fileName=' + fileName
  }
  a.click()
}

import fs from 'fs'
import moment from 'moment'
import { useEffect, useRef, useCallback, } from 'react';
import NP from 'number-precision';
//字符串首字母大写
export const upperFirstChar = (str: string) => {
  return str.trim().replace(str[0], str[0].toUpperCase())
}

const typeObj:any = {
  array: 'Array<any>',
  integer: 'number',
  string: 'string',
}

//处理数据
export const setData = (result:any, controller:string) => {
  // const controller = '/b/couponpackage/'
  const Using = 'Using'
  const { paths = {}, definitions = {} } = result
  const list = []
  for (const key in paths) {

    if (key.indexOf(controller) != -1) {

      const que = key.split(controller)
      const item = paths[key]
      const type = item.post.operationId.split((que[1] + Using))
      const parameters = item.post.parameters
      const _parameters = parameters.find((item:any) => {

        return item.name == 'form'

      })
      const reqBodyName = _parameters ? _parameters.schema ? _parameters.schema.originalRef : [] : []
      let resBodyName = item.post.responses[200].schema ? item.post.responses[200].schema.originalRef : []
      if (resBodyName.indexOf('«') != -1) {
        const resBodyNameList = resBodyName.split('«')
        const _resBodyName = resBodyNameList[resBodyNameList.length - 1]
        resBodyName = _resBodyName.replace(/»/g, '')
      }
      // properties
      const reqBodyList = getBodyList(definitions[reqBodyName],definitions)
      const resBodyList = getBodyList(definitions[resBodyName],definitions)
      const remark= item.post.description
 
      list.push({
        name: que[1],
        url: key,
        reqBodyList,
        resBodyList,
        type: type[1] ? type[1] : 'POST',
        remark: remark?remark:item.post?.summary,
        tags: item.post.tags ? item.post.tags[0] ? item.post.tags[0] : '' : ""
      })
    }
  }

  return list
}

//获取每个接口对应的字段
function getBodyList(data:any = {},definitions:any={}) {
  if (!data) {
    return []
  }
  const require = data.required || []
  const properties = data.properties ? data.properties : {}
  let resultList = []
  for (const key in properties) {
    const item = properties[key]
    const type = item.type
    let sortRemark = ''
    if(key === 'field'){
      sortRemark='排序字段'
    }
    if(key === 'sort'){
      sortRemark='排序方式; 升序: asc;降序: desc'
    }
    const obj:any= {
      name: key,
      type: typeObj[type] ? typeObj[type] : 'string',
      remark: item.description?item.description:sortRemark,
      isRequire: require.indexOf(key) > -1 ? true : false,
    }

    if(type === 'array'){
      if(item.items.originalRef){
        const originalRef = item.items.originalRef
        obj.arrayList=   getBodyList(definitions[originalRef],definitions)
      }else if(item.items.type)
        obj.type=  `${typeObj[item.items.type]} []`
    }
    resultList.push(obj)
  }

  return resultList
}

/**
 * 
 * @param {*} fileName 文件夹名称
 * @param {*} name     文件名
 *  @param {*} content  文件内容
 */
 const mkdirFile = (fileName:any, name:string, content:string, callback:any) => {
  fs.writeFile(name, content, (err) => {
    if (err) {
      callback(err)
    }

    callback(true)
  });

}

//生成ts目录
export const mkdirFilesTs = (filepath:string) => {
  const _filepath = upperFirstChar(filepath)
  const urlP = './modules/build/ts/' + _filepath
  if (!fs.existsSync(urlP)) {
    fs.mkdirSync(urlP);
  }
}
//生成ts子目录
export const mkdirFilesTsItem = (filepath:string) => {
  const _filepath = upperFirstChar(filepath)
  const urlC = './modules/build/ts/' + _filepath + '/data'
  if (!fs.existsSync(urlC)) {
    fs.mkdirSync(urlC);
  }
}

/**
 * next
 * @param {*} filepath 
 */

export const mkdirFilesHomeNext = (filepath:string) => {
  const urlP = './modules/build/next/' + filepath
  if (!fs.existsSync(urlP)) {
    fs.mkdirSync(urlP);
  }
}

export const mkdirNextModules = (filepath:string) => {
  const urlP = './modules/build/next/' + filepath + '/modules'
  const urlP_ = './modules/build/next/' + filepath + '/modules/' + filepath
  if (!fs.existsSync(urlP)) {
    fs.mkdirSync(urlP);
  }
  if (!fs.existsSync(urlP_)) {
    fs.mkdirSync(urlP_);
  }
}

export const mkdirNextPages = (filepath:string) => {
  const urlP = './modules/build/next/' + filepath + '/pages'
  const urlP_ = './modules/build/next/' + filepath + '/pages/' + filepath
  if (!fs.existsSync(urlP)) {
    fs.mkdirSync(urlP);
  }
  if (!fs.existsSync(urlP_)) {
    fs.mkdirSync(urlP_);
  }
}

export const mkdirNextService = (filepath:string) => {
  const urlC = './modules/build/next/' + filepath + '/modules' + '/services'
  if (!fs.existsSync(urlC)) {
    fs.mkdirSync(urlC);
  }
}

export const mkdirVueService = (filepath:string) => {
  const urlC = './modules/build/vue3/' + filepath
  const urlD = './modules/build/vue3/' + filepath+ '/details'
  const urlA = './modules/build/vue3/' + filepath+ '/components'

  
  if (!fs.existsSync(urlC)) {
    fs.mkdirSync(urlC);
  }
  if (!fs.existsSync(urlD)) {
    fs.mkdirSync(urlD);
  }
  if (!fs.existsSync(urlA)) {
    fs.mkdirSync(urlA);
  }
  
}


export const createFun = ( url:string, _html = '') => {
  new Promise((resolve, reject)=>{
    mkdirFile(null, url, _html, (val:any) => {
      if (val) {
        resolve(true)
        return true
      }
      reject(true)
    })
  })

}



export const mkdirFilesHomeUmi = (filepath:string) => {
  const urlP = './modules/build/umi/' + filepath
  if (!fs.existsSync(urlP)) {
    fs.mkdirSync(urlP);
  }
}

export const mkdirUmiModules = (filepath:string) => {
  const defaultUrl= './modules/build/umi/' + filepath 
  const urlModels =defaultUrl+ '/models'
  const urlDetail = defaultUrl + '/detail'
  const urlCreate = defaultUrl+'/create'
  const urlServices = defaultUrl+'/services'


  if (!fs.existsSync(urlModels)) {
    fs.mkdirSync(urlModels);
  }
  if (!fs.existsSync(urlDetail)) {
    fs.mkdirSync(urlDetail);
  }
  if (!fs.existsSync(urlCreate)) {
    fs.mkdirSync(urlCreate);
  }
  if (!fs.existsSync(urlServices)) {
    fs.mkdirSync(urlServices);
  }
}

export const getTableY = (
  columns: any,
  collapsed: boolean = true,
  isHaveTabs = false
) => {
  // 1. 获取一个文字在当前浏览器中的像素是多少? 本次仅仅以正常文字作为标准

  if (typeof document === 'undefined') {
    return 630
  }
  // var defultFront = document.createElement('span');
  // defultFront.innerHTML = '嘻';
  // defultFront.style.fontSize = '14px';
  // defultFront.style.color = 'transparent';
  // defultFront.style.fontWeight = '500';
  // document.body.appendChild(defultFront);

  const getHeight = (domName: string, defaultHeight: number) => {
    const dom = document.getElementsByClassName(domName)
    let domHeight = defaultHeight
    if (dom && dom.length > 0) {
      domHeight = dom[0].clientHeight
    }
    return domHeight
  }
  const headHeight = getHeight('ant-layout-header', 48)
  const navHeight = getHeight('ant-tabs-nav', 56)
  const footerHeight = getHeight('ant-layout-footer', 54)
  // 切换页面toolbarHeight可能取不到值 所以给一个默认值
  const toolbarHeight = getHeight('ant-pro-table-list-toolbar', 64) || 64

  let h =
    window.innerHeight -
    headHeight -
    navHeight -
    footerHeight -
    toolbarHeight -
    // 56 -
    16 -
    (isHaveTabs ? 46 : 0) -
    searchHeight(columns, 3, collapsed)
  // 47 表格头部高度
  // 56 分页的高度
  //*** 如果页面有tab切换的要多加一层判断。并且在table onLoad里面再调用 setY(getTableY(columns))
  const orderListTab = document.querySelector('.order-list-tab')
  if (orderListTab && orderListTab.clientHeight > 0) {
    h = h - orderListTab.clientHeight - 5
  }
  if (h < 200) {
    h = 200
  }
  return h
}

const searchHeight = (columns: any, num: any = 3, collapsed: boolean) => {
  if (collapsed) return 57
  const list = columns.filter((item: any) => !item.hideInSearch)
  const ls: any = list.length || 0
  const h: any = ls % num > 0 ? (ls / num) + 1 : (ls / num)
  return h * 40 - 3
  // 26 = 16(paddingTop) + 10(borderBottomWidth)
}

// 显示后几位文字
export function subStrFirst(str: any, num: number) {
  if (!str) {
    return '-'
  }
  return str.substr(0, num) + '...'
}


/**用于页面中排序的公用方法*/
export const pageSort = (params: any, sorter: any) => {
  const sortList = []
  for (const key1 in sorter) {
    if (sorter[key1] && sorter[key1] === 'descend') {
      sortList.push({ field: key1, sort: 'desc' })
    }
    if (sorter[key1] && sorter[key1] === 'ascend') {
      sortList.push({ field: key1, sort: 'asc' })
    }
  }
  if (sortList.length === 0) {
    sortList.push({ field: 'addTime', sort: 'desc' })
  }
  params['sortInfos'] = sortList
}

// 格式化时间戳(以毫秒级转换)
export const formatDate = (timeStamp: number, time?: boolean) => {
  // let timeTem = parseFloat(timeStamp)
  return moment(timeStamp).format(time ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD')
}


export const getDataSource = (source: any) => {
  let dataSource: any = [];
  if (source) {
      for (let i in source) {
          dataSource.push({
              name: source[i].text,
              id: parseInt(i),
          });
      }
  }
  return dataSource;
};

export const useDebounceFn = (func:any, wait:any, immediate:any) => {
  const timeout:any = useRef();
  /* 函数组件的this其实没啥多大的意义，这里我们就把this指向func好了 */
  const fnRef:any = useRef(func);

  /*  useDebounceFn 重新触发 func 可能会改变，这里做下更新 */
  useEffect(() => {
      fnRef.current = func;
  }, [func]);

  /* 
      timeout.current做了缓存，永远是最新的值
      cancel 虽然看着没有依赖项了
      其实它的隐形依赖项是timeout.current
  */
  const cancel = useCallback(function () {
      timeout.current && clearTimeout(timeout.current);
  }, []);

  /* 相关函数 func 可能会返回值，这里也要缓存 */
  const resultRef = useRef();
  function resDebounced(...args: any[]) {
      //args就是事件对象event

      // 一直触发一直清除上一个打开的延时器
      cancel();

      if (immediate) {
          // 第一次触发，timeout===undefined恰好可以利用timeout的值
          const callNow = !timeout.current;
          timeout.current = setTimeout(function () {
              timeout.current = null;
          }, wait);
          /* this指向func好了 */
          if (callNow) resultRef.current = fnRef.current.apply(fnRef.current, args);

      } else {
          // 停止触发，只有最后一个延时器被保留
          timeout.current = setTimeout(function () {
              timeout.current = null;
              // func绑定this和事件对象event，还差一个函数返回值
              resultRef.current = fnRef.current.apply(fnRef.current, args);
          }, wait);
      };
      return resultRef.current;
  };
  resDebounced.cancal = function () {
      cancel();
      timeout.current = null;
  };

  return useCallback(resDebounced, [wait, cancel, immediate]);
}

/*
  NP 数据处理 数据统一只留两位小数
*/
// 是否为正整数，包括正整数和0
export const isInteger = (_msg?: any) => {
  var z_reg: RegExp = /^(([0-9])|([1-9]([0-9]+)))$/;
  return ({ getFieldValue }: any) => ({
      validator(rule: any, value: any) {
          if (z_reg.test(value)) {
              return Promise.resolve();
          }
          return Promise.reject(_msg || '请输入正整数');
      },
  });
};

// 精确除法 例:分转换成元
export function getElement(data: any, unit?: number) {
  if (!data || data === '-') return 0;
  if (!unit) {
      unit = 100;
  }
  const num: number = NP.divide(data, unit);
  return isInteger(num) ? num : num.toFixed(2);
}

// 精确乘法 例:元转换成分
export function getCentNullZero(data: any, unit?: number) {
  if (!data || data === '-') return '';
  if (!unit) {
      unit = 100;
  }
  const num: number = NP.times(data, unit);
  return isInteger(num) ? num : num.toFixed(2);
}

//获取url参数
export function getQueryString(name:any){
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
  var r = window.location.search.substr(1).match(reg);
  if (r != null) return unescape(r[2]);
  return null;
}
import moment from 'moment'
import { useEffect, useRef, useCallback } from 'react'
import NP from 'number-precision'
import _ from 'lodash';


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
  const h: any = ls % num > 0 ? ls / num + 1 : ls / num
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
  let dataSource: any = []
  if (source) {
    for (let i in source) {
      dataSource.push({
        name: source[i].text,
        id: parseInt(i),
      })
    }
  }
  return dataSource
}

export const useDebounceFn = (func: any, wait: any, immediate: any) => {
  const timeout: any = useRef()
  /* 函数组件的this其实没啥多大的意义，这里我们就把this指向func好了 */
  const fnRef: any = useRef(func)

  /*  useDebounceFn 重新触发 func 可能会改变，这里做下更新 */
  useEffect(() => {
    fnRef.current = func
  }, [func])

  /* 
        timeout.current做了缓存，永远是最新的值
        cancel 虽然看着没有依赖项了
        其实它的隐形依赖项是timeout.current
    */
  const cancel = useCallback(function () {
    timeout.current && clearTimeout(timeout.current)
  }, [])

  /* 相关函数 func 可能会返回值，这里也要缓存 */
  const resultRef = useRef()
  function resDebounced(...args: any[]) {
    //args就是事件对象event

    // 一直触发一直清除上一个打开的延时器
    cancel()

    if (immediate) {
      // 第一次触发，timeout===undefined恰好可以利用timeout的值
      const callNow = !timeout.current
      timeout.current = setTimeout(function () {
        timeout.current = null
      }, wait)
      /* this指向func好了 */
      if (callNow) resultRef.current = fnRef.current.apply(fnRef.current, args)
    } else {
      // 停止触发，只有最后一个延时器被保留
      timeout.current = setTimeout(function () {
        timeout.current = null
        // func绑定this和事件对象event，还差一个函数返回值
        resultRef.current = fnRef.current.apply(fnRef.current, args)
      }, wait)
    }
    return resultRef.current
  }
  resDebounced.cancal = function () {
    cancel()
    timeout.current = null
  }

  return useCallback(resDebounced, [wait, cancel, immediate])
}

/*
    NP 数据处理 数据统一只留两位小数
  */
// 是否为正整数，包括正整数和0
export const isInteger = (_msg?: any) => {
  var z_reg: RegExp = /^(([0-9])|([1-9]([0-9]+)))$/
  return ({ getFieldValue }: any) => ({
    validator(rule: any, value: any) {
      if (z_reg.test(value)) {
        return Promise.resolve()
      }
      return Promise.reject(_msg || '请输入正整数')
    },
  })
}

// 精确除法 例:分转换成元
export function getElement(data: any, unit?: number) {
  if (!data || data === '-') return 0
  if (!unit) {
    unit = 100
  }
  const num: number = NP.divide(data, unit)
  return isInteger(num) ? num : num.toFixed(2)
}

// 精确乘法 例:元转换成分
export function getCentNullZero(data: any, unit?: number) {
  if (!data || data === '-') return ''
  if (!unit) {
    unit = 100
  }
  const num: number = NP.times(data, unit)
  return isInteger(num) ? num : num.toFixed(2)
}

//获取url参数
export function getQueryString(name: any) {
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
  var r = window.location.search.substr(1).match(reg)
  if (r != null) return unescape(r[2])
  return null
}
//格式化后端返回的树状数据
export const formatTreeTable = (data: Array<any> = []) => {
  let dataList: Array<any> = []

  const formatTreeDataFun = (children: Array<any>, parentKey?: number) => {
    for (let i = 0; i < children.length; i += 1) {
      if (children[i]) {
        children[i] = {
          ...children[i].tree,
          ...children[i],
        }
        if (children[i].children) {
          formatTreeDataFun(children[i].children)
        }
      }
    }
  }
  formatTreeDataFun(data)
  return data
}

//处理详情页的数据
export const setData = (val: any, valueType: string) => {
  if (!valueType) {
    return val ? val : '-'
  }
  if (valueType === 'date') {
    return val ? formatDate(val) : '-'
  }
  if (valueType === 'dateTime') {
    return val ? formatDate(val, true) : '-'
  }
  if (valueType === 'money') {
    return val ? getElement(val) : '-'
  }
}

// 替换规则
const fieldReplacements: Record<string, string> = {
 '装机容量\\s*\\(?W\\)?': '装机容量(W)',
  '装机容量\\s*\\(?KW\\)?': '装机容量(KW)',
  '组件块数': '组件数量',
  '回购批次号': '回购批次号',
  '电站名称': '电站名称',
  '建站地址': '建站地址',
  '代理商名称': '代理商名称',
  '运维商名称': '运维商名称',
  '逆变器总发电量\\(kwh\\)': '逆变器总发电量(kWh)',
  '电度表发电量\\(kwh\\)': '电度表发电量(kWh)',
};

// 文本预处理
function preprocessOcrText(rawText: string): string {
  return rawText
    .replace(/[\r\n]+/g, '\n') // 换行符标准化
    .replace(/[^\u4e00-\u9fa5a-zA-Z0-9\s\(\)\/\|.-]/g, '') // 合法字符保留
    .replace(/\s+/g, ' ') // 多空格合并
    .trim();
}

// 应用字段修正
function correctField(field: string): string {
  let corrected = field.trim();
  for (const [pattern, replacement] of Object.entries(fieldReplacements)) {
    corrected = corrected.replace(new RegExp(pattern, 'gi'), replacement);
  }
  return corrected;
}

// 主函数
export const parseOcrFields = (ocrText: string, type: 1 | 2 = 1) => {
  // const cleanedText = preprocessOcrText(ocrText);
  // console.log('ocrText',ocrText)
  // // 分词：按空格分开，但保留中文字段（防止英文大写断开）
  // const rawFields = cleanedText.split(/\s+/g).map(f => f.trim()).filter(Boolean);
  // console.log('rawFields',rawFields)

  // // 字段组合（解决 OCR 有时拆分错误）
  // const mergedFields: string[] = [];
  // let buffer = '';
  // for (let i = 0; i < rawFields.length; i++) {
  //   buffer += rawFields[i];
  //   // 如果字段长度较短，继续组合
  //   if (buffer.length < 5 && i < rawFields.length - 1) {
  //     buffer += ' ';
  //     continue;
  //   }
  //   mergedFields.push(buffer.trim());
  //   buffer = '';
  // }
  // if (buffer) mergedFields.push(buffer.trim());
  // console.log(buffer,mergedFields)

  // const correctedFields = mergedFields.map(correctField);

  // console.log('correctedFields',correctedFields)

  // const validFields = correctedFields.filter(f => f.length > 1);
  // console.log('validFields',validFields)

    const cleanedText = preprocessOcrText(ocrText);
  const rawFields = cleanedText.split(/\s+/g).map(f => f.trim()).filter(Boolean);
  const mergedFields = smartMergeFields(rawFields);
  const correctedFields = mergedFields.map(correctField);
  const validFields = correctedFields.filter(f => f.length > 1);


  return validFields.map((label, index) => {
    const base = {
      isCheckout: true,
      align: 'center' as const,
      dic: null
    };
    return type === 1
      ? { label, value: `prop${index}`, ...base }
      : { title: label, dataIndex: `prop${index}`, hideInSearch: true, ...base };
  });
};



function smartMergeFields(rawFields: string[]): string[] {
  const merged: string[] = [];
  for (let i = 0; i < rawFields.length; i++) {
    const current = rawFields[i];
    const next = rawFields[i + 1];

    // 单位类字段 (W)、(kWh)、(KW) 等，合并到前一个
    if (/^\(.+\)$/.test(current)) {
      if (merged.length > 0) {
        merged[merged.length - 1] += ' ' + current;
      } else {
        merged.push(current); // fallback
      }
      continue;
    }

    // 如果下一个字段是单位，合并
    if (next && /^\(.+\)$/.test(next)) {
      merged.push(current + ' ' + next);
      i++; // skip next
      continue;
    }

    // 默认直接添加
    merged.push(current);
  }
  return merged;
}

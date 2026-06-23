
//表格的批量选项
export const BatchSource = [
  {
    id: 'delete',
    name: '批量删除',
  },
  {
    id: 'up',
    name: '批量上架',
  },
  {
    id: 'down',
    name: '批量下架',
  },
 
]
//表格的header选项
export const HeaderSource = [
  {
    id: 'add',
    name: '新建',
  },
  {
    id: 'export',
    name: '导出',
  },
  {
    id: 'import',
    name: '导入',
  },
 
]
//表格的操作栏选项
export const OptionSource = [
  {
    id: 'edit',
    name: '编辑',
  },
  {
    id: 'delete',
    name: '删除',
  },
  {
    id: 'detail',
    name: '详情',
  },
]
//表格的valueType列表
export const ValueTypeSource = [
  {
    id: 'text',
    name: '输入框',
  },
  {
    id: 'select',
    name: '下拉框',
  },
  {
    id: 'date',
    name: '日期',
  },
  {
    id: 'dateTime',
    name: '日期时间',
  },

  {
    id: 'dateRange',
    name: '日期范围',
  },
  {
    id: 'dateTimeRange',
    name: '时间范围',
  },

  {
    id: 'area',
    name: '省市区级联下拉',
  },
  {
    id: 'fuzzySelect',
    name: '模糊筛选(FuzzySelect)',
  },
  
]

//表单的内容列表
export const formSource = [
  {
    id: 'text',
    name: '输入框',
  },
  {
    id: 'date',
    name: '日期',
  },
  {
    id: 'dateTime',
    name: '日期时间',
  },
  {
    id: 'select',
    name: '下拉框',
  },
  {
    id: 'dateRange',
    name: '日期范围',
  },
  {
    id: 'dateTimeRange',
    name: '时间范围',
  },
  {
    id: 'textArea',
    name: '文本框',
  },
  {
    id: 'area',
    name: '省市区级联下拉',
  },

  {
    id: 'uploadFile',
    name: '上传文件',
  },
   {
    id: 'fuzzySelect',
    name: '模糊筛选(FuzzySelect)',
  },
]

// 校验规则
export const rulesSource = [
  {
    id: 'default',
    name: '无',
  },
  {
    id: 'required',
    name: '必填',
  },
  {
    id: 'number',
    name: '正整数',
  },
  {
    id: 'money',
    name: '金额（百万以内）',
  },
 
  {
    id: 'phone',
    name: '手机号',
  },
  {
    id: 'card',
    name: '身份证',
  },

  {
    id: 'email',
    name: '邮箱',
  },
  {
    id: 'bankAccount',
    name: '银行卡',
  },

  {
    id: 'chinaZh',
    name: '中文',
  },
  {
    id: 'max12',
    name: '12个字符以内',
  },
  {
    id: 'max50',
    name: '50个字符以内',
  },
  {
    id: 'max150',
    name: '150个字符以内',
  },
]


export const rules :any= {
  chinaZh: /[\u4e00-\u9fa5]/gm,
  // 邮箱
  email: /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
  // 身份证
  card: /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/,
  // 手机号
  phone: /^[1][3,4,5,6.7,8,9][0-9]{9}$/,
  isNum: /^[1-9]\d*$/,
  // 座机或手机
  landPhone: /^(([0-9]{3,4}[-])?[0-9]{7,8}$)|(^(1[3-9]\d{9}$))/,
  // 金额输入框正则校验：百万以内
  money: /^(([1-9]\d{0,6})|0)?$/,
  integer  : /^[1-9]\d*$/,
  //银行卡
  bankAccount  :/^\d{16,19}$/ ,
  number: /^\d+$/, //正整数
  max12: /^(.|\n){0,12}$/, //不能超过12位
  max50: /^(.|\n){0,50}$/, //不能超过12位
  max150: /^(.|\n){0,150}$/, //不能超过12位

};

export const FormItemLayout = {
  labelCol: {
      xs: { span: 24 },
      sm: { span: 8 },
  },
  wrapperCol: {
      xs: { span: 24 },
      sm: { span: 16 },
  },
}
import React, { useRef } from 'react'
import {
  Radio,
  Form,
  Input,
  Button,
  Spin,
  Popconfirm,
  message
} from 'antd'
import { useState } from 'react'
import { FooterToolbar } from '@ant-design/pro-layout'
import { getTs, getVue, getNext, getReact } from './data'
import ListModal from '../components/listModal'
import ListModalPreview from '../components/listModalYu'

import AddModal from '../components/addModal'
import AddModalYu from '../components/addModalYu'

import DetailModal from '../components/detailModal'
import DetailModalYu from '../components/detailModalYu'

import { FormItemLayout } from '../components/valueTypeList'
import { InfoCircleOutlined } from '@ant-design/icons'
import { EyeOutlined } from '@ant-design/icons'

const FormItem = Form.Item

const Index: React.FC<any> = (props) => {
  const [spinning, setSpinning] = useState<boolean>(false)

  const [form] = Form.useForm()

  //表格页设置ref
  const tabSetRef = useRef<any>()
  //表格页预览ref
  const tabPreviewRef = useRef<any>()

  const [isTs, setIsts] = useState<boolean>(false)
  //pageList数据信息
  const [pageListSource, setPageListSource] = useState<Array<any>>([])
  //detail数据信息
  const [detailSource, setDetailSource] = useState<Array<any>>([])
  //add数据信息
  const [addSource, setAddSource] = useState<Array<any>>([])
  
    //表单页Ref
    const addSetRef = useRef<any>()
    //表单页预览Ref
    const addPreviewRef = useRef<any>()
  
  const onFinish = async (values: any) => {
    // isDownload:true
    setSpinning(true)
    const { isDownload = 1, tempType, fileName } = values
    //如果是单独生成TS页面，则直接生成

    if (tempType == 4) {
      getTs(values, fileName, isDownload, tempType, setSpinning)
      return
    }

    let optionSet: string[] = []
    const checkSource = pageListSource.filter((item) => {
      if (item.optionSet) {
        optionSet = item.optionSet
      }
      return item.isCheckout || item.isSearchs
    })

    const obj: any = {
      detail: '详情',
      edit: '修改',
      delete: '删除',
    }

    const list = optionSet.map((item: any) => {
      return {
        title: obj[item],
      }
    })

    const addList = addSource.filter((item: any) => {
      return item.isCheckout
    })

    // checkSource 表头 list 操作栏 detailSource 详情

    if (tempType == 2) {
      
      getVue(
        values,
        fileName,
        isDownload,
        tempType,
        checkSource,
        setSpinning,
        list,
        detailSource,
        addList
      )
      return
    }
    if (tempType == 3) {
      getNext(
        values,
        fileName,
        isDownload,
        tempType,
        pageListSource,
        setSpinning
      )
      return
    }

    getReact(
      values,
      fileName,
      isDownload,
      tempType,
      pageListSource,
      setSpinning
    )
    return
  }

  const onValuesChange = (
    changedValues: { [key: string]: any },
    values: any
  ) => {
    const { tempType, pageList } = changedValues
    if (tempType) {
      if (tempType === 4) {
        //模板类型
        setIsts(true)
      } else {
        setIsts(false)
      }
    }
  }

  //当改变数据后需要重置一部分数据
  const formReload = (num: number) => {
    form.setFieldsValue({
      pageList: '',
      fileName: '',
    })
  }

  //双向绑定列表接口名
  const pageListChange = (val: any) => {
    form.setFieldsValue({
      pageList: val.target.value,
    })
    if (val.target.value) {
      getApi()
    }
  }

  //双向绑定列表接口名
  const fileNameChange = (val: any) => {
    form.setFieldsValue({
      fileName: val.target.value,
    })
  }
  //双向绑定列表接口名
  const detailChange = (val: any) => {
    form.setFieldsValue({
      detail: val.target.value,
    })
    getDetailApi()
  }
//双向绑定列表接口名
const addChange = (val: any) => {
  form.setFieldsValue({
    add: val.target.value,
  })
  getAddApi()
}
  

  //配置列表页
  const pageListSet = async () => {
    tabSetRef.current && tabSetRef.current.show([...pageListSource], false)
  }
  //列表页预览
  const previewListClick = async () => {
    const res: any = await getApi()
    let optionSet: string[] = []
    const list = pageListSource.filter((item) => {
      if (item.optionSet) {
        optionSet = item.optionSet
      }
      return item.isCheckout
    })

    if (optionSet && optionSet.length > 0) {
      list.push({
        title: '操作',
        dataIndex: 'option',
        valueType: 'option',
        fixed: 'right',
        hideInSearch: true,
        align: 'center',
        width: optionSet.length * 40,
        render: (_: any, r: any) => {
          return optRender(optionSet)
        },
      })
    }
    info('列表', tabPreviewRef.current.show, list)
  }

  //渲染列表页操作栏
  const optRender = (optionSet: string[]) => {
    const obj: any = {
      detail: '详情',
      edit: '编辑',
    }
    const opt =
      optionSet &&
      optionSet.map((item: string) => {
        if (item === 'delete') {
          return (
            <Popconfirm
              title="确定删除吗？"
              okText="确认"
              cancelText="取消"
              onConfirm={() => {}}
            >
              {' '}
              <Button type="link">删除</Button>
            </Popconfirm>
          )
        }
        return (
          <Button type="link" onClick={() => {}}>
            {obj[item]}
          </Button>
        )
      })

    return opt
  }

    //配置表单页
    const addSet = async () => {
      addSetRef.current && addSetRef.current.show(addSource, false)
  }

  const info = (name: string, show: any, dataList: any) => {
    show(dataList)
  }

  const getApi = () => {
    const values = form.getFieldsValue()
    return fetch('/api/hello', {
      method: 'POST',
      body: JSON.stringify({
        id: values.pageList,
        token: values.token,
        url: values.url,
      }),
    })
      .then(async (res: any) => {
        const response = await res.json()
        // 根据你的接口规范处理业务错误码
        if (response.code !== 200) {
           message.error(response.message)
          throw new Error(response.msg || '业务请求失败')
        }
        const res_body: any = JSON.parse(response.data.res_body)
        const parts = response.data.path.split('/')
        let _object:any = {}
        if(res_body.properties.data.properties){
          _object =res_body.properties.data.properties?.data?.items?.properties ?? res_body.properties.data.properties;
        }else{
          _object =res_body.properties.data.items.properties
        }

        const _columns = []
        for (const key in _object) {
          const item = _object[key]

          _columns.push({
            title: item.description,
            hideInSearch: true,
            dataIndex: key,
            isCheckout: true,
            align: 'center',
            dic: null
          })
        }
        setPageListSource(_columns)
        form.setFieldsValue({
          fileName: parts[parts.length - 2],
        })
        return _columns
      })
      .catch((err) => {
        setSpinning(false)
      })
  }

  const getDetailApi = () => {
    const values = form.getFieldsValue()
    return fetch('/api/hello', {
      method: 'POST',
      body: JSON.stringify({
        id: values.detail,
        token: values.token,
        url: values.url,
      }),
    })
      .then(async (res: any) => {
        const response = await res.json()
        // 根据你的接口规范处理业务错误码
        if (response.code !== 200) {
           message.error(response.message)
          throw new Error(response.msg || '业务请求失败')
        }
        const res_body: any = JSON.parse(response.data.res_body);
        const _object =res_body.properties.data.properties?.data?.items?.properties ?? res_body.properties.data.properties;
        const detailList = []
        for (const key in _object) {
          const item = _object[key]
          detailList.push({
            label: item.description,
            value: key,
          })
        }

        setDetailSource(detailList)
      })
      .catch((err) => {
        setSpinning(false)
      })
  }


  const getAddApi= () => {
    const values = form.getFieldsValue()
    return fetch('/api/hello', {
      method: 'POST',
      body: JSON.stringify({
        id: values.add,
        token: values.token,
        url: values.url,
      }),
    })
      .then(async (res: any) => {
        const response = await res.json()
        // 根据你的接口规范处理业务错误码
        if (response.code !== 200) {
          message.error(response.message)
          throw new Error(response.msg || '业务请求失败')
        }
        const res_body: any = JSON.parse(response.data.req_body_other);
        
        const _object =res_body.properties;

          const required =res_body.required || [];
        const addList = [];

        for (const key in _object) {
          let typeUi= 'text'
          
          const item = _object[key]

          const mock = item.mock
          let type = item.type
          if(mock){
            type= mock.mock.replace('@','')
          }


            // 处理不同组件类型
      if (key.toLowerCase().includes('file')) {
        typeUi = `uploadFile`;
      } else if ( ['remark','reason'].includes(key)) { 
        typeUi = `textArea`;
      } else {
        switch (type) {
          case 'date':
          case 'datetime':
            typeUi = `${type}`;
            break;
          case 'number':
          case 'integer':
            typeUi =  `${type}`;
            break;
          default:
            typeUi =  `${type}`;
        }
      }

          addList.push({
            label: item.description,
            value: key,
            type: type,
            typeUi,
            required: required.includes(key),
            isCheckout: true,
            dic: null
          })
        }
        setAddSource(addList)
      })
      .catch((err) => {
        setSpinning(false)
      })
  }
  //双向绑定列表接口名
  const tokenChange = (val: any) => {
    form.setFieldsValue({
      token: val.target.value,
    })
  }

  //双向绑定列表接口名
  const urlChange = (val: any) => {
    form.setFieldsValue({
      url: val.target.value,
    })
  }

  return (
    <Spin tip="加载中..." spinning={spinning}>
      <Form
        form={form}
        onFinish={onFinish}
        onValuesChange={onValuesChange}
        {...FormItemLayout}
        style={{ maxWidth: '600px' }}
      >

        <FormItem
          label="yapi地址"
          name="url"
          initialValue="http://172.21.143.35:3000"
        >
          <Input
            onChange={(val) => urlChange(val)}
            style={{ width: 'calc(100% - 200px)' }}
          />
        </FormItem>

        <FormItem
          label="token"
          name="token"
          initialValue="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjYzMCwiaWF0IjoxNzUwNjUwMjYzLCJleHAiOjE3NTEyNTUwNjN9.lfIYOt9w7-8pxZvud-ipWAxKZWOaQ-Uh_oOFHBbFdrs; _yapi_uid=630"
        >
          <Input
            onChange={(val) => tokenChange(val)}
            style={{ width: 'calc(100% - 200px)' }}
          />
        </FormItem>

        <FormItem
          label="模版语法"
          name="tempType"
          initialValue= {2}
          rules={[
            {
              required: true,
              message: '必填内容',
            },
          ]}
        >
          <Radio.Group>
            <Radio disabled value={1}>
              Umi
            </Radio>
            <Radio value={2}>VUE</Radio>
            <Radio disabled value={3}>
              NEXT
            </Radio>
            <Radio value={4} disabled>TS</Radio>
          </Radio.Group>
        </FormItem>

        {!isTs ? (
          <>
            <FormItem label="列表页面" name="pageList">
              <Input.Group compact>
                <Input
                  onChange={(val) => pageListChange(val)}
                  style={{ width: 'calc(100% - 200px)' }}
                />
                <Button type="primary" onClick={pageListSet}>
                  配置页面
                </Button>
              </Input.Group>
            </FormItem>

            <FormItem label="详情页面" name="detail" initialValue="">
              <Input
                onChange={(val) => detailChange(val)}
                style={{ width: 'calc(100% - 200px)' }}
              />
            </FormItem>
            <FormItem label="新增页面" name="add" initialValue="">
             
               <Input.Group compact>
               <Input
                onChange={(val) => addChange(val)}
                style={{ width: 'calc(100% - 200px)' }}
              />
                <Button type="primary" onClick={addSet}>
                  配置页面
                </Button>
                </Input.Group>
            </FormItem>


            <FormItem
          label="表单展示形式"
          name="addType"
          initialValue= {1}
          rules={[
            {
              required: true,
              message: '必填内容',
            },
          ]}
        >
          <Radio.Group>
            <Radio  value={1}>
              弹框表单
            </Radio>
            <Radio value={2}>非弹框</Radio>
          </Radio.Group>
        </FormItem>

            <FormItem label="文件名称" name="fileName" initialValue="fileName">
              <Input
                onChange={(val) => fileNameChange(val)}
                style={{ width: 'calc(100% - 200px)' }}
              />
              
            </FormItem>

            {/* <FormItem
              label="新增页面展示方式"
              name="addType"
              initialValue={1}
              rules={[
                {
                  required: true,
                  message: '必填内容',
                },
              ]}
            >
              <Radio.Group>
                <Radio value={1}>
                  <Tooltip title="会新建一个页面。从列表页点击新增会  跳转到新增页面！">
                    新页面展示 <InfoCircleOutlined />
                  </Tooltip>
                </Radio>
                <Radio value={2}>
                  <Tooltip title="不会新建一个页面。从列表页点击新增会 弹出一个新增弹框！">
                    弹框展示 <InfoCircleOutlined />
                  </Tooltip>
                </Radio>
              </Radio.Group>
            </FormItem> */}
          </>
        ) : (
          ''
        )}
        <FormItem
          label="生成后下载"
          name="isDownload"
          initialValue={true}
          // rules={[
          //   {
          //     required: true,
          //     message: '必填内容',
          //   },
          // ]}
        >
          <Radio.Group>
            <Radio value={true}>是</Radio>
            <Radio value={false}>否</Radio>
          </Radio.Group>
        </FormItem>

        <FooterToolbar
          renderContent={() => (
            <Button type="primary" onClick={() => form?.submit()}>
              生成页面
            </Button>
          )}
        />
      </Form>

      {/* 列表页配置组件 */}
      <ListModal tabRef={tabSetRef} setPageListSource={setPageListSource} />
      {/* 列表页预览组件 */}
      <ListModalPreview tabRef={tabPreviewRef} />
      {/* 新增页配置组件 */}
      <AddModal tabRef={addSetRef} setAddSource={setAddSource} />
      {/* 新增页预览组件 */}
      <AddModalYu tabRef={addPreviewRef} />

    </Spin>
  )
}

export default Index

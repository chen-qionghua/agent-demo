import React, {
  useImperativeHandle,
  useRef,
  useState,
  ChangeEvent,
} from 'react'
import { Modal, Input, Button, Upload } from 'antd'
import type { UploadProps } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import ProTable from '@ant-design/pro-table'
import DataSelect from '@/components/dataSelect/dataSelect'
import { formSource, rulesSource } from './valueTypeList'
import { parseOcrFields } from '@/common/utils'

const AddModal: React.FC<any> = (props) => {
  const { tabRef, setAddSource } = props
  const [visible, setVisible] = useState<boolean>(false)
  const [dataSource, setDataSource] = useState<Array<any>>([]) //表格数据

  const uploadProps: UploadProps = {
    action: '/api/ocr',
    onChange({ file, fileList }) {
      if (file.status !== 'uploading') {
        
      
        const list = parseOcrFields(file.response?.text ?? '',1)
        setDataSource([...list])
         setSelectedRowKeys([])
          setSelectedRows([])
      } else {
        setDataSource([]) 
         setSelectedRowKeys([])
          setSelectedRows([])
      }
    },
    defaultFileList: [],
  }

  const handleOk = () => {
    const selectedRowKeysObj: any = {}

    selectedRowKeys &&
      selectedRowKeys.map((item) => {
        selectedRowKeysObj[item] = item
      })
    //筛选出选中的数据
    const data =
      dataSource &&
      dataSource.map((item: any) => {
        if (selectedRowKeysObj[item.value]) {
          return {
            ...item,
            isCheckout: true,
          }
        }
        return {
          ...item,
          isCheckout: false,
        }
      })

    setAddSource(data)
    handleCancel()
  }

  const handleCancel = () => {
    setVisible(false)
  }

  const columns: any = [
    {
      title: '表单英文名',
      hideInSearch: true,
      dataIndex: 'value',
      align: 'center',
      width: 80,
    },
    {
      title: '字段中文名',
      hideInSearch: true,
      dataIndex: 'label',
      width: 150,
      align: 'center',
      render: (_: any, item: any, index: number) => {
        return (
          <Input
            defaultValue={item.label}
            onChange={(val: any) => labelChange(val, index)}
          />
        )
      },
    },

    {
      title: '表单类型',
      hideInSearch: true,
      dataIndex: 'type',
      align: 'center',
      width: 120,
      tip: '输入框、文本框、时间、日期、下拉框等',
      render: (_: any, item: any, index: number) => {
        return (
          <DataSelect
            defaultValue={item.typeUi || 'text'}
            dataSource={formSource}
            onChange={(val: string) => typeChange(val, index)}
          />
        )
      },
    },
    {
      title: '接口字典(dic)',
      hideInSearch: true,
      dataIndex: 'dic',
      width: 80,
      align: 'center',
      render: (_: any, item: any, index: number) => {
        return (
          <Input
            placeholder="选填(下拉框场景下使用)"
            defaultValue={item.dic}
            onChange={(val: any) => dicChange(val, index)}
          />
        )
      },
    },
    {
      title: '必填',
      hideInSearch: true,
      dataIndex: 'label',
      width: 80,
      align: 'center',
      render: (_: any, item: any, index: number) => {
        return item.required ? <span style={{ color: 'red' }}>是</span> : '否'
      },
    },
    {
      title: '表单校验',
      hideInSearch: true,
      dataIndex: 'rules',
      align: 'center',
      width: 120,
      tip: '表单的校验规则',
      render: (_: any, item: any, index: number) => {
        return (
          <DataSelect
            defaultValue={item.isRequire ? ['required'] : []}
            multiple={true}
            dataSource={rulesSource}
            onChange={(val: string) => rulesChange(val, index)}
          />
        )
      },
    },
  ]

  const labelChange = (val: any, index: number) => {
    const data = JSON.parse(JSON.stringify(dataSource))
    data[index].label = val.target.value
    setDataSource(data)
  }

  const typeChange = (val: string, index: number) => {
    const data = JSON.parse(JSON.stringify(dataSource))
    data[index].typeUi = val
    setDataSource(data)
  }

  const dicChange = (val: any, index: number) => {
    const data = JSON.parse(JSON.stringify(dataSource))
    data[index].dic = val.target.value
    setDataSource(data)
  }

  const rulesChange = (val: any, index: number) => {
    const data = JSON.parse(JSON.stringify(dataSource))
    if (val.includes('required')) {
      data[index].required = true
    }
    data[index].rules = val
    setDataSource(data)
  }

  useImperativeHandle(tabRef, () => ({
    // 暴露给父组件的方法
    tableReload: () => {
      ref.current && ref.current.reload()
    },
    show: (data: any, first: boolean) => {
      setDataSource(data)
      setVisible(true)
      const seRowVal = data.map((item: any) => {
        return item.value
      })
      if (first) {
        setSelectedRowKeys(seRowVal)
      }
      ref.current && ref.current.reload()
    },
  }))

  //自定义新增数据
  const addData = () => {
    const dataIndex = `prop${dataSource.length}`

    setDataSource([
      ...dataSource,
      {
        label: null,
        value: dataIndex,
        isCheckout: true,
        align: 'center',
        dic: null,
      },
    ])
  }

  const ref: any = useRef<any>()

  // 选择框(单选/多选)
  const [selectedRows, setSelectedRows] = useState<any[]>()
  const [selectedRowKeys, setSelectedRowKeys] = useState<any[]>()
  const rowSelection: any = {
    type: 'checkout',
    selectedRowKeys,
    onChange: (selectedRowKeys: string[], selectedRows: any[]) => {
      setSelectedRowKeys(selectedRowKeys)
      setSelectedRows(selectedRows)
    },
  }
  return (
    <Modal
      title="配置表格内容"
      visible={visible}
      onOk={handleOk}
      cancelText="取消"
      okText="确定"
      onCancel={handleCancel}
      width="80%"
      maskClosable={false}
      className="pageListClassName"
    >
      <Button type="primary" onClick={addData} style={{ marginRight: '48px' }}>
        新增{' '}
      </Button>

      {/* <div style={{ padding: 20 }}>
        <h1>图片文字识别</h1>
        <div style={{width: '80px',height:'80px',border:'1px solid'}}> 
             <input
          type="file"
          accept="image/*"
          onChange={handleUpload}
          disabled={loading}
          style={{width: '80px',height:'80px',opacity:'0'}}
        />

        </div>
        {loading && <p style={{ color: '#666' }}>识别中...</p>}

        {result && (
          <div style={{ marginTop: 20 }}>
            <h3>识别结果：</h3>
            <pre
              style={{
                whiteSpace: 'pre-wrap',
                background: '#f5f5f5',
                padding: 15,
                borderRadius: 4,
              }}
            >
              {result}
            </pre>
          </div>
        )}
      </div> */}

      <Upload {...uploadProps}>
        <Button icon={<UploadOutlined />}>原型图片识别</Button>
      </Upload>

      <ProTable
        scroll={{ x: 'max-content', y: '40vh' }}
        actionRef={ref}
        rowKey="value"
        rowSelection={rowSelection}
        search={false}
        dataSource={dataSource}
        columns={columns}
        headerTitle="选中要展示的表单"
        pagination={{
          pageSize: 100,
          pageSizeOptions: [100, 200, 300, 500],
        }}
      />
    </Modal>
  )
}

export default AddModal

import React, { useEffect, useImperativeHandle, useRef, useState } from 'react'
import { Modal, Input, Button, Switch,Upload } from 'antd'
import type { UploadProps } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import ProTable from '@ant-design/pro-table'
import DataSelect from '@/components/dataSelect/dataSelect'
import { parseOcrFields } from '@/common/utils'


import {
  ValueTypeSource,
  OptionSource,
  HeaderSource,
  BatchSource,
} from './valueTypeList'

const ListModal: React.FC<any> = (props) => {
  const { tabRef, setPageListSource } = props
  const [visible, setVisible] = useState<boolean>(false)
  const [dataSource, setDataSource] = useState<Array<any>>([]) //表格数据

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
        if (selectedRowKeysObj[item.dataIndex]) {
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
    setPageListSource(data)
    handleCancel()
  }

  const handleCancel = () => {
    setVisible(false)
  }
  const columns: any = [
    {
      title: '字段英文名',
      hideInSearch: true,
      dataIndex: 'dataIndex',
      align: 'center',
      width: 120,
    },
    {
      title: '字段中文名',
      hideInSearch: true,
      dataIndex: 'title',
      width: 80,
      align: 'center',
      render: (_: any, item: any, index: number) => {
        return (
          <Input
            defaultValue={item.title}
            onChange={(val: any) => remarkChange(val, index)}
          />
        )
      },
    },
    {
      title: '字段类型',
      hideInSearch: true,
      dataIndex: 'type',
      align: 'center',
      width: 80,
    },

    {
      title: '是否检索',
      hideInSearch: true,
      dataIndex: 'isSearch',
      align: 'center',
      width: 80,
      render: (_: any, item: any, index: number) => {
        return (
          <Switch
            checkedChildren="是"
            unCheckedChildren="否"
            defaultChecked={false}
            onChange={(val: boolean) => isSearchChange(val, index)}
          />
        )
      },
    },

    {
      title: '检索项类型',
      hideInSearch: true,
      dataIndex: 'selectType',
      align: 'center',
      width: 120,
      tip: '表格的筛选项目',
      render: (_: any, item: any, index: number) => {
        return (
          <DataSelect
            defaultValue={'default'}
            dataSource={ValueTypeSource}
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
            defaultValue={item.dic}
            placeholder="选填(下拉框场景下使用)"
            onChange={(val: any) => dicChange(val, index)}
          />
        )
      },
    },

    {
      title: '操作栏配置',
      hideInSearch: true,
      dataIndex: 'optionSet',
      align: 'center',
      tip: '只需要设置第一个即可',
      width: 120,
      render: (_: any, item: any, index: number) => {
        if (index !== 0) {
          return '-'
        }
        return (
          <DataSelect
            multiple={true}
            dataSource={OptionSource}
            onChange={(val: string[]) => optionSetChange(val)}
          />
        )
      },
    },
  ]

  const remarkChange = (val: any, index: number) => {
    const data = JSON.parse(JSON.stringify(dataSource))
    data[index].title = val.target.value
    setDataSource(data)
  }
  const typeChange = (val: string, index: number) => {
    const data = JSON.parse(JSON.stringify(dataSource))
    data[index].selectType = val
    setDataSource(data)
  }

  const dicChange = (val: any, index: number) => {
    const data = JSON.parse(JSON.stringify(dataSource))
    data[index].dic = val.target.value
    setDataSource(data)
  }

  const isSearchChange = (val: boolean, index: number) => {
    const data = JSON.parse(JSON.stringify(dataSource))
    data[index].isSearchs = val
    setDataSource(data)
  }

  const optionSetChange = (val: string[]) => {
    const data = JSON.parse(JSON.stringify(dataSource))
    data &&
      data.map((item: string, index: number) => {
        data[index].optionSet = val
      })
    setDataSource(data)
  }
  const exprotChange = (val: string[]) => {
    const data = JSON.parse(JSON.stringify(dataSource))
    data &&
      data.map((item: string, index: number) => {
        data[index].headerSet = val
      })
    setDataSource(data)
  }

  const isHaveIndexChange = (val: boolean) => {
    const data = JSON.parse(JSON.stringify(dataSource))
    data &&
      data.map((item: string, index: number) => {
        data[index].isHaveIndex = val
      })

    setDataSource(data)
  }

  //自定义新增数据
  const addData = () => {
    const dataIndex = `prop${dataSource.length}`

    setDataSource([
      ...dataSource,
      {
        title: null,
        hideInSearch: true,
        dataIndex: dataIndex,
        isCheckout: true,
        align: 'center',
        dic: null,
      },
    ])
  }

    const uploadProps: UploadProps = {
      action: '/api/ocr',
      onChange({ file, fileList }) {
        if (file.status !== 'uploading') {
          console.log()
          const list = parseOcrFields(file.response?.text ?? '',2)
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

  useImperativeHandle(tabRef, () => ({
    // 暴露给父组件的方法
    tableReload: () => {
      ref.current && ref.current.reload()
    },
    show: (data: any, first: boolean) => {
      setDataSource(data)
      setVisible(true)
      const seRowVal = data.map((item: any) => {
        return item.dataIndex
      })
      if (first) {
        setSelectedRowKeys(seRowVal)
      }
      ref.current && ref.current.reload()
    },
  }))
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
      <Button type="primary" onClick={addData}  style={{ marginRight: '48px' }}>
        新增{' '}
      </Button>

       <Upload {...uploadProps}>
            <Button icon={<UploadOutlined />}>原型图片识别</Button>
          </Upload>

      <ProTable
        scroll={{ x: 'max-content', y: '40vh' }}
        actionRef={ref}
        rowKey="dataIndex"
        rowSelection={rowSelection}
        search={false}
        dataSource={dataSource}
        columns={columns}
        headerTitle={
          <>
            <span>选中要展示的数据</span>
          </>
        }
        pagination={{
          pageSize: 100,
          pageSizeOptions: [100, 200, 300, 500],
        }}
        toolBarRender={() => [
          <DataSelect
            style={{ minWidth: 140 }}
            placeholder="请选中操作按钮"
            multiple={true}
            dataSource={HeaderSource}
            onChange={exprotChange}
          />,
        ]}
      />
    </Modal>
  )
}

export default ListModal

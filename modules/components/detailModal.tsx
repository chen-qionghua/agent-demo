import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';
import { Modal, Input, Form, Switch } from 'antd';
import ProTable from '@ant-design/pro-table';
import DataSelect from '@/components/dataSelect/dataSelect';
import { ValueTypeSource } from './valueTypeList'

const DeatilModal: React.FC<any> = (props) => {
    const { tabRef, setDetailSource } = props
    const [visible, setVisible] = useState<boolean>(false)
    const [dataSource, setDataSource] = useState<Array<any>>([])//表格数据

    const handleOk = () => {
        const selectedRowKeysObj: any = {}

        selectedRowKeys && selectedRowKeys.map((item) => {
            selectedRowKeysObj[item] = item
        })
        //筛选出选中的数据
        const data=  dataSource && dataSource.map((item: any) => {
            if (selectedRowKeysObj[item.name]) {
                return {
                    ...item,
                    isCheckout: true
                }
            }
            return  {
                ...item,
                isCheckout: false
            }

        })
        setDetailSource(data)
        handleCancel()
    };

    const handleCancel = () => {
        setVisible(false)
    };



    const columns: any = [
        {
            title: '字段英文名',
            hideInSearch: true,
            dataIndex: 'name',
            align: 'center',
            width: 120,
            
        },
        {
            title: '字段中文名',
            hideInSearch: true,
            dataIndex: 'remark',
            width: 80,
            align: 'center',
            render: (_: any, item: any, index: number) => {
                return <Input  defaultValue={item.remark}  onChange={(val:any)=>remarkChange(val,index)}/>
            },
        },
        {
            title: '字段展示类型',
            hideInSearch: true,
            dataIndex: 'type',
            align: 'center',
            width: 120,
            tip: '用作处理特殊字段，如：金额、日期、时间等',
            render: (_: any, item: any, index: number) => {
                return <DataSelect defaultValue={'default'} dataSource={ValueTypeSource} onChange={(val: string) => typeChange(val, index)} />
            },
        },
    ]

    const typeChange = (val: string, index: number) => {
        const data = JSON.parse(JSON.stringify(dataSource))
        data[index].valueType = val
        setDataSource(data)
    }

    const remarkChange =(val:any,index:number)=>{
        const data = JSON.parse(JSON.stringify(dataSource))
        data[index].remark = val.target.value
        setDataSource(data)
    }

    useImperativeHandle(tabRef, () => ({
        // 暴露给父组件的方法
        tableReload: () => {
            ref.current && ref.current.reload();
        },
        show: (data: any, first:boolean) => {
            setDataSource(data)
            setVisible(true)
            const seRowVal = data.map((item: any) => {
                return item.name
            })
            if(first){
                setSelectedRowKeys(seRowVal)
            }
            ref.current && ref.current.reload();
        },
    }));
    const ref: any = useRef<any>();

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
            title="配置详情页内容"
            visible={visible}
            onOk={handleOk}
            cancelText='取消'
            okText='确定'
            onCancel={handleCancel}
            width='80%'
            maskClosable={false}
            className='pageListClassName'
        >
            <ProTable
                scroll={{ x: 'max-content', y: '40vh' }}
                actionRef={ref}
                rowKey='name'
                rowSelection={rowSelection}
                search={false}
                dataSource={dataSource}
                columns={columns}
                headerTitle="选中要展示的数据"
                pagination={{
                    pageSize: 100,
                    pageSizeOptions: [100, 200, 300, 500]
                }}
            />

        </Modal>

    )
}

export default DeatilModal
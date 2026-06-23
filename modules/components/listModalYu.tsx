import React, {  useEffect, useImperativeHandle, useRef, useState } from 'react';
import { Modal, Button } from 'antd';
import ProTable from '@ant-design/pro-table';
import { PlusOutlined } from '@ant-design/icons'


const ListModal: React.FC<any> = (props) => {
    const { tabRef } = props
    const [visible,setVisible]= useState<boolean>(false)
    const [columns,setColumns]=useState<Array<any>>([])//表头
    const [headerNode,setHeaderNode]=useState<Array<any>>([])
    const [batchListNode, setBatchListNode]= useState<string[]>([])
    const handleOk = () => {
        handleCancel()
    };

    const handleCancel = () => {
        setVisible(false)
    };

    useImperativeHandle(tabRef, () => ({
        // 暴露给父组件的方法
        tableReload: () => {
            ref.current && ref.current.reload();
        },
        show: (data:any,headerSet:string[],batchListSet:string[])=>{
            setHeaderNode(headerSet)
            setColumns(data)
            setVisible(true)
            setBatchListNode(batchListSet)
            ref.current && ref.current.reload();
        },
    }));
    const ref: any = useRef<any>();

    const toolBarRenders=()=>{
     const he=   headerNode&&headerNode.map((item:string)=>{
            if(item === 'add'){
                return <Button type="primary" onClick={() => { }}>
                  <PlusOutlined /> 新建
                </Button>
            }
            if(item === 'export'){
                return <Button type="primary" onClick={() => { }}>
                 导出
                </Button>
            }
        })
        return he
    }

    const headerTitleRenders=()=>{
    
        const he= batchListNode&&batchListNode.map((item:string)=>{
               if(item === 'delete'){
                   return <Button type="primary" onClick={() => { }}>
                      批量删除
                   </Button>
               }
               if(item === 'up'){
                   return <Button type="primary" style={{marginLeft:10}} onClick={() => { }}>
                    批量上架
                   </Button>
               }
               if(item === 'down'){
                   return <Button type="primary" style={{marginLeft:10}} onClick={() => { }}>
                    批量下架
                   </Button>
               }
           })
           return he
       }

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
            title="预览列表页"
            visible={visible}
            onOk={handleOk}
            cancelText='取消'
            okText='确定'
            onCancel={handleCancel}
            width='80%'
            maskClosable
            className='pageListClassName'
            >
            <ProTable
                scroll={{ x: 'max-content',y: '40vh' }}
                actionRef={ref}
                rowKey='name'
                rowSelection={batchListNode&&batchListNode.length===0?false:rowSelection}
                dataSource={[{}]}
                columns={columns}
                pagination={{
                    pageSize: 100,
                    pageSizeOptions: [100,200,300,500]
                }}
                toolBarRender={() => {
                    return  toolBarRenders()
                }}
                headerTitle={
                    <>
                        {headerTitleRenders()}
                    
                    </>
                }
            />

        </Modal>

    )
}

export default ListModal
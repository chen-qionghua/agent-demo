import React, { useImperativeHandle, useRef, useState } from 'react';
import { Modal } from 'antd';
import { Descriptions } from 'antd';
import { setData } from '@/common/utils';
const DescriptionsItem = Descriptions.Item

const ListModal: React.FC<any> = (props) => {
    const { tabRef } = props
    const [visible, setVisible] = useState<boolean>(false)
    const [detailSource, setDetailSource] = useState<Array<any>>([])//表头
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
        show: (data: any) => {
            setDetailSource(data)
            setVisible(true)
            ref.current && ref.current.reload();
        },
    }));
    const ref: any = useRef<any>();


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
            <Descriptions>

                {
                    detailSource && detailSource.map((item:any)=>{
                        return (
                            <DescriptionsItem label={item.remark}>{setData(item.remark,'')}</DescriptionsItem>
                        )
                    })
                }

               

            </Descriptions>

        </Modal>

    )
}

export default ListModal
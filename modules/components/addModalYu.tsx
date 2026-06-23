import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';
import { Modal, Input, Form, Switch, DatePicker } from 'antd';
import { ValueTypeSource, rules as rulesObject} from './valueTypeList'
import { FormItemLayout } from '../components/valueTypeList'
import DataSelect from '@/components/dataSelect/dataSelect';
import CascaderAddress from '@/components/address/cascaderAddress';
import UploadPic from '@/components/upload/uploadPic';
import UploadList from '@/components/upload/UploadList';

import UploadfFiles from '@/components/upload/UploadfFiles';



const { RangePicker } = DatePicker;
const FormItem = Form.Item

interface FormItemType {
    isCheckout: boolean;
    isRequire: boolean;
    name: string;
    remark: string;
    rules: string[];
    type: string;
    valueType: string
}


const ListModal: React.FC<any> = (props) => {
    const { tabRef } = props
    const [visible, setVisible] = useState<boolean>(false)
    const [formData, setFormData] = useState<Array<any>>([])//表头
    const handleOk = () => {
        form?.submit()
    };

    const handleCancel = () => {
        setVisible(false)
    };


    useImperativeHandle(tabRef, () => ({
        show: (data: any) => {
            setFormData(data)
            setVisible(true)
        },
    }));
    const ref: any = useRef<any>();

    const onFinish = (values: any) => {
       
    }

    const [form] = Form.useForm();

    //渲染表单
    const showAllFormItem = (item: FormItemType) => {
        return (
            <FormItem
                label={item.remark}
                name={item.name}
                rules= {formItemRules(item.rules, item.remark)}
            >   
                {
                    formItemType(item.valueType, item.remark)
                }
            </FormItem>
        )
    }
    
    //表单校验规则
    // rules={[
    //     {
    //       required: true,
    //       message: '请输入公司名称',
    //     },
    //   ]}
    const formItemRules= (rules:string[],remark:string)=>{
        const rulesObj :any =[]
        const formNodeObj: any = {
            required: `${remark}不能为空`,
            number: `只能为正整数`,
            money: `请输入百万以内的金额`,
            phone: `手机号格式错误`,
            card: `身份证格式错误`,
            email: `邮箱格式错误`,
            bankAccount: `银行卡式错误`,
            chinaZh: `只能输入中文`,
            max12: `不能超过12个字符`,
            max50: `不能超过50个字符`,
            max150: `不能超过150个字符`,
        }
        rules&&rules.map((item:string)=>{
            // ruleObj[item]= 
            if(item === 'required'){
                rulesObj.push( {
                    required: true,
                    message: formNodeObj[item],
                })
                
            }else{
                rulesObj.push( {
                    pattern: rulesObject[item],
                    message: formNodeObj[item],
                })
            }
        })
            return rulesObj
    }

    //表单内容
    const formItemType = (valueType: string, remark: string) => {
        if (!valueType) {
            return <Input placeholder={`请输入${remark}`} />
        }
        const formNodeObj: any = {
            text: <Input placeholder={`请输入${remark}`} />,
            date: <DatePicker placeholder={`请选择${remark}`} />,
            dateTime: <DatePicker showTime placeholder={`请选择${remark}`} />,
            select: <DataSelect dataSource={[]} placeholder={`请选择${remark}`} />,
            dateRange: <RangePicker />,
            dateTimeRange: <DatePicker showTime />,
            area: <CascaderAddress />,
            uplodaImage: <UploadPic />,
            uplodaImageList: <UploadList />,
            uploadFile: <UploadfFiles />,
            textArea: <Input.TextArea rows={3} placeholder={`请输入${remark}`} />,

        }
        if (formNodeObj[valueType]) {
            return formNodeObj[valueType]
        }
    }

    return (

        <Modal
            title="预览新增页"
            visible={visible}
            onOk={handleOk}
            cancelText='取消'
            okText='确定'
            onCancel={handleCancel}
            width='80%'
            maskClosable={false}
            className='pageListClassName'
        >

            <Form
                form={form}
                onFinish={onFinish}
                {...FormItemLayout}
                style={{ maxWidth: '80%',maxHeight: '50vh',overflowY:'auto' }}>
                {
                    formData.map((item: FormItemType) => {
                        return showAllFormItem(item)
                    })
                }



            </Form>


        </Modal>

    )
}

export default ListModal
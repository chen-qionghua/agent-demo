import CascaderAddress from '@/components/address/cascaderAddress';
import UploadfFiles from "@/components/upload/UploadfFiles"  
import {Button,Card,Form,Input} from 'antd';
import React, {FC, useEffect,useState} from 'react';
import {GridContent,FooterToolbar} from '@ant-design/pro-layout';
import { formatDate } from '@/common/utils'; 
import moment from 'moment';
import { useRouter } from 'next/router'
import {add, update,query} from '../services/customer';
import {AddReqForm} from '../services/data';
import { FormItemLayout } from 'common/constants'
import {  rules as rulesObject} from '@/modules/components/valueTypeList';
const FormItem = Form.Item;


const CreateCustomerForm: FC<any> = (props) => {
const [loading, setLoading] = useState(false)
 const router = useRouter(); 
 const id:any = router.query.id;

  const onFinish = (values: AddReqForm  ) => {
setLoading(true)
const params:AddReqForm = {...values};
if (id) {
update({...params,id}).then((res:any)=>{
setLoading(false)
   if(res.result === 'ok'){
   router.push({pathname: `/customer` })
 return;
 }
})
return 
}
add(params).then((res:any)=>{
setLoading(false)
  if(res.result === 'ok'){
   router.push({pathname: `/customer`  })
}})  };

  const [form] = Form.useForm();
  useEffect(() => {
    if(id){
 query({ id }).then((res: any) => {
  if (res.result === 'ok') {
     const { data } = res
     for (const key in data) {
       const name = key.replace(key, key.toLowerCase())
      if (name.indexOf('time') > -1 || name.indexOf('date') > -1) {
data[key] = data[key] ? moment(formatDate(data[key], true)) : ''
 }
 }
form.setFieldsValue(data);
 }
 })
    }
  }, [id])

  return (
 <Form
      form={form}
      onFinish={onFinish}
      {...FormItemLayout}
  style={{ maxWidth: '600px' }}     >
      <GridContent>
        <Card title="基础数据" bordered={false}>
    
           <FormItem
            label='市'
            name="city"
rules={[{required: true,
message:" 市不能为空 "
},]}>
<CascaderAddress /> 
          </FormItem>        
    
           <FormItem
            label='头像地址'
            name="headImgUrl"
>
<UploadfFiles /> 
          </FormItem>        
    
           <FormItem
            label='姓名'
            name="name"
rules={[{required: true,
message:" 姓名不能为空 "
},{pattern: rulesObject.max12,
message:" 不能超过12个字符" 
},]}>
<Input placeholder="请输入姓名" /> 
          </FormItem>        
        </Card>
      </GridContent>
      <FooterToolbar
        renderContent={() => (
          <Button type="primary" onClick={() => form?.submit()} loading={loading}>
            提交
          </Button>
        )}
      />
    </Form>  );
};

export default CreateCustomerForm;

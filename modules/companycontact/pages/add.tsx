import DataSelect from '@/components/dataSelect/dataSelect';
import {Button,Card,Form,Input} from 'antd';
import React, {FC, useEffect,useState} from 'react';
import {GridContent,FooterToolbar} from '@ant-design/pro-layout';
import { formatDate } from '@/common/utils'; 
import moment from 'moment';
import { useRouter } from 'next/router'
import {add, update,query} from '../services/companycontact';
import {AddReqForm} from '../services/data';
import { FormItemLayout } from 'common/constants'
import {  rules as rulesObject} from '@/modules/components/valueTypeList';
const FormItem = Form.Item;


const CreateCompanycontactForm: FC<any> = (props) => {
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
   router.push({pathname: `/companycontact` })
 return;
 }
})
return 
}
add(params).then((res:any)=>{
setLoading(false)
  if(res.result === 'ok'){
   router.push({pathname: `/companycontact`  })
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
            label='客户名称'
            name="companyId"
rules={[{required: true,
message:" 客户名称不能为空 "
},]}>
<DataSelect dataSource={[]} placeholder="请选择客户名称" /> 
          </FormItem>        
    
           <FormItem
            label='是否关键决策人'
            name="managerFlag"
>
<DataSelect dataSource={[]} placeholder="请选择是否关键决策人" /> 
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
    
           <FormItem
            label='手机号'
            name="phone"
rules={[{required: true,
message:" 手机号不能为空 "
},{pattern: rulesObject.phone,
message:" 手机号格式错误" 
},]}>
<Input placeholder="请输入手机号" /> 
          </FormItem>        
    
           <FormItem
            label='职务'
            name="post"
>
<Input placeholder="请输入职务" /> 
          </FormItem>        
    
           <FormItem
            label='备注'
            name="remark"
rules={[{pattern: rulesObject.max150,
message:" 不能超过150个字符" 
},]}>
<Input.TextArea rows={3} placeholder="请输入备注"/> 
          </FormItem>        
    
           <FormItem
            label='性别'
            name="sex"
rules={[{required: true,
message:" 性别不能为空 "
},]}>
<DataSelect dataSource={[]} placeholder="请选择性别" /> 
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

export default CreateCompanycontactForm;

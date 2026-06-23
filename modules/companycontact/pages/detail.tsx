import {Card, Descriptions, Divider} from 'antd';
import React,{useEffect,useState} from 'react';

import {PageHeaderWrapper as ProPageHeaderWrapper} from '@ant-design/pro-layout';
import { useRouter } from 'next/router'
import { setData } from '@/common/utils';
import {query} from '../services/companycontact';

interface DetailProps {
}

const PageHeaderWrapper = ProPageHeaderWrapper as React.ComponentType<
  React.PropsWithChildren<React.ComponentProps<typeof ProPageHeaderWrapper>>
>;


const Detail: React.FC<DetailProps> = (props) => {
 const router = useRouter(); 
 const id:any = router.query.id;


 const [companycontactInfo,setCompanycontactInfo]= useState<any>({});
  useEffect(() => {
    if(id){
 query({ id }).then((res: any) => {
  if (res.result === 'ok') {
     const { data } = res
     setCompanycontactInfo(data)
 }
 })
    }
  }, [id])

  const {addTime,addUserId,addUserName,companyId,companyName,managerFlag,name,optTime,optUserId,optUserName,phone,post,remark,sex,} = companycontactInfo;
  return (
    <PageHeaderWrapper title={<></>}>
      <Card bordered={false}>
        <Descriptions title="" style={{marginBottom: 32}}>
          <Descriptions.Item label="添加时间">{setData(addTime,'')}</Descriptions.Item>
          <Descriptions.Item label="添加人编号">{setData(addUserId,'')}</Descriptions.Item>
          <Descriptions.Item label="添加人姓名">{setData(addUserName,'')}</Descriptions.Item>
          <Descriptions.Item label="客户（公司）编号">{setData(companyId,'')}</Descriptions.Item>
          <Descriptions.Item label="客户（公司）名称">{setData(companyName,'')}</Descriptions.Item>
          <Descriptions.Item label="联系人编号">{setData(id,'')}</Descriptions.Item>
          <Descriptions.Item label="决策人标记，1：是，2：否，默认：0">{setData(managerFlag,'')}</Descriptions.Item>
          <Descriptions.Item label="姓名">{setData(name,'')}</Descriptions.Item>
          <Descriptions.Item label="操作时间">{setData(optTime,'')}</Descriptions.Item>
          <Descriptions.Item label="编辑人编号">{setData(optUserId,'')}</Descriptions.Item>
          <Descriptions.Item label="编辑人姓名">{setData(optUserName,'')}</Descriptions.Item>
          <Descriptions.Item label="手机号">{setData(phone,'')}</Descriptions.Item>
          <Descriptions.Item label="职务">{setData(post,'')}</Descriptions.Item>
          <Descriptions.Item label="备注">{setData(remark,'')}</Descriptions.Item>
          <Descriptions.Item label="性别，0：女，1：男，2：保密">{setData(sex,'')}</Descriptions.Item>
        </Descriptions>

      </Card>
    </PageHeaderWrapper>
  );

}

export default Detail
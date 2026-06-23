import {Card, Descriptions, Divider} from 'antd';
import React,{useEffect,useState} from 'react';

import {PageHeaderWrapper as ProPageHeaderWrapper} from '@ant-design/pro-layout';
import { useRouter } from 'next/router'
import { setData } from '@/common/utils';
import {query} from '../services/customer';

interface DetailProps {
}

const PageHeaderWrapper = ProPageHeaderWrapper as React.ComponentType<
  React.PropsWithChildren<React.ComponentProps<typeof ProPageHeaderWrapper>>
>;


const Detail: React.FC<DetailProps> = (props) => {
 const router = useRouter(); 
 const id:any = router.query.id;


 const [customerInfo,setCustomerInfo]= useState<any>({});
  useEffect(() => {
    if(id){
 query({ id }).then((res: any) => {
  if (res.result === 'ok') {
     const { data } = res
     setCustomerInfo(data)
 }
 })
    }
  }, [id])

  const {addShopId,addTime,addUserId,addUserName,address,balance,birthday,city,companyId,consumerAllCount,consumerAllMoney,couponNum,district,headImgUrl,idcard,lastedConsumerTime,name,nickname,packageNum,phone,productDictionaryList,province,remark,sex,shopName,state,stateChangeTime,wechatNo,} = customerInfo;
  return (
    <PageHeaderWrapper title={<></>}>
      <Card bordered={false}>
        <Descriptions title="" style={{marginBottom: 32}}>
          <Descriptions.Item label="添加的门店编号">{setData(addShopId,'')}</Descriptions.Item>
          <Descriptions.Item label="添加时间">{setData(addTime,'')}</Descriptions.Item>
          <Descriptions.Item label="添加人编号">{setData(addUserId,'')}</Descriptions.Item>
          <Descriptions.Item label="添加人姓名">{setData(addUserName,'')}</Descriptions.Item>
          <Descriptions.Item label="地址">{setData(address,'')}</Descriptions.Item>
          <Descriptions.Item label="余额">{setData(balance,'')}</Descriptions.Item>
          <Descriptions.Item label="生日">{setData(birthday,'')}</Descriptions.Item>
          <Descriptions.Item label="市">{setData(city,'')}</Descriptions.Item>
          <Descriptions.Item label="公司编号">{setData(companyId,'')}</Descriptions.Item>
          <Descriptions.Item label="累计消费次数">{setData(consumerAllCount,'')}</Descriptions.Item>
          <Descriptions.Item label="累计消费总额">{setData(consumerAllMoney,'')}</Descriptions.Item>
          <Descriptions.Item label="优惠券数量">{setData(couponNum,'')}</Descriptions.Item>
          <Descriptions.Item label="区">{setData(district,'')}</Descriptions.Item>
          <Descriptions.Item label="头像地址">{setData(headImgUrl,'')}</Descriptions.Item>
          <Descriptions.Item label="用户编号">{setData(id,'')}</Descriptions.Item>
          <Descriptions.Item label="身份证号码">{setData(idcard,'')}</Descriptions.Item>
          <Descriptions.Item label="最近消费时间">{setData(lastedConsumerTime,'')}</Descriptions.Item>
          <Descriptions.Item label="姓名">{setData(name,'')}</Descriptions.Item>
          <Descriptions.Item label="昵称">{setData(nickname,'')}</Descriptions.Item>
          <Descriptions.Item label="套餐数量">{setData(packageNum,'')}</Descriptions.Item>
          <Descriptions.Item label="手机号码">{setData(phone,'')}</Descriptions.Item>
          <Descriptions.Item label="雇主商品列表">{setData(productDictionaryList,'')}</Descriptions.Item>
          <Descriptions.Item label="省">{setData(province,'')}</Descriptions.Item>
          <Descriptions.Item label="商家备注">{setData(remark,'')}</Descriptions.Item>
          <Descriptions.Item label="性别：0、未知；1、男；2、女">{setData(sex,'')}</Descriptions.Item>
          <Descriptions.Item label="门店名称">{setData(shopName,'')}</Descriptions.Item>
          <Descriptions.Item label="状态：1、正常；2、冻结">{setData(state,'')}</Descriptions.Item>
          <Descriptions.Item label="状态变更时间">{setData(stateChangeTime,'')}</Descriptions.Item>
          <Descriptions.Item label="微信号">{setData(wechatNo,'')}</Descriptions.Item>
        </Descriptions>

      </Card>
    </PageHeaderWrapper>
  );

}

export default Detail
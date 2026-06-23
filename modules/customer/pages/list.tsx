import React, {useRef,useState} from 'react';
import { Button, Popconfirm, Tooltip,notification } from 'antd'
import { useRouter } from 'next/router'
import CrmTable from '@/components/crmTable'
import { subStrFirst} from '@/common/utils'
import { PlusOutlined } from '@ant-design/icons'
import Authorized from '@/components/authorized'
import {QueryPageListResForm} from '../services/data'
import { deleteCustomer,queryPageList } from '../services/customer'
 
const CustomerIndex: React.FC<any> = (props) => {

const router = useRouter()
const tabRef = useRef<any>()
const modalRef = useRef<any>()
  const columns = [
{
      title: '门店编号',
      hideInSearch:true,
 dataIndex: 'addShopId',
  ellipsis: true,
  align: 'center',
    },
{
      title: '添加时间',
      hideInSearch:false,
      valueType:'date',
 dataIndex: 'addTime',
  ellipsis: true,
  align: 'center',
    },
{
      title: '添加人姓名',
      hideInSearch:false,
 dataIndex: 'addUserName',
  ellipsis: true,
  align: 'center',
    },
{
      title: '市',
      hideInSearch:true,
 dataIndex: 'city',
  ellipsis: true,
  align: 'center',
    },

    {
      title: '操作',
      dataIndex: 'option', 
      valueType: 'option',
      fixed: 'right',
hideInSearch: true,
      align: 'center',
      render: (_: any, r: QueryPageListResForm) => {
const {id}= r
        return <>
 <Authorized authority='/customer/update'>
        <Button type="link" onClick={() => {
          router.push({pathname: `/customer/update`,query: {id:r.id}})
        }}>
          编辑
        </Button>
 </Authorized> 
 <Authorized authority='/customer/delete'>
        <Popconfirm 
        title='确定删除吗？'
         okText='确认'
        cancelText='取消'
         onConfirm={() => delele_(id)} 
        >   <Button type='link' size='small'> 
  删除 
   </Button> 
   </Popconfirm> 
 </Authorized> 
        </>
      }
    }
    ];
const delele_= (id:any)=>{
   deleteCustomer({id}).then((res:any)=>{
      if(res.result === 'ok'){
        notification.success({
          message: `提示`,
        description: '删除成功',
       })
       reload()
     }
   })
}//表格刷新
const reload=()=>{
 tabRef.current.tableReload()
 }

 return (
<> <CrmTable
 tabRef={tabRef}
 columns={columns}
tableAlertRender={false}
  queryPageList={queryPageList}
    toolBarRender={false}/>
</>)
}

export default CustomerIndex
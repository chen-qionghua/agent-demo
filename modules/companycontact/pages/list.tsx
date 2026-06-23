import React, {useRef,useState} from 'react';
import { Button, Popconfirm, Tooltip,notification } from 'antd'
import { useRouter } from 'next/router'
import CrmTable from '@/components/crmTable'
import { subStrFirst} from '@/common/utils'
import { PlusOutlined } from '@ant-design/icons'
import Authorized from '@/components/authorized'
import {QueryPageListResForm} from '../services/data'
import { deleteCompanycontact,queryPageList } from '../services/companycontact'
 
const CompanycontactIndex: React.FC<any> = (props) => {

const router = useRouter()
const tabRef = useRef<any>()
const modalRef = useRef<any>()
  const columns = [
 {   title: '序号',width: 60,   align: 'center',   hideInSearch: true,  dataIndex: 'index',   render: (_: any, __: any, index: number) => `${index + 1}`  },{
      title: '客户名称',
      hideInSearch:false,
 dataIndex: 'companyName',
  ellipsis: true,
  align: 'center',
    },
{
      title: '是否关键决策',
      hideInSearch:true,
 dataIndex: 'managerFlag',
  ellipsis: true,
  align: 'center',
    },
{
      title: '姓名',
      hideInSearch:false,
 dataIndex: 'name',
  ellipsis: true,
  align: 'center',
    },
{
      title: '手机号',
      hideInSearch:true,
 dataIndex: 'phone',
  ellipsis: true,
  align: 'center',
    },
{
      title: '职务',
      hideInSearch:true,
 dataIndex: 'post',
  ellipsis: true,
  align: 'center',
    },
{
      title: '备注',
      hideInSearch:true,
 dataIndex: 'remark',
  ellipsis: true,
  align: 'center',
render: (_: React.ReactNode,r:QueryPageListResForm) => { 
const values= (r.remark || '')
if(values &&values.length<18){
return values
}
return (
<div>
<Tooltip title={values}>{values ? subStrFirst(values, 18) : '-'}</Tooltip>
</div>
)
},
    },
{
      title: '性别',
      hideInSearch:true,
 dataIndex: 'sex',
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
 <Authorized authority='/companycontact/update'>
        <Button type="link" onClick={() => {
          router.push({pathname: `/companycontact/update`,query: {id:r.id}})
        }}>
          编辑
        </Button>
 </Authorized> 
 <Authorized authority='/companycontact/delete'>
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
   deleteCompanycontact({id}).then((res:any)=>{
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
toolBarRender={() => [
 <Authorized authority='/companycontact/add'>
        <Button type="primary" onClick={() => {
          router.push({pathname: `/companycontact/add`})
        }}>
          <PlusOutlined/> 新建
        </Button>,
 </Authorized>, 
 <Authorized authority='/companycontact/add'>
        <Button type="primary" onClick={() => {
        }}>
  导出
        </Button>,
 </Authorized>, 
      ]}
/>
</>)
}

export default CompanycontactIndex
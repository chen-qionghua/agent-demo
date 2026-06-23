import request from '@/common/request';
import {AddReqForm,DeleteReqForm,QueryReqForm,QueryContactSelReqForm,QueryPageListReqForm,UpdateReqForm} from './data';
//新增公司（客户）联系人表
export async function add(params:AddReqForm){
  return request(`/crm/companycontact/add`, {
    method: 'POST',
    data: params,
  });
}//删除公司（客户）联系人表
export async function deleteCompanycontact(params:DeleteReqForm){
  return request(`/crm/companycontact/delete`, {
    method: 'POST',
    data: params,
  });
}//查询公司（客户）联系人表
export async function query(params:QueryReqForm){
  return request(`/crm/companycontact/query`, {
    method: 'POST',
    data: params,
  });
}//公司联系人下拉选
export async function queryContactSel(params:QueryContactSelReqForm){
  return request(`/crm/companycontact/queryContactSel`, {
    method: 'POST',
    data: params,
  });
}//查询公司（客户）联系人表列表(带分页)
export async function queryPageList(params: QueryPageListReqForm) {

  const {data} = await request(`/crm/companycontact/queryPageList`, {
    method: 'POST',
    data: params,
  });

  return {
    data: data.dataList,
    total: data.totalCount,
    success: true,
    pageSize:data.pageSize,
    current: parseInt(`${data.pageNum}`, 10) || 0,
  }
}
//修改公司（客户）联系人表
export async function update(params:UpdateReqForm){
  return request(`/crm/companycontact/update`, {
    method: 'POST',
    data: params,
  });
}
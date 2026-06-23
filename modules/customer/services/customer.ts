import request from '@/common/request';
import {AddReqForm,DeleteReqForm,QueryReqForm,QueryByPhoneReqForm,QueryPageInfoListReqForm,QueryPageListReqForm,UpdateReqForm} from './data';
//新增雇主
export async function add(params:AddReqForm){
  return request(`/b/customer/add`, {
    method: 'POST',
    data: params,
  });
}//删除雇主
export async function deleteCustomer(params:DeleteReqForm){
  return request(`/b/customer/delete`, {
    method: 'POST',
    data: params,
  });
}//查询雇主
export async function query(params:QueryReqForm){
  return request(`/b/customer/query`, {
    method: 'POST',
    data: params,
  });
}//查询雇主（根据手机号）
export async function queryByPhone(params:QueryByPhoneReqForm){
  return request(`/b/customer/queryByPhone`, {
    method: 'POST',
    data: params,
  });
}//查询雇主详细信息列表(带分页)
export async function queryPageInfoList(params:QueryPageInfoListReqForm){
  return request(`/b/customer/queryPageInfoList`, {
    method: 'POST',
    data: params,
  });
}//查询雇主列表(带分页)
export async function queryPageList(params: QueryPageListReqForm) {

  const {data} = await request(`/b/customer/queryPageList`, {
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
//修改雇主
export async function update(params:UpdateReqForm){
  return request(`/b/customer/update`, {
    method: 'POST',
    data: params,
  });
}
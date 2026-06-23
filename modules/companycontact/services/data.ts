//新增公司（客户）联系人表--入参
export interface AddReqForm{
companyId?:string//客户（公司）编号
managerFlag?:number//决策人标记，1：是，2：否，默认：0
name?:string//姓名
phone?:string//手机号
post?:string//职务
remark?:string//备注
sex?:number//性别，0：女，1：男，2：保密
}
//新增公司（客户）联系人表--回参
export interface AddResForm{
addTime:string//添加时间
addUserId:string//添加人编号
addUserName:string//添加人姓名
companyId:string//客户（公司）编号
companyName:string//客户（公司）名称
id:number//联系人编号
managerFlag:number//决策人标记，1：是，2：否，默认：0
name:string//姓名
optTime:string//操作时间
optUserId:string//编辑人编号
optUserName:string//编辑人姓名
phone:string//手机号
post:string//职务
remark:string//备注
sex:number//性别，0：女，1：男，2：保密
}
//删除公司（客户）联系人表--入参
export interface DeleteReqForm{
id:number//编号
}
//删除公司（客户）联系人表--回参
export interface DeleteResForm{
data:string//返回数据对象
msg:string//备注原因
rescode:number//状态码: 200 成功, 201 失败, 202 需要登陆
result:string//状态: ok 成功, fail 失败
}
//查询公司（客户）联系人表--入参
export interface QueryReqForm{
id:number//编号
}
//查询公司（客户）联系人表--回参
export interface QueryResForm{
addTime:string//添加时间
addUserId:string//添加人编号
addUserName:string//添加人姓名
companyId:string//客户（公司）编号
companyName:string//客户（公司）名称
id:number//联系人编号
managerFlag:number//决策人标记，1：是，2：否，默认：0
name:string//姓名
optTime:string//操作时间
optUserId:string//编辑人编号
optUserName:string//编辑人姓名
phone:string//手机号
post:string//职务
remark:string//备注
sex:number//性别，0：女，1：男，2：保密
}
//公司联系人下拉选--入参
export interface QueryContactSelReqForm{
companyId?:string//客户id
id?:number//下拉id
name?:string//下拉值
}
//公司联系人下拉选--回参
export interface QueryContactSelResForm{
data:string//返回数据对象
msg:string//备注原因
rescode:number//状态码: 200 成功, 201 失败, 202 需要登陆
result:string//状态: ok 成功, fail 失败
}
//联系人编号列表--入参
export interface IdListReqForm{
}
//排序字段--入参
export interface SortInfosReqForm{
field?:string//undefined
sort?:string//undefined
}
//查询公司（客户）联系人表列表(带分页)--入参
export interface QueryPageListReqForm{
addUserId?:string//添加人编号
addUserName?:string//添加人姓名
companyId?:string//客户（公司）编号
id?:number//联系人编号
idList?:Array<IdListReqForm>//联系人编号列表
managerFlag?:number//决策人标记，1：是，2：否，默认：0
maxAddTime?:string//最大添加时间
minAddTime?:string//最小添加时间
name?:string//姓名
nameLike?:string//姓名（模糊）
optUserId?:string//编辑人编号
optUserName?:string//编辑人姓名
pageNum?:number//分页页码
pageSize?:number//分页每页条数
phone?:string//手机号
post?:string//职务
remark?:string//备注
sex?:number//性别，0：女，1：男，2：保密
sortInfos?:Array<SortInfosReqForm>//排序字段
}
//查询公司（客户）联系人表列表(带分页)--回参
export interface QueryPageListResForm{
addTime:string//添加时间
addUserId:string//添加人编号
addUserName:string//添加人姓名
companyId:string//客户（公司）编号
companyName:string//客户（公司）名称
id:number//联系人编号
managerFlag:number//决策人标记，1：是，2：否，默认：0
name:string//姓名
optTime:string//操作时间
optUserId:string//编辑人编号
optUserName:string//编辑人姓名
phone:string//手机号
post:string//职务
remark:string//备注
sex:number//性别，0：女，1：男，2：保密
}
//修改公司（客户）联系人表--入参
export interface UpdateReqForm{
companyId?:string//客户（公司）编号
id:number//联系人编号
managerFlag?:number//决策人标记，1：是，2：否，默认：0
name?:string//姓名
phone?:string//手机号
post?:string//职务
remark?:string//备注
sex?:number//性别，0：女，1：男，2：保密
}
//修改公司（客户）联系人表--回参
export interface UpdateResForm{
data:string//返回数据对象
msg:string//备注原因
rescode:number//状态码: 200 成功, 201 失败, 202 需要登陆
result:string//状态: ok 成功, fail 失败
}

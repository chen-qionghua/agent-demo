/** 
 *新增雇主--入参
 */ 
export interface AddReqForm{
/**添加的门店编号 */ 
addShopId?:string
/**市 */ 
city?:string
/**公司编号 */ 
companyId?:string
/**区 */ 
district?:string
/**头像地址 */ 
headImgUrl?:string
/**身份证号码 */ 
idcard?:string
/**姓名 */ 
name?:string
/**昵称 */ 
nickname?:string
/**手机号码 */ 
phone?:string
/**省 */ 
province?:string
/**性别：0、未知；1、男；2、女 */ 
sex?:number
/**状态：1、正常；2、禁用 */ 
state?:number
/**状态变更时间 */ 
stateChangeTime?:string
}
/** 
 *雇主商品列表--回参
 */ 
export interface ProductDictionaryListResForm{
/**编号 */ 
id:string
/**是否是月嫂  ture 是   false 否 */ 
isMonthWoman:string
/**名称 */ 
name:string
}
/** 
 *新增雇主--回参
 */ 
export interface AddResForm{
/**添加的门店编号 */ 
addShopId:string
/**添加时间 */ 
addTime:string
/**添加人编号 */ 
addUserId:string
/**添加人姓名 */ 
addUserName:string
/**生日 */ 
birthday:string
/**市 */ 
city:string
/**公司编号 */ 
companyId:string
/**区 */ 
district:string
/**头像地址 */ 
headImgUrl:string
/**用户编号 */ 
id:string
/**身份证号码 */ 
idcard:string
/**姓名 */ 
name:string
/**昵称 */ 
nickname:string
/**手机号码 */ 
phone:string
/**雇主商品列表 */ 
productDictionaryList:Array<ProductDictionaryListResForm>
/**省 */ 
province:string
/**商家备注 */ 
remark:string
/**性别：0、未知；1、男；2、女 */ 
sex:number
/**门店名称 */ 
shopName:string
/**状态：1、正常；2、冻结 */ 
state:number
/**状态变更时间 */ 
stateChangeTime:string
/**微信号 */ 
wechatNo:string
}
/** 
 *删除雇主--入参
 */ 
export interface DeleteReqForm{
/**编号 */ 
id:string
}
/** 
 *删除雇主--回参
 */ 
export interface DeleteResForm{
/**返回数据对象 */ 
data:string
/**备注原因 */ 
msg:string
/**状态码: 200 成功, 201 失败, 202 需要登陆 */ 
rescode:number
/**状态: ok 成功, fail 失败 */ 
result:string
}
/** 
 *查询雇主--入参
 */ 
export interface QueryReqForm{
/**编号 */ 
id:string
}
/** 
 *查询雇主--回参
 */ 
export interface QueryResForm{
/**添加的门店编号 */ 
addShopId:string
/**添加时间 */ 
addTime:string
/**添加人编号 */ 
addUserId:string
/**添加人姓名 */ 
addUserName:string
/**地址 */ 
address:string
/**余额 */ 
balance:number
/**生日 */ 
birthday:string
/**市 */ 
city:string
/**公司编号 */ 
companyId:string
/**累计消费次数 */ 
consumerAllCount:number
/**累计消费总额 */ 
consumerAllMoney:number
/**优惠券数量 */ 
couponNum:number
/**区 */ 
district:string
/**头像地址 */ 
headImgUrl:string
/**用户编号 */ 
id:string
/**身份证号码 */ 
idcard:string
/**最近消费时间 */ 
lastedConsumerTime:string
/**姓名 */ 
name:string
/**昵称 */ 
nickname:string
/**套餐数量 */ 
packageNum:number
/**手机号码 */ 
phone:string
/**雇主商品列表 */ 
productDictionaryList:Array<ProductDictionaryListResForm>
/**省 */ 
province:string
/**商家备注 */ 
remark:string
/**性别：0、未知；1、男；2、女 */ 
sex:number
/**门店名称 */ 
shopName:string
/**状态：1、正常；2、冻结 */ 
state:number
/**状态变更时间 */ 
stateChangeTime:string
/**微信号 */ 
wechatNo:string
}
/** 
 *查询雇主（根据手机号）--入参
 */ 
export interface QueryByPhoneReqForm{
/**手机号码 */ 
phone:string
}
/** 
 *查询雇主（根据手机号）--回参
 */ 
export interface QueryByPhoneResForm{
/**添加的门店编号 */ 
addShopId:string
/**添加时间 */ 
addTime:string
/**添加人编号 */ 
addUserId:string
/**添加人姓名 */ 
addUserName:string
/**生日 */ 
birthday:string
/**市 */ 
city:string
/**公司编号 */ 
companyId:string
/**区 */ 
district:string
/**头像地址 */ 
headImgUrl:string
/**用户编号 */ 
id:string
/**身份证号码 */ 
idcard:string
/**姓名 */ 
name:string
/**昵称 */ 
nickname:string
/**手机号码 */ 
phone:string
/**雇主商品列表 */ 
productDictionaryList:Array<ProductDictionaryListResForm>
/**省 */ 
province:string
/**商家备注 */ 
remark:string
/**性别：0、未知；1、男；2、女 */ 
sex:number
/**门店名称 */ 
shopName:string
/**状态：1、正常；2、冻结 */ 
state:number
/**状态变更时间 */ 
stateChangeTime:string
/**微信号 */ 
wechatNo:string
}
/** 
 *排序字段--入参
 */ 
export interface SortInfosReqForm{
/**排序字段 */ 
field?:string
/**排序方式; 升序: asc;降序: desc */ 
sort?:string
}
/** 
 *查询雇主详细信息列表(带分页)--入参
 */ 
export interface QueryPageInfoListReqForm{
/**添加的门店编号 */ 
addShopId?:string
/**添加人编号 */ 
addUserId?:string
/**添加人姓名 */ 
addUserName?:string
/**市 */ 
city?:string
/**公司编号 */ 
companyId?:string
/**手机姓名昵称（模糊） */ 
customerSearchKey?:string
/**区 */ 
district?:string
/**头像地址 */ 
headImgUrl?:string
/**用户编号 */ 
id?:string
/**用户编号列表 */ 
idList?:string []
/**身份证号码 */ 
idcard?:string
/**最大添加时间 */ 
maxAddTime?:string
/**最小添加时间 */ 
minAddTime?:string
/**姓名 */ 
name?:string
/**姓名（模糊） */ 
nameLike?:string
/**昵称 */ 
nickname?:string
/**分页页码 */ 
pageNum?:number
/**分页每页条数 */ 
pageSize?:number
/**手机号码 */ 
phone?:string
/**省 */ 
province?:string
/**性别：0、未知；1、男；2、女 */ 
sex?:number
/**排序字段 */ 
sortInfos?:Array<SortInfosReqForm>
/**状态：1、正常；2、禁用 */ 
state?:number
}
/** 
 *查询雇主详细信息列表(带分页)--回参
 */ 
export interface QueryPageInfoListResForm{
/**添加的门店编号 */ 
addShopId:string
/**添加时间 */ 
addTime:string
/**添加人编号 */ 
addUserId:string
/**添加人姓名 */ 
addUserName:string
/**地址 */ 
address:string
/**余额 */ 
balance:number
/**生日 */ 
birthday:string
/**市 */ 
city:string
/**公司编号 */ 
companyId:string
/**累计消费次数 */ 
consumerAllCount:number
/**累计消费总额 */ 
consumerAllMoney:number
/**优惠券数量 */ 
couponNum:number
/**区 */ 
district:string
/**头像地址 */ 
headImgUrl:string
/**用户编号 */ 
id:string
/**身份证号码 */ 
idcard:string
/**最近消费时间 */ 
lastedConsumerTime:string
/**姓名 */ 
name:string
/**昵称 */ 
nickname:string
/**套餐数量 */ 
packageNum:number
/**手机号码 */ 
phone:string
/**雇主商品列表 */ 
productDictionaryList:Array<ProductDictionaryListResForm>
/**省 */ 
province:string
/**商家备注 */ 
remark:string
/**性别：0、未知；1、男；2、女 */ 
sex:number
/**门店名称 */ 
shopName:string
/**状态：1、正常；2、冻结 */ 
state:number
/**状态变更时间 */ 
stateChangeTime:string
/**微信号 */ 
wechatNo:string
}
/** 
 *查询雇主列表(带分页)--入参
 */ 
export interface QueryPageListReqForm{
/**添加的门店编号 */ 
addShopId?:string
/**添加人编号 */ 
addUserId?:string
/**添加人姓名 */ 
addUserName?:string
/**市 */ 
city?:string
/**公司编号 */ 
companyId?:string
/**手机姓名昵称（模糊） */ 
customerSearchKey?:string
/**区 */ 
district?:string
/**头像地址 */ 
headImgUrl?:string
/**用户编号 */ 
id?:string
/**用户编号列表 */ 
idList?:string []
/**身份证号码 */ 
idcard?:string
/**最大添加时间 */ 
maxAddTime?:string
/**最小添加时间 */ 
minAddTime?:string
/**姓名 */ 
name?:string
/**姓名（模糊） */ 
nameLike?:string
/**昵称 */ 
nickname?:string
/**分页页码 */ 
pageNum?:number
/**分页每页条数 */ 
pageSize?:number
/**手机号码 */ 
phone?:string
/**省 */ 
province?:string
/**性别：0、未知；1、男；2、女 */ 
sex?:number
/**排序字段 */ 
sortInfos?:Array<SortInfosReqForm>
/**状态：1、正常；2、禁用 */ 
state?:number
}
/** 
 *查询雇主列表(带分页)--回参
 */ 
export interface QueryPageListResForm{
/**添加的门店编号 */ 
addShopId:string
/**添加时间 */ 
addTime:string
/**添加人编号 */ 
addUserId:string
/**添加人姓名 */ 
addUserName:string
/**生日 */ 
birthday:string
/**市 */ 
city:string
/**公司编号 */ 
companyId:string
/**区 */ 
district:string
/**头像地址 */ 
headImgUrl:string
/**用户编号 */ 
id:string
/**身份证号码 */ 
idcard:string
/**姓名 */ 
name:string
/**昵称 */ 
nickname:string
/**手机号码 */ 
phone:string
/**雇主商品列表 */ 
productDictionaryList:Array<ProductDictionaryListResForm>
/**省 */ 
province:string
/**商家备注 */ 
remark:string
/**性别：0、未知；1、男；2、女 */ 
sex:number
/**门店名称 */ 
shopName:string
/**状态：1、正常；2、冻结 */ 
state:number
/**状态变更时间 */ 
stateChangeTime:string
/**微信号 */ 
wechatNo:string
}
/** 
 *修改雇主--入参
 */ 
export interface UpdateReqForm{
/**添加的门店编号 */ 
addShopId?:string
/**市 */ 
city?:string
/**公司编号 */ 
companyId?:string
/**区 */ 
district?:string
/**头像地址 */ 
headImgUrl?:string
/**用户编号 */ 
id:string
/**身份证号码 */ 
idcard?:string
/**姓名 */ 
name?:string
/**昵称 */ 
nickname?:string
/**手机号码 */ 
phone?:string
/**省 */ 
province?:string
/**商家备注 */ 
remark?:string
/**性别：0、未知；1、男；2、女 */ 
sex?:number
/**状态：1、正常；2、禁用 */ 
state?:number
/**状态变更时间 */ 
stateChangeTime?:string
}
/** 
 *修改雇主--回参
 */ 
export interface UpdateResForm{
/**返回数据对象 */ 
data:string
/**备注原因 */ 
msg:string
/**状态码: 200 成功, 201 失败, 202 需要登陆 */ 
rescode:number
/**状态: ok 成功, fail 失败 */ 
result:string
}

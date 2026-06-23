
import { upperFirstChar } from '@/common/utilsNode'
    

export default function getViewJS  (dataList = [], prefix, allPrefix,controllerAdd,controllerDelete,controllerQuery,controllerQueryPageList){
    let s = ''
    s=s+("import request from '@/utils/request';\n");
    s=s+("import {"+getApiNameInface(dataList,allPrefix)+"} from './data';\n");


    
    dataList.forEach((item) => {
        const url = item.url
       const inList = item.reqBodyList;
        const name= item.name

        if (name == controllerQueryPageList) {
            s=s+("//"+ item.remark +"\n");
            s=s+("export async function queryPageList(params: " +upperFirstChar(controllerQueryPageList)  + "ReqForm) {\n" +
                    "\n" +
                    "  const {data} = await request(`" + url + "`, {\n" +
                    "    method: 'POST',\n" +
                    "    data: params,\n" +
                    "  });\n" +
                    "\n" +
                    "  return {\n" +
                    "    data: data.dataList,\n" +
                    "    total: data.totalCount,\n" +
                    "    success: true,\n" +
                    "    pageSize:data.pageSize,\n" +
                    "    current: parseInt(`${data.pageNum}`, 10) || 0,\n" +
                    "  }\n" +
                    "}\n");
        } else {

            let methodName = name;
            if(methodName== controllerDelete){
                methodName='delete'+allPrefix;
            }
            if(methodName== controllerAdd){
                methodName='add';
            }
            if(methodName== controllerQuery){
                methodName='query';
            }
            s=s+("//"+ item.remark +"\n");
            s=s+("export async function " + methodName + "(params:" +( upperFirstChar(name)+'ReqForm)') + "{\n" +
                    "  return request(`" + url + "`, {\n" +
                    "    method: 'POST',\n" +
                    "    data: params,\n" +
                    "  });\n" +
                    "}");
        }

    });

    return s
}

function getApiNameInface(dataList,allPrefix) {
 const res=   dataList&&dataList.map((item)=>{
        if(item.name === 'delete'){
            return upperFirstChar(item.name)+'ReqForm'
        }
        return upperFirstChar(item.name)+'ReqForm'
    })
    return res.toString()
}


import { upperFirstChar } from '@/common/utilsNode'


export default function getViewJS(dataList = [], _, allPrefix) {
let childObj = {}

    let s = ''
    dataList.forEach((item) => {

        const url = item.url
        const reqList = item.reqBodyList;
        const name = item.name
        const resList = item.resBodyList
        let methodName = name;
        if (methodName == "delete") {
            methodName += allPrefix;
        }
        //入参字段
        s = s + (appendFields(reqList, false, s, item.name, item.remark,childObj));
        //回参字段
        s = s + (appendFields(resList, true, s, item.name, item.remark,childObj));
    });
    return s
}



function appendFields(list, isRes = false, html = '', names, remark,childObj) {
    let s = '';
    let ht = ''
    list.forEach((fieldInfo) => {
        const type = fieldInfo.type;

        let required = "?";

        if (fieldInfo.isRequire) {
            required = "";
        }
        if (isRes) {
            required = "";
        }
        if (fieldInfo.arrayList) {
            //判断是否已经生成过字段，true:直接使用,false:生成
            if (childObj[fieldInfo.name]) {
                s = s + ('/**' + fieldInfo.remark+' */ \n')
                s = s + ("" + (fieldInfo.name) + "" + required + ':' + "Array<" + childObj[fieldInfo.name] + ">" + "\n");
            }else{
                if(!fieldInfo.remark){
                }
                childObj[fieldInfo.name] = upperFirstChar(fieldInfo.name) + (isRes ? "Res" : "Req") + "Form"
                ht = ht + appendFields(fieldInfo.arrayList, isRes, html, fieldInfo.name, fieldInfo.remark,childObj)
                s = s + ('/**' + fieldInfo.remark+' */ \n')
                s = s + ("" + (fieldInfo.name) + "" + required + ':' + "Array<" + childObj[fieldInfo.name] + ">" +  "\n");
            }
           
        } else {
            s = s + ('/**' + fieldInfo.remark+' */ \n')
            s = s + ("" + (fieldInfo.name) + "" + required + ':' + type  + "\n");


        }
    });
    ht = ht + ('/** \n *' + remark+ (isRes ? "--回参\n" : "--入参\n")+' */ \n')
    ht = ht + ("export interface " + upperFirstChar(names) + (isRes ? "Res" : "Req") + "Form{\n");

    ht = ht + (s.toString());
    ht = ht + ("}\n");
    return ht
}




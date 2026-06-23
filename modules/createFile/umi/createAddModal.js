
export default function getCreate(dataList = [], prefix, allPrefix, controllerAdd) {
    let s = ''
    const queryObj = dataList.find((methodInfo) => {
        return methodInfo.name == controllerAdd
    })
    const list = queryObj ? queryObj.reqBodyList : []
    s = s + (
        importComponent(list) +
        "import React, {FC, useEffect,useState,useImperativeHandle,useRef} from 'react';\n" +
        "import {GridContent} from '@ant-design/pro-layout';\n" +
        "import {connect, Dispatch, history} from 'umi';\n" +

        "import { formatDate } from '@/utils/utils'; \n" +
        "import moment from 'moment';\n" +
        "import {add, update,query} from '../services/" + prefix + "';\n" +
        "import {AddReqForm} from '../services/data';\n" +
        "import { FormItemLayout } from 'common/constants'\n" +
        "import {  rules as rulesObject} from '@/modules/components/valueTypeList';\n" +
        "const FormItem = Form.Item;\n" +
        "\n" +
        "\n" +
        "const Create" + allPrefix + "Form: FC<any> = (props) => {\n" +
        "const [visible,setVisible]= useState<boolean>(false)\n" +
        "const [id,setId]= useState<any>(null)\n" +
        " const {reload,modalRef}= props\n" +
        " const handleOk = () => {\n" +
        "    form?.submit()\n" +
        " };\n" +
        " const handleCancel = () => {\n" +
        "    form.resetFields()\n" +
        "   setVisible(false)\n" +
        " }; \n" +
        "  const onFinish = (values: AddReqForm  ) => {\n" +
        "const params:AddReqForm = {...values};\n" +
        "if (id) {\n" +
        "update({...params,id}).then((res:any)=>{\n" +

        "   if(res.result === 'ok'){\n" +
        " reload()\n" +
        "handleCancel()\n" +
        " return;\n" +
        " }\n" +
        "})\n" +
        "return \n" +
        "}\n" +
        "add(params).then((res:any)=>{\n" +

        "  if(res.result === 'ok'){\n" +
        " reload()\n" +
        "   handleCancel()\n" +
        "}\n" +
        "})\n" +

        "  };\n" +
        "\n" +
        "  const [form] = Form.useForm();\n" +
        " useImperativeHandle(modalRef,()=>({\n" +
        " add: ()=>{\n" +
        "setVisible(true)\n" +
        " },\n" +
        "  update: (data:any)=>{\n" +
        " for (const key in data) {\n" +
        "  const name = key.replace(key, key.toLowerCase())\n" +
        " if (name.indexOf('time') > -1 || name.indexOf('date') > -1) {\n" +
        "    data[key] = data[key] ? moment(formatDate(data[key], true)) : ''\n" +
        "    }\n" +
        "  }\n" +
        "  setId(data.id)\n" +
        "    form.setFieldsValue(data);\n" +
        "         setVisible(true)"+
        "  }\n" +
        "}))\n" +


        "\n" +
        "  return (\n" +
        " <Modal" +
        " title={id?'编辑':'新增'}" +
        " visible={visible}" +
        " onOk={handleOk}" +
        " width='60%'"+
        "  cancelText='取消'" +
        " maskClosable={false}"+
        " okText='确定'" +
        " onCancel={handleCancel}>" +
        " <Form\n" +
        "      form={form}\n" +
        "      onFinish={onFinish}\n" +
        "      {...FormItemLayout}\n" +
        "  style={{ maxWidth: '600px' }} " +
        "    >\n" +
        "      <GridContent>\n");


    list && list.forEach((item) => {
        let name = item.name
        name = name.replace(name, name.toLowerCase())
        s = s + ("    \n" +
            "           <FormItem\n" +
            "            label='" + item.remark + "'\n" +
            "            name=\"" + item.name + "\"\n" +
            (item.rules && item.rules.length > 0 ? "rules={" + rulesHtml(item.rules, item.remark) + "}" : '') +
            ">\n" +
            formItemType(item.valueType, item.remark) +
            "          </FormItem>" +
            "        \n");
    });
    s = s + (
        "      </GridContent>\n" +
        "    </Form>" +
        "</Modal>" +
        "  );\n" +
        "};\n" +
        "\n" +
        "export default Create" + allPrefix + "Form;\n");

    return s
}

function rulesHtml(rules, remark) {
    let rulesObj = '['
    const formNodeObj = {
        required: `${remark}不能为空`,
        number: `只能为正整数`,
        money: `请输入百万以内的金额`,
        phone: `手机号格式错误`,
        card: `身份证格式错误`,
        email: `邮箱格式错误`,
        bankAccount: `银行卡式错误`,
        chinaZh: `只能输入中文`,
        max12: `不能超过12个字符`,
        max50: `不能超过50个字符`,
        max150: `不能超过150个字符`,
    }
    rules && rules.map((item) => {
        // ruleObj[item]= 
        if (item === 'required') {
            rulesObj = rulesObj + '{required: true,\n' +
                `message:" ${formNodeObj[item]} "\n` +
                '},'
        } else {
            rulesObj = rulesObj +
                `{pattern: rulesObject.${item},\n` +
                `message:" ${formNodeObj[item]}" \n` +
                '},'

        }
    })
    rulesObj = rulesObj + ']'
    return rulesObj
}

//表单内容
const formItemType = (valueType, remark) => {
    if (!valueType) {
        return '<Input placeholder="' + `请输入${remark}` + '" /> \n'
    }
    const formNodeObj = {
        text: '<Input placeholder="' + `请输入${remark}` + '" /> \n',
        date: '<DatePicker placeholder="' + `请选择${remark}` + '" /> \n',
        dateTime: '<DatePicker showTime placeholder="' + `请选择${remark}` + '" /> \n',
        select: '<DataSelect dataSource={[]} placeholder="' + `请选择${remark}` + '" /> \n',
        dateRange: '<RangePicker /> \n',
        dateTimeRange: '<DatePicker showTime /> \n',
        area: '<CascaderAddress /> \n',
        uplodaImage: '<UploadPic /> \n',
        uplodaImageList: '<UploadList /> \n',
        uploadFile: '<UploadfFiles /> \n',
        textArea: '<Input.TextArea rows={3} placeholder="'+`请输入${remark}` +'"/> \n',
    }
    if (formNodeObj[valueType]) {
        return formNodeObj[valueType]
    }
}

// 
function importComponent(list) {
    const obj = {}
    let imHtme = ''
    let antdHtml = ['Button', 'Card', 'Form', 'Modal']
    const formNodeObj = {
        select: "import DataSelect from '@/components/dataSelect/dataSelect';\n",
        area: "import CascaderAddress from '@/components/address/cascaderAddress';\n",
        uplodaImage: 'import UploadPic from "@/components/upload/uploadPic" \n',
        uplodaImageList: 'import UploadList from "@/components/upload/UploadList"  \n',
        uploadFile: 'import UploadfFiles from "@/components/upload/UploadfFiles"  \n',
    }
    list && list.forEach((item) => {
        const valueType = item.valueType
        if (!valueType) {
            antdHtml.push('Input')
        }
        if (obj[valueType]) {
            return
        }

        obj[valueType] = true
        if (valueType === 'text') {
            antdHtml.push('Input')
            return
        }
        if (valueType === 'date' || valueType === 'dateTime' || valueType === 'dateRange') {
            antdHtml.push('DatePicker')
            return
        }
        if (formNodeObj[valueType]) {
            imHtme = imHtme + formNodeObj[valueType]
        }

    })
    let resultarr = [...new Set(antdHtml)];
    imHtme = imHtme + "import {" + resultarr.toString() + "} from 'antd';\n"
    return imHtme

}


export default function getIndexJS(dataList = [], prefix, allPrefix, _, controllerQueryPageList, controlleDelete, addType) {
    let s = ''
    const deleteType = isHaveDelete(dataList, controlleDelete) //判断是否与删除接口，没有则不加载删除内容
    s = s + (
        "import React, {useRef,useState} from 'react';\n" +
        "import { Button, Popconfirm, Tooltip,notification } from 'antd'\n" +
        "import { useRouter } from 'next/router'\n" +
        "import CrmTable from '@/components/crmTable'\n" +
        "import { subStrFirst} from '@/common/utils'\n" +
        "import { PlusOutlined } from '@ant-design/icons'\n" +
        "import Authorized from '@/components/authorized'\n" +
        "import {QueryPageListResForm} from '../services/data'\n")
    if (addType === 2) {
        s = s + "import AddModal from './add'\n"
    }
    if (deleteType) {
        s = s + ("import { delete" + allPrefix + ",queryPageList } from '../services/" + prefix + "'\n " +
            "\n");
    } else {
        s = s + ("import {queryPageList } from '../services/" + prefix + "'\n " +
            "\n");
    }
    s = s + ("const " + allPrefix + "Index: React.FC<any> = (props) => {\n" +
        "\n");
    s = s + "const router = useRouter()\n"
    s = s + "const tabRef = useRef<any>()\n"
    s = s + "const modalRef = useRef<any>()\n"

    dataList.forEach((methodInfo) => {
        const name = methodInfo.name

        if (name == controllerQueryPageList) {
            const fieldInfoList = methodInfo.resBodyList;
            let headerSet = []      //新增or导出
            let batchListSet = [] //批量操作
            if (fieldInfoList) {
                let optionSet = []
                s = s + ("  const columns = [\n");
                if (fieldInfoList[0] && fieldInfoList[0].isHaveIndex) {
                    s = s + (" {" +
                        "   title: '序号'," +
                        "width: 60," +
                        "   align: 'center'," +
                        "   hideInSearch: true," +
                        "  dataIndex: 'index'," +
                        "   render: (_: any, __: any, index: number) => `${index + 1}`" +
                        "  },")
                }
                fieldInfoList.forEach((fieldInfo) => {
                    const nameChild = fieldInfo.name
                    const enName = fieldInfo.name.replace(nameChild, nameChild.toLowerCase())
                    const titleIndex = fieldInfo.remark && fieldInfo.remark.indexOf(': ')
                    const _titleIndex = fieldInfo.remark && fieldInfo.remark.indexOf('：')
                    let strTitle = fieldInfo.remark
                    let strTitleTip = ''
                    if (titleIndex >= 0) {
                        strTitle = titleIndex >= 0 ? fieldInfo.remark.substr(0, titleIndex) : fieldInfo.remark
                        strTitleTip = titleIndex >= 0 ? "//" + fieldInfo.remark.substr(titleIndex, fieldInfo.remark.length - 1) : ''
                    }
                    if (_titleIndex >= 0) {
                        strTitle = _titleIndex >= 0 ? fieldInfo.remark.substr(0, _titleIndex) : fieldInfo.remark
                        strTitleTip = _titleIndex >= 0 ? "//" + fieldInfo.remark.substr(_titleIndex, fieldInfo.remark.length - 1) : ''
                    }
                    s = s + ("{\n" +
                        "      title: '" + strTitle + "'," + strTitleTip + "\n");
                    if (fieldInfo.isSearchs) {
                        s = s + ("      hideInSearch:false,\n");
                    } else {
                        s = s + ("      hideInSearch:true,\n");
                    }
                    if (fieldInfo.valueType) {
                        s = s + ("      valueType:'" + fieldInfo.valueType + "',\n");
                    }



                    s = s + (" dataIndex: '" + nameChild + "',\n");
                    s = s + cloFun(enName, nameChild, strTitle,)
                    s = s + ("    },\n");
                    if (fieldInfo.optionSet) {
                        optionSet = fieldInfo.optionSet
                    }
                    if (fieldInfo.headerSet) {
                        headerSet = fieldInfo.headerSet
                    }
                    if (fieldInfo.batchList) {
                        batchListSet = fieldInfo.batchList
                    }
                });

                if (optionSet && optionSet.length > 0) {
                    s = s + setOptions(optionSet, prefix, allPrefix, deleteType, addType)
                } else {
                    s = s + ("    ];\n");
                }

                if (batchListSet && batchListSet.length > 0) {
                    // 选择框(单选/多选)
                    s = s + ('const [selectedRows, setSelectedRows] = useState<any[]>()\n' +
                        'const [selectedRowKeys, setSelectedRowKeys] = useState<any[]>()\n' +
                        'const rowSelection: any = {\n' +
                        '  type: "checkout",\n' +
                        ' selectedRowKeys,\n' +
                        'onChange: (selectedRowKeys: string[], selectedRows: any[]) => {\n' +
                        'setSelectedRowKeys(selectedRowKeys)\n' +
                        'setSelectedRows(selectedRows)\n' +
                        '}\n}\n')
                }

            }
            s = s + (
                "\n return (\n" +
                "<>" +
                " <CrmTable\n" +
                " tabRef={tabRef}\n" +
                " columns={columns}\n" +
                "tableAlertRender={false}\n" +
                "  queryPageList={queryPageList}\n")
            if (headerSet && headerSet.length > 0) {

                s = s + (toolBarRender(headerSet, prefix, addType))
            } else {
                s = s + "    toolBarRender={false}"
            }
            if (batchListSet.length > 0) {
                s = s + 'headerTitle={\n<>\n'
                s = s + batchListRender(batchListSet)
                s = s + '</>}\n'
                s = s + 'rowSelection={rowSelection}\n'
            }
            s = s + "/>\n"

            if (addType === 2) {
                s = s + "<AddModal modalRef={modalRef}  reload={()=>{tabRef.current&&tabRef.current.reload()}}/> \n"
            }
            s = s +  "</>)\n"
        }
    });

    s = s + ("}\n" +
        "\n" + "export default " + allPrefix + "Index");

    return s;
}


const cloFun = (enName, nameChild, strTitle) => {
    let s = ''


    if (enName.indexOf("phone") > -1) {//手机号码类型参数
    }
    if (enName.indexOf("remark") > -1) {//备注类型参数
        s = s + ("  ellipsis: true,\n");
        s = s + ("  align: 'center',\n");

        s = s + setTooltip(nameChild)
        return s
    }
    if (enName.indexOf("address") > -1) {
        s = s + ("  ellipsis: true,\n");
        s = s + ("  align: 'center',\n");

        s = s + setTooltip(nameChild)
        return s
    }
    if (enName.indexOf("url") > -1) {
        s = s + ("  ellipsis: true,\n");
        s = s + ("  align: 'center',\n");
        s = s + setTooltip(nameChild)
        return s
    }


    s = s + ("  ellipsis: true,\n");
    s = s + ("  align: 'center',\n");

    return s
}

const setTooltip = (nameChild) => {
    let s = ''
    s = s + ("render: (_: React.ReactNode,r:QueryPageListResForm) => { \n")
    s = s + ("const values= (r." + nameChild + " || '')\n")
    s = s + ("if(values &&values.length<18){\n")
    s = s + ("return values\n")
    s = s + ("}\n")
    s = s + ("return (\n")
    s = s + ("<div>\n")
    s = s + ("<Tooltip title={values}>{values ? subStrFirst(values, 18) : '-'}</Tooltip>\n")
    s = s + ("</div>\n")
    s = s + (")\n")
    s = s + ("},\n")

    return s
}

//操作栏
const setOptions = (value = [], prefix, allPrefix, deleteType, addType) => {
    let s = ''
    s = s + ("\n" +
        "    {\n" +
        "      title: '操作',\n" +
        "      dataIndex: 'option', \n" +
        "      valueType: 'option',\n" +
        "      fixed: 'right',\n" +
        "hideInSearch: true,\n" +
        "      align: 'center',\n" +
        "      render: (_: any, r: QueryPageListResForm) => {\n" +
        "const {id}= r\n" +
        "        return <>\n");

    if (value.includes('edit')) {
        s = s + (" <Authorized authority='/" + prefix + "/update'>\n" +
            "        <Button type=\"link\" onClick={() => {\n")
        if (addType === 2) {
            s = s + " const data = JSON.parse(JSON.stringify(r))\n"
            s = s + "modalRef.current&&modalRef.current.update(data)\n"
        } else {
            s = s + "          router.push({pathname: `/" + prefix + "/update`,query: {id:r.id}})\n"
        }
        s = s + ("        }}>\n" +
            "          编辑\n" +
            "        </Button>\n" +
            " </Authorized> \n");
    }
    if (value.includes('delete')) {
        s = s + (" <Authorized authority='/" + prefix + "/delete'>\n" +
            "        <Popconfirm \n" +
            "        title='确定删除吗？'\n" +
            "         okText='确认'\n" +
            "        cancelText='取消'\n" +
            "         onConfirm={() => delele_(id)} \n" +
            "        > " +
            "  <Button type='link' size='small'> \n" +
            "  删除 \n" +
            "   </Button> \n" +
            "   </Popconfirm> \n" +
            " </Authorized> \n");
    }

    if (value.includes('detail')) {
        s = s + (" <Authorized authority='/" + prefix + "/update'>\n" +
            "        <Button type=\"link\" onClick={() => {\n" +
            "          router.push({pathname: `/" + prefix + "/detail`,query: {id:r.id}})\n" +
            "        }}>\n" +
            "          详情\n" +
            "        </Button>\n" +
            " </Authorized> \n");
    }
    s = s + ("        </>\n" +
        "      }\n" +
        "    }\n");
    s = s + ("    ];\n");

    s = s + (
        "const delele_= (id:any)=>{\n")
    if (deleteType) {
        s = s + ("   delete" + allPrefix + "({id}).then((res:any)=>{\n" +
            "      if(res.result === 'ok'){\n" +
            "        notification.success({\n" +
            "          message: `提示`,\n" +
            "        description: '删除成功',\n" +
            "       })\n" +
            "       reload()\n" +
            "     }\n" +
            "   })\n"
        )

    }
    s = s + '}'

    s = s + ("//表格刷新\n" +
        "const reload=()=>{\n" +
        " tabRef.current.tableReload()\n" +
        " }\n")


    return s
}

//是否有删除接口
const isHaveDelete = (dataList, controlleDelete) => {
    let type = false
    dataList.forEach((methodInfo) => {
        const name = methodInfo.name

        if (name == controlleDelete) {

            type = true
        }
    })
    return type
}

const toolBarRender = (headerSet, prefix, addType) => {
    let s = "toolBarRender={() => [\n"


    if (headerSet.includes('add')) {
        s = s + (" <Authorized authority='/" + prefix + "/add'>\n" +
            "        <Button type=\"primary\" onClick={() => {\n")
        if (addType === 2) {
            s = s + "modalRef.current&&modalRef.current.add()\n"
        } else {
            s = s + "          router.push({pathname: `/" + prefix + "/add`})\n"
        }
        s = s + ("        }}>\n" +
            "          <PlusOutlined/> 新建\n" +
            "        </Button>,\n" +
            " </Authorized>, \n")
    }

    if (headerSet.includes('export')) {
        s = s + (" <Authorized authority='/" + prefix + "/add'>\n" +
            "        <Button type=\"primary\" onClick={() => {\n" +

            "        }}>\n" +
            "  导出\n" +
            "        </Button>,\n" +
            " </Authorized>, \n")
    }

    s = s + "      ]}\n"
    return s
}

const batchListRender = (batchListSet) => {
    let s = ''
    batchListSet && batchListSet.map((item) => {
        if (item === 'delete') {
            s = s + '<Button type="primary" onClick={() => { }}>\n' +
                '批量删除\n' +
                ' </Button>\n'
        }
        if (item === 'up') {
            s = s + ' <Button type="primary" style={{marginLeft:10}} onClick={() => { }}>\n' +
                ' 批量上架\n' +
                '</Button>\n'
        }
        if (item === 'down') {
            s = s + ' <Button type="primary" style={{marginLeft:10}} onClick={() => { }}>\n' +
                ' 批量下架\n' +
                '</Button>\n'
        }
    })
    return s
}
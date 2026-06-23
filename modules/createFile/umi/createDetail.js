export default function getDeatil(dataList = [], prefix, allPrefix, query) {
    let s = ''
    const queryObj = dataList.find((methodInfo) => {
        return methodInfo.name == query
    })
    const list = queryObj ? queryObj.resBodyList : []
    s = s + ("import {Card, Descriptions, Divider} from 'antd';\n" +
        "import React,{useEffect,useState} from 'react';\n" +
        "\n" +
        "import {PageHeaderWrapper} from '@ant-design/pro-layout';\n" +
        "import { setData } from '@/utils/utils';\n" +
        "import {query} from '../services/" + prefix + "';\n" +
        "import {connect, Dispatch, history} from 'umi';\n" +
        "\n" +
        "interface DetailProps {\n" +
        "}\n" + 
        "\n" +
        "\n" +
        "const Detail: React.FC<DetailProps> = (props) => {\n" +
        "  const { location, dispatch } = props;\n" +
        " const id = location.query.id\n" +
        "\n" +
        "\n");

    let str = ''
    list.forEach((item) => {
        if (item.name != 'id') {
            str = str + (item.name + ",");
        }
    });

    s = s +
        " const [" + prefix + "Info,set" + allPrefix + "Info]= useState<any>({});\n" +
        "  useEffect(() => {\n" +
        "    if(id){\n" +
        " query({ id }).then((res: any) => {\n" +
        "  if (res.result === 'ok') {\n" +
        "     const { data } = res\n" +
        "     set" + allPrefix + "Info(data)\n" +
        " }\n" +
        " })\n" +
        "    }\n" +
        "  }, [id])\n" +
        "\n"

    s = s + ("  const {" + str + "} = " + prefix + "Info;\n");

    s = s + ("  return (\n" +
        "    <PageHeaderWrapper title={<></>}>\n" +
        "      <Card bordered={false}>\n" +
        "        <Descriptions title=\"\" style={{marginBottom: 32}}>\n");

    list.forEach((item) => {
        s = s + ("          <Descriptions.Item label=\"" + item.remark + "\">{setData(" + item.name +','+(item.valueType?("'"+item.valueType+"'"):"''") +")}</Descriptions.Item>\n");
    });
    s = s + ("        </Descriptions>\n" +
        "\n" +
        "      </Card>\n" +
        "    </PageHeaderWrapper>\n" +
        "  );\n" +
        "\n" +
        "}\n" +
        "\n" +
        "export default Detail");

    return s
}


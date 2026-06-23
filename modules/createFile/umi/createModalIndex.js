export default function getModalIndex(list = [], prefix, allPrefix) => {
        let s = ''
        s = s + ("import {Effect, Reducer} from 'umi';\n");
        let m = '';
        list.forEach((methodInfo) => {
                let methodName = methodInfo.name
                if (methodName == "delete") {
                        methodName += allPrefix;
                }
                m = m + (methodName + ",\n");
        });

        s = s + ("import {" + m + "" + allPrefix + "Info} from '@/services/" + prefix + "';\n");


        s = s + ("import {message} from 'antd';\n");


        s = s + ("export interface StateType {\n" +
                "  " + prefix + "Modal?: boolean,\n" +
                "  item?: " + allPrefix + "Info\n" +
                "}\n");

        s = s + ("export interface " + allPrefix + "ModelType {\n" +
                "  namespace: string;\n" +
                "  state: StateType;\n" +
                "  effects: {\n");
        list.forEach((methodInfo) => {
                let methodName = methodInfo.name
                if (methodName == "delete") {
                        methodName += allPrefix;
                }
                s = s + (methodName + ":Effect,\n");
        });
        s = s + ("  };\n");
        s = s + ("reducers: {\n" +
                "    stateChange: Reducer<StateType>,\n" +
                "    showModal: Reducer<any>,\n" +
                "    hideModal: Reducer<any>\n" +
                "  }");

        s = s + ("  };\n");

        s = s + ("\n" +
                "const Model: " + allPrefix + "ModelType = {\n" +
                "  namespace: '" + prefix + "',\n" +
                "\n" +
                "  state: {\n" +
                "  " + prefix + "Modal: false,\n" +
                "    item: undefined\n" +
                "  },\n" +
                "\n" +
                "  effects: {\n");
        list.forEach((methodInfo) => {

                let methodName = methodInfo.name
                if (methodName == "delete") {
                        methodName += allPrefix;
                }
                s = s + ("    * " + methodName + "({payload}, {call, put}) {\n" +
                        "      const {result} = yield call(" + methodName + ", payload);\n" +
                        "      if (result === 'ok') {\n" +
                        "        message.success(\"操作成功\")\n" +
                        "        return true;\n" +
                        "      }\n" +
                        "\n" +
                        "      return false\n" +
                        "\n" +
                        "    },\n");

        });

        s = s + ("  },\n" +
                "\n" +
                "  reducers: {\n" +
                "    showModal(state, {payload}) {\n" +
                "      const {modal, item} = payload;\n" +
                "      return {\n" +
                "        ...state,\n" +
                "        item,\n" +
                "        [modal]: true,\n" +
                "      };\n" +
                "    },\n" +
                "\n" +
                "    hideModal(state, {payload}) {\n" +
                "      const {modal} = payload;\n" +
                "      return {\n" +
                "        ...state,\n" +
                "        item: {},\n" +
                "        [modal]: false,\n" +
                "      };\n" +
                "    },\n" +
                "\n" +
                "    stateChange(state, {payload}) {\n" +
                "      return {\n" +
                "        ...state,\n" +
                "        ...payload\n" +
                "      }\n" +
                "    }\n" +
                "  }\n" +
                "};");

        s = s + ("export default Model;\n");

        return s;
}

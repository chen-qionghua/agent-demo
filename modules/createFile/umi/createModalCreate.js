export default function getModalCreate(list = [], prefix, allPrefix) {
        return "import {Effect, Reducer,history} from 'umi';\n" +
                "import {add, update,query," + allPrefix + "Info} from '@/services/" + prefix + "';\n" +
                "import {Subscription} from \"@@/plugin-dva/connect\";\n" +
                "import {message} from \"antd\";\n" +
                "\n" +
                "export interface StateType {\n" +
                "  " + prefix + "Info?: " + allPrefix + "Info\n" +
                "}\n" +
                "\n" +
                "\n" +
                "export interface " + allPrefix + "ModelType {\n" +
                "  namespace: string;\n" +
                "  state: StateType;\n" +
                "  effects: {\n" +
                "    add: Effect;\n" +
                "    query: Effect,\n" +
                "    update: Effect\n" +
                "  };\n" +
                "  reducers: {\n" +
                "    stateChange: Reducer<StateType>\n" +
                "  };\n" +
                "  subscriptions: {\n" +
                "    setup: Subscription;\n" +
                "  }\n" +
                "}\n" +
                "\n" +
                "\n" +
                "const Model: " + allPrefix + "ModelType = {\n" +
                "  namespace: '" + prefix + "Create',\n" +
                "\n" +
                "  state: {\n" +
                "    " + prefix + "Info: undefined,\n" +
                "  },\n" +
                "\n" +
                "  effects: {\n" +
                "    * add({payload}, {call, put}) {\n" +
                "\n" +
                "      const {result} = yield call(add, payload)\n" +
                "      if (result === 'ok') {\n" +
                "        message.success(\"创建成功\")\n" +
                "        history.goBack()\n" +
                "        return;\n" +
                "      }else{\n" +
                "        return;\n" +
                "      }\n" +
                "    },\n" +
                "    * query({payload}, {call, put}) {\n" +
                "      const {result, data} = yield call(query, payload)\n" +
                "      if (result !== 'ok') {\n" +
                "        return;\n" +
                "      }\n" +
                "       return data \n" +
                "    },\n" +
                "    * update({payload}, {call, put}) {\n" +
                "\n" +
                "      const {result} = yield call(update, payload)\n" +
                "      if (result !== 'ok') {\n" +
                "        return;\n" +
                "      }\n" +
                "      message.success(\"修改成功\");\n" +
                "      history.goBack();\n" +
                "    }\n" +
                "  },\n" +
                "\n" +
                "  reducers: {\n" +
                "\n" +
                "    stateChange(state, {payload}) {\n" +
                "      return {\n" +
                "        ...state,\n" +
                "        ...payload\n" +
                "      }\n" +
                "    }\n" +
                "  },\n" +
                "  subscriptions: {\n" +
                "    setup({dispatch, history}) {\n" +

                "    }\n" +
                "  }\n" +
                "};\n" +
                "\n" +
                "export default Model;";
}

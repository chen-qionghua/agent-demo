export default function getModalDetail(list = [], prefix, allPrefix) => {
    let s = ''


    s = s + ("import {Effect, Reducer,history} from 'umi';\n" +
        "import {query," + allPrefix + "Info} from '@/services/" + prefix + "';\n" +
        "import {Subscription} from \"@@/plugin-dva/connect\";\n" +
        "import {message} from \"antd\";\n" +
        "\n" +
        "export interface StateType {\n" +
        "  " + prefix + "Info?: " + allPrefix + "Info\n" +
        "}\n" +
        "\n" +
        "\n" +
        "export interface Query" + allPrefix + "ModelType {\n" +
        "  namespace: string;\n" +
        "  state: StateType;\n" +
        "  effects: {\n" +
        "    query: Effect,\n" +
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
        "const Model: Query" + allPrefix + "ModelType = {\n" +
        "  namespace: '" + prefix + "Detail',\n" +
        "\n" +
        "  state: {\n" +
        "    " + prefix + "Info: undefined,\n" +
        "  },\n" +
        "\n" +
        "  effects: {\n" +
        "    * query({payload}, {call, put}) {\n" +
        "      const {result, data} = yield call(query, payload)\n" +
        "      if (result !== 'ok') {\n" +
        "        return;\n" +
        "      }\n" +
        "    return data" +
        "    },\n" +
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
        "export default Model;\n");

    return s

}

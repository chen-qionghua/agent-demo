export default function getIndexJS(dataList = [],fileName,operateColumn=[],addType) {
  
  const checkoutList=  dataList.filter((item)=>item.isCheckout)

  const headerSetItem = dataList.find((item)=>item.headerSet && item.headerSet.length)

  const headerSetList = headerSetItem?headerSetItem.headerSet: []

  const listSearch = dataList.filter((item)=>item.isSearchs)

  const generateOption = () =>{
    const list = []
    listSearch.forEach(item => {
        if(item.selectType == 'select'){
          list.push(`const ${item.dataIndex}Option = ref([]);`)
        }
    })
    return list.join('\n      ');
  }
  
  const generateDicOption = () => {
    const list = [];
    const listName = [];
    listSearch.forEach(item => {
      if(item.selectType == 'select' && item.dic) {
        list.push(item.dic);
        listName.push(`${item.dataIndex}Option`);
      }
    });
    
    if(list.length > 0) {
      return `// 获取字典
      const getDicData = async () => {
        try {
           const res = await dic([${list.map(item => `'${item}'`).join(', ')}]);
          if (res.code == SUCCESS_CODE) {
             ${listName.map((name,index) => `${name}.value = res.data[${index}].data;`).join('\n          ')}
          }
        } catch (error) {}
      };`;
    }
    return '';
  };


  const generateHeaderFun = () =>{
    const list = []
    headerSetList.forEach(item => {
        if(item == 'add'){
          list.push(`const handleAdd = () => {
            ${addType==1 &&headerSetList.includes('add')? "dialogComRef?.value?.show()":''}
            }`)
        }else if(item == 'export'){
          list.push(`const handleExport = () => {
  dowloadTaskExportExcel({
    data: formatParams(),
    url: 'XXXXXX/export',
  })
}`)
        }
    })
    return list.join('\n      ');
  }

  const generateFormItems = (data) => {

    return data.map(item => {
      let component = '';
      const commonProps = `v-model="searchParams.${item.dataIndex}"`;
      

      switch (item.selectType) {
        case 'date':
        case 'dateTime':
          component = `<el-date-picker ${commonProps} clearable
            type="${item.selectType=='dateTime'?'datetime':'date'}" class="cwgf-header-select" value-format="YYYY-MM-DD${item.selectType === 'dateTime' ? ' HH:mm:ss' : ''}"
            placeholder="${item.title}" />`;
          break;

          case 'dateRange':
              component = `<el-date-picker ${commonProps} 
                type="daterange" class="cwgf-header-daterange" value-format="YYYY-MM-DD"
                unlink-panels clearable range-separator="至" start-placeholder="开始日期" end-placeholder="截止日期" />`;
              break;
          
              case 'dateTimeRange':
                component = `<el-date-picker ${commonProps} 
                  type="datetimerange" class="cwgf-header-daterange"  value-format="YYYY-MM-DD HH:mm:ss"
                  unlink-panels clearable range-separator="至" start-placeholder="开始时间" end-placeholder="截止时间" />`;
                break;

                case 'select':
                  component = `  <el-select placeholder="${item.title}" ${commonProps} filterable class="cwgf-header-select" clearable >
                     <el-option v-for="item in ${item.dataIndex}Option" :key="item.id" :label="item.name" :value="item.id"></el-option>
                     </el-select>
                  `;
                  break;
                  case 'area':
                    component = `<AreaCascader ${commonProps} class="cwgf-header-select" :level="2" placeholder="选择省市区" /> `;
                    break;
                    case 'fuzzySelect':
                      component = `   <FuzzySelect ${commonProps} type="code"  class="cwgf-header-select" placeholder="${item.title}"></FuzzySelect> `;
                      break;
        default:
          component = `<el-input  class="cwgf-header-input"  ${commonProps} placeholder="${item.title}"
            :maxlength="50" clearable />`;
      }
      
      return ` ${component}`;
    }).join('\n      ');
  };

  const generateColumns = (data) => {
    return data
      .map((item) => {
        return `{
  prop: '${item.dataIndex}',
  label: '${item.title}',
  minWidth: '140'}`;
      })
      .join(',\n  ');
  };

  const generateOperateColumn = (data) => {
    return data
      .map((item) => {
        return ` {
    label: '${item.title}',
    method: row => {
    },
    isShow: (auth, row) => {
      return auth('code')
    }
  }`;
      })
      .join(',\n  ');
  };

  const generateHeader = (data) => {
    return data.map(item => {
      let component = '';
      switch (item) {
        case 'add':
          component = `<cwgf-button @click="handleAdd" v-if="$auth('CODE:ADD')">新增</cwgf-button>`;
          break;
        case 'export':
          component = `<cwgf-button v-if="$auth('CODE:EXPORT')" @click="handleExport">导出</cwgf-button>`;
          break;
        case 'import':
        component = `<ImportFile v-if="$auth('CODE:IMPORT')" action="acceptTask/upload" :data="{}" @success="getTableData" style="margin-left: 10px">导入</ImportFile>`;
        break;
      }
      return ` ${component}`;
    }).join('\n      ');
  };

  
  return `
<template>
  <div class="cwgf-container">
   <PageHeader>
     ${generateHeader(headerSetList)}
    </PageHeader>
       <PageContent>
    <TableSearch @search="handleClear">
    ${generateFormItems(listSearch)}
    </TableSearch>

    <el-table style="width: 100%" border height="100%" :data="tableData" ref="cwgfTableRef">
      <el-table-column v-for="column in columns" :key="column.prop || column.type" :prop="column.prop" :label="column.label" :min-width="column.minWidth" :fixed="column.fixed" :type="column.type" >
        <template #header="{ column: headerColumn }">
          <component v-if="column.renderHeader" :is="column.renderHeader(headerColumn)" />
          <span v-else>{{ column.label }}</span>
        </template>

        <template #default="{ row, $index }">
          <template v-if="column.render">
            <component :is="column.render(row)" />
          </template>
          <template v-else-if="column.type === 'index'">
            {{ $index + 1 }}
          </template>
          <template v-else>
            {{ row[column.prop] === 0 ? 0 : [null, undefined, ''].includes(row[column.prop]) ? '-' : row[column.prop] }}
          </template>
        </template>
      </el-table-column>
      <template v-if="operateColumn && operateColumn.length > 0">
        <TableColumn>
          <template #default="{ row }">
            <template v-for="(item, index) in operateColumn" :key="index">
              <cwgf-button v-if="item.isShow ? item.isShow($auth, row) : true" link @click="item.method(row)">{{ item.label }}</cwgf-button>
            </template>
          </template>
        </TableColumn>
      </template>
    </el-table>
    <cwgf-pagination v-show="listQuery.total > 0" :total="listQuery.total" v-model:page="listQuery.page" v-model:limit="listQuery.limit" @pagination="getTableData" />
      </PageContent>
      ${addType==1 &&headerSetList.includes('add')? "<DialogCom ref='dialogComRef' @reloadTable='getTableData'  />":''}
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, h,onActivated,nextTick } from 'vue'
import { dic, pageListApi } from '@/api'
import { removeNullUndefined ${headerSetList.includes('export')?', dowloadTaskExportExcel':''} } from '@/utils/index.js'
import { usePagination } from '@/hooks'
import { SUCCESS_CODE } from '@/projectSetting'
${addType==1 &&headerSetList.includes('add')? "import DialogCom from './components/dialogCom.vue'":''}

defineOptions({ name: '${fileName}' })
const initialState = {
  ${listSearch.map(item => `${item.dataIndex}: null `).join(',\n  ')}
}

const cwgfTableRef = ref(null)
const searchParams = reactive({ ...initialState })

const listQuery = usePagination()
let tableData = ref([])
${addType==1 &&headerSetList.includes('add')? "const dialogComRef = ref(null)":''}
${generateOption()}



const columns = [
  ${generateColumns(checkoutList)}
]

const operateColumn = [
${generateOperateColumn(operateColumn)}
]

${generateDicOption()}

onMounted(() => {})

  onActivated(() => {
    getTableData();
    nextTick(() => {
      cwgfTable.value.doLayout();
    });
  });

const handleClear = () => {
  listQuery.page = 1
  getTableData()
}

const formatParams = () => {
  const {  ...params } = searchParams
  return removeNullUndefined({
    ...params
  })
}

const getTableData = async () => {
  try {
    let sendData = {
      ...formatParams(),
      pageSize: listQuery.limit,
      pageNum: listQuery.page
    }

    let res = await pageListApi(sendData)
    if (res.code == SUCCESS_CODE) {
      tableData.value = res.data?.data ?? []
      listQuery.total = res.data?.rows ?? 0
    }
  } catch (error) {
    tableData.value = []
    listQuery.total = 0
  }
}

${generateHeaderFun()}

defineExpose({ getTableData })
</script>

<style lang="scss" scoped></style>
  `;
}
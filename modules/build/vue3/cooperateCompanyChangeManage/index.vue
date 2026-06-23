
<template>
  <div class="cwgf-container">
   <PageHeader>
      <ImportFile v-if="$auth('CODE:IMPORT')" action="acceptTask/upload" :data="{}" @success="getTableData" style="margin-left: 10px">导入</ImportFile>
    </PageHeader>
       <PageContent>
    <TableSearch @search="handleClear">
     <el-input  class="cwgf-header-input"  v-model="searchParams.code" placeholder="批次号"
            :maxlength="50" clearable />
         <el-select placeholder="切换前资方" v-model="searchParams.cooperateCompanyTypeBefore" filterable class="cwgf-header-select" clearable >
                     <el-option v-for="item in cooperateCompanyTypeBeforeOption" :key="item.id" :label="item.name" :value="item.id"></el-option>
                     </el-select>
                  
         <el-select placeholder="切换后资方" v-model="searchParams.cooperateCompanyTypeAfter" filterable class="cwgf-header-select" clearable >
                     <el-option v-for="item in cooperateCompanyTypeAfterOption" :key="item.id" :label="item.name" :value="item.id"></el-option>
                     </el-select>
                  
         <el-select placeholder="变更节点 变更节点 1签约总部审核通过前,2签约总部审核通过后｜施工总部审核通过前,3施工总部审核通过后｜并网总部审核通过前,4并网总部审核通过后" v-model="searchParams.point" filterable class="cwgf-header-select" clearable >
                     <el-option v-for="item in pointOption" :key="item.id" :label="item.name" :value="item.id"></el-option>
                     </el-select>
                  
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
      
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, h } from 'vue'
import { dic, pageListApi } from '@/api'
import { removeNullUndefined  } from '@/utils/index.js'
import { usePagination } from '@/hooks'
import { SUCCESS_CODE } from '@/projectSetting'


defineOptions({ name: 'cooperateCompanyChangeManage' })
const initialState = {
  code: null ,
  cooperateCompanyTypeBefore: null ,
  cooperateCompanyTypeAfter: null ,
  point: null 
}

const cwgfTableRef = ref(null)
const searchParams = reactive({ ...initialState })

const listQuery = usePagination()
let tableData = ref([])

const cooperateCompanyTypeBeforeOption = ref([]);
      const cooperateCompanyTypeAfterOption = ref([]);
      const pointOption = ref([]);



const columns = [
  {
  prop: 'code',
  label: '批次号',
  minWidth: '140'},
  {
  prop: 'cooperateCompanyTypeBeforeName',
  label: '切换前资方',
  minWidth: '140'},
  {
  prop: 'cooperateCompanyTypeAfterName',
  label: '切换后资方',
  minWidth: '140'},
  {
  prop: 'pointName',
  label: '变更节点',
  minWidth: '140'},
  {
  prop: 'num',
  label: '订单数量',
  minWidth: '140'},
  {
  prop: 'createPeopleName',
  label: '操作人',
  minWidth: '140'},
  {
  prop: 'modifyTime',
  label: '操作时间',
  minWidth: '140'}
]

const operateColumn = [
 {
    label: '修改',
    method: row => {
    },
    isShow: (auth, row) => {
      return auth('code')
    }
  }
]

// 获取字典
      const getDicData = async () => {
        try {
           const res = await dic(['dic_point']);
          if (res.code == SUCCESS_CODE) {
             pointOption.value = res.data[0].data;
          }
        } catch (error) {}
      };

onMounted(() => {})

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



defineExpose({ getTableData })
</script>

<style lang="scss" scoped></style>
  

<template>
  <div class="cwgf-container">
   <PageHeader>
     
    </PageHeader>
       <PageContent>
    <TableSearch @search="handleClear">
    
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


defineOptions({ name: 'invoiceItems' })
const initialState = {
  
}

const cwgfTableRef = ref(null)
const searchParams = reactive({ ...initialState })

const listQuery = usePagination()
let tableData = ref([])





const columns = [
  {
  prop: 'id',
  label: '列表id',
  minWidth: '140'},
  {
  prop: 'relationCompanyId',
  label: '关联公司(basic.company_config)',
  minWidth: '140'},
  {
  prop: 'relationCompanyName',
  label: '关联公司NAME',
  minWidth: '140'},
  {
  prop: 'taxNum',
  label: '企业税号',
  minWidth: '140'},
  {
  prop: 'orgCode',
  label: '组织编码',
  minWidth: '140'},
  {
  prop: 'invoiceName',
  label: '开票名称',
  minWidth: '140'},
  {
  prop: 'mateGroupCode',
  label: '物料组编码',
  minWidth: '140'},
  {
  prop: 'mateGroupName',
  label: '物料组名称',
  minWidth: '140'},
  {
  prop: 'materialName',
  label: '物料名称',
  minWidth: '140'},
  {
  prop: 'customerName',
  label: '客户名称',
  minWidth: '140'},
  {
  prop: 'taxCode',
  label: '税收编码',
  minWidth: '140'},
  {
  prop: 'taxName',
  label: '税收简称',
  minWidth: '140'},
  {
  prop: 'taxRate',
  label: '税率',
  minWidth: '140'},
  {
  prop: 'isTax',
  label: '含税价标志(1.含税  2.不含税)',
  minWidth: '140'},
  {
  prop: 'isTaxName',
  label: '含税价标志name',
  minWidth: '140'},
  {
  prop: 'model',
  label: '规格型号',
  minWidth: '140'},
  {
  prop: 'unit',
  label: '单位',
  minWidth: '140'},
  {
  prop: 'status',
  label: '数据状态 1.启用,2.禁用',
  minWidth: '140'},
  {
  prop: 'statusName',
  label: '数据状态name',
  minWidth: '140'},
  {
  prop: 'createTime',
  label: '创建时间',
  minWidth: '140'}
]

const operateColumn = [

]



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
  

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
import { ref, reactive, onMounted, h,onActivated,nextTick } from 'vue'
import { dic, pageListApi } from '@/api'
import { removeNullUndefined  } from '@/utils/index.js'
import { usePagination } from '@/hooks'
import { SUCCESS_CODE } from '@/projectSetting'


defineOptions({ name: 'fileName' })
const initialState = {
  
}

const cwgfTableRef = ref(null)
const searchParams = reactive({ ...initialState })

const listQuery = usePagination()
let tableData = ref([])





const columns = [
  {
  prop: 'prop0',
  label: '111',
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
  },
   {
    label: '删除',
    method: row => {
    },
    isShow: (auth, row) => {
      return auth('code')
    }
  }
]



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



defineExpose({ getTableData })
</script>

<style lang="scss" scoped></style>
  
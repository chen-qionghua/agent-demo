export default function createDetailIndex(dataList = []) {
  const generateColumns = (data) => {
    return data
      .map((item) => {
        return `{
  value: '${item.value}',
  label: '${item.label}'}`;
      })
      .join(',\n  ');
  };

  
  return `
<template>
    <cwgf-details> 
    <div class="cwgf-detail-section">
      <el-descriptions title="基础信息" border>
        <template v-for="item in detailList" :key="item.value">
          <el-descriptions-item :label="item.label">
            {{ dataInfo[item.value] === 0 ? 0 : [null, undefined, ''].includes(dataInfo[item.value]) ? '-' : dataInfo[item.value] }}
          </el-descriptions-item>
        </template>
      </el-descriptions>
    </div>
    </cwgf-details>
</template>

<script setup>
import { ref,  onMounted} from 'vue'
import { useRoute} from 'vue-router'

// 基础信息数据
const dataInfo = ref({})

onMounted(() => {
})

const detailList = [
${generateColumns(dataList)}
]

</script>

<style lang="scss" scoped></style>
  `;
}
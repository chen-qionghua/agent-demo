
<template>
  <el-dialog title="操作" v-model="dialogVisible" width="550" @close="handleClose">
    <el-form ref="elFormRef" :model="formData" :rules="rules" label-width="120">
      
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible=false">取消</el-button>
        <cwgf-button type="primary" @click="submit">确定</cwgf-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { addApi,dic } from '@/api'
import { SUCCESS_CODE } from '@/projectSetting';

const emits = defineEmits(['reloadTable'])
const elFormRef = ref(null)
const dialogVisible = ref(false)
const initialFormData= {
  
}
const formData = reactive({...initialFormData})



const rules = reactive({})



const handleClose = () => {
  dialogVisible.value = false
  Object.assign(formData, {...initialFormData})
  elFormRef.value?.resetFields()
}

const submit = () => {
  elFormRef.value.validate(valid => {
    if (valid) {
    addApi({
      ...formData,
    }).then(res => {
      if (res.code == SUCCESS_CODE) {
         emits('reloadTable')
      ElMessage.success('操作成功')
      dialogVisible.value = false
      }
    })
    }
  })
}

const show = () => {
  dialogVisible.value = true
}

defineExpose({ show })
</script>

<style scoped lang="scss">
/* 自定义样式 */
</style>
  
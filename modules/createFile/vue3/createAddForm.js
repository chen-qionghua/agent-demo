export default function createDetailIndex(dataList = []) {
  const generateFormItems = () => {
    return dataList.map(item => {
      let component = '';
      const commonProps = `v-model="formData.${item.value}"`;
      

      switch (item.typeUi) {
        case 'uploadFile':
          component = `<UploadFile ${commonProps} :limit="5" />`;
            break;
        
        case 'textArea':
          component = `<el-input type="textarea" ${commonProps}
          :style="{ width: '100%' }" :maxlength="200"
          :autosize="{ minRows: 3 }" show-word-limit clearable />`;
            break;

        case 'date':
        case 'dateTime':
          component = `<el-date-picker ${commonProps} clearable
            type="${item.typeUi=='dateTime'?'datetime':'date'}" :style="{ width: '100%' }" value-format="YYYY-MM-DD${item.typeUi === 'dateTime' ? ' HH:mm:ss' : ''}"
            placeholder="请选择${item.label}" />`;
          break;

          case 'dateRange':
              component = `<el-date-picker ${commonProps} 
                type="daterange" :style="{ width: '100%' }" value-format="YYYY-MM-DD"
                unlink-panels clearable range-separator="至" start-placeholder="开始日期" end-placeholder="截止日期" />`;
              break;
          
              case 'dateTimeRange':
                component = `<el-date-picker ${commonProps} 
                  type="datetimerange" :style="{ width: '100%' }" value-format="YYYY-MM-DD HH:mm:ss"
                  unlink-panels clearable range-separator="至" start-placeholder="开始时间" end-placeholder="截止时间" />`;
                break;

                case 'select':
                  component = `  <el-select placeholder="请选择" ${commonProps} filterable :style="{ width: '100%' }"  clearable >
                     <el-option v-for="item in ${item.value}Option" :key="item.id" :label="item.name" :value="item.id"></el-option>
                     </el-select>
                  `;
                  break;
                  case 'area':
                    component = `<AreaCascader ${commonProps} :level="2" placeholder="选择省市区" /> `;
                    break;
                     case 'fuzzySelect':
                      component = `<FuzzySelect ${commonProps} type="code" :style="{ width: '100%' }" placeholder="请选择"></FuzzySelect> `;
                      break;
        case 'number':
        case 'integer':
          component = `<el-input-number :style="{ width: '100%' }" ${commonProps} :controls="false"
            :min="0" :max="99999" placeholder="请输入" />`;
          break;
        default:
          component = `<el-input :style="{ width: '100%' }" ${commonProps} placeholder="请输入"
            :maxlength="50" clearable />`;
      }
      
      return `<el-form-item prop="${item.value}"  label="${item.label}">
        ${component}
      </el-form-item>`;
    }).join('\n      ');
  };

  const generateRules = () => {
    const rules = {};
    dataList.forEach(item => {
      if (item.required) {
      const trigger =    ['file', 'date', 'datetime','select'].includes(item.typeUi)? 'change' : 'blur';
      console.log(trigger,item.typeUi)
        rules[item.value] = [{
          required: true,
          message: `请${trigger == 'change' ? '选择' : '输入'}${item.label}`,
          trigger: trigger
        }];
      }
    });
    return JSON.stringify(rules, null, 4);
  };

  const generateOption = () =>{
    const list = []
      dataList.forEach(item => {
        if(item.typeUi == 'select'){
          list.push(`const ${item.value}Option = ref([]);`)
        }
    })
    return list.join('\n      ');
  }


  const generateDicOption = () => {
    const list = [];
    const listName = [];
    dataList.forEach(item => {
      if(item.selectType == 'select' && item.dic) {
        list.push(item.dic);
        listName.push(`${item.value}Option`);
      }
    });
    
    if(list.length > 0) {
      return `// 获取字典
      const getDicData = async () => {
        try {
            const res = await dic([${list.map(item => `'${item}'`).join(', ')}]);
          if (res.code == SUCCESS_CODE) {
             ${listName.map((item,index) => `${item}.value = res.data[${index}].data;`).join('\n          ')}
          }
        } catch (error) {}
      };`;
    }
    return '';
  };

  return `
<template>
  
 <cwgf-details>
    <div class="cwgf-detail-section">

    <el-form ref="elFormRef" :model="formData" :rules="rules" label-width="120">
      ${generateFormItems()}
    </el-form>
    </div>
    <!-- 吸底 -->
    <div class="bottom-fixed flex-end">
      <el-button type="primary" @click="submit">提交</el-button>
    </div>
    
  </cwgf-details>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import {useRouter } from 'vue-router'
import { addApi,dic } from '@/api'


const elFormRef = ref(null)
const router = useRouter()
const initialFormData= {
  ${dataList.map(item => `${item.value}: null `).join(',\n  ')}
}
const formData = reactive({...initialFormData})

${generateOption()}

const rules = reactive(${generateRules()})

${generateDicOption}

const submit = () => {
  elFormRef.value.validate(valid => {
    if (valid) {
    addApi({
      ...formData,
    }).then(res => {
      if (res.code == SUCCESS_CODE) {
      ElMessage.success('操作成功')
          router.go(-1)
      }
    })
    }
  })
}


</script>

<style scoped lang="scss">
/* 自定义样式 */
.bottom-fixed {
  position: sticky;
  bottom: 0px;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: flex-end;
  background-color: #fff;
  padding: 10px 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  z-index: 9;
}
.flex-end {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
</style>
  `;
}
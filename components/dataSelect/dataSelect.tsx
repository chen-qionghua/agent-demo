import React, { useEffect, useState } from 'react';
import { Select } from 'antd';

const { Option } = Select;

 const DataSelect: React.FC<any> = (props) => {

  const {
    onChange = (val: object, e: any) => { },
    dValue,
    placeholder = '请选择',
    labelKey = 'name',
    valueKey = 'id',
    dataSource,
    action = '',
    multiple = false,
    value,
    SelectParams,
    labelRender,
    selectProps = {},
    disabled = false,
    style = {},
    defaultValue,
    isDefVal = false,
    reload,
    cusSetAll,
    cusListEventThrow,
    orderOptionKey,
    allowClear=true
  } = props;

  const [dataList, setDataList] = useState<any>([]);
  const [curParams, setCurParams] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false);
  const [selectData, setSelectData] = useState<any>();

  const [dataObj, setDataObj] = useState<any>({});
  const [defVlaue, setDefValue] = useState<any>(defaultValue);
  // 初始化
  useEffect(() => {
    if (action) {
      // 1. 我们过滤下 有参数的 重复请求
      if (curParams && SelectParams && JSON.stringify(SelectParams) == JSON.stringify(curParams)) {
        return;
      }
      // 2. 增加loading 过滤重复的请求
      if (loading) {
        return;
      }
      const payload:any = {};
      // console.log('SelectParams', SelectParams);

      if (SelectParams) {
        for (const key in SelectParams) {
          payload[key] = SelectParams[key];
        }
      }
      // 每次请求的时候，若存在数据主动清除
      if (selectData) {
        setSelectData('');
        onChange(undefined, {}, {});
      }
      setLoading(true);
    
    }
  }, [action, SelectParams]);

  // 初始化
  useEffect(() => {
    if (dataSource) {
      setDataList(dataSource);
    }
  }, [dataSource]);

  useEffect(() => {
    // 有数据我们抛出事件
    if (cusListEventThrow) {
      cusListEventThrow(dataList);
    }
  }, [dataList]);

  useEffect(() => {
    setSelectData(dValue);
  }, [dValue]);

  useEffect(() => {
    setSelectData(value);
  }, [value]);

  useEffect(() => {
    // 全选
    if (cusSetAll === '1') {
      const selects: any = dataList.map((r: any) => r.id);
      setSelectData(selects);
      onChange(selects, {}, {});
    }
    // 取消
    if (cusSetAll === '2') {
      setSelectData(undefined);
      onChange(undefined, {}, {});
    }
  }, [cusSetAll]);

  return (
    <Select
      allowClear={allowClear}
      showSearch
      loading={loading}
      mode={multiple ? 'multiple' : undefined}
      style={{ maxWidth: 400, ...style }}
      placeholder={placeholder}
      value={selectData}
      optionFilterProp="children"
      disabled={disabled}
      maxTagCount={8}
      defaultValue={defVlaue}
      onChange={(val: any, e: any) => {
        // console.log('selectData', val);
        setSelectData(val);
        onChange(val, e, dataObj[val]);
      }}
      filterOption={(input: any, option: any) => {
        return option.children && option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
      }}
      {...selectProps}
    >
      {dataList &&
        dataList.map((item: any,index:number) => (
          <Option
            key={index}
            disabled={item.disabled ? true : false}
            value={item[orderOptionKey || valueKey]}
          >
            {labelRender ? labelRender(item) : item[labelKey]}
          </Option>
        ))}
    </Select>
  );
}
export default DataSelect

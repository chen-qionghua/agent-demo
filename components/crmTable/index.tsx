import React, { useRef,useState,useImperativeHandle } from 'react';
import ProTable from '@ant-design/pro-table';
import { getTableY, pageSort } from '@/common/utils';
import {formatTreeTable} from '@/common/utils'

const TableX=(props: any) =>{
  const { columns,tabRef,queryPageList,queryParams={},rowSelection,isTreeTable=false,rowKey='id',search=true } = props;


  const [y, setY] = useState(getTableY(columns,true,true));

  useImperativeHandle(tabRef, () => ({
    // 暴露给父组件的方法
    tableReload: () => {
      ref.current && ref.current.reload();
    }
  }));
  const ref: any = useRef<any>();
 
  return <>
    <ProTable
      scroll={{ x: 'max-content', y: y }}
      actionRef={ref}
      rowKey={rowKey}
      rowSelection={rowSelection}
      search={search?{
        span: 6,
        defaultCollapsed: true,
        onCollapse: (clp: boolean) => {
          setY(getTableY(columns, clp,true));
        },
      }:false}
      defaultSize='small'
      onLoad={() => {
        setY(getTableY(columns,true,true))
      }}
      request={async (params, sorter, filter) => {
        pageSort(params, sorter);
        const {reqUrl}=props
        params['pageNum'] = params.current ? params.current - 1 : 0;
        for (const key in queryParams) {
            params[key] = queryParams[key]
      }

      if(params.city){
        [params['provinceId'], params['cityId'], params['districtId']] = params['city'];
        delete params.city
      }

      if(params.addTimes){
        params.maxAddTime= new Date(params.addTimes[1]).getTime()
        params.minAddTime= new Date(params.addTimes[0]).getTime()
        delete params.addTimes
      }

        const {data,total,pageSize,current} = await queryPageList(params)
        let treeList= []
        if(isTreeTable){
          treeList=  formatTreeTable(data)
        }
       
        return {
          data:isTreeTable?treeList: data,
          total: total,
          success: true,
          pageSize: pageSize,
          current: current,
        }
      }}
      {...props}
    />
  </>
}

export default TableX

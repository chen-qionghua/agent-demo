import React, { useRef, useState, useImperativeHandle, useEffect } from 'react';
import { Cascader } from 'antd';
import { DetailAddressCity } from '@/common/chinaCity';

interface CreateFormProps {
    multiple?: boolean;
    onChange?: (value: Array<any>) => void;
    value?: number[];
    cRef?:any
}

const CascaderAddress = (props: CreateFormProps) => {
    const { multiple = false, onChange = () => undefined, value = [],cRef } = props;


    const [lableList, setLableList] = useState<any>([])

    useImperativeHandle(cRef,()=>({
        getName:()=>{
            return lableList
        },
        setName:(val:Array<string>)=>{
            setLableList(val)
        }
    }))

    const changes = (value: any, opt: any) => {
        onChange(value)
        const lab = opt && opt.map((item: any) => {
            return item.label
        })
        setLableList(lab)
    }


    return <Cascader options={DetailAddressCity} multiple={multiple} onChange={changes} value={value} placeholder="请选择" />
}

export default CascaderAddress

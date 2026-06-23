import React, { Component } from 'react';
import { Upload, Button } from 'antd';
import {  PlusOutlined } from '@ant-design/icons';
import { isEmpty } from 'lodash';


export default class UploadList extends Component {
  state = {
    fileList: null
  }

  static defaultProps = {
    onChange: null,
    disabled: false,
    buttonText: "上传",
    width: 144,
    height: 144
  }

  updateList = () => {
    const { value, param } = this.props
    const fileList = value || []
    // const name = param && param.name || '附件'
    const imgs = []
    if (fileList && !isEmpty(fileList)) {
      fileList.map((item, index) => {
        imgs.push({
          url: item,
          name: item,
          status: 'done',
          uid: -1 - index
        })
      })
      this.setState({ fileList: imgs })
      return imgs
    }
  }

  handleUploadResult = file => {
    const fileList = this.state.fileList || []
    fileList.push(file)
    this.setState({ fileList });
  };

  render () {
    const { param, onChange, accept } = this.props
    const quantity = param && param.quantity || 1
    const fileList = this.state.fileList || this.updateList() || []
    const uploadProps = {
      accept:accept || '',
      className: "avatar-uploader",
      showUploadList: param && param.showUploadList === false ? param.showUploadList : true,
      fileList,
      onRemove: (file) => {
        if (file) {
          const { fileList } = this.state
          let delIndex
          fileList.find((item, index) => {
            if (file.uid === item.uid) {
              delIndex = index
              return true
            }
          })
          fileList.splice(delIndex, 1)
          const imgs = []
          fileList.forEach(item => {
            imgs.push(item.url)
          });
          this.setState({ fileList })
          onChange && onChange(imgs)
        }
      },
      customRequest: info => {
        if (!info.file) {
          return
        }
        const formData = new FormData();
        formData.append('code', info.file);

        // uploadFile(formData).then((res)=>{
        //   const {data,result}= res
        //   if (result === 'ok') {
        //     const file = {
        //       uid: info.file.uid,
        //       name: data,//info.file.name,
        //       status: 'done',
        //       url: `${data}`,
        //     };
        //     this.handleUploadResult(file);
        //     let imgs = this.props.value ? JSON.parse(JSON.stringify(this.props.value)) : []
        //     imgs.push(data)
        //     onChange && onChange(imgs)
        //   }
        // })
      },
    };

    const uploadButton = (
      <Button icon={<PlusOutlined />}>上传附件</Button>
    );

 
    return <div>
      <Upload {...uploadProps}>
        {fileList.length >= quantity ? null : uploadButton}
      </Upload>
    </div>
  }
}


// import './index.less'
import React, {Component} from 'react';
import {Upload} from 'antd';
import {LoadingOutlined, PlusOutlined} from '@ant-design/icons';
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
    const { value } = this.props
    const fileList = value || []
    const imgs = []
    if (!isEmpty(fileList)) {
      fileList.map((item, index) => {
        imgs.push({
          url: item,
          name: 'image.png',
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
    const { param, onChange ,pla} = this.props
    const quantity = param.quantity || 1
    const fileList = this.state.fileList || this.updateList() || []

    const uploadProps = {
      accept: 'image/*',
      listType: "picture-card",
      className: "avatar-uploader",
      // showUploadList: false,
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

        // upload(formData).then((res)=>{
        //   const {data,result}= res
        //   if(result !== 'ok'){
        //     return
        //   }
        //   const file = {
        //     uid: info.file.uid,
        //     name: info.file.name,
        //     status: 'done',
        //     url: `${data}`,
        //   };
        //   this.handleUploadResult(file);
        //   let imgs = this.props.value ? JSON.parse(JSON.stringify(this.props.value)) : []
        //   imgs.push(data)
        //   onChange && onChange(imgs)
        // })
      },
    };

    const uploadButton = (
      <div style={{ color: '#999' }}>
        {this.state.loading ? <LoadingOutlined /> : <PlusOutlined />}
        <div className="ant-upload-text">上传</div>
      </div>
    );

  
    return <div>
      <Upload {...uploadProps}>
        {fileList.length >= quantity ? null : uploadButton}
      </Upload>
      {
        pla ?<div style={{color: '#aaa'}}>{pla}</div>:''
      }
    </div>
  }
}

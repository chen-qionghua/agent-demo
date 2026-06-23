import React, {Component} from 'react';
import {Upload} from 'antd';
import {LoadingOutlined, PlusOutlined} from '@ant-design/icons';


export default class UploadPic extends Component {

  constructor(props) {
    super(props)
    this.state = {
      fileList: null,
    }
  }

  static defaultProps = {
    onChange: null,
    disabled: false,
    buttonText: "上传",
    width: 144,
    height: 144
  }

  render() {
    const {disabled, onChange, value,pla} = this.props;
    let initialFileList = [
      {
        name: 'image.png',
        uid: -1,
        status: 'done',
        url: value
      }
    ]
    let fileList = this.state.fileList || initialFileList || []
    const handleUploadResult = file => {
      fileList = [file];
      this.setState({fileList});
    };
    const uploadProps = {
      disabled,
      accept: 'image/*',
      listType: "picture-card",
      className: "avatar-uploader",
      showUploadList: false,
      fileList: fileList,
      onRemove: () => {
        if (!disabled) {
          fileList = [];
          this.setState({fileList});
        }
      },
      customRequest: info => {
        if (!info.file) {
          return
        }

        const formData = new FormData();
        formData.append('code', info.file);


       
      },
    };

    let url = '';
    if (fileList && fileList.length > 0) {
      url = fileList[0].url
    } else if (value) {
      url = value
    }

    const uploadButton = (
      <div style={{ color: '#999' }}>
        {this.state.loading ? <LoadingOutlined/> : <PlusOutlined/>}
        <div className="ant-upload-text">上传</div>
      </div>
    );

    return <div>
      <Upload {...uploadProps}>
        {url ? <img src={url} alt="avatar" style={{width: '100%', maxHeight: '100%'}}/> : uploadButton}
      </Upload>
      {
        pla ?<div style={{color: '#aaa'}}>{pla}</div>:''
      }
      
    </div>
  }
}

import React, { PropTypes } from 'react'
import { Form, Input, InputNumber, Radio, Modal,Select,Checkbox  } from 'antd'
const CheckboxGroup = Checkbox.Group;

const FormItem = Form.Item;
const Option = Select.Option;
const info = {
  empty:'不能为空'
}
function once(rule, value, callback){
  console.log(rule, value, callback,90990)
}
const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
}

const modal = ({
  appState,
  visible,
  title,
  item = {},
  roseList,
  onOk,
  onCancel,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
  },
}) => {

  function handleOk () {
  
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue(),
        key: item.key,
      }
      if(data.qpwd == data.npwd){
 onOk(data)
      }else{

alert("两次密码不一致")
     
      }
    })
  }
  const state = [
    {value:1,text:22},
    {value:13,text:232},

  ]
  const modalOpts = {
    title,
    visible,
    onOk: handleOk,
    onCancel,
    wrapClassName: 'vertical-center-modal',
  }
  
  return (
    <Modal {...modalOpts}>
      <Form layout="horizontal">
        <FormItem style={{'display':'none'}} hasFeedback {...formItemLayout}>
          {getFieldDecorator('pkid', {
            initialValue: appState.pkid,
          
          })(<Input placeholder="" />)}
        </FormItem>
        <FormItem label="旧密码" hasFeedback {...formItemLayout}>
          {getFieldDecorator('opwd', {
            initialValue: appState.opwd,
            rules: [
              {
                required: true,
                message: info.empty,
              },
            ],
          })(<Input type="password" placeholder="" />)}
        </FormItem>
        <FormItem label="新密码" hasFeedback {...formItemLayout}>
          {getFieldDecorator('npwd', {
            initialValue: appState.npwd,
            rules: [
              {
                required: true,
                message: info.empty,
              },
            ],
          })(<Input type="password" placeholder="" />)}
        </FormItem>
        <FormItem label="重复密码" hasFeedback {...formItemLayout}>
          {getFieldDecorator('qpwd', {
            initialValue: appState.qpwd,
            rules: [
              {
               
                required: true,
                message: info.empty,
              },
            ],
          })(
            <Input type="password" placeholder="" />
          )}
        </FormItem>
       
     
       
      </Form>
    </Modal>
  )
}

export default Form.create()(modal)

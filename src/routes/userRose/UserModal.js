import React, { PropTypes } from 'react'
import { Form, Input, InputNumber, Radio, Modal,Select,Checkbox  } from 'antd'
const CheckboxGroup = Checkbox.Group;

const FormItem = Form.Item;
const Option = Select.Option;
const info = {
  empty:'不能为空'
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
      onOk(data)
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
  const SelectProps = {

     placeholder:"请选择",
     children:roseList.map(item=><Option key={item.pkid} value={item.pkid}>{item.roleName}</Option>)
    
  }
  return (
    <Modal {...modalOpts}>
      <Form layout="horizontal">
        <FormItem style={{'display':'none'}} label="登录账号" hasFeedback {...formItemLayout}>
          {getFieldDecorator('pkid', {
            initialValue: item.pkid,
          
          })(<Input placeholder="" />)}
        </FormItem>
        <FormItem label="登录账号" hasFeedback {...formItemLayout}>
          {getFieldDecorator('userCode', {
            initialValue: item.userCode,
            rules: [
              {
                required: true,
                message: info.empty,
              },
            ],
          })(<Input placeholder="" />)}
        </FormItem>
        <FormItem label="用户名称" hasFeedback {...formItemLayout}>
          {getFieldDecorator('userName', {
            initialValue: item.userName,
            rules: [
              {
                required: true,
                message: info.empty,
              },
            ],
          })(<Input placeholder="" />)}
        </FormItem>
       
        <FormItem label="角色选择" hasFeedback {...formItemLayout}>
          {getFieldDecorator('rolePkid', {
            initialValue: item.rolePkid,
            rules: [
              {
                required: true,
                message: info.empty,
              },
            ],
          })(<Select  {...SelectProps}>{SelectProps.children}</Select>)}
        </FormItem>
        <FormItem label="启用禁用" hasFeedback {...formItemLayout}>
          {getFieldDecorator('flagStatus', {
            initialValue: item.flagStatus,
            rules: [
              {
                required: true,
                message: info.empty,
              },
            ],
          })( <Radio.Group >
                <Radio value={1}>启用</Radio>
                <Radio value={0}>禁用</Radio>
            </Radio.Group>)}
        </FormItem>
       
      </Form>
    </Modal>
  )
}

export default Form.create()(modal)

import React, { PropTypes } from 'react'
import { Form, Input, InputNumber, Radio, Modal } from 'antd'
const FormItem = Form.Item
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
            initialValue: item.pkid,
            
          })(<Input placeholder="" />)}
        </FormItem>
        <FormItem label="角色编号" hasFeedback {...formItemLayout}>
          {getFieldDecorator('roleCode', {
            initialValue: item.roleCode,
            rules: [
              {
                required: true,
                message: info.empty,
              },
            ],
          })(<Input placeholder="" />)}
        </FormItem>
        <FormItem label="角色名称" hasFeedback {...formItemLayout}>
          {getFieldDecorator('roleName', {
            initialValue: item.roleName,
            rules: [
              {
                required: true,
                message: info.empty,
              },
            ],
          })(<Input placeholder="" />)}
        </FormItem>
        <FormItem label="详细信息" hasFeedback {...formItemLayout}>
          {getFieldDecorator('remark', {
            initialValue: item.remark,
            rules: [
              {
                required: true,
                message: info.empty,
              },
            ],
          })(
            <Input type="textarea" placeholder="" />
          )}
        </FormItem>
      
     
      </Form>
    </Modal>
  )
}

modal.propTypes = {
  form: PropTypes.object.isRequired,
  visible: PropTypes.bool,
  type: PropTypes.string,
  item: PropTypes.object,
  onCancel: PropTypes.func,
  onOk: PropTypes.func,
}

export default Form.create()(modal)

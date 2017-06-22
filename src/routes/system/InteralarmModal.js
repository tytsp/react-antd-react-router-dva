import React, { PropTypes } from 'react'
import { Form, Input, InputNumber, Radio, Modal,Select } from 'antd'
const FormItem = Form.Item
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
  selectlist,
  onOk,
  onCancel,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
  },
}) => {
  selectlist.unshift({alarmposCode:'',alarmposName:'无'})
  function handleOk () {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue(),
        key: item.key,
      }
      let {lowerlimitAlarmValue, toplimitAlarmValue} = data;
      lowerlimitAlarmValue = lowerlimitAlarmValue == void 0 ? 0 :lowerlimitAlarmValue;
      toplimitAlarmValue = toplimitAlarmValue == void 0 ? 0 :toplimitAlarmValue;
      
      if( lowerlimitAlarmValue > toplimitAlarmValue ){
        alert('上线值不能小于下线值')
        return
      }else{
        onOk(data)

      }
    
    })
  }

  const modalOpts = {
    title,
    visible,
    onOk: handleOk,
    onCancel,
    wrapClassName: 'vertical-center-modal',
  }
 
 const SelectProps = {

     placeholder:"请选择",
     children:selectlist.map(item=><Option key={item.alarmposCode} value={item.alarmposCode}>{item.alarmposName}</Option>)
     
  }
  return (
    <Modal {...modalOpts}>
      <Form layout="horizontal">
       <FormItem style={{'display':'none'}} hasFeedback {...formItemLayout}>
          {getFieldDecorator('pkid', {
            initialValue: item.pkid,
           
          })(<Input placeholder="" />)}
        </FormItem>
        <FormItem label="报警描述" hasFeedback {...formItemLayout}>
          {getFieldDecorator('alarmDescription', {
            initialValue: item.alarmDescription,
            rules: [
              {
                required: true,
                message: info.empty,
              },
            ],
          })(<Input placeholder="" />)}
        </FormItem>
       <FormItem label="关联部位" hasFeedback {...formItemLayout}>
          {getFieldDecorator('alarmposCode', {
            initialValue: item.alarmposCode,
            rules: [
              
            ],
          })(<Select  {...SelectProps}>{SelectProps.children}</Select>)}
        </FormItem>
        <FormItem label="报警部位" hasFeedback {...formItemLayout}>
          {getFieldDecorator('flagAlarmposRelation', {
            initialValue: item.flagAlarmposRelation,
            rules: [
              {
                required: true,
                message: info.empty,
              },
            ],
          })( <Radio.Group >
                <Radio value={1}>关联</Radio>
                <Radio value={0}>不关联</Radio>
            </Radio.Group>)}
        </FormItem>
         <FormItem label="报警设置" hasFeedback {...formItemLayout}>
          {getFieldDecorator('flagEnableAlarmposRelation', {
            initialValue: item.flagEnableAlarmposRelation,
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

modal.propTypes = {
  form: PropTypes.object.isRequired,
  visible: PropTypes.bool,
  type: PropTypes.string,
  item: PropTypes.object,
  onCancel: PropTypes.func,
  onOk: PropTypes.func,
}

export default Form.create()(modal)

import React from 'react';
import { Modal, Button , Row , Col , Input , Radio , Checkbox ,Form } from 'antd';
const FormItem = Form.Item;


const CheckboxGroup = Checkbox.Group;
const formItemLayout = {
   style:{
    margin:0
   },
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
}
const options = [
  { label: '用户管理', value: '用户管理'},
  { label: '角色定义', value: '角色定义' },
  { label: '工厂及设备查看', value: '工厂及设备查看' },
  { label: '单体设备参数查看', value: '单体设备参数查看' },
  { label: '群体图参数定义', value: '群体图参数定义' },
  { label: '预设报警设置', value: '预设报警设置' },
  { label: '内部报警设置', value: '内部报警设置' },
  { label: '报表查询', value: '报表查询' },
];

const Rolepermission  = ({
  ...single,
  state,
  onOk,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
  }
}) => {
   function handleOk () {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue(),
      }
      onOk(data)
    })
  }
  const modalOpts = {
    ...single,
    onOk: handleOk,
   
  }
console.log(state.curSource)
    return (
     
        <Modal {...modalOpts }
        >
        
        <Form>
         
            {getFieldDecorator('menus', {
              initialValue: Array.isArray(state.curSource.menus) ? state.curSource.menus : [],
              
            })(<CheckboxGroup  onChange={single.onChange} options={single.options}   />)}
        
          
        </Form>
  


        </Modal>

    );
  
}
export default Form.create({})(Rolepermission)
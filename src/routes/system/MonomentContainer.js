import React, { PropTypes } from 'react'
import { connect } from 'dva';
import { Table ,Pagination , Button, Menu, Icon , Input, Cascader,Form } from 'antd';
import { routerRedux } from 'dva/router';
import styles from './Users.css';
const FormItem = Form.Item


const monomer = {
        marrright15:{
          marginRight:15,
          paddingTop:5,
        },
        width555:{
          width:555,
          display:'inline-block',
        },
        diblock:{
          display:'inline-block',
        }
      
}



/* table数据源header*/

  const dataSource = [{
    title: '序号',
    dataIndex: 'index',
    key: '序号',
    render: text => <a href="#">{text}</a>,
  },{
    title: '参数类别代码',
    dataIndex: 'typeCode',
    key: '参数类别代码',
  }, {
    title: '参数类别',
    dataIndex: 'typeName',
    key: '参数类别',
  }, {
    title: '参数名称',
    dataIndex: 'parameterName',
    key: '参数名称',
  },
  {
    title: '参数单位',
    dataIndex: 'parameterUnit',
    key: '参数单位',
  }];



const selectTree = ({
    ...state,
    onSubmit,
   form: {
      getFieldDecorator,
      validateFields,
      getFieldsValue,
      validateFieldsAndScroll
    }
  
}) =>{
  const handleSubmit =(e) =>{
  
     e.preventDefault();
     validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  }
  return (<Form onSubmit={handleSubmit}  style={monomer.diblock}>
              <FormItem style={monomer.width300}>
                {getFieldDecorator('residence', {
                    initialValue: [],
                    rules: [{ type: 'array', required: true, message: '你不是要验证么 置空干什么' }],
                  })(
                    <Cascader   options={state.list} />
                  )}
               
              </FormItem>
               <FormItem style={monomer.diblock}>
                  <Button type="primary" htmlType="submit" size="large">查询</Button>
               </FormItem>
            </Form>)
}
const BBB = Form.create()(selectTree)
const Monoment = ({ 
    ...single
   }) => {
  /*传参 state*/
  const { ...state } = single.monoment;

const onChange = (a,b) =>{

  single.dispatch({
    type:'monoment/queryList',
    payload:{
      data:b[b.length-1].deviceParameterList
    }
  })
}

  return (
    <div className={styles.normal}>

      <div className="box">
        <div className="title">单体设备参数查看</div>
          <div className="box-primary">
          <div className="box-header">
            <lable style={monomer.marrright15}>设备选择:</lable> 
            
             <Cascader placeholder={"请选择"} onChange={onChange} style={monomer.width555}  options={state.list} />  
          </div>
          <Table rowKey={record => record.pkid} classname="usertable"  columns={dataSource} dataSource={state.data} />
        </div>
      </div>
    </div>
   
  );
}
/*monoment 为model*/
export default connect(({ monoment, loading }) => ({ monoment, loading: loading.models.users }))(Monoment)

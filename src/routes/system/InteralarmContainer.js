import React, { PropTypes } from 'react'
import { connect } from 'dva';
import { Table ,Pagination , Cascader,Button, Menu, Icon , Input , Select , Dropdown , Modal , Checkbox ,Form   } from 'antd';
import { routerRedux } from 'dva/router';
import styles from './Users.css';
import InteralarmModal from './InteralarmModal';
import { DropOption } from '../../components'
const FormItem = Form.Item


const monomer = {
        marrright15:{
          marginRight:15
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
const dataSource = (handleMenuClick) =>{

  const columns = [{
    title: '序号',
    dataIndex: 'index',
    key: '序号',
    render: text => <a href="#">{text}</a>,
  },{
    title: '参数名称',
    dataIndex: 'parameterName',
    key: '参数名称',
    render: text => <a href="#">{text}</a>,
  }, {
    title: '报警描述',
    dataIndex: 'alarmDescription',
    key: '报警描述',
  }, {
    title: '关联报警部位',
    dataIndex: 'alarmposCode1',
    key: '关联报警部位',
    render:(value)=> !value ? '无' : value
  }, {
    title: '报警部位',
    dataIndex: 'flagAlarmposRelation',
    key: '报警部位',
    render:(value)=> value==0 ? '未关联' : '关联'
  }, {
    title: '报警设置',
    dataIndex: 'flagEnableAlarmposRelation',
    key: '报警设置',
    render:(value)=> value==0 ? '禁用' : '启用'
  }, {
    title: '操作',
    key: '操作',
    render: (text, record) => (
     <DropOption onMenuClick={e => handleMenuClick(record, e)} menuOptions={[{ key: '1', name: '修改信息' }]} />
    )
  }];
  return columns
}



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
  return (<Form onSubmit={handleSubmit}>
              <FormItem >
                {getFieldDecorator('residence', {
                    initialValue: [],
                    rules: [{ type: 'array', required: true, message: '请选择' }],
                  })(
                    <Cascader options={state.list} />
                  )}
               
              </FormItem>
            </Form>)
}
const BBB = Form.create()(selectTree)
const Interalarm = ({ 
    ...single
   }) => {
	/*传参 state*/
  const { ...state } = single.interalarm;


  const onChange = (item,b) =>{
    single.dispatch({
        type: 'interalarm/query',
        payload: {
           factoryId:item[0] , workshopId:item[1] , lineId:(item[2]+'').split('#')[0] , sublineId:(item[2]+'').split('#')[1] , deviceId:item[3],
        },
    })
  }


 
  /*操作菜单下拉*/
  const handleMenuClick = (row,b) =>{
      /*1编辑和2删除*/
      if(b.key == 1){
        single.dispatch({
          type: 'interalarm/showModal',
          payload: {
            modalType: 'update',
            currentItem: row,
          },
        })
      }else if(b.key ==2 ){
          if(confirm('您确定要删除这条记录吗?')){

          }else{

          }
          
      }else{

      }
  }

  /*模态框属性*/
  const InteralarmModalProps = {
    item: state.modalType == 'create' ? {} : state.currentItem,
    visible:state.modalVisible,
    selectlist:state.selectlist,
    title: `${state.modalType === 'create' ? '新建用户' : '修改信息'}`,
    onCancel(){
      single.dispatch({
          type: 'interalarm/hideModal',
      })
    },
    onOk(item){
       single.dispatch({
          type: 'interalarm/update',
          payload:{
            dispatch:single.dispatch,
            'bizDeviceAlarmBindList':[{
            ...state.currentItem,
            ...item, 

          }]},
        })
      
    }
   

  }

  const InteralarmModalGeng = () => <InteralarmModal {...InteralarmModalProps} />


  return (
    <div className={styles.normal}>

      <div className="box">
        <div className="title">内部报警设置</div>
          <div className="box-primary">
          <div className="box-header">
            <lable style={monomer.marrright15}>设备选择:</lable> 
             <Cascader placeholder={'请选择'} defaultValue={state.defaultValue} onChange={onChange} style={monomer.width555}  options={state.list} /> 
            
          </div>
          <InteralarmModalGeng  />
          <Table classname="usertable" rowKey={record => record.pkid}  columns={dataSource(handleMenuClick)} dataSource={state.data} />
        </div>
      </div>
    </div>
   
  );
}
/*interalarm 为model*/
export default connect(({ interalarm, loading }) => ({ interalarm, loading: loading.models.users }))(Interalarm)

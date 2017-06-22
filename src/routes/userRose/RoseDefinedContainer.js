import React, { PropTypes } from 'react'
import { connect } from 'dva';
import { Table ,Pagination , Button, Menu, Icon , Input , Select , Dropdown , Modal , Checkbox    } from 'antd';
import { routerRedux } from 'dva/router';
import styles from './Users.css';
import RoseModal from './RoseModal';
import { DropOption ,Warn} from '../../components'
import SourceModal from './SourceModal'

/* table数据源*/
const dataSource = (handleMenuClick) =>{
  const columns = [{
    title: '角色编号',
    dataIndex: 'roleCode',
    key: '角色编号',
    render: text => <a href="#">{text}</a>,
  }, {
    title: '角色名称',
    dataIndex: 'roleName',
    key: '角色名称',
  }, {
    title: '详细信息',
    dataIndex: 'remark',
    key: '详细信息',
  }, {
    title: '权限设置',
    key: '权限设置',
    render: (text, record) => (
     <DropOption onMenuClick={e => handleMenuClick(record, e)} menuOptions={[{ key: '1', name: '编辑角色' }, { key: '2', name: '删除' }, { key: '3', name: '权限分配' }]} />
    )
  }];
  return columns
}



const RoseDefined = ({ ...single }) => {
  const { ...state } = single.roseDefined;

  /*点击新增用户*/
  const addUser = (a,b) =>{

    single.dispatch({
        type: 'roseDefined/showModal',
        payload: {
          modalType: 'create',
        },
    })
  }
  /**/
  const removeUser =(a,b) => {
    single.dispatch({
      type: 'roseDefined/UserEntity',
      payload:{
        selectType:'remove',
        dispatch:single.dispatch
      }
    })
  }

  /* table前check全选*/
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
     
      const arrid = selectedRows.map(item => item.pkid)
      single.dispatch({
          type: 'roseDefined/selectUser',
          payload: {
            selectId: arrid,
          },
        })
    }
  };
  /*操作菜单下拉*/
  const handleMenuClick = (row,b) =>{
      /*1编辑和2删除*/
      if(b.key == 1){
        single.dispatch({
          type: 'roseDefined/showModal',
          payload: {
            modalType: 'update',
            currentItem: row,
          },
        })
      }else if(b.key ==2 ){
          if(confirm('您确定要删除这条记录吗?')){
                single.dispatch({type:'roseDefined/removeRose',payload:{
                  list:[row.pkid],
                  dispatch:single.dispatch
                }})
          }else{

          }
          
      }else if(b.key ==3){
        
        single.dispatch({
          type: 'roseDefined/showSourceModal',
          payload:{curSource:row}
        })
      }
  }
  /*模态框属性*/
  const RoseModalProps = {
    item: state.modalType == 'create' ? {} : state.currentItem,
    visible:state.modalVisible,
    title: `${state.modalType === 'create' ? '新增角色' : '编辑角色'}`,
    onCancel(){
      single.dispatch({
          type: 'roseDefined/hideModal',
      })
    },
    onOk(item){
      state.modalType == 'create' ? single.dispatch({type:'roseDefined/addRose',payload:{item:item,dispatch:single.dispatch}}):single.dispatch({type:'roseDefined/editRose',payload:{item:item,dispatch:single.dispatch}})
    }
   

  }

  const UserModalGeng = () => <RoseModal {...RoseModalProps} />

  const onPageChange =(page) => {

      single.dispatch({
        type:'roseDefined/querySuccess',
        payload:{
          pagination:{
            ...page 
          }
        }
      })
  }
 
  /*警告框*/
  const WarnProps = {
    visible:state.warnVisible,
    title:'警告信息',
    text:'请至少选择一条数据进行操作',
    footer:null,
    onOk(){
      single.dispatch({
        type:'roseDefined/hideWarnModal'
      })
    },
    onCancel(){
      single.dispatch({
        type:'roseDefined/hideWarnModal'
      })
    }

  }

  const SourceModalProps = {
    state:state,
    single:single,
    options:state.sourceList,
    visible:state.sourceVisible,
    text:state.warnText,
    title:'资源分配',
    onChange(a){
      // state.curSource
      // console.log(a)

    },
    onOk(item){
     // console.log(item)

      single.dispatch({
        type:'roseDefined/sourceForm',
        payload:{...state.curSource,menus:item.menus,dispatch:single.dispatch}
      })
    },
    onCancel(){
      single.dispatch({
        type:'roseDefined/hideSourceModal'
      })
    }
  }
  const SourceModalGeng = () =>  <SourceModal {...SourceModalProps}/>
  return (
    <div className={styles.normal}>
      <Warn {...WarnProps}/>
      <SourceModalGeng />
      <UserModalGeng  />
      
      <div className="box">
        <div className="title">角色定义</div>
          <div className="box-primary">
          <div className="box-header">
            <Button type="primary" onClick={addUser}>新增角色</Button>
            <Button type="primary"  onClick={removeUser}>批量删除</Button>
   
          </div>
          
          <Table classname="usertable"
           rowSelection={rowSelection} 
           rowKey={record => record.pkid}
           columns={dataSource(handleMenuClick)}
           dataSource={state.data}
           loading={single.loading}
           pagination={state.pagination}
           onChange={onPageChange} />
        </div>
      </div>
    </div>
   
  );
}
/*userSetting 为model*/
export default connect(({ roseDefined, loading }) => ({ roseDefined, loading: loading.models.users }))(RoseDefined)


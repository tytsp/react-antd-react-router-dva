import React, { PropTypes } from 'react'
import { connect } from 'dva';
import { Table ,Pagination , Button, Menu, Icon , Input , Select , Dropdown , Modal , Checkbox    } from 'antd';
import { routerRedux } from 'dva/router';
import styles from './Users.css';
import UserModal from './UserModal';
import { DropOption ,Warn} from '../../components'
import UserSourceModal from './UserSourceModal'

/* table数据源*/
const dataSource = (handleMenuClick) =>{
  const columns = [{
    title: '登录账号',
    dataIndex: 'userCode',
    key: '登录账号',
    render: text => <a href="#">{text}</a>,
  }, {
    title: '用户名称',
    dataIndex: 'userName',
    key: '用户名称',
  }, {
    title: '角色名称',
    dataIndex: 'roleName',
    key: '角色名称',
  }, {
    title: '账户启用/禁用',
    dataIndex: 'flagStatus',
    key: '账户启用/禁用',
    render:(value)=> value==0 ? '禁用' : '启用'
  }, {
    title: '权限设置',
    key: '权限设置',
    render: (text, record) => (
     <DropOption onMenuClick={e => handleMenuClick(record, e)} menuOptions={[{ key: '1', name: '用户编辑' }, { key: '2', name: '删除' }, { key: '3', name: '资源分配' }]} />
    )
  }];
  return columns
}



const userSetting = ({ ...single }) => {
	/*传参 state*/
  const { ...state } = single.userSetting;

  
  /*点击新增用户*/
  const addUser = (a,b) =>{
    single.dispatch({
        type: 'userSetting/addUser',
        payload: {
          modalType: 'create',
          dispatch:single.dispatch
        },
    })
  }
  /*点击事件*/
  const removeUser =(a,b) => {
    single.dispatch({
      type: 'userSetting/UserEntity',
      payload:{
        selectType:'remove',
        dispatch:single.dispatch
      }
    })
  }
  const openUser =(a,b) => {
     single.dispatch({
      type: 'userSetting/UserEntity',
      payload:{
        selectType:'open',
        dispatch:single.dispatch
      }
    })
  }
  const closeUser =(a,b) => {
     single.dispatch({
      type: 'userSetting/UserEntity',
      payload:{
        selectType:'close',
        dispatch:single.dispatch
      }
    })
  }
  /* table前check全选*/
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      const arrid = selectedRows.map(item => item.pkid)
      single.dispatch({
          type: 'userSetting/selectUser',
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
        /*模态框单条数据及显示状态*/
        /*角色列表*/
        single.dispatch({
          type:'userSetting/roseList',
          payload: {
            modalType: 'update',
            currentItem: row,
          },
        })
      }else if(b.key ==2 ){
          if(confirm('您确定要删除这条记录吗?')){
             single.dispatch({
              type: 'userSetting/selectUser',
              payload: {
                selectId: [row.pkid],
              },
            })
            single.dispatch({
              type: 'userSetting/UserEntity',
              payload:{
                selectType:'remove',
                dispatch:single.dispatch
              }
            })
          }else{

          }
          
      }else if(b.key == 3){
        console.log(row)
        console.log(row.pkid)
            single.dispatch({
              type: 'userSetting/sourceTree',
              payload:{
                userPkid:row.pkid,
                usrName:row.userName,
                Rose:row.roleName,
                dispatch:single.dispatch
              }
            })
      }
  }
  /*模态框属性*/
  const userModalProps = {
    item: state.modalType == 'create' ? {} : state.currentItem,
    visible:state.modalVisible,
    roseList:state.roseList,
    title: `${state.modalType === 'create' ? '新建用户' : '修改用户'}`,
    onCancel(){
      single.dispatch({
          type: 'userSetting/hideModal',
      })
    },
    onOk(item){
      switch(state.modalType){
        case 'create':
          single.dispatch({
            type:'userSetting/create',
            payload:{
              ...item,
              dispatch:single.dispatch
            }
          })
        break;
        case 'update':
          single.dispatch({
            type:'userSetting/update',
            payload:{
              ...item,
              dispatch:single.dispatch
            }
          })
        break;
      }
    }
   

  }

  const UserModalGeng = () => <UserModal {...userModalProps} />

  const onPageChange =(page) => {
     // console.log(page)
      single.dispatch({
        type:'userSetting/querySuccess',
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
    text:state.text,
    footer:null,
    onOk(){
      single.dispatch({
        type:'userSetting/hideWarnModal'
      })
    },
    onCancel(){
      single.dispatch({
        type:'userSetting/hideWarnModal'
      })
    }

  }
  const UserSourceModalProps = {
    dispatch:single.dispatch,
    visible:state.sourceVisible,
    title:`用户名称:${state.usrName} 角色:${state.Rose}`,
    state:state,
    text:state.text,
    onOk(){
      
      single.dispatch({
        type:'userSetting/sourceTreeCommit',
        payload:{
          userPkid:state.userPkid,
          structure:state.sourceTree
        }
      })
    },
    onCancel(){
      single.dispatch({
        type:'userSetting/querySuccess',
        payload:{
          sourceVisible:false
        }
      })
    }
  }
   const restore =(a,b) => {
     single.dispatch({
      type: 'userSetting/UserEntity',
      payload:{
        selectType:'restore',
        dispatch:single.dispatch
      }
    })
  }
  return (
    <div className={styles.normal}>
      <Warn {...WarnProps}/>
      <UserSourceModal {...UserSourceModalProps}/>
      <div className="box">
        <div className="title">用户设置</div>
          <div className="box-primary">
          <div className="box-header">
            <Button type="primary" onClick={addUser}>新增用户</Button>
            <Button type="primary"  onClick={removeUser}>删除用户</Button>
            <Button type="primary"  onClick={openUser}>用户启用</Button>
            <Button type="primary"  onClick={closeUser}>用户禁用</Button>
            <Button type="primary"  onClick={restore}>密码还原</Button>
          </div>
          <UserModalGeng  />
          <Table classname="usertable"
           rowKey={record => record.pkid}
           rowSelection={rowSelection} 
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
export default connect(({ userSetting, loading }) => ({ userSetting, loading: loading.models.users }))(userSetting)

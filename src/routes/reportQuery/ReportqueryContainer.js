import React, { PropTypes } from 'react'
import { connect } from 'dva';
import { Table ,Pagination , Button, Menu, Icon , Input, Cascader,DatePicker,TreeSelect ,Tree   } from 'antd';
import { routerRedux } from 'dva/router';
import moment from 'moment';
import styles from './Users.css';

const { MonthPicker, RangePicker } = DatePicker;
const SHOW_PARENT = TreeSelect.SHOW_PARENT;
const TreeNode = Tree.TreeNode;

const dateFormat = "YYYY-MM-DD HH:mm:ss";
const pageSize = 10;
const monomer = {
        marginBottom15:{
          marginBottom:15
        },
         marginRight15:{
          marginRight:15
        },
      
}

function Users({ ...single }) {

   const {...state} = single.Reportquery;



const CascaderProps = {
    style:{ width: 450 },
    options: state.factoriesAndWorkshops,
    defaultValue:state.selectedId,
    placeholder: '请选择',
    onChange(a, b){
     
      var list =  b[b.length - 1].deviceParameterList || [];

      // factoryId,workshopId,lineId,sublineId,deviceId,

      var json = {factoryId:a[0],workshopId:a[1],lineId:(''+ a[2]).split('#')[0],sublineId:('' + a[2]).split('#')[1],deviceId:a[3]}

      var selected = [];
      var parameterCode = [];
      var parentId = [];
      
      list && list.map(item=>parameterCode.push(item.parameterCode))
     
     
      single.dispatch({type: 'Reportquery/reduce', payload: {json:json,parentId:parentId,parameterCode:parameterCode,selectId:selected,selectedId:a,lineList:list}})
    
    }
  }
 
  function unique(list){
    if(list.length){
         var res = [];
         var json = {};
         for(var i = 0; i < list.length; i++){
          if(!json[list[i]]){
           res.push(list[i]);
           json[list[i]] = 1;
          }
         }
         return res;
    }else{
        return [];
    }
  
  }
 
  const handleTableChange = (a,b,c) => {
     
     single.dispatch({type:'Reportquery/reduce',payload:{
        pagination:a
      }})
     single.dispatch({type:'Reportquery/query',payload:Object.assign({
        pageSize:pageSize,
        pageNum:a.current,
        startTime:moment(state.timeStart).format(dateFormat),
        endTime:moment(state.timeEnd).format(dateFormat),
        parameters:state.parameterCode.join(',')
      },state.json)})


  }
 
  const TreeProps = {
    disabled:false,
    value:state.TreeProps,
    searchPlaceholder: '请选择',

    treeCheckable:true,
    treeDefaultExpandAll:true,
    multiple: true,
    defaultCheckedKeys:state.selectId,
    onChange(code,name,b){

      var tableHeader = [{
            title: '生产日期-时间',
            dataIndex: 'update_time',
            key: 'update_time',
            fixed:'left',
            width:180,
          }];

      code.map((item ,index)=> tableHeader.push({key:item,dataIndex:item,title:name[index],width: 180}))

      single.dispatch({type:'Reportquery/reduce',payload:{

        columns:tableHeader,
        TreeProps:code,
        parameters:code,
        length:name.length,
        pagination:{current:1}
      }})
      
      xhr(code);
      
    },
    onSearch(){
      // setInterval(function(){

      // document.querySelector('.ant-select').className = 'ant-select-open'
      // },1200)
      console.log(arguments,this)
    }
  }

  
 
  const onStartChange = (value) =>{
    
    single.dispatch({type:'Reportquery/reduce',payload:{
      timeStart:moment(value).format(dateFormat),
      startTime:value,
      pagination:{current:1}
    }})
    
    single.dispatch({type:'Reportquery/query',payload:Object.assign({
        pageSize:pageSize,
        pageNum:1,
        endTime:state.timeEnd,
        startTime:moment(value).format(dateFormat),
        parameters:state.parameterCode.join(',')
      },state.json)})

 
    
  } 
  const onEndChange = (value) =>{
   
     single.dispatch({type:'Reportquery/reduce',payload:{
      timeEnd:moment(value).format(dateFormat),
      endTime:value,
      pagination:{current:1}
     }})
    
    single.dispatch({type:'Reportquery/query',payload:Object.assign({
        pageSize:pageSize,
        pageNum:1,
        startTime:state.timeStart,
        endTime:moment(value).format(dateFormat),
        parameters:state.parameterCode.join(',')
      },state.json)})

     

  }
  
   const xhr = (code) =>{
    // console.log(state.parameters)
    single.dispatch({type:'Reportquery/query',payload:Object.assign({
        pageSize:pageSize,
        pageNum:1,
        startTime:moment(state.timeStart).format(dateFormat),
        endTime:moment(state.timeEnd).format(dateFormat),
        parameters:code.join(',')
      },state.json)})
  }
  const ButtonProps = {
    onClick(){

      const pageSize = state.pagination.total;
      const headerTable = state.columns.map(item=>item.title);
      const index = state.columns.map(item=>item.key);

      single.dispatch({
        type:'Reportquery/exportExcel',
        payload:Object.assign({
          pageSize:pageSize,
          pageNum:1,
          endTime:state.timeEnd,
          startTime:state.timeStart,
          headerTable:headerTable,
          index:index,
          parameters:state.parameters
        },state.json)
      })
    }
  }
  const TreeS = () =>{
    return <TreeSelect  style={{'width':'calc(100% - 70px)'}} {...TreeProps}>
                 {state.lineList.length != 0 ? <TreeNode  value={'全选'} title={'全选'} key={'全选'}>
                  {state.lineList.map(item=>{

                      return <TreeNode label={item.pkid} value={item.parameterCode} header={item.parameterName} parameterCode={item.parameterCode} key1={item.pkid}  title={item.parameterName} key={item.pkid}>
                                
                            </TreeNode> 
                    })
                  }
                   </TreeNode>:console.warn('TreeSelect') } 
                  </TreeSelect>
  }

  return (
    <div className={styles.normal}>

<div className="box">
<div className="title">报表查询</div>
<div className="box-primary">
<div className="box-header">
<div style={monomer.marginBottom15}>
<span>时间段选择：</span>
<DatePicker
    showTime
    value={state.startTime}
    format={dateFormat}
    onChange={onStartChange}
    
 />
 -
<DatePicker
    showTime
    value={state.endTime}
    format={dateFormat}
    onChange={onEndChange}
   
 />
 </div>
<div style={monomer.marginBottom15}>
<span>设备选择：</span>
<Cascader {...CascaderProps}  />

</div>
<div style={monomer.marginBottom15}>
<span>参数选择：</span>
<TreeS style={{'display':'block'}}/>
</div>

</div>
 <div className="sysmenu-indent" >
 <Table scroll={{ x: state.columns.length*180 }} dataSource={state.dataSource} onChange={handleTableChange} pagination={state.pagination} rowKey={(record,index) => record.update_time + index} columns={state.columns} />
 {state.pagination.total > 0 && <Button  type="primary" {...ButtonProps}>导出</Button> }

 </div>




</div>
</div>

 

    </div>
   
  );
}



export default connect(({ Reportquery,global }) => ({ Reportquery ,global}))(Users)

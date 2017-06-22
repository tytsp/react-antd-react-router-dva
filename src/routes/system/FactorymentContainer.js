import React, { PropTypes } from 'react'
import { connect } from 'dva';
import { Table ,Pagination , Button, Menu, Icon , Input , Select , Dropdown , Modal , Checkbox , Row , Col , Tree    } from 'antd';
import { routerRedux } from 'dva/router';
import styles from './Users.css';
import {SearchTree} from '../../components'

const gData = [
  {
    title:'铝加工一厂',
    key:'1',
    children:[
      {
        title:'一车间',
        key:'11',
        children:[
          {
            title:'一挤压线',
            key:'111',
            children:[
              
            ]
          },
          {
            title:'二挤压线',
            key:'112',
            children:[
              
            ]
          }
        ]
      },
      {
        title:'二车间',
        key:'12',
        children:[
          
        ]
      }
    ]
  },
  {
    title:'铝加工二厂',
    key:'2',
    children:[
      {
        title:'一车间',
        key:'21',
        children:[
          {
            title:'一挤压线',
            key:'211',
            children:[
              
            ]
          },
          {
            title:'二挤压线',
            key:'212',
            children:[
              
            ]
          }
        ]
      },
      {
        title:'二车间',
        key:'22',
        children:[
          
        ]
      }
    ]
  }

]
/*获取第一个子节点*/

	var arr = [];
	var str = '';
function getDefault(data,node){
	const one  = data[0].children;
	str += '/' + data[0].key;
	arr.push(str)
	if(one.length){

		return getDefault(one,node)
	}else{
		return {a:data[0],r:arr}
	}
}
const defaultkeys = getDefault(gData).r;


const sysmenustyle = {
        treetest:{
          border:'solid 1px #E3E3E3',
          padding:'10',
        },
         treetestright:{
          border:'solid 1px #E3E3E3',
          padding:'20',
        },
        inputtext:{
            paddingTop:'5',
            textAlign:'center',
            fontWeight:'bold'

        },

}

 

function TreeSingle({ ...single }) {
	const {...state} = single.factory;
	console.log(defaultkeys.slice([defaultkeys.length - 1]))
	const SearchTreeProps = {
		mode:'inline',
		theme:'',
		handleClickNavMenu(a,b){
			console.log(a,b)
		},
		gData:gData,
		defaultOpenKeys:defaultkeys.slice(0,defaultkeys.length -1),
		defaultSelectedKeys:defaultkeys.slice([defaultkeys.length - 1])
	}
  const TreeNode = Tree.TreeNode;
 var dataSource = [{
  key: '1',
  id: '1',
  machine: '挤压机',
  sort: '排序'
}, {
  key: '2',
  id: '2',
  machine: '挤压机',  
  sort: '排序'
}];

const columns = [{
  title: '设备编号',
  dataIndex: 'id',
  key: 'id',
}, {
  title: '设备名称',
  dataIndex: 'machine',
  key: 'machine',
}, {
  title: '设备排序',
  dataIndex: 'sort',
  key: 'sort',
}];


  return (
    <div className={styles.normal}>

		<div className="box">
			<div className="title">工厂及设备查看</div>
			<div className="box-primary">
				<div className="box-header"></div>
				 <div className="sysmenu-indent">
				 <Row>
		             <Col span={5}>
		                 <div style={sysmenustyle.treetest}>

				         <SearchTree { ...SearchTreeProps } />
					                </div>
		              </Col>
				       <Col span={18} offset={1}>
				       <div style={sysmenustyle.treetestright}>
				           
						<Table dataSource={dataSource} columns={columns} />

				          </div>
				        </Col>
				  </Row>


				 </div>




			</div>
		</div>

		 

    </div>
   
  );
}


export default connect(({ factory }) => ({ factory }))(TreeSingle)

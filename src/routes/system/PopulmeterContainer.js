import React from "react";
import {connect} from "dva";
import {Button, Cascader, Col, Form, Radio, Row, TreeSelect,Tree} from "antd";
import styles from "./Users.css";
const RadioGroup = Radio.Group;
const TreeNode = Tree.TreeNode;
const radioStyle = {
	display: 'block',
	height: 30,
	lineHeight: 30,
};
const SHOW_ALL = TreeSelect.SHOW_ALL;

const sysmenustyle = {
	treetest: {
		border: 'solid 1px #E3E3E3',
		padding: 10,
	},
	treetestright: {
		border: 'solid 1px #E3E3E3',
		padding: 20,
	},
	marrright15: {
		marginRight: 15
	},
	marbott15: {
		marginBottom: 15
	},
	width555:{
      width:555,
      display:'inline-block',
    }

}


function Populmeter({...single}) {
	const {...state} = single.populmeter;


// 获取当前选中的id组selectedId以及选中的参数列表selectId
	const CascaderProps = {
		style:sysmenustyle.width555,
		options: state.factoriesAndWorkshops,
   		defaultValue:state.selectedId,
		placeholder: '请选择',
		onChange(a, b){

      var list =  b[b.length - 1].deviceList;
      var selected = [];
      var parameterCode = [];
      var parentId = [];

      for (var i = 0; i <  list.length; i++) {
         if(list[i].flagStatus == 1){
            selected.push(list[i].pkid)
         }
         var item = list[i].deviceParameterList;
    
         for(var j = 0; j<item.length; j++ ){

            if(item[j].flagStatus == 1){
              parameterCode.push(item[j].parameterCode)
              selected.push(item[j].pkid);
              parentId.push(list[i].pkid)
            }
         }
      }
     
			single.dispatch({type: 'populmeter/querySuccess', payload: {parentId:parentId,parameterCode:parameterCode,selectId:selected,selectedId:a,lineList:list}})
		}
	}

	const RadioGroupProps = {
		onChange(e){
			const current = e.target;

			var lineInfoArr = [];
			// 生产线 变化事件处理
			if (null != current && null != state.lineList && state.lineList.length > 0) {
				var deviceList = [];
				lineInfoArr = current.value.split(",");
				for (var i = 0; i < state.lineList.length; i++) {
					if (lineInfoArr[0] == state.lineList[i].lineId && lineInfoArr[1] == state.lineList[i].sublineId) {
						deviceList = state.lineList[i].deviceList;
						break;
					}
				}
				var devices = [];
				var defaultCheckedValues = [];
				// 拼装数据
				if (null != deviceList && deviceList.length > 0) {
					for (var i = 0; i < deviceList.length; i++) {
						var device = {};
						device.label = deviceList[i].deviceName;
						device.value = deviceList[i].pkid;
						device.key = deviceList[i].pkid;
						var params = [];
						var paramList = deviceList[i].deviceParameterList;
						if (null != paramList & paramList.length > 0) {
							for (var j = 0; j < paramList.length; j++) {
								var param = {};
								param.label = paramList[j].parameterName;
								param.value = paramList[j].pkid;
								param.key = paramList[j].parameterCode;
								params.push(param);
								if ("1" == paramList[j].flagStatus) {
									defaultCheckedValues.push(param.value);
								}
							}
						}
						device.children = params;
						devices.push(device);
					}
				}

				if (lineInfoArr.length > 0) {
					single.dispatch({
						type: 'populmeter/querySuccess',
						payload: {lineId: lineInfoArr[0], sublineId: lineInfoArr[1]}
					});
				}

				single.dispatch({
					type: 'populmeter/querySuccess',
					payload: {
						TreeSelect: defaultCheckedValues,
						paramTreeData: devices/*, treeDefaultCheckedValue: defaultCheckedValues*/
					}
				});


			}

		},
		children: (null == state.lineList || undefined == state.lineList) ? "" : state.lineList.map((item, index) =>
			<Radio style={radioStyle}
				   value={/*item.pkid + "," + */item.lineId + "," + item.sublineId}> {item.lineName}#{item.sublineId} </Radio>)
	}

	const FormItem = Form.Item;

	const selectTree = ({
							onSubmit,
							form: {
								getFieldDecorator,
								validateFields,
								getFieldsValue,
								validateFieldsAndScroll
							}
						}) => {
		const handleSubmit = (e) => {

			e.preventDefault();
			validateFieldsAndScroll((err, values) => {
				if (!err) {
			     	if(state.parameterCode.length){

					single.dispatch({
						type: 'populmeter/query',
						payload: {
							'factoryId': state.selectedId[0],
							'workshopId': state.selectedId[1],
							'lineId': state.selectedId[2].split('#')[0],
							'sublineId': state.selectedId[2].split('#')[1],
							'deviceId': unique(state.selectId.concat(state.parentId)).join(','),
							'parameterCode': state.parameterCode.join(','),
							dispatch : single.dispatch
						}
					});
			     	}else{
			     		alert('最少选择一条')
			     	}
				}
			});
		}
		return (<Form onSubmit={handleSubmit}>
			<FormItem>
				<Button type="primary" htmlType="submit" size="large">保存</Button>
			</FormItem>
		</Form>)
	}

	const treeSelectOnSelect = (value, label, extra) => {
	
		if (null != extra) {
			var checkedNodes = extra.checkedNodes;
			var selectedParamterCodeList = [];
			var selectedDeviceIds = extra.halfCheckedKeys;
			if (null != checkedNodes && checkedNodes.length > 0) {
				for (var i = 0; i < checkedNodes.length; i++) {
					var props = checkedNodes[i].props;
					if (null != props.value && "" != props.value) {
						if (null == props.children || undefined == props.children) {
							selectedParamterCodeList.push(checkedNodes[i].key)
						} else {
							selectedDeviceIds.push(checkedNodes[i].key);
						}
					}
				}
			}
		
			single.dispatch({
				type: 'populmeter/querySuccess',
				payload: {deviceIds: selectedDeviceIds, parameterCodes: selectedParamterCodeList}
			});
		}
	}

	const treeSelectOnChange = (value, label, extra) => {
		

		single.dispatch({
			type: 'populmeter/querySuccess',
			payload: {TreeSelect: value}
		});

	}


	const TreeSelectProps = {
		style: {display: 'block'},
		dropdownStyle: {maxHeight: 400, overflow: 'auto'},
		treeData: state.paramTreeData,
		// treeData={treeData}
		// 指定默认选中的条目
		defaultValue: state.TreeSelect,
		// defaultValue={state.treeDefaultCheckedValue}
		placeholder: "请选择",
		treeCheckable: true,
		treeDefaultExpandAll: true,
		//showCheckedStrategy: SHOW_ALL,
		onSelect: treeSelectOnSelect,
		onChange: treeSelectOnChange
	}

	const TreeAlies = () => {
		return <Tree
			{...TreeSelectProps}
		/>
	}

	const SaveButton = Form.create()(selectTree)
  const quntitu = () =>{
      return  <div>
                <div style={sysmenustyle.marbott15}>群体图数据选择:</div>
                <Col span={5}>
                  <div style={sysmenustyle.treetest}>
                    <div style={sysmenustyle.marbott15}>生产线选择:</div>
                    <RadioGroup {...RadioGroupProps}>
                      {RadioGroupProps.children}
                    </RadioGroup>
                  </div>
                </Col>
              </div>
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

 // 树型控件变化触发 默认为selectId
  const TreeProps = {
    checkable:true,
    // defaultExpandAll:false,
    defaultExpandedKeys:state.parentId,
    defaultCheckedKeys:state.selectId,
    onCheck(key,b){
      // { factoryId, workshopId, lineId, sublineId, deviceId, parameterCode}
      var deviceId = [] 
      var parameterCode = [];
      var parentId = [];
      console.log(b.checkedNodes)
      var arr = [];

      b.checkedNodes.map(item=>{
	      item.props.parameterCode && arr.push(item.props.parameterCode)
      })
      if(arr.length > 5){
      	alert('最多只能选5条');

	     single.dispatch({type:'populmeter/querySuccess',payload:{parentId:state.parentId,parameterCode:state.parameterCode,selectId:state.selectId}})
      }else{
      	b.checkedNodes.map(item=>{
	        item.props.parameterCode && parameterCode.push(item.props.parameterCode)
	        item.props.parentId && parentId.push(item.props.parentId)
	        item.props.key1 && deviceId.push(item.key)
      	})
      single.dispatch({type:'populmeter/querySuccess',payload:{parentId:parentId,parameterCode:parameterCode,selectId:unique(deviceId)}})
      }
      

      
    }
  }
  const TreeS = () =>{
    return <Tree {...TreeProps}>
                  {state.lineList.map(item=>{
                      return <TreeNode  title={item.deviceName} key={item.pkid}>
                              {item.deviceParameterList.map(item1=>{
                                return <TreeNode title={item1.parameterName} parentId={item.pkid} parameterCode={item1.parameterCode}  key={item1.pkid} key1={item1.pkid} />
                              })}
                            </TreeNode> 
                    })
                  }
                  </Tree>
  }

	return (
		<div className={styles.normal}>
			<div className="box">
				<div className="title">群体图参数定义</div>
				<div className="box-primary">
					<div className="box-header">
						<lable style={sysmenustyle.marrright15}>工厂-车间-生产线选择:</lable>
						<Cascader {...CascaderProps}  />
					</div>
          {state.lineList.length > 0 &&
					<div className="sysmenu-indent">
						<Row>
							

							<Col>
								<div style={sysmenustyle.treetestright}>
									<div style={sysmenustyle.marbott15}>参数选择:</div>
								
                  <TreeS style={{'display':'block'}} />
								</div>
							</Col>
						</Row>

						<SaveButton {...state}/>

					</div>

        }
				</div>
			</div>
		</div>
	);
}

export default connect(({populmeter}) => ({populmeter}))(Populmeter)

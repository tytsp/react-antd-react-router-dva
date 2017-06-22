import {query, queryTree} from '../services/populmeter'
import {parse} from 'qs'

export default {
	/*文件名字和namespace保持一致*/
	namespace: 'populmeter',

	state: {
		lineList: [],
		data: [],
		//list: [],
		paramTreeData: [],
		treeDefaultCheckedValue: [],
		factoriesAndWorkshops: [],
		/*初始状态模态框*/
		modalVisible: false,
		/*当前行数据*/
		//currentItem: {},
		/**/
		selectId: [],
    // 选出的列表
    selectedId:[],
    // 设备码
    parameterCode:[],
    // 设备id
    deviceId:[],
		factoryId: [],
		workshopId: [],
		lineId: [],
		sublineId: [],
		deviceIds: [],
		parameterCodes: [],
		// /*页码*/
		// pagination: {
		// 	showSizeChanger: true,
		// 	showQuickJumper: true,
		// 	showTotal: total => `共 ${total} 条`,
		// 	current: 1,
		// 	total: null,
		// },
	},

	subscriptions: {
		/*初始化*/
		setup ({dispatch, history}) {
			/*事件派发 调用 namespace/effects */
			 let timer = null;
	        timer = setInterval(function(){

	          if(localStorage.getItem('Token') == 1){
	           
	             dispatch({
					type: 'queryTree'
				})
	           
	            clearInterval(timer)
	          }
	        },800)
			
		},
	},

	effects: {
		*queryTree ({payload}, {call, put, select}) {
			const data = yield call(queryTree, parse(payload));

			var factoryRes = [];
			if (data.status) {
				factoryRes = data.data;
				
					for (var i = 0; i < factoryRes.length; i++) {

						factoryRes[i].value = factoryRes[i].pkid;
						factoryRes[i].label = factoryRes[i].factoryName;
            factoryRes[i].children = factoryRes[i].workshopList;
						var workShopList =  factoryRes[i].workshopList;
						
							for(var j = 0; j < workShopList.length; j ++){
								workShopList[j].value = workShopList[j].pkid;
								workShopList[j].label = workShopList[j].workshopName;
								workShopList[j].children = workShopList[j].lineList;

                var lineList = workShopList[j].lineList;
                for (var k = 0; k < lineList.length; k++) {
                  lineList[k].value = lineList[k].lineId ;
                  lineList[k].label = lineList[k].lineName ;
                }
							}
				

					}
				yield put({
					type: 'querySuccess',
					payload: {
						data : data.data,
						factoriesAndWorkshops : factoryRes
					}
				})
			} else {
				alert(data.message);
			}
		},

		*query ({payload}, {call, put, select}) {
			const data = yield call(query, parse(payload));
			alert(data.message);
			if(data.status){
				payload.dispatch({
					type: 'populmeter/queryTree'
				})
			}
		}

	},

	reducers: {
		querySuccess (state, action) {
			return {...state, ...action.payload}
		},
		showModal (state, action) {
			return {...state, ...action.payload, modalVisible: true}
		},
		hideModal (state) {
			return {...state, modalVisible: false}
		},
		selectUser (state, action) {
			return {...state, ...action.payload}
		}

	},

}

import {  structureAl } from '../services/monoment'
import { parse } from 'qs'

export default {
	/*文件名字和namespace保持一致*/
  namespace: 'monoment',

  state: {
    data:[],
    /*设备选择*/
    list:[],
    /*初始状态模态框*/
      modalVisible:false,
      /*当前行数据*/
      currentItem: {},
      /**/
      selectId: [],
      selectType:null,
      /*页码*/
      pagination: {
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: total => `共 ${total} 条`,
        current: 1,
        total: null,
      },
  },

  subscriptions: {
	  /*初始化*/
    setup ({ dispatch, history }) {
		/*事件派发 调用 namespace/effects */
         let timer = null;
        timer = setInterval(function(){

          if(localStorage.getItem('Token') == 1){
           
              dispatch({
                type:'productTree'
              }) 
           
            clearInterval(timer)
          }
        },800)
        
    },
  },

  effects: {
    
    *queryList({ payload },{call , put, select}){
      payload.data.map((item,index)=>item['index'] = index+1)
       yield put({
          type:'querySuccess',
          payload:{
          
            data:payload.data
          }
        })
    },
    *productTree({ payload },{call , put, select}){

      const res =  yield call(structureAl,parse(payload));
      var tableList = [];

     for (var i = res.data.length - 1; i >= 0; i--) {

        res.data[i].label = res.data[i].factoryName;
        res.data[i].value = res.data[i].pkid;
        res.data[i].children = res.data[i].workshopList;
        var single = res.data[i].children;
        for (var j = 0; j < single.length; j++) {
         
          single[j].label = single[j].workshopName;
          single[j].value = single[j].pkid;
          single[j].children = single[j].lineList;

          var item = single[j].children;
          for (var k = 0; k < item.length; k++) {
            item[k].label = item[k].lineName ;
            item[k].value = item[k].lineId ;
            item[k].children = item[k].deviceList;

            var wuyu = item[k].children;
             
            for (var l = 0; l < wuyu.length; l++) {
              wuyu[l].index =  l;
              wuyu[l].label =  wuyu[l].deviceName;
              wuyu[l].value = wuyu[l].pkid;
              // tableList =  wuyu[l].deviceParameterList
            }

          }

        }
      }

  
      if(res.status){
        yield put({
          type:'querySuccess',
          payload:{
            list:res.data,
            data:tableList
          }
        })
      }else{
        alert(res.message)
      }
    },
  
    
    
   
  },

  reducers: {
    querySuccess (state, action) {
      return {...state, ...action.payload}
    },
    showModal (state, action) {
      return { ...state, ...action.payload, modalVisible: true }
    },
    hideModal (state) {
      return { ...state, modalVisible: false }
    },
    selectUser (state, action) {
      return {...state, ...action.payload}
    }
  
  },

}

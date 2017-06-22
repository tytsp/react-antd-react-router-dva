import {  query,prealarmTree,structureAl,update } from '../services/prealarm'
import { parse } from 'qs'

export default {
	/*文件名字和namespace保持一致*/
  namespace: 'prealarm',

  state: {
    defaultValue:[],
    data:[],
    list:[],
    selectlist:[],
    /*初始状态模态框*/
      modalVisible:false,
      /*当前行数据*/
      currentItem: {},
      /**/
      currentId:{},
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
      var url = window.location.href.split('?')[1];
      if(url){
        var params = parse(url);
        var arr = [];
        arr.push(params.factoryId);
        arr.push(params.workshopId);
        arr.push(params.lineId+ '#' +params.sublineId);
        arr.push(params.deviceId);
      
        dispatch({
          type:'querySuccess',
          payload:{
            defaultValue:arr
          }
        })
        dispatch({type:'query',payload:params})

      }
     
    
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
  
    *productTree({ payload },{call , put, select}){

      const res =  yield call(structureAl,parse(payload));

     

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
            item[k].label = item[k].lineName;
            item[k].value = item[k].lineId;
            item[k].children = item[k].deviceList;

            var wuyu = item[k].children;
             
            for (var l = 0; l < wuyu.length; l++) {
             
              wuyu[l].label =  wuyu[l].deviceName;
              wuyu[l].value = wuyu[l].pkid;

            }

          }

        }
      }

   
      if(res.status){
        yield put({
          type:'querySuccess',
          payload:{
            list:res.data,

          }
        })
      }else{
        alert(res.message)
      }
    },
    *query({ payload },{call , put, select}){
       const subres =  yield call(query,parse(payload));
      
      
       for (var i = 0; i < subres.data.techBindList.length; i++) {
          subres.data.techBindList[i].index = i+1;
          for(var j = 0 ;j<subres.data.alarmposList.length;j++){

           if(subres.data.techBindList[i].alarmposCode == subres.data.alarmposList[j].alarmposCode){
              subres.data.techBindList[i].alarmposCode1 =  subres.data.alarmposList[j].alarmposName;
           }
          }
       }
      
       if(subres.status){
         yield put({
          type:'querySuccess',
          payload:{
            currentId:payload,
            data:subres.data.techBindList,
            selectlist:subres.data.alarmposList,
          }
     
        })

       }
    },

     *update({ payload }, { call, put ,select }) {
      const data = yield call(update, parse(payload));
      const current = yield select(state => state.prealarm.currentId)
      if(data.status){
        yield put({type: 'hideModal'})
        payload.dispatch({
        type:'prealarm/query',
        payload:current
      })
      }else{
        alert(data.message)
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

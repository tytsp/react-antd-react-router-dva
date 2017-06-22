import {  query,source,sourceP,addRose ,editRose,removeRose,sourceCommit} from '../services/roseDefined'
import { parse } from 'qs'

export default {

  namespace: 'roseDefined',

  state: {
      /*资源分配框*/
      sourceVisible:false,
      /*警告框*/
      warnVisible:false,
      data:[],
      /*初始状态模态框*/
      modalVisible:false,
      /*当前行数据*/
      currentItem: {},
      /**/
      selectId: [],
      curPkid:'',
      /*当前选中资源*/
      curCheck:[],
      /*当前资源*/
      curSource:{},
      /*资源列表*/
      sourceList:[],
      /*资源列表原始结构*/
      PList:[],
      selectType:null,
      /*页码*/
      pagination: {

        showTotal: total => `共 ${total} 条`,
        current: 1,
        total: null,
      },
  },

  subscriptions: {
    setup ({ dispatch, history }) {
       let timer = null;
          timer = setInterval(function(){

            if(localStorage.getItem('Token') == 1){
             
           dispatch({
              type:'query',
              payload:{
                pageIndex:1,
                pageSize:2
              }
            })
            // 初始化加载资源列表
            dispatch({
              type:'sourceList'
             
            })
             
              clearInterval(timer)
            }
          },800)
        
    },
  },

  effects: {
  
    /*资源分配提交*/
    *sourceForm({payload},{call,put, select}){
      // payload.menus.push(payload.parentPkid)
      const data = yield call(sourceCommit, parse(payload));
      if(data.status){
        payload.dispatch({type:'roseDefined/hideSourceModal'})
        payload.dispatch({type:'roseDefined/query'})
      }else{
        alert(data.message)
      }
    },
    *removeRose({payload},{call,put, select}){
      const data = yield call(removeRose, parse(payload));
      if(data.status){
   
        payload.dispatch({type:'roseDefined/query'})
      }else{
        alert(data.message)
      }
    },
    *addRose({payload},{call,put, select}){
      const data = yield call(addRose, parse(payload.item));
      if(data.status){
        yield put({type:'hideModal'});
        payload.dispatch({type:'roseDefined/query'})
      }else{
        alert(data.message)
      }
    },
    *editRose({payload},{call,put, select}){
      const data = yield call(editRose, parse(payload.item));
      if(data.status){
        yield put({type:'hideModal'});
        payload.dispatch({type:'roseDefined/query'})
      }else{
        alert(data.message)
      }
    },

    *sourceList({payload},{call,put, select}){
        var arr = [];

        function transform(data){

          if(data.length){
            for (var i = 0; i < data.length; i++) {
              arr.push({value:data[i].pkid,label:data[i].name})
              
              if(data[i].child){
                
                transform(data[i].child)
              }
            }
          }
        }
        
      const data = yield call(sourceP, parse(payload));
      
      if(data.status){
          transform(data.data)
          yield put({type:'querySuccess',payload:{
            sourceList:arr,
            PList:data.data
          }})

      }else{
        alert(data.message)
      }
    },
    *query ({ payload }, { call, put ,select }) {
 
    const data = yield call(query, parse(payload))

    if(data.status){
      const current = yield select(state=>state.roseDefined.pagination.current);

      yield put({
          type: 'querySuccess',
          payload: {
            data:data.data.list,
            pagination:{
              current:current,
              total:data.pageTotal
            },
          },
        })
    }else{
      alert(data.message)
    }
    },
    *UserEntity({payload}, { call, put ,select }){
      const arrid =  yield select(state => state.roseDefined.selectId)

      const { selectType } = payload;
      if(!arrid.length){
        yield put({type:'showWarnModal'})
      }else{

        switch(selectType){
          case 'remove' :
              const removedata = yield call(removeRose, parse({list:arrid}))
              if(removedata.status){
                payload.dispatch({type:'roseDefined/query'})
                payload.dispatch({type:'roseDefined/querySuccess',payload:{selectId:[]}})
              }else{
                alert(removedata.message)
              }
          break;
          
        }
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
    showWarnModal (state, action) {
      return { ...state, ...action.payload, warnVisible: true }
    },
    hideWarnModal (state) {
      return { ...state, warnVisible: false }
    },
    showSourceModal (state, action) {
      return { ...state, ...action.payload, sourceVisible: true }
    },
    hideSourceModal (state) {
      return { ...state, sourceVisible: false }
    },

    selectUser (state, action) {
      return {...state, ...action.payload}
    }
  
  },

}

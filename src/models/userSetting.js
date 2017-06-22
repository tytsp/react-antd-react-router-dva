import {  query, create,remove,update,roseList ,open,close,userLine,lineEdit,restore} from '../services/userSetting'
import { parse } from 'qs'

export default {

  namespace: 'userSetting',

  state: {
    /*警告框文本*/
    text:'',
    userPkid:'',
    usrName:'',
    Rose:'',
    /*资源分配框*/
    sourceVisible:false,
    sourceTree:[],
      /*角色列表*/
      roseList:[],
      /*警告框*/
      warnVisible:false,
      data:[],
      /*初始状态模态框*/
      modalVisible:false,
      /*当前行数据*/
      currentItem: {},
      /**/
      selectId: [],
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
         
           // 用户设置列表
        dispatch({
          type:'query',
          payload:{
            pageNum:1,
            pageSize:10
          }
        })
         
          clearInterval(timer)
        }
      },800)
     
   
    },
  },

  effects: {
    *addUser({ payload }, { call, put ,select }) {
       const data = yield call(roseList, parse(payload));

       if(data.status){
          yield put({
            type: 'showModal',
            payload: {
              roseList:data.data.list,
              modalType: payload.modalType
            },
          })

       }else{
        alert('获取角色列表失败')
       }
    },
    *roseList({ payload }, { call, put ,select }) {
  
      const data = yield call(roseList, parse(payload))
      if(data.status){
        
        yield put({
            type: 'showModal',
            payload: {
              roseList:data.data.list,
              modalType: payload.modalType,
              currentItem: payload.currentItem,
            },
          })
      }
    },
    *sourceTreeCommit({ payload }, { call, put ,select }) {
      const data = yield call(lineEdit,parse(payload));
      if(data.status){
        yield put({
          type:'querySuccess',
          payload:{
             sourceVisible:false,
          }
        })
      }else{
        alert(data.message)
      }
    },
    *sourceTree({ payload }, { call, put ,select }) {
      var formData = new FormData();
      formData.append("userPkid", payload.userPkid);
      const data = yield call(userLine,formData);
      if(data.status){
        yield put({
          type:'querySuccess',
          payload:{
            usrName:payload.usrName,
            Rose:payload.Rose,
            userPkid:payload.userPkid,
            sourceVisible:true,
            sourceTree:data.data
          }
        })
      }else{
        alert(data.message)
      }
    },
    *query ({ payload }, { call, put ,select }) {
   
    const data = yield call(query, parse(payload))

    if(data.status){
      const current = yield select(state=>state.userSetting.pagination.current);

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
    }
  },
  *create({ payload }, { call, put ,select }){
    const data = yield call(create, parse(payload));
    if(data.status){
      yield put({type:'hideModal'})
      payload.dispatch({type:'userSetting/query'})
    }else{
      alert(data.message)
    }
  },
  *update({ payload }, { call, put ,select }){
    const data = yield call(update, parse(payload))
    if(data.status){
      yield put({type:'hideModal'})
      payload.dispatch({
        type:'userSetting/query'
      })
    }else{
      alert(data.message)
    }
  },

  *UserEntity({payload}, { call, put ,select }){
    const arrid =  yield select(state => state.userSetting.selectId)
  
    const { selectType } = payload;
    if(!arrid.length){
      yield put({type:'showWarnModal',payload:{text:'请至少选择一条数据进行操作'}})
    }else{

      switch(selectType){
        case 'remove' :
            const data = yield call(remove, parse({list:arrid}))
            if(data.status){
              payload.dispatch({type:'userSetting/query'})
              payload.dispatch({type:'userSetting/querySuccess',payload:{selectId:[]}})
            }else{
              alert(data.message)
            }
        break;
        case 'open' :
            const opendata = yield call(open, parse({list:arrid}))
            if(opendata.status){
              payload.dispatch({type:'userSetting/query'})
              yield put({type:'showWarnModal'})
              yield put({type:'showWarnModal',payload:{text:'启用成功'}})
              // payload.dispatch({type:'userSetting/querySuccess',payload:{selectId:[]}})
            }else{
              alert(opendata.message)
            }
        break;
        case 'close' :
            const closedata = yield call(close, parse({list:arrid}))
            if(closedata.status){
              payload.dispatch({type:'userSetting/query'})
              yield put({type:'showWarnModal'})
              yield put({type:'showWarnModal',payload:{text:'禁用成功'}})
              // payload.dispatch({type:'userSetting/querySuccess',payload:{selectId:[]}})
            }else{
              alert(closedata.message)
            }
        break;
        case 'restore' :
    
            const restoredata = yield call(restore, parse({list:arrid}))
            if(restoredata.status){
              payload.dispatch({type:'userSetting/query'})
              yield put({type:'showWarnModal'})
              yield put({type:'showWarnModal',payload:{text:'密码还原成功'}})
              // payload.dispatch({type:'userSetting/querySuccess',payload:{selectId:[]}})
            }else{
              alert(restoredata.message)
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

    selectUser (state, action) {
      return {...state, ...action.payload}
    }
  
  },

}

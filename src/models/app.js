import { login, userInfo, logout,menu,directorPass} from '../services/app'
import { parse } from 'qs'

export default {
  namespace: 'app',
  state: {
    Token:'',
    login: false,
    user: {
      name: '',
    },
    loged:{},
    structure:[],
    directorVisible:false,
    menu:[],
    pkid:'',
    loginButtonLoading: false,
    menuPopoverVisible: false,
    siderFold: false,
    darkTheme: true,
    isNavbar: document.body.clientWidth < 769,
    navOpenKeys: [],
    userPermissions: [],
  },
  subscriptions: {
    setup ({ dispatch }) {
      dispatch({ type: 'login' })
     
      let tid
      window.onresize = () => {
        clearTimeout(tid)
        tid = setTimeout(() => {
          dispatch({ type: 'changeNavbar' })
        }, 300)
      }
    },
  },
  effects: {
    *login ({
      payload,
    }, { call, put }) {
      localStorage.setItem('Token',0)
      var oMyForm = new FormData();
      if(payload){

        oMyForm.append("username", payload.username);
        oMyForm.append("password", payload.password);
      }else if(localStorage.username &&  localStorage.password){
         oMyForm.append("username", localStorage.username);
         oMyForm.append("password", localStorage.password);
      }
      const loginRes = yield call(login, oMyForm);
      
      
      const userPermissions = null;

      if (loginRes.status) {
        // const data = yield call(menu)
        if(payload){

          localStorage.username=payload.username;
          localStorage.password=payload.password;

        }
        

        yield put({type:'dashboard/loginData',payload:{loged:loginRes}})
        yield put({
          type: 'loginSuccess',
          payload: {
            structure:loginRes.data.structure,
            userPermissions,
            user: { 
              name:  localStorage.username ,
            },
            pkid:loginRes.data.userPkid,
            menu:loginRes.data.menu
          } })
        var arr = [];
         loginRes.data.menu.map(item=>item.child && item.child.map(item1=>arr.push(item1.menuUrl)))
         localStorage.setItem('menuUrl',JSON.stringify(arr));
         yield put({
          type: 'reduce',
          payload: {
            Token:`${loginRes.data.token}`
          },
        })
         document.cookie = `token=${loginRes.data.token} ;path=/`
         localStorage.setItem('Token',1)
      } else {
        if(payload){
          alert(loginRes.message)
        }
        yield put({
          type: 'loginFail',
        })
      }
    },
    *queryUser ({
      payload,
    }, { call, put }) {
      const { success, userPermissions, username } = yield call(userInfo, parse(payload))
      const {data} = yield call(menu)

      if (success) {
        yield put({
          type: 'loginSuccess',
          payload: {
            userPermissions,
            user: {
              name: username,
            },
            menu:data
          },
        })
      }
    },
    *directorPassword({
      payload,
    }, { call, put }) {
      var from = new FormData();
       from.append("pkid", payload.pkid);
       from.append("opwd", payload.opwd);
       from.append("npwd", payload.npwd);
       from.append("qpwd", payload.qpwd);
       
        const data = yield call(directorPass,from);
        if(data.status){
          localStorage.password = payload.npwd;
          yield put({
            type:'handleNavOpenKeys',
            payload:{
              directorVisible:false
            }
          })
        }else{
          alert(data.message)
        }
    },
    *logout ({
      payload,
    }, { call, put }) {
      localStorage.username = '';
      localStorage.password = '';
      window.location.href = '/dashboard'
      const data = yield call(logout, parse(payload))
      if (data.success) {
        yield put({
          type: 'logoutSuccess',
        })
      }
    },
    *switchSider ({
      payload,
    }, { put }) {
      yield put({
        type: 'handleSwitchSider',
      })
    },
    *changeTheme ({
      payload,
    }, { put }) {
      yield put({
        type: 'handleChangeTheme',
      })
    },
    *changeNavbar ({
      payload,
    }, { put }) {
      if (document.body.clientWidth < 769) {
        yield put({ type: 'showNavbar' })
      } else {
        yield put({ type: 'hideNavbar' })
      }
    },
    *switchMenuPopver ({
      payload,
    }, { put }) {
      yield put({
        type: 'handleSwitchMenuPopver',
      })
    },
  },
  reducers: {
    reduce (state, action) {
      return {...state,...action.payload}
    },
    loginSuccess (state, action) {
    	
      return {
        ...state,
        ...action.payload,
        login: true,
        loginButtonLoading: false,
      }
    },
    logoutSuccess (state) {
      return {
        ...state,
        login: false,
      }
    },
    loginFail (state) {
      return {
        ...state,
        login: false,
        loginButtonLoading: false,
      }
    },
    showLoginButtonLoading (state) {
      return {
        ...state,
        loginButtonLoading: true,
      }
    },
    handleSwitchSider (state) {
     
      return {
        ...state,
        siderFold: !state.siderFold,
      }
    },
    handleChangeTheme (state) {

      return {
        ...state,
        darkTheme: !state.darkTheme,
      }
    },
    showNavbar (state) {
      return {
        ...state,
        isNavbar: true,
      }
    },
    hideNavbar (state) {
      return {
        ...state,
        isNavbar: false,
      }
    },
    handleSwitchMenuPopver (state) {
      return {
        ...state,
        menuPopoverVisible: !state.menuPopoverVisible,
      }
    },
    handleNavOpenKeys (state, action) {
      return {
        ...state,
        ...action.payload,
      }
    },
  },
}

import {  query,queryTree} from '../services/Reportquery'
import { parse } from 'qs'

export default {

  namespace: 'global',

  state: {
    aaa:[]
  },

  subscriptions: {
    
  },

  effects: {
    
  *update({ payload }, { call, put ,select }){
    
  },
 
   
  },

  reducers: {
    reduce (state, action) {
      return {...state, ...action.payload}
    },
    
  
  },

}

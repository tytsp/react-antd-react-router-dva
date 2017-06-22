import {  query,queryTree} from '../services/Reportquery'
import { parse } from 'qs'
import moment from 'moment';
import XLSX from 'xlsx'
import FileSaver from 'file-saver'
// // 推荐在入口文件全局设置 locale
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

function StartDateStr(AddDayCount) {
    const dd = new Date();
    dd.setDate(dd.getDate()+AddDayCount);//获取AddDayCount天后的日期
    const y = dd.getFullYear();
    const m = dd.getMonth()+1;//获取当前月份的日期
    const d = dd.getDate();
    return y+"-"+m+"-"+d+" 00:00:00";
}
function EndDateStr(AddDayCount) {
  const dd = new Date();
  dd.setDate(dd.getDate()+AddDayCount);//获取AddDayCount天后的日期
  const y = dd.getFullYear();
  const m = dd.getMonth()+1;//获取当前月份的日期
  const d = dd.getDate();
  return y+"-"+m+"-"+d+" 23:59:59";
}
var timeStart = moment(StartDateStr(-1)).format("YYYY-MM-DD HH:mm:ss");
var timeEnd = moment(EndDateStr(-1)).format("YYYY-MM-DD HH:mm:ss");

export default {

  namespace: 'Reportquery',

  state: {
    startTime:moment(StartDateStr(-1)),
    timeStart:timeStart,
    timeEnd:timeEnd,
    endTime:moment(EndDateStr(-1)),
    length:0,
    parameterCode:[],
    json:{},
    // table 数据
    dataSource:[],
    // 设备选择
    deviceLIST:{},
    // 参数选择
    parameters:[],
    TreeProps:[],
    lineList:[],
    factoriesAndWorkshops: [],
    data: [],
    columns : [],
    pagination: {

      showTotal: total => `共 ${total} 条`,
      current: 1,
      total: null,
    },
  },

  subscriptions: {
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
    *exportExcel({payload}, {call, put, select}) {
      console.log(payload)
      const parameters =Object.prototype.toString.call(payload.parameters) == '[object String]' ? payload.parameters : payload.parameters.join(',')
      const data = yield call(query, parse({pageSize:payload.pageSize,pageNum:payload.pageNum,history:{...payload,parameters}}));
      function Workbook() {
        if (!(this instanceof Workbook)) return new Workbook();
        this.SheetNames = [];
        this.Sheets = {};
      }

      function s2ab(s) {
          var buf = new ArrayBuffer(s.length);
          var view = new Uint8Array(buf);
          for (var i=0; i!=s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
          return buf;
      }

      var array = [];
      array.push(payload.headerTable);
      // console.log(data.data.list)
      data.data.list.map(item=>{
        var arr = [];
        payload.index.map(item1=>arr.push(item[item1]))
        array.push(arr);
      })
      var arr = XLSX.utils.aoa_to_sheet(array);
      var ws_name = "报表";
      var wb = new Workbook()

      wb.SheetNames.push(ws_name);
      wb.Sheets[ws_name] = arr;
      
      var wopts = { bookType:'xlsx', bookSST:false, type:'binary' };
     
      var wbout = XLSX.write(wb,wopts);
          
      /* the saveAs call downloads a file on the local machine */
      FileSaver.saveAs(new Blob([s2ab(wbout)],{type:"application/octet-stream"}), "报表.xlsx");

    },
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
                  lineList[k].label = lineList[k].lineName;
                  lineList[k].children = lineList[k].deviceList;

                  var deviceList = lineList[k].deviceList;
                  for (var l = 0; l < deviceList.length; l++) {
                    deviceList[l].value = deviceList[l].pkid;
                    deviceList[l].label = deviceList[l].deviceName;

                  }
                }
              }
        

          }
          
        yield put({
          type: 'reduce',
          payload: {
            data : data.data,
            factoriesAndWorkshops : factoryRes
          }
        })
      } else {
        alert(data.message);
      }
    },

  *query({ payload }, { call, put ,select }){
 
    
    const length = yield select(state=>state.Reportquery.length);

      if( length > 0){
        
        const parameters1 = yield select(state=>state.Reportquery.parameters);
        
        const parameters =Object.prototype.toString.call(parameters1) == '[object String]' ? parameters1 : parameters1.join(',')
        const data = yield call(query, parse({pageSize:payload.pageSize,pageNum:payload.pageNum,history:{...payload,parameters}}));
        const current = yield select(state=>state.Reportquery.pagination.current);

        // console.log(current)
        if(data.status){
        yield put({
          type:'reduce',
          payload:{
            parameters:parameters,
            dataSource:data.data.list,
            pagination:{
              current:current,
              total:data.data.total
            },
          }
        })
         }else{
          alert(data.message)
        }
      }else{
        yield put({
          type:'reduce',
          payload:{
            columns:[],
            dataSource:[],
            pagination:{
               current: 1,
                total: null,
            },
          }
        })
      }
   
  },
 
   
  },

  reducers: {
    reduce (state, action) {
      return {...state, ...action.payload}
    },
    
  
  },

}

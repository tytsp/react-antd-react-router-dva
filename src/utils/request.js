import { message } from 'antd'
import axios from 'axios'
import qs from 'qs'
import { YQL, CORS } from './config'
import jsonp from 'jsonp'
import lodash from 'lodash'
import md5 from 'md5'
import base64url  from "base64url"


// const token = '16sgnc5mbn97v4o6qxjcw6';

// axios.defaults.headers.common['Authorization'] = base64url(JSON.stringify({code:md5(token + '2017-5-03 10:00:00'),time:'2017-5-03 10:00:00',deviceType:'PC'}));

const fetch = (options) => {
  let {
    method = 'get',
    data,
    fetchType,
    url,
  } = options

  // if (fetchType === 'JSONP') {
  //   return new Promise((resolve, reject) => {
  //     jsonp(url, {
  //       param: `${qs.stringify(data)}&callback`,
  //       name: `jsonp_${new Date().getTime()}`,
  //       timeout: 4000,
  //     }, (error, result) => {
  //       if (error) {
  //         reject(error)
  //       }
  //       resolve({ statusText: 'OK', status: 200, data: result })
  //     })
  //   })
  // } else if (fetchType === 'YQL') {
  //   url = `http://query.yahooapis.com/v1/public/yql?q=select * from json where url='${options.url}?${qs.stringify(options.data)}'&format=json`
  //   data = null
  // }

  switch (method.toLowerCase()) {
    case 'get':
      return axios.get(`${url}${!lodash.isEmpty(data) ? `?${qs.stringify(data)}` : ''}`)
    case 'delete':
      return axios.delete(url, { data })
    case 'head':
      return axios.head(url, data)
    case 'post':
      return axios.post(url, data)
    case 'put':
      return axios.put(url, data)
    case 'patch':
      return axios.patch(url, data)
    default:
      return axios(options)
  }
}

export default function request (options) {
  // if (options.url && options.url.indexOf('//') > -1) {
  //   const origin = `${options.url.split('//')[0]}//${options.url.split('//')[1].split('/')[0]}`
  //   if (window.location.origin !== origin) {
  //     if (CORS && CORS.indexOf(origin) > -1) {
  //       options.fetchType = 'CORS'
  //     } else if (YQL && YQL.indexOf(origin) > -1) {
  //       options.fetchType = 'YQL'
  //     } else {
  //       options.fetchType = 'JSONP'
  //     }
  //   }
  // }

  function Token(){
     var arr =  document.cookie.split('token=');

    const token =  arr[arr.length -1];
    return token;
  }
  
  if(options.url.indexOf('?') > -1){
    options.url = options.url + '&Token=' + Token();
  }else{

    options.url = options.url + '?Token=' + Token();
  }

  return fetch(options).then((response) => {
    const { statusText, status } = response
    let data = options.fetchType === 'YQL' ? response.data.query.results.json : response.data
    console.warn(data)
    if(data.message=='token timeout' || data.message=='token is invalid'){
      // alert('登录过期重新登录')
      // localStorage.setItem('username','');
      // localStorage.setItem('password','');
      window.location.reload();

    }
    return {
      code: 0,
      status,
      message: statusText,
      ...data,
    }
   

  }).catch((error) => {
    const {
      response = {
        statusText: error.message || '网络错误',
      },
    } = error

     message.error('服务器异常')

    // return { code: 1, mymessage: response.statusText }
  })
}

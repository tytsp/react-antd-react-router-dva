import { request,config } from '../utils'


export async function query(params){
  return request({
    url: `${config.baseURL}/biz/PresetAlarm/query`,
    method: 'post',
    data: params,
  })
}
export async function structureAl(params){
  return request({
    url: `${config.baseURL}/biz/bizLine/structureAl`,
    method: 'post',
    data: params,
  })
}
export async function update(params){
  return request({
    url: `${config.baseURL}/biz/PresetAlarm/update`,
    method: 'post',
    data: params,
  })
}

import { request, config } from '../utils'


export async function structureAl(params){
  return request({
    url: `${config.baseURL}/biz/bizLine/structureAl`,
    method: 'post',
    data: params,
  })
}

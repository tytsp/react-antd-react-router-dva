import { request ,config} from '../utils'


export async function login(params){
  return request({
    url: `${config.baseUrl}/system_login`,
    method: 'post',
    data: params,
  })
}

import { request, config} from '../utils'


export async function query(params){
  return request({

    url: `${config.baseURL}/biz/deviceTechnologyBind/update`,
    method: 'post',
    data: params,
  })
}

export async function queryTree(params){
  return request({

	url: `${config.baseURL}/biz/deviceTechnologyBind/getQueryCondition`,
    method: 'get',
    data: params,
  })
}


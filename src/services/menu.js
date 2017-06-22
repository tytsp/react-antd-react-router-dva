import { request } from '../utils'

export async function menu (params) {
  return request({
    url: `${config.baseURL}/biz/bizMenu/getMenuTree`,
    method: 'post',
    data: params,
  })
}

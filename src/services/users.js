import { request } from '../utils'


export async function query(params){
  return request({
    url: '/api/usersc',
    method: 'post',
    data: params,
  })
}
export async function create (params) {
  return request({
    url: '/api/usersu',
    method: 'post',
    data: params,
  })
}

export async function remove (params) {
  return request({
    url: '/api/usersr',
    method: 'post',
    data: params,
  })
}

export async function update (params) {
  return request({
    url: '/api/usersd',
    method: 'post',
    data: params,
  })
}

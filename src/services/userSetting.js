import { request, config } from '../utils'


export async function query(params){
  return request({
    url: `${config.baseURL}/biz/sysUser/query`,
    method: 'post',
    data: params,
  })
}
export async function create(params){
  return request({
    url: `${config.baseURL}/biz/sysUser/add`,
    method: 'post',
    data: params,
  })
}

export async function remove(params){
  return request({
    url: `${config.baseURL}/biz/sysUser/remove`,
    method: 'post',
    data: params,
  })
}
export async function open(params){
  return request({
    url: `${config.baseURL}/biz/sysUser/open`,
    method: 'post',
    data: params,
  })
}
export async function close(params){
  return request({
    url: `${config.baseURL}/biz/sysUser/close`,
    method: 'post',
    data: params,
  })
}
export async function update(params){
  return request({
    url: `${config.baseURL}/biz/sysUser/edit`,
    method: 'post',
    data: params,
  })
}

export async function roseList(params){
  return request({
    url: `${config.baseURL}/biz/sysRole/query`,
    method: 'post',
    data: params,
  })
}
export async function userLine(params){
  return request({
    url: `${config.baseURL}/biz/sysUser/userLine`,
    method: 'post',
    data: params,
  })
}
export async function lineEdit(params){
  return request({
    url: `${config.baseURL}/biz/sysUser/lineEdit`,
    method: 'post',
    data: params,
  })
}
export async function restore(params){
  return request({
    url: `${config.baseURL}/biz/sysUser/originalPwd`,
    method: 'post',
    data: params,
  })
}

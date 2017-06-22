import { request, config } from '../utils'

export async function login (params) {

  return request({

    url: `${config.baseURL}/system_login`,
    method: 'post',
    data: params,
  })
}

export async function logout (params) {
  return request({
    url: `${config.baseURL}/api/logout`,
    method: 'post',
    data: params,
  })
}


export async function userInfo (params) {
  return false;
  return request({
    url: `${config.baseURL}/api/login`,
    method: 'post',
    data: params,
  })
}
export async function directorPass (params) {

  return request({
    url: `${config.baseURL}/biz/sysUser/editPassword`,
    method: 'post',
    data: params,
  })
}

export async function menu (params) {
  return request({
    url: `${config.baseURL}/biz/bizMenu/getMenuTree`,
    method: 'post',
    data: params,
  })
}

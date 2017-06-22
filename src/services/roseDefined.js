import { request , config} from '../utils'

// 删除角色
export async function removeRose(params){
  return request({
    url: `${config.baseURL}/biz/sysRole/remove`,
    method: 'post',
    data: params,
  })
}
// 新增角色
export async function addRose(params){
  return request({
    url: `${config.baseURL}/biz/sysRole/add`,
    method: 'post',
    data: params,
  })
}
// 编辑角色
export async function editRose(params){
  return request({
    url: `${config.baseURL}/biz/sysRole/edit`,
    method: 'post',
    data: params,
  })
}
// 角色列表查询
export async function query(params){
  return request({
    url: `${config.baseURL}/biz/sysRole/query`,
    method: 'post',
    data: params,
  })
}
// 资源分配提交
export async function sourceCommit(params){
  return request({
    url: `${config.baseURL}/biz/sysRole/resource`,
    method: 'post',
    data: params,
  })
}
// 资源分配列表
export async function sourceP(params){
  return request({
    url: `${config.baseURL}/biz/bizMenu/getMenuTree`,
    method: 'post',
    data: params,
  })
}


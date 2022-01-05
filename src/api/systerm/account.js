import request from '@/utils/request'

export function getList (params) {
  return request({
    url: '/v1/user/list',
    method: 'get',
    params
  })
}

export function add (data) {
  return request({
    url: '/v1/user/add',
    method: 'post',
    data
  })
}

export function modify (data) {
  return request({
    url: '/v1/user/modify',
    method: 'post',
    data
  })
}

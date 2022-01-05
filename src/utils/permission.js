import store from '@/store'
// const ignoreRole = ['admin', 'customer']

/**
 * @param {Array} value
 * @returns {Boolean}
 * @example see @/views/permission/directive.vue
 */
export default function checkPermission (value) {
  if (value && value instanceof Array && value.length > 0) {
    const roles = store.getters && store.getters.roles
    const permissionRoles = value

    const hasPermission = roles.some(role => {
      return permissionRoles.includes(role)
    })
    return hasPermission
  } else {
    console.error('need roles! Like v-permission="[\'admin\',\'editor\']"')
    return false
  }
}

export const findPermissionBtns = (routes, value) => {
  let btns = []
  for (let index = 0; index < routes.length; index++) {
    const route = routes[index]
    // 只有一级
    if (!route.children) {
      // 路径匹配就返回btn权限集合
      if (route.btns && route.path === value) {
        btns = route.btns
        break
      }
    } else {
      // 有子级
      btns = [...findPermissionBtns(route.children, value)]
      // 找到btn，结束循环
      if (btns.length) {
        break
      }
    }
  }
  return btns
}

export function checkBtnPermission (value) {
  // const roles = store.getters && store.getters.roles
  // 如果是超级管理员不作处理
  // if ((roles.includes(ignoreRole[0]) || roles.includes(ignoreRole[1]))) {
  //   return true
  // }
  const btns = store.getters && store.getters.permission_btns
  if (value) {
    // 从用户路由权限表中找出当前按钮的配置
    let hasPermission = false
    for (let index = 0; index < btns.length; index++) {
      const btn = btns[index]
      if (btn.path === value) {
        hasPermission = true
        break
      }
    }
    return hasPermission
  } else {
    throw new Error('need roles! Like v-permission="[\'admin\',\'editor\']"')
  }
}

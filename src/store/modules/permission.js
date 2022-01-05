import { asyncRoutes, constantRoutes } from '@/router'
import { findPermissionBtns } from '@/utils/permission'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission (roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes (routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    // 根据用户类型权限划分路由
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  routes: [], // 静态路由 +  用户权限路由
  userRoutes: [], // 用户权限路由
  btns: [] // 当前页面的btn权限表
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.userRoutes = routes
    state.routes = constantRoutes.concat(routes)
  },
  SET_PERMISSIONBTNS: (state, btns) => {
    state.btns = btns
  }
}

const handleRoutes = (sourceRoute, userRoutes) => {
  const routes = []
  for (let index = 0; index < userRoutes.length; index++) {
    const route = userRoutes[index]
    // 找出原始路由的parent
    const parentIndex = sourceRoute.findIndex((item) => item.path === route.path)
    // 存在原始路由，开始拼接路由列表
    if (parentIndex > -1) {
      const parent = sourceRoute[parentIndex]
      let children = []
      let btns = []
      // 子路由处理
      if (parent.children && route.children) {
        children = handleRoutes(parent.children, route.children)
      }
      // 权限按钮处理
      if (parent.btns && route.btns) {
        btns = handleRoutes(parent.btns, route.btns)
      }
      const routeData = { ...parent }
      if (children.length) {
        routeData.children = children
      }
      if (btns.length) {
        routeData.btns = btns
      }
      routes.push(routeData)
      // 找到一个删除一次,减少查找时间
      sourceRoute.splice(parentIndex, 1)
    }
  }
  return routes
}

const actions = {
  generateRoutes ({ commit }, { roles, routes }) {
    return new Promise(resolve => {
      let accessedRoutes = []
      accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
      // 如果是管理身份不需要进行再次筛选
      // let userRoutes = accessedRoutes
      // if (!(roles.includes('admin') || roles.includes('customer'))) {
      const userRoutes = handleRoutes(accessedRoutes, routes)
      // }

      commit('SET_ROUTES', userRoutes)
      resolve(userRoutes)
    })
  },
  findPermissionBtns ({ commit }, path) {
    return new Promise(resolve => {
      const btns = findPermissionBtns(state.routes, path)
      commit('SET_PERMISSIONBTNS', btns)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

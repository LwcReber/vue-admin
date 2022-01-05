import store from '@/store'

// const ignoreRole = ['admin', 'customer'] // 超管不处理

// 页面权限控制
function checkPermission (el, binding) {
  const { value } = binding
  const roles = store.getters && store.getters.roles
  if (value && value instanceof Array) {
    if (value.length > 0) {
      const permissionRoles = value

      const hasPermission = roles.some(role => {
        return permissionRoles.includes(role)
      })

      if (!hasPermission) {
        el.parentNode && el.parentNode.removeChild(el)
      }
    }
  } else {
    throw new Error('need roles! Like v-permission="[\'admin\',\'editor\']"')
  }
}

const permission = {
  inserted (el, binding) {
    checkPermission(el, binding)
  },
  update (el, binding) {
    checkPermission(el, binding)
  }
}
// 按钮权限控制
function checkBtnPermission (el, binding) {
  const { value } = binding
  // const roles = store.getters && store.getters.roles
  const btns = store.getters && store.getters.permission_btns
  if (value) {
    // if ((roles.includes(ignoreRole[0]) || roles.includes(ignoreRole[1]))) {
    //   return
    // }
    // 从用户路由权限表中找出当前按钮的配置
    let hasPermission = false
    for (let index = 0; index < btns.length; index++) {
      const btn = btns[index]
      if (btn.path === value) {
        hasPermission = true
        break
      }
    }
    if (!hasPermission) {
      el.parentNode && el.parentNode.removeChild(el)
    }
  } else {
    throw new Error('need roles! Like v-permission="[\'admin\',\'editor\']"')
  }
}

const btnPermission = {
  inserted (el, binding) {
    checkBtnPermission(el, binding)
  },
  update (el, binding) {
    checkBtnPermission(el, binding)
  }
}

export {
  permission,
  btnPermission
}

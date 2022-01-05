// 页面按钮map表
const SYSTEM = {
  ACCOUNT: {
    LIST: '/system',
    ADD: '/system/account/btn/add',
    EDIT: '/system/account/btn/edit',
    CHECK: '/system/account/btn/check'
  }
}

const PERMISSION = {
  ROLE: {
    LIST: '/permission/role',
    ADD: '/permission/role/btn/add',
    EDIT: '/permission/role/btn/edit',
    DELETE: '/permission/role/btn/delete'
  }
}

export const PAGEBUTTON = {
  SYSTEM,
  PERMISSION
}

// 页面路由按钮列表
const SYSTEMBTN = {
  ACCOUNT: [
    { path: SYSTEM.ACCOUNT.LIST, title: '列表' },
    { path: SYSTEM.ACCOUNT.ADD, title: '新增' },
    { path: SYSTEM.ACCOUNT.EDIT, title: '编辑' }
  ]
}

const PERMISSIONBTN = {
  ROLE: [
    { path: PERMISSION.ROLE.LIST, title: '列表' },
    { path: PERMISSION.ROLE.ADD, title: '新增' },
    { path: PERMISSION.ROLE.EDIT, title: '编辑' },
    { path: PERMISSION.ROLE.DELETE, title: '删除' }
  ]
}

export {
  SYSTEMBTN,
  PERMISSIONBTN
}

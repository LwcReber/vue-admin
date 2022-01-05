// Just a mock data

const constantRoutes = [
  {
    path: '/redirect',
    component: 'layout/Layout',
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: 'views/redirect/index'
      }
    ]
  },
  {
    path: '/login',
    component: 'views/login/index',
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: 'views/login/auth-redirect',
    hidden: true
  },
  {
    path: '/404',
    component: 'views/error-page/404',
    hidden: true
  },
  {
    path: '/401',
    component: 'views/error-page/401',
    hidden: true
  },
  {
    path: '',
    component: 'layout/Layout',
    redirect: 'dashboard',
    children: [
      {
        path: 'dashboard',
        component: 'views/dashboard/index',
        name: 'Dashboard',
        meta: { title: 'Dashboard', icon: 'dashboard', affix: true }
      }
    ]
  },
  {
    path: '/documentation',
    component: 'layout/Layout',
    children: [
      {
        path: 'index',
        component: 'views/documentation/index',
        name: 'Documentation',
        meta: { title: 'Documentation', icon: 'documentation', affix: true }
      }
    ]
  }
]

const asyncRoutes = [
  {
    path: '/system',
    name: 'system',
    children: [
      {
        path: '/account',
        name: 'account',
        btns: [
          { path: '/system', title: '列表' },
          { path: '/system/account/btn/add', title: '新增' },
          { path: '/system/account/btn/edit', title: '编辑' }
          // { path: '/system/btn/modify', title: '修改' }
        ]
      }
    ]
  },
  {
    path: '/permission',
    children: [
      {
        path: '/permission/role',
        name: 'RolePermission',
        btns: [
          { path: '/permission/role', title: '列表' },
          { path: '/permission/role/btn/add', title: '新增' },
          // { path: '/page/btn/edit', title: '编辑' },
          { path: '/permission/role/btn/edit', title: '修改' }
        ]
      }
    ]
  }
]

module.exports = {
  constantRoutes,
  asyncRoutes
}

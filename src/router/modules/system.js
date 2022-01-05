/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'
import { SYSTEMBTN } from '../buttons'
const componentsRouter = {
  path: '/system',
  component: Layout,
  redirect: 'noRedirect',
  name: 'system',
  meta: {
    title: '系统设置',
    roles: ['admin']
  },
  children: [
    {
      path: '/account',
      component: () => import('@/views/system/account'),
      name: 'account',
      meta: { title: '账号管理' },
      btns: SYSTEMBTN.ACCOUNT
    }
  ]
}

export default componentsRouter

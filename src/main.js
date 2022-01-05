import Vue from 'vue'

import './element-ui' // element-ui 公共组件

import 'normalize.css/normalize.css' // a modern alternative to CSS resets
import i18n from './lang' // internationalization
import '@/styles/index.scss'
import App from './App'
import store from './store'
import router from './router'
import './icons' // icon
import './permission' // permission control
import './utils/error-log' // error log
import './globalCom'
import * as filters from './filters' // global css
import { permission, btnPermission } from '@/directive/permission/index.js' // 权限判断指令
/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
// if (process.env.NODE_ENV === 'production') {
const { mockXHR } = require('../mock')
mockXHR()
// }

Vue.directive('permission', permission) // 用户权限
Vue.directive('epermission', btnPermission) // 按钮权限

// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})
Vue.use(i18n)

Vue.config.productionTip = false

// eslint-disable-next-line no-new
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})

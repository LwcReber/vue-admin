import { permission, btnPermission } from './permission'

const install = function (Vue) {
  Vue.directive('permission', permission)
}

if (window.Vue) {
  window.permission = permission
  window.btnPermission = btnPermission
  Vue.use(install); // eslint-disable-line
}

permission.install = install
btnPermission.install = function (Vue) {
  Vue.directive('epermission', btnPermission)
}
export { permission, btnPermission }

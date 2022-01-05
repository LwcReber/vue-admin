const getters = {
  sidebar: state => state.app.sidebar,
  size: state => state.app.size,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  introduction: state => state.user.introduction,
  roles: state => state.user.roles,
  permission_routes: state => state.permission.routes,
  userRoutes: state => state.permission.userRoutes, // 用户的权限路由
  permission_btns: state => state.permission.btns, // 当前页面按钮权限
  errorLogs: state => state.errorLog.logs
}
export default getters

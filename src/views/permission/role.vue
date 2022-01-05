<template>
  <div class="app-container">
    <PcSearchForm
      :form-list="formList"
      :search-form="searchForm"
      :action-list="actionList"
      @request="requestTable('reset')"
    />

    <PcTable
      ref="table"
      :req-params="searchForm"
      :request-api="getRoles"
      :colum-list="columList"
    >
      <template v-slot:action="scope">
        <el-button
          v-epermission="$PAGEBUTTON.PERMISSION.ROLE.EDIT"
          type="primary"
          size="small"
          @click="handleEdit(scope)"
        >
          编辑
        </el-button>
        <el-button
          v-epermission="$PAGEBUTTON.PERMISSION.ROLE.DELETE"
          type="danger"
          size="small"
          @click="handleDelete(scope)"
        >
          删除
        </el-button>
      </template>
    </PcTable>
    <el-dialog
      :visible.sync="dialogVisible"
      :title="dialogType==='edit'?'编辑角色':'新增角色'"
    >
      <el-form
        :model="role"
        label-width="80px"
        label-position="left"
      >
        <el-form-item label="Name">
          <el-input
            v-model="role.name"
            placeholder="Role Name"
          />
        </el-form-item>
        <el-form-item label="Desc">
          <el-input
            v-model="role.description"
            :autosize="{ minRows: 2, maxRows: 4}"
            type="textarea"
            placeholder="Role Description"
          />
        </el-form-item>
        <el-form-item label="Menus">
          <el-tree
            ref="tree"
            default-expand-all
            :check-strictly="checkStrictly"
            :data="routesData"
            :props="defaultProps"
            show-checkbox
            node-key="path"
            class="permission-tree"
          />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button
          type="danger"
          @click="dialogVisible=false"
        >
          取消
        </el-button>
        <el-button
          type="primary"
          @click="confirmRole"
        >
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import path from 'path'
import { deepClone } from '@/utils'
import { getRoles, addRole, deleteRole, updateRole } from '@/api/role'
import { Tree } from 'element-ui'
const defaultRole = {
  key: '',
  name: '',
  description: '',
  routes: []
}

export default {
  components: { 'el-tree': Tree },
  data () {
    return {
      role: Object.assign({}, defaultRole),
      formList: [
        { label: '角色', prop: 'roleCode', placeholder: '请输入角色名称' }
      ],
      searchForm: {
        roleCode: ''
      },
      actionList: [
        { label: '添加角色', click: () => { this.handleAddRole() }, epermission: this.$PAGEBUTTON.PERMISSION.ROLE.ADD }
      ],
      columList: [
        { label: '角色', prop: 'key', minWidth: 120, fixed: 'left' },
        { label: '账号', prop: 'name', minWidth: 100 },
        { label: 'description', prop: 'description', minWidth: 150 }
      ],
      routes: [],
      rolesList: [],
      dialogVisible: false,
      dialogType: 'new',
      checkStrictly: false,
      defaultProps: {
        children: 'children',
        label: 'title'
      }
    }
  },
  computed: {
    routesData () {
      return this.routes
    }
  },
  created () {
    // Mock: get all routes and roles list from server
    this.getRoutes()
  },
  methods: {
    getRoles,
    async getRoutes () {
      // const res = await getRoutes()
      // this.serviceRoutes = res.data
      this.routes = this.generateRoutes(this.$store.getters.userRoutes)
    },
    requestTable (type) {
      console.log(type)
      this.$refs.table && this.$refs.table.requestData(type)
      console.log(this.searchForm)
    },

    // Reshape the routes structure so that it looks the same as the sidebar
    generateRoutes (routes, basePath = '/') {
      const res = []

      for (let route of routes) {
        // skip some route
        if (route.hidden) { continue }

        const onlyOneShowingChild = this.onlyOneShowingChild(route.children, route)

        if (route.children && onlyOneShowingChild && !route.alwaysShow) {
          route = onlyOneShowingChild
        }

        const data = {
          path: path.resolve(basePath, route.path),
          title: route.meta && route.meta.title
        }

        // recursive child routes
        if (route.children) {
          data.children = this.generateRoutes(route.children, data.path)
        }
        if (route.btns) {
          data.children = route.btns
        }
        res.push(data)
      }
      return res
    },
    generateArr (routes) {
      let data = []
      routes.forEach(route => {
        data.push(route)
        if (route.children) {
          const temp = this.generateArr(route.children)
          if (temp.length > 0) {
            data = [...data, ...temp]
          }
        }
      })
      return data
    },
    handleAddRole () {
      this.role = Object.assign({}, defaultRole)
      console.log(this.role)
      if (this.$refs.tree) {
        this.$refs.tree.setCheckedNodes([])
      }
      this.dialogType = 'new'
      this.dialogVisible = true
    },
    handleEdit (scope) {
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.checkStrictly = true
      this.role = deepClone(scope.row)
      this.$nextTick(() => {
        const routes = this.generateRoutes(this.role.routes)
        this.$refs.tree.setCheckedNodes(this.generateArr(routes))
        // set checked state of a node not affects its father and child nodes
        this.checkStrictly = false
      })
    },
    handleDelete ({ $index, row }) {
      this.$confirm('Confirm to remove the role?', 'Warning', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      })
        .then(async () => {
          await deleteRole(row.key)
          this.rolesList.splice($index, 1)
          this.$message({
            type: 'success',
            message: 'Delete succed!'
          })
        })
        .catch(err => { console.error(err) })
    },
    generateTree (routes, basePath = '/', checkedKeys) {
      const res = []

      for (const route of routes) {
        const routePath = path.resolve(basePath, route.path)

        // recursive child routes
        if (route.children) {
          route.children = this.generateTree(route.children, routePath, checkedKeys)
        }

        if (checkedKeys.includes(routePath) || (route.children && route.children.length >= 1)) {
          res.push(route)
        }
      }
      return res
    },
    async confirmRole () {
      const isEdit = this.dialogType === 'edit'

      const checkedKeys = this.$refs.tree.getCheckedKeys()
      this.role.routes = this.generateTree(deepClone(this.serviceRoutes), '/', checkedKeys)

      if (isEdit) {
        await updateRole(this.role.key, this.role)
        for (let index = 0; index < this.rolesList.length; index++) {
          if (this.rolesList[index].key === this.role.key) {
            this.rolesList.splice(index, 1, Object.assign({}, this.role))
            break
          }
        }
      } else {
        console.log(this.role)

        const { data } = await addRole(this.role)
        this.role.key = data.key
        this.rolesList.push(this.role)
      }

      const { description, key, name } = this.role
      this.dialogVisible = false
      this.$notify({
        title: 'Success',
        dangerouslyUseHTMLString: true,
        message: `
            <div>Role Key: ${key}</div>
            <div>Role Name: ${name}</div>
            <div>Description: ${description}</div>
          `,
        type: 'success'
      })
    },
    // reference: src/view/layout/components/Sidebar/SidebarItem.vue
    onlyOneShowingChild (children = [], parent) {
      let onlyOneChild = null
      const showingChildren = children.filter(item => !item.hidden)

      // When there is only one child route, the child route is displayed by default
      if (showingChildren.length === 1) {
        onlyOneChild = showingChildren[0]
        onlyOneChild.path = path.resolve(parent.path, onlyOneChild.path)
        return onlyOneChild
      }

      // Show parent if there are no child route to display
      if (showingChildren.length === 0) {
        onlyOneChild = { ...parent, path: '', noShowingChildren: true }
        return onlyOneChild
      }

      return false
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  .roles-table {
    margin-top: 30px;
  }
  .permission-tree {
    margin-bottom: 30px;
  }
}
</style>

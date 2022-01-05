<template>
  <div>
    <PcSearchForm
      :form-list="formList"
      :search-form="searchForm"
      :action-list="actionList"
      @request="requestTable('reset')"
    />

    <PcTable
      ref="table"
      :request-immediate="false"
      :req-params="searchForm"
      :request-api="getList"
      :colum-list="columList"
    >
      <template v-slot:enable="{row}">
        <template v-for="item in enableStatusAll">
          <el-tag v-if="item.value === row.enable" :key="item.value" :type="row.enable ? 'success' : 'danger'" :disable-transitions="true">
            {{ item.label }}
          </el-tag>
        </template>
      </template>
      <template v-slot:role="{row}">
        <template v-for="item in roleList">
          <el-tag v-if="item.value === row.roleCode" :key="item.value">
            {{ item.label }}
          </el-tag>
        </template>
      </template>

      <template
        v-slot:action="{row}"
      >
        <el-button v-epermission="$PAGEBUTTON.SYSTEM.ACCOUNT.EDIT" type="primary" @click="edit(row)">
          编辑
        </el-button>
        <el-button v-epermission="$PAGEBUTTON.SYSTEM.ACCOUNT.CHECK" @click="check(row)">
          查看
        </el-button>
      </template>
    </PcTable>
    <AddEdit
      :disabled="addEditObj.mode === 'check'"
      :mode="addEditObj.mode"
      :data="addEditObj.data"
      :title="dialogTitle[addEditObj.mode]"
      :visible.sync="addEditObj.visible"
      @submit="requestTable"
    />
  </div>
</template>

<script>
import { roleList } from './config'
import { enableStatusAll } from '@/config'
import { getList } from '@/api/systerm/account'
import AddEdit from './components/AddEditDialog'
import { createTime } from '@/components/PcTable/comColum'
export default {
  components: { AddEdit },
  data () {
    return {
      roleList,
      enableStatusAll,
      getList,
      dialogTitle: { add: '新增账号', edit: '编辑账号', check: '查看' },
      addEditObj: {
        data: {},
        visible: false,
        mode: 'add'
      },
      searchForm: {
        enable: '', roleCode: '', name: '', phone: ''
      },
      formList: [
        { label: '状态', prop: 'enable', sources: enableStatusAll, type: 'select' },
        { label: '角色', prop: 'roleCode', sources: roleList, type: 'select' },
        { label: '账号', prop: 'name' }
      ],
      actionList: [
        { label: '新增账号', click: () => { this.addNew() }, epermission: this.$PAGEBUTTON.SYSTEM.ACCOUNT.ADD }
      ],
      columList: [
        { label: '账号', prop: 'userId', minWidth: 120, fixed: 'left' },
        { label: '账号', prop: 'name', minWidth: 100 },
        { label: '角色', prop: 'role', minWidth: 100 },
        {
          label: '状态',
          prop: 'enable',
          minWidth: 100
        },
        createTime
      ]
    }
  },
  methods: {
    edit (data) {
      this.addEditObj.data = data
      this.addEditObj.visible = true
      this.addEditObj.mode = 'edit'
      console.log('edit')
    },
    check (data) {
      this.addEditObj.data = data
      this.addEditObj.visible = true
      this.addEditObj.mode = 'check'
      console.log('CHECK')
    },
    addNew () {
      this.addEditObj.visible = true
      this.addEditObj.mode = 'add'
      console.log('newnew')
    },
    requestTable (type) {
      console.log(type)
      this.$refs.table && this.$refs.table.requestData(type)
      console.log(this.searchForm)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>

<template>
  <div>
    <el-table
      v-loading="loading"
      v-bind="$attrs"
      :data="tableList"
      :size="tableSize"
      border
      @selection-change="handleSelectionChange"
    >
      <!-- 添加expand 类型 -->
      <el-table-column
        v-if="selection"
        type="selection"
        :fixed="true"
        width="40"
        :resizable="false"
        header-align="center"
        align="center"
      />

      <el-table-column
        v-if="typeIndex"
        type="index"
        label="编号"
        :fixed="true"
        width="80"
        header-align="center"
        align="center"
      />
      <!-- permission 权限控制 -->
      <template v-for="item in columList">
        <el-table-column
          v-if="item.permission ? checkPermission(item.permission) : true"
          :key="item.prop"
          :label="item.label"
          :width="item.width"
          :min-width="item.minWidth"
          :prop="item.prop"
          :fixed="item.fixed"
          :type="item.type"
          :align="item.align || 'center'"
          :sortable="item.sortable"
        >
          <template
            slot="header"
          >
            <slot :name="'header-' + item.prop"></slot>
          </template>
          <template slot-scope="scope">
            <table-expand
              v-if="item.render"
              :row="scope.row"
              :column="item"
              :render="item.render"
            />
            <slot v-else :name="item.prop" :row="scope.row" :column="{...scope.column, prop: item.prop}" :index="scope['$index']">
              <span>{{ scope.row[item.prop] }}</span>
            </slot>
          </template>
        </el-table-column>
      </template>

      <!-- 最后一次操作人，操作时间 -->
      <template v-if="lastModifyColu">
        <template v-for="item in lastModifyList">
          <el-table-column
            v-if="item.permission ? checkPermission(item.permission) : true"
            :key="item.prop"
            eslint-disable-next-line
            :label="item.label"
            :width="item.width"
            :min-width="item.minWidth"
            :prop="item.prop"
            :fixed="item.fixed"
            :type="item.type"
            :align="item.align || 'center'"
          >
            <template slot-scope="scope">
              <table-expand
                v-if="item.render"
                :row="scope.row"
                :column="item"
                :render="item.render"
              />
              <slot v-else :row="scope.row" :column="{...scope.column, prop: item.prop}" :index="scope['$index']">
                <span>{{ scope.row[item.prop] }}</span>
              </slot>
            </template>
          </el-table-column>
        </template>
      </template>

      <!-- 操作按钮区写法自定义 -->
      <el-table-column
        v-if="actionPermission.length ? checkPermission(actionPermission) : showActionColu"
        label="操作"
        fixed="right"
        :width="actionWidth || 180"
        header-align="center"
        align="center"
      >
        <template slot-scope="scope">
          <slot name="action" :row="scope.row" :column="scope.column" :index="scope['$index']">
          </slot>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-if="!hidePagination"
      class="pagination"
      :current-page="pageIndex"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :hide-on-single-page="!total"
      layout="prev, pager, next, jumper, total, sizes"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
import { Table, Pagination, TableColumn } from 'element-ui'
import TableExpand from './expand'
import { lastModifyList } from './comColum'
import checkPermission from '@/utils/permission'
const noop = () => []
export default {
  components: { 'el-table': Table, 'el-pagination': Pagination, 'el-table-column': TableColumn, TableExpand },
  props: {
    'request-immediate': {
      type: Boolean, // 页面加载完成是否立即执行加载方法
      default: true
    },
    lastModifyColu: {
      type: Boolean, // 最后一次操作人
      default: true
    },
    actionWidth: {
      type: Number,
      default: 180
    },
    requestApi: { // 接口请求配置，从api文件夹中导入，再传入
      type: Function,
      default: () => {}
    },
    showActionColu: {
      type: Boolean,
      default: true // 是否显示操作栏
    },
    columList: { // 表格配置数据
      // {label: '', prop: '', width: 100, minWidth: 100, type: '', align: '' }
      type: Array,
      required: true,
      default: noop
    },
    typeIndex: Boolean, // 是否需要显示编号
    reqParams: { // 请求参数
      type: Object,
      default: () => {}
    },
    tableSize: { // 表格 size
      type: String,
      default: 'small'
    },
    actionPermission: {
      type: Array,
      default: () => []
    },
    handleData: { // 处理响应数据
      type: Function,
      default: null
    },
    selection: Boolean, // 多选
    hidePagination: Boolean // 是否需要分页
  },
  data () {
    return {
      lastModifyList,
      loading: false,
      total: 0,
      pageIndex: 1,
      pageSize: 10,
      tableList: []
    }
  },
  mounted () {
    // 初始化完成是否默认请求请求数据
    if (this.requestImmediate) {
      this.request()
    }
  },
  methods: {
    checkPermission,
    async request () {
      if (!this.requestApi) return
      this.loading = true
      this.$nextTick(async () => {
        const res = await this.requestApi({
          pageNo: this.pageIndex,
          pageSize: this.pageSize,
          ...this.reqParams
        }).catch((err) => {
          this.loading = false
          console.log('table', err)
        })
        if (res) {
          const { data } = res
          console.log(data)
          if (data && data.data) {
            // 自定义处理列表数据
            if (this.handleData) {
              this.tableList = this.handleData(data.data)
            } else {
              this.tableList = data.data || []
            }
            this.total = data.total
          } else {
            this.tableList = []
            this.total = 0 // 没有返回data字段时，分页总数也清空
          }
        }
        this.loading = false
      })
    },
    // 搜索form请求时，分页从第一页开始请求数据
    resetRequest () {
      this.pageIndex = 1
      this.request()
    },
    requestData (type) {
      if (type === 'reset') {
        this.resetRequest()
      } else {
        this.request()
      }
    },
    handleSelectionChange (arr) {
      this.$emit('selection-change', arr)
      this.$emit('update:selectItems', arr) // 更新上面组件的绑定的props
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.resetRequest()
    },
    handleCurrentChange (val) {
      this.pageIndex = val
      this.request()
    }
  }
}
</script>

<style lang="scss" scoped>
  .pagination {
    margin-top: 20px;
    text-align: center;
    ::v-deep {
      .el-pagination__total {
        margin-left: 24px;
      }
    }
  }
</style>

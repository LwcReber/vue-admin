<template>
  <el-form
    ref="searchForm"
    class="table-search-form"
    :model="searchForm"
    label-suffix=":"
  >
    <el-form-item
      v-for="item in formList"
      v-if="item.permission ? checkPermission(item.permission) : true"
      :key="item.prop"
      :prop="item.prop"
      :label="item.label"
    >
      <slot :row="item">
        <template>
          <el-Input
            v-if="item.type ? item.type === 'input' : 'input'"
            v-model="searchForm[item.prop]"
            :type="item.itype"
            :maxlength="item.maxlength"
            :size="item.size || 'mini'"
            :clearable="item.hasOwnProperty('clearable') ? item.clearable : true"
            :placeholder="item.placeholder || `请输入${item.label}` "
            :style="{width: calcWidth(item.width) || '160px' }"
          />
          <el-select
            v-else-if="item.type === 'select'"
            v-model="searchForm[item.prop]"
            :size="item.size || 'mini'"
            :clearable="item.clearable"
            :placeholder="item.placeholder"
            :style="{width: calcWidth(item.width) || '160px' }"
          >
            <el-option
              v-for="sitem in item.sources"
              :key="sitem.value"
              :label="sitem.label"
              :value="sitem.value"
            />
          </el-select>

          <el-date-picker
            v-else-if="item.type === 'date'"
            v-model="searchForm[item.prop]"
            :style="{width: item.width ? calcWidth(item.width) : item.itype === 'daterange' ? '280px' : '360px'}"
            :size="item.size || 'mini'"
            :type="item.itype || 'daterange'"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </template>
      </slot>
    </el-form-item>

    <el-form-item>
      <el-button
        size="mini"
        type="primary"
        icon="search"
        @click="search"
      >
        搜索
      </el-button>
      <el-button
        size="mini"
        @click="reset"
      >
        重置
      </el-button>
      <el-button
        v-for="item in actionList"
        v-if="item.permission ? checkPermission(item.permission) : item.epermission ?  checkBtnPermission(item.epermission) : true"
        :key="item.label"
        size="mini"
        :type="item.type || 'primary'"
        @click="item.click"
      >
        {{ item.label }}
      </el-button>
    </el-form-item>
    <slot name="after"></slot>
  </el-form>
</template>

<script>
import { DatePicker } from 'element-ui'
import checkPermission, {checkBtnPermission} from '@/utils/permission'

export default {
  name: 'PcSearchForm',
  components: { 'el-date-picker': DatePicker },
  props: {
    request: { // 搜索请求
      type: Function,
      default: () => {}
    },
    searchForm: { // 绑定的值
      type: Object,
      required: true,
      default: () => {}
    },
    formList: { // 表单配置表   [{prop:'', type: '', sources: 'select类型的数据源' size: '', placeholder: '', width:'100px'}, {prop:'', render: ''}]
      type: Array,
      required: true
    },
    actionList: { // 按钮操作区  {label: '', click: () => {console.log('点击')}}
      type: Array,
      default: () => []
    }
  },
  methods: {
    calcWidth (width) {
      return typeof width === 'number' ? (width + 'px') : width
    },
    checkBtnPermission,
    checkPermission,
    search () {
      this.$emit('request')
    },
    reset () {
      // 重置表单
      this.$refs.searchForm.resetFields()
       this.$emit('request')
    }
  }
}
</script>

<style lang="scss" scoped>
  .table-search-form {
    margin-bottom: 10px;
  }
</style>

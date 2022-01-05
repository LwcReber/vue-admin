# Vue-element-admin
基于Vue-element-admin改造，封装了页面搜索和表格组件，开发页面配置化，简单高效 

权限管理，可自定义用户角色类型，与vue-element-admin的保持一致，也可以支持自定义角色，对角色编辑权限菜单进行控制。同时精确到了按钮级别的权限管理
## 如何修改主题色

目前项目是按需引入element-ui的组件

1 首先保证node环境是12以下

2 通过命令  `./nodemodules/.bin/et -i `重新生成样式变量文件 （官方的做法）

3 修改样式文件后命令执行 `./nodemodules/.bin/et` 构建theme主题文件，放到src目录下



## 表格页面组件使用说明

### PcSearchForm 页面搜索组件

```vue
<PcSearchForm
  :form-list="formList"
  :search-form="searchForm"
  :action-list="actionList"
  @request="requestTable('reset')"
/>
```

form-list: form表单搜索条件项

每项参数说明：  [{prop:'当前项的prop，对应form的prop', type: 'input|select|date|daterange', sources: 'select类型的数据源' size: '', placeholder: '', width:'100px'}]

配置了常用的搜索项，

type：默认是input类型

sources: select 类型的下拉数据，必须是[{ label: 'xxx', value: 'xxx' }] 数据类型

如：

```
 formList: [
 		{ label: '名称', prop: 'name' },
 		{ label: '编号', prop: 'code', width: '200px' },
 		{ label: '类型', prop: 'type', sources: typeStatusAll, type: 'select' },
 		{ label: '模式', prop: 'mode', sources: modesList, type: 'select' }
 ]
```

对于无法满足的类型，可以在写好formList后，在页面上进行自定义form-item选项

```vue
 <PcSearchForm
   :form-list="formList"
   :search-form="searchForm"
   :action-list="actionList"
   @request="requestTable('reset')"
 >
    <template v-slot:test="{row}">
	  <!-- row 是tabled的每一条数据 -->
      <el-input v-model="searchForm.test"></el-input>
    </template>
    <template v-slot:test2="{row}">
       <el-input v-model="searchForm.test2"></el-input>
    </template>
 </PcSearchForm>

data () {
	return {
		searchForm: {
       prop1: '', test: ''
    },
		formList: [
			{ label: 'Label1', prop: 'prop1' }
			{ label: 'testLabel', prop: 'test' }
		]
	}
}
```

search-form： 搜索form表单的mode，保存所有项的值

action-list：在搜索最后提供按钮进行操作，页面自带了搜索，重置按钮，这两个按钮点击时会触发request事件，无需添加， 如：

```js
actionList: [
  { label: '导出', click: () => { this.exportExcel() } },
  { label: '新增', click: () => { this.add() } }
]
```

对于不是按钮类型的操作，提供了别名插槽after，可以自定义内容



### PcTable table组件

```vue
<PcTable
   ref="table"
   :req-params="reqData"
   :request-api="getList"
   :colum-list="columList"
 >
   <template #action="{row}">
     <!-- 自定义的表格项渲染 -->
     <el-button type="primary" @click="edit(row)">
     	编辑
     </el-button>
   </template>
 </PcTable>
```

| prop        | 说明                                      |                                                           |
| ----------- | ----------------------------------------- | --------------------------------------------------------- |
| req-params  | 接口请求数据                              |                                                           |
| request-api | axios封装后的接口api函数                  |                                                           |
| colum-list  | 表格项，大部分参数对标Table-column 的prop | {label: '', prop: '',minWidth: 100, type: '', align: '' } |

同时支持表格项在colum-list中写render函数，与iview的写法一样

表格请求方法，type： 'reset' : 页码重置到第一页，不传择继续使用当前的页码

this.$refs.table && this.$refs.table.requestData(type)


## 按钮级别的权限
 在router中的buttons文件编写对应的按钮map变量，赋值给对应route的btns变量，在页面上通过`v-epermission`指令添加到对应的元素上，对于PcSearchForm的actionList按钮可以添加epermission变量进行控制，用法与`v-epermission`一样

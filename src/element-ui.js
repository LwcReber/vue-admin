
import Vue from 'vue'

import {
  Button,
  Select,
  Option,
  Input,
  Tag,
  Table,
  TableColumn,
  Dialog,
  Form,
  FormItem,
  Loading,
  MessageBox,
  Message,
  Notification,
  Image
} from 'element-ui'

const comList = [
  Button,
  Select,
  Option,
  Input,
  Tag,
  Table,
  TableColumn,
  Dialog,
  Form,
  FormItem,
  Image
]

comList.map((item) => {
  Vue.component(item.name, item)
})

const MessageSingle = (...args) => {
  Message.closeAll()
  Message(...args)
}

Vue.use(Loading.directive)
Vue.prototype.$loading = Loading.service
Vue.prototype.$msgbox = MessageBox
Vue.prototype.$alert = MessageBox.alert
Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$prompt = MessageBox.prompt
Vue.prototype.$notify = Notification
Vue.prototype.$message = MessageSingle

Vue.prototype.$ELEMENT = { size: 'small', zIndex: 3000 }

export {
  MessageSingle
}

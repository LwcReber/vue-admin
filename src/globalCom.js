// 全局组件引入

import Vue from 'vue'
import PcTable from '@/components/PcTable'
import PcSearchForm from '@/components/PcSearchForm'
import hevueImgPreview from 'hevue-img-preview'
// 按钮map全局配置
import { PAGEBUTTON } from '@/router/buttons'

Vue.use(hevueImgPreview, { clickMaskCLose: true })
Vue.prototype.$previewImg = Vue.prototype.$hevueImgPreview
Vue.prototype.$PAGEBUTTON = PAGEBUTTON

Vue.component('PcTable', PcTable)
Vue.component('PcSearchForm', PcSearchForm)

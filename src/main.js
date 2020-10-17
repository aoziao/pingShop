import Vue from 'vue'
import App from './App.vue'
import router from './router'
// ElementUI按需所求
import './plugins/element.js'
// 导入全局样式
import './assets/css/globalCss.css'
// 导入图标
import './assets/fonts/iconfont.css'
// 导入table-tree
import TreeTable from 'vue-table-with-tree-grid'
// 导入moment.js
import Moment from 'moment'
// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// 导入富文本编辑器样式
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme

// 导入axios
import { axios } from './plugins/axios' // 设置语言 或 moment.lang('zh-cn')

Moment.locale('zh-cn')// 设置语言 或 moment.lang('zh-cn');
// 定义时间过滤器函数
Vue.filter('dataFormat', (value, arg) => {
  return Moment(value).format(arg)
})

Vue.use(VueQuillEditor)

Vue.prototype.$http = axios

Vue.config.productionTip = false

Vue.component('tree-table', TreeTable)
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

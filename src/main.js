// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import '@/assets/css/style.css'
import App from './App'
import router from './router'
import http from '@/plugins/http'
import comBreadcrumb from '@/components/common/cusBreadcrumb'


// 安装插件
Vue.use(ElementUI)
Vue.use(http)
Vue.use(require('vue-moment'));

// 定义全局组件
Vue.component('comBreadcrumb', comBreadcrumb)

// 是否是生产环境（false 开发环境 项目输出会更多）
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: {
    App
  },
  template: '<App/>'
})

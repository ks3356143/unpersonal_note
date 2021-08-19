import Vue from 'vue'
import App from './App'
import router from './router' //如果导入是文件夹，会自动导入index.js（语法）

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})

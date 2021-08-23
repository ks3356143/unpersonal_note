import Vue from 'vue'
import App from '@/App'
import router from '@/router'
import store from '@/store/index.js'
import axios from 'axios'

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})

axios({
  url:'http://127.0.0.1/home',
  params:{
    name:"chen",
  }
})

//axios发送并发请求
axios.all([axios({
  url:'',
  params:{}
}),axios({
  url:'',
  params:{
    type:'sell',
    page:5
  },
})]).then(res => {
  //统一处理结果
  console.log(res);
})

axios.all([axios({
  url:'',
  params:{}
}),axios({
  url:'',
  params:{
    type:'sell',
    page:5
  },
})]).then(axios.spread((res1,res2)=>{
  console.log("分离成功");
}))

//axios中的default,配置立即生效
axios.defaults.baseURL = 'http://120.0.0.1:8000'
axios.defaults.timeout = 5000
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'

import { request } from '@/network/request.js'

request({
  url:'/home'
},res=>{
  console.log(res);
},err=>{
  console.log(err);
})

//常见配置选项
request({
  baseConfig:{
    
  },
  success:function(res){

  },
  failure:function(err){

  }
})

//还不是最终方式
request({
  url:"/home/multidata"
}).then(res=>{
  console.log(res);
}).catch(err=>{
  console.log(err);
})


import VueRouter from 'vue-router'
import Vue from 'vue'
//第一步通过Vue.use（这是插件），来安装这个插件，而不是在webpack插入，因为是运行时
Vue.use(VueRouter)

import Home from '../components/home'
import about from '../components/about'

const routes = [
    {
        path:'',
        redirect:Home
    },
    {
        path:"/home",
        component:Home
    },
    {
        path:"/about",
        component:about
    },
]

const router = new VueRouter({
    routes,
    mode: 'history', //这是个类对象，需要小括号
    linkActiveClass:"active"
})

export default router
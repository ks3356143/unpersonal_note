import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
//懒加载组件
const Home = () => import('../views/home/home.vue')
const Category = () => import('../views/category/category.vue')
const Shortcut = () => import('../views/shortcut/shortcut.vue')
const Profile = () => import('../views/profile/profile.vue')

//路由对象为下
const routes = [
  {
    path:'',
    redirect:'/home'
  },
  {
    path:'/home',
    component:Home
  },
  {
    path:'/category',
    component:Category
  },
  {
    path:'/shortcut',
    component:Shortcut
  },
  {
    path:'/profile',
    component:Profile
  },
]

export default new Router({
  routes,
  mode: 'history',
})
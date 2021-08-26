import { createRouter, createWebHistory } from 'vue-router'

const Home = () => import('views/home/home.vue')
const Category = () => import('views/category/category.vue')
const Shortcut = () => import('views/shortcut/shortcut.vue')
const Profile = () => import('views/profile/profile.vue')

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

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router

import VueRouter from 'vue-router'
import Vue from 'vue'
//第一步通过Vue.use（这是插件），来安装这个插件，而不是在webpack插入，因为是运行时
Vue.use(VueRouter)

// import Home from '../components/home.vue'
// import About from '../components/about'
// import User from '../components/user' 已经改懒加载
const Home = () => import('../components/home.vue')
const Homenews = () => import('../components/homenews')
const homemessages = () => import('../components/homemessages')

const About = () => import('../components/about.vue')
const User = () => import('../components/user.vue')
const Profile = () => import('../components/profile.vue')

const routes = [
    {
        path:"/",
        redirect:'/home',
    },
    {
        path:"/home",
        component:Home,
        meta:{
            title:'首页'
        },
        children:[
            // {
            //     path:"",
            //     redirect:'news',
            // },
            {
                path:'news',
                component:Homenews,
                meta:{
                    title:"首页-新闻"
                },
                name:"Mine"
            },
            {
                path:"messages",
                component:homemessages,
                meta:{
                    title:"首页-消息"
                }
            },
        ]
    },
    {
        path:"/about",
        component:About,
        meta:{
            title:"关于"
        }
    },
    {
        path:'/user/:userId',//注意冒号后是参数，其他文件可以通过$route.param.userID拿到参数
        component:User,
        meta:{
            title:"用户界面"
        }
    },
    {
        path:'/profile',
        component:Profile,
        meta:{
            title:"我的"
        }
    },
]

const router = new VueRouter({
    routes:routes,
    mode: 'history', //这是个类对象，需要小括号
    // linkActiveClass:"active"
})


router.beforeEach((to,from,next)=>{
    next()
    console.log("运行了前置钩子，也是导航首位函数");
    document.title = to.meta.title
    if(from.name === "Mine"){
        console.log("next函数起作用了");
    }
})

router.afterEach((to,from) => {
    console.log('运行了后置钩子，也是后首位')
})


export default router
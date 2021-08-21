import Vue from 'vue'
import Vuex from 'vuex'


//1.安装插件
Vue.use(Vuex) //会去执行该插件的install方法

//2.创建对象,创建其属性store
import { INCREMENT } from "@/store/multation-types.js";

const moduleA = {
    state: () => ({
        name:"张三-我是store子模块"
     }),
    mutations: { 
        updatename(state,payload){
            state.name = payload
        },
     },
    actions: {  },
    getters: { 
        fullname(state){
            return state.name + "11111"
        },
        fullname2(state,getters)
     }
  }

const store =  new Vuex.Store({
    state:{//保存状态的
        counter:1,
        students:[
            {id:111,name:"chen",age:18},
            {id:112,name:"chen1",age:18},
            {id:113,name:"chen2",age:22},
            {id:114,name:"chen3",age:33},
            {id:115,name:"chen4",age:18},
            {id:116,name:"chen5",age:22},
            {id:117,name:"chen6",age:18},
        ],
        info:{
            name:1
        }
    },
    mutations:{//定义方法,方法自动传参state，对应上面的state对象
        [INCREMENT](state){
            state.counter++
        },
        decrement(state){
            state.counter--
        },
        incrementCount(state,payload){//注意这个payload
            console.log(payload);
            state.counter += payload.count
        },
        addstudent(state,stu){
            state.students.push(stu);
            Vue.set(state.info,"AAA","什么属性值")
        },
        UpdateInfo(state){
            state.info.name = "陈俊亦"
        }
    },
    getters:{
        powerCounter(state){
            return state.counter * state.counter 
        },
        selectstudent(state){
            let student = []
            for(let i of state.students){
                if(i.age >= 20)
                student.push(i.name)
            }
            return student
        },
        more20age(state){
            return state.students.filter(s => s.age >= 20)
        },
        more20age1(state,getters){
            return getters.more20age.length
        },
        moreAgestu(state){
            return (age) => {
                return state.students.filter(s => s.age >= age)
            }
        },
    },
    actions:{
        aUpadteinfo(context,payload){//这里context相当于上下文，store对象
            return new Promise((resolve,reject)=>{
                setTimeout(()=>{
                    context.commit("UpdateInfo") 
                    console.log(payload)
                    resolve("完成了")
                },3000)
            })
        },
    },
    modules: {

        a:{
            state:{
                name:"zhangsan"
            }
        },
        b:moduleA
    },
})



export default store
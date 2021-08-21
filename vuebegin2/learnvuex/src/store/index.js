import Vue from 'vue'
import Vuex from 'vuex'


//1.安装插件
Vue.use(Vuex) //会去执行该插件的install方法

//2.创建对象,创建其属性store
const state = {
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
}

import mutations from 'store/mutation.js';
import getters from 'store/getters'
import actions from 'store/actions'
import moduleA from 'store/modules/moduleA';

const store =  new Vuex.Store({
    state,
    mutations,
    getters,
    actions,
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
import Vue from 'vue'
import Vuex from 'vuex'


//1.安装插件
Vue.use(Vuex) //会去执行该插件的install方法

//2.创建对象,创建其属性store
export default new Vuex.Store({
    state:{//保存状态的
        counter:1
    },
    mutations:{//定义方法,方法自动传参state，对应上面的state对象
        increment(state){
            state.counter++
        },
        decrement(state){
            state.counter--
        },
    },
    getters:{

    },
    modules:{

    },
})
import { INCREMENT } from "@/store/multation-types.js";

export default {//定义方法,方法自动传参state，对应上面的state对象
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
}
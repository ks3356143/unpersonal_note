export default {
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
        fullname2(state,getters){
            
        }
     }
  }
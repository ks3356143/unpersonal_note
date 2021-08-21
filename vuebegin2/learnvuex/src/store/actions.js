export default {
    aUpadteinfo(context,payload){//这里context相当于上下文，store对象
        return new Promise((resolve,reject)=>{
            setTimeout(()=>{
                context.commit("UpdateInfo") 
                console.log(payload)
                resolve("完成了")
            },3000)
        })
    },
}
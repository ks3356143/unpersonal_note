//导出多个实例不用default
import axios from 'axios'
//让别人传一个函数success和failure
export function request(config){
    const instance1 = axios.create({
        baseURL:'http://217.0.0.1:8000',
        timeout:5000
    })
    //axios拦截器,我已经把它拦截了,所以要原封不动返回过去
    axios.interceptors.request.use(config => {
        console.log(config);
        return config
    },err=>{
        console.log(err);
    })

    axios.interceptors.response.use()
    

    return instance1(config)//axios已经把Promise包装好了
}
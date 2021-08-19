<template>
    <div>
        <h2>我是首页</h2>
        <p>首页内容</p>
        <router-link to="/home/news" tag="button">新闻</router-link>
        <router-link to="/home/messages" tag="button">消息</router-link>
        <router-view></router-view>
    </div>
</template>

<script>
export default {
    name:"home",
    created(){
        console.log("创建首页了");
        // this.$router.replace({path:"/home/news",query:{
        //     name:"chenjunyi"
        // }})
    },
    destroyed() {
        
    },
    activated() {
        console.log(this.path);
        this.$router.push(this.path)
    },
    deactivated() {
        
    },
    beforeRouteLeave (to, from, next) {
        this.path = this.$route.path
        console.log(this.path);
        next()
    },
    data(){
        return {
            path:'/home/news'
        }
    }
    
}
</script>

<style>

</style>
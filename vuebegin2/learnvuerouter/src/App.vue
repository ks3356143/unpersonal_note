<template>
  <div id="app">
    <h2>我是APP组件</h2>
    <router-link to="/home" tag="button" active-class="active">首页</router-link>
    <router-link to="/about" tag="button" active-class="active">关于</router-link>
    <router-link v-bind:to="'/user/' + userID" tag="button" active-class="active">用户界面</router-link>
    <!-- <router-link to="/profile" tag="button" active-class="active">我的</router-link> -->
    <router-link :to="{path:'/profile',query:{name:'chenjunyi',age:18,height:1.88}}" tag="button" active-class="active">我的</router-link>
   <br>
    <button @click="homeclick">首页</button>
    <button @click="aboutclick">关于</button>
    <button @click="profileclick">我的</button>
    <keep-alive exclude="profile">
        <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
export default {
  name: 'App',
  data(){
    return{
      userID:"zhangsan",
      path:'/home/news'
    }
  },
  methods: {
    homeclick(){
      console.log("点击了home");
      this.$router.replace("/home")
    },
    aboutclick(){
      console.log("点击了about");
      this.$router.replace("/about")
    },
    profileclick(){
      this.$router.replace({
        path:"/profile",
        query:{
          name:'kobe',
          age:19,
          height:1.90
        }
      })
    }
  },
}
</script>

<style>
.active{
  color: red;
}
</style>

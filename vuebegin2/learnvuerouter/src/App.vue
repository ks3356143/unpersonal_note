<template>
  <div id="app">
    <h2>我是APP组件</h2>
    <!-- <router-link to="/home" tag="button">首页</router-link>
    <router-link to="/about" tag="button">关于</router-link>
    <router-view></router-view> -->
    <button @click="homeclick">首页</button>
    <button @click="aboutclick">关于</button>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App',
  methods: {
    homeclick(){
      console.log("点击了home");
      this.$router.push("/home")
    },
    aboutclick(){
      console.log("点击了about");
      this.$router.push("/about")
    }
  },
}
</script>

<style>
.active{
  color: red;
}
</style>

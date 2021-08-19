<template>
  <div>
      <h2>用户界面</h2>
      <p>我是用户相关信息，呵呵呵</p>
      <h2>{{userId}}</h2>
      <button @click="btnclick">按钮</button>
  </div>
</template>

<script>
export default {
    name:"user",
    // created(){
    //     document.title = "用户界面"
    // },
    computed:{
        userId(){
            return this.$route.params.userId
        }
    },
    methods: {
        btnclick(){
            console.log(this.$router);
            console.log(this.$route);
        }
    },
}
</script>

<style>

</style>
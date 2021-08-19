<template>
  <div>
      <h2>我是profile</h2>
      <h2>{{$route.query.name}}</h2>
      <h2>{{$route.query}}</h2>
  </div>
</template>

<script>
export default {
    name:"profile",
    // created(){
    //     document.title = "我的"
    // },
    mounted() {
        //在挂载到DOM上后
        console.log("狗子函数mount")
    },
    updated(){
        console.log("狗子函数updated")
    }
}
</script>

<style>

</style>
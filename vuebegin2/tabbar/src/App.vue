<template>
  <!-- 所有item都展示这个文字图片 -->
  <div id="app">
    <router-view></router-view>
    <maintabbar></maintabbar>
  </div>
</template>

<script>
import maintabbar from "@/components/maintabbar.vue";

export default {
  name: "App",
  components: {
    maintabbar,
  },
};
</script>

<style>
@import "assets/css/base.css";
</style>

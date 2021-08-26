<template>
  <router-view></router-view>
  <maintabbar></maintabbar>
</template>

<script>
import maintabbar from "@/components/content/maintabbar.vue";
export default {
  name: "app",
  components: {
    maintabbar,
  },
};
</script>

<style>
@import "~assets/css/base.css";
</style>

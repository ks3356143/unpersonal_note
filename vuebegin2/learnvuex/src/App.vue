<template>
  <div id="app">
    <h2>计数为：{{ $store.state.counter }}</h2>
    <button @click="addition">+</button>
    <button @click="subtraction">-</button>
    <hellowvuex />
  </div>
</template>

<script>
import hellowvuex from "@/components/hellowvuex.vue";

export default {
  name: "App",
  data() {
    return {
      message: "我是App组件",
    };
  },
  components: {
    hellowvuex,
  },
  methods: {
    addition() {
      this.$store.commit("increment"); //commit方法后跟着multate的方法名字
    },
    subtraction() {
      this.$store.commit("decrement");
    },
  },
};
</script>

<style></style>

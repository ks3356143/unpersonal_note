<template>
  <div id="app">
    <h2>~~~~~~~~~~~~~App内容~~~~~~~~~~~</h2>
    <h2>计数为：{{ $store.state.counter }}</h2>
    <button @click="addition">+</button>
    <button @click="subtraction">-</button>
    <button @click="addCount(5)">+5</button>
    <button @click="addCount(10)">+10</button>
    <button @click="addStudent">添加学生</button>
    <h2>~~~~~~~~~~~~~hellovuex组件显示内容~~~~~~~~~~~~~~~~</h2>
    <hellowvuex />
    <h2>~~~~~~~~~~~~~getter的获取~~~~~~~~~~~~~~~~~~~~~~~</h2>
    <h2>getter获取平方{{ $store.getters.powerCounter }}</h2>
    <h2>获取年龄大于20岁的学生{{ $store.getters.selectstudent }}</h2>
    <h2>App.vue界面获取{{ $store.getters.more20age }}</h2>
    <h2>App.vue界面获取大于20岁个数{{ $store.getters.more20age1 }}</h2>
    <h2>App.vue外部传来的学生age，然后大于他：{{ $store.getters.moreAgestu(100) }}</h2>
    <h2>{{ $store.state.info.name }}</h2>
    <button @click="nameclick">点击添加陈俊亦</button>
  </div>
</template>

<script>
import hellowvuex from "@/components/hellowvuex.vue";
import { INCREMENT } from "@/store/multation-types.js";

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
      this.$store.commit(INCREMENT); //commit方法后跟着multate的方法名字
    },
    subtraction() {
      this.$store.commit("decrement");
    },
    addCount(count) {
      //普通提交风格
      // this.$store.commit("incrementCount", count);
      //另一个提交风格，官方推荐风格
      this.$store.commit({
        type: "incrementCount",
        count: count,
      });
    },
    addStudent() {
      const stu = { id: 101, name: "alan", age: "189" };
      this.$store.commit("addstudent", stu);
    },
    nameclick() {
      this.$store.dispatch("aUpadteinfo", "我是携带信息").then((res) => {
        console.log(res);
      });
    },
  },
  computed: {
    // more20age() {
    //   return this.$store.state.students.filter((s) => s.age >= 20); //filter把数组每一个传入函数筛选
    // },
  },
};
</script>

<style></style>

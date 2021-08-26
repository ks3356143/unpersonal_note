<template>
  <div class="nav-bar">
    <div class="left"><slot name="left"> </slot></div>
    <div class="center"><slot name="center"> </slot></div>
    <div class="right"><slot name="right"> </slot></div>
  </div>
</template>

<script>
export default {
  name: "navbar",
};
</script>

<style>
/* 使用flex布局，最大给个flex，左边固定宽度（返回按钮60px） ，右边60px，中间占完*/
.nav-bar {
  display: flex;
  /* 导航高度为44px，line-height文字可以上下居中 */
  height: 44px;
  line-height: 44px;
  text-align: center;
  /* 阴影设置 */
  box-shadow: 0 1px 1px rgba(100, 100, 100, 0.1);
}

.left,
.right {
  width: 60px;
}

.center {
  flex: 1;
}
</style>

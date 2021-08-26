<template>
  <div class="tab-bar-item" @click="itemclick">
    <slot v-if="!isActive" name="item-icon"></slot>
    <slot v-else-if="isActive" name="item-icon-active"></slot>
    <div :style="activeStyle">
      <slot name="item-text"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "tabbarItem",
  computed: {
    isActive() {
      //拿到处于活跃的path
      return this.$route.path.indexOf(this.path) !== -1; //是否包含
    },
    activeStyle() {
      return this.isActive ? { color: this.activeColor ? this.activeColor : "red" } : {};
    },
  },
  props: {
    path: String,
    activeColor: String,
  },
  methods: {
    itemclick() {
      console.log("点击了item");
      this.$router.replace({
        path: this.path,
      });
    },
  },
};
</script>

<style>
.tab-bar-item {
  flex: 1;
  /* flex的均等分 */
  text-align: center;
  height: 49px;
  /* 移动端开发一般49px */
  font-size: 14px;
}

.tab-bar-item img {
  width: 24px;
  height: 24px;
  vertical-align: middle;
}
</style>

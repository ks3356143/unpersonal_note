<template>
  <div>
    <tabbar>
      <tabbarItem path="/home" activeColor="deeppink">
        <img src="~assets/img/tabbar/home.svg" alt="" slot="item-icon" />
        <img src="~assets/img/tabbar/home_active.svg" alt="" slot="item-icon-active" />
        <div slot="item-text">首页</div>
      </tabbarItem>
      <tabbarItem path="/category" activeColor="orange">
        <img src="~assets/img/tabbar/category.svg" alt="" slot="item-icon" />
        <img
          src="~assets/img/tabbar/category_active.svg"
          alt=""
          slot="item-icon-active"
        />
        <div slot="item-text">分类</div>
      </tabbarItem>
      <tabbarItem path="/shortcut" activeColor="blue">
        <img src="~assets/img/tabbar/shortcut.svg" alt="" slot="item-icon" />
        <img
          src="~assets/img/tabbar/shortcut_active.svg"
          alt=""
          slot="item-icon-active"
        />
        <div slot="item-text">更多</div>
      </tabbarItem>
      <tabbarItem path="/profile">
        <img src="~assets/img/tabbar/profile.svg" alt="" slot="item-icon" />
        <img src="~assets/img/tabbar/profile_active.svg" alt="" slot="item-icon-active" />
        <div slot="item-text">我的</div>
      </tabbarItem>
    </tabbar>
  </div>
</template>

<script>
import tabbar from "components/tabbar/tabbar.vue";
import tabbarItem from "components/tabbar/tabbarItem.vue";

export default {
  name: "maintabbar",
  components: {
    tabbar,
    tabbarItem,
  },
};
</script>

<style></style>

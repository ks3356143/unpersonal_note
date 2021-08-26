<template>
  <div>
    <tabbar>
      <tabbarItem path="/home" activeColor="deeppink">
        <template v-slot:item-icon
          ><img src="~assets/img/tabbar/home.svg" alt=""
        /></template>
        <template v-slot:item-icon-active>
          <img src="~assets/img/tabbar/home_active.svg" alt="" />
        </template>
        <template v-slot:item-text>
          <div>首页</div>
        </template>
      </tabbarItem>
      <tabbarItem path="/category" activeColor="orange">
        <template v-slot:item-icon
          ><img src="~assets/img/tabbar/category.svg" alt=""
        /></template>
        <template v-slot:item-icon-active>
          <img src="~assets/img/tabbar/category_active.svg" alt="" />
        </template>
        <template v-slot:item-text>
          <div>分类</div>
        </template>
      </tabbarItem>
      <tabbarItem path="/shortcut" activeColor="blue">
        <template v-slot:item-icon
          ><img src="~assets/img/tabbar/shortcut.svg" alt=""
        /></template>
        <template v-slot:item-icon-active>
          <img src="~assets/img/tabbar/shortcut_active.svg" alt="" />
        </template>
        <template v-slot:item-text>
          <div>更多</div>
        </template>
      </tabbarItem>
      <tabbarItem path="/profile">
        <template v-slot:item-icon
          ><img src="~assets/img/tabbar/profile.svg" alt=""
        /></template>
        <template v-slot:item-icon-active>
          <img src="~assets/img/tabbar/profile_active.svg" alt="" />
        </template>
        <template v-slot:item-text>
          <div>我的</div>
        </template>
      </tabbarItem>
    </tabbar>
  </div>
</template>

<script>
import tabbar from "components/common/tabbar/tabbar.vue";
import tabbarItem from "components/common/tabbar/tabbarItem.vue";

export default {
  name: "maintabbar",
  components: {
    tabbar,
    tabbarItem,
  },
};
</script>

<style></style>

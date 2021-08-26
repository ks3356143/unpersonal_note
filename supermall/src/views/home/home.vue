<template>
  <div id="home">
    <navbar class="home-nav">
      <template #center>购物街</template>
    </navbar>
  </div>
</template>

<script>
import navbar from "components/common/navbar/navbar";
import { request } from "@/network/request.js";

export default {
  name: "home",
  components: {
    navbar,
  },
};
</script>

<style>
.home-nav {
  background-color: var(--color-tint);
  color: white;
}
</style>

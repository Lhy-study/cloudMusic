<template>
  <router-link to="/setting"
    ><li @click="setDrawer">
      <span class="iconfont icon-shezhi1" style="font-size: 27px"></span></li
  ></router-link>
</template>

<script setup lang="ts">
// import "../../assets/css/modules-icon.less"
import { ref } from "vue";

const drawer = ref(false);

function setDrawer() {
  drawer.value = true;
}
</script>

<style lang="less" scoped>
@import "../../assets/css/modules-icon.less";
li {
  display: flex;
  justify-content: center;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  // margin-right: 20px;
  float: left;
  &:hover {
    cursor: pointer;
    background-color: #f4f3eb;
  }
  span {
    color: rgb(59, 57, 57);
    line-height: 50px;
    font-size: 23px;
  }
}
</style>
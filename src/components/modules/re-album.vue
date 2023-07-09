<template>
  <div id="re-album">
    <el-carousel :interval="4000" type="card" height="200px" :autoplay="false">
    <el-carousel-item v-for="item in 6" :key="item">
      <h3 text="2xl" justify="center">{{ item }}</h3>
    </el-carousel-item>
  </el-carousel>
  </div>
</template>

<script lang="ts" setup>
import { onBeforeMount } from "vue";
import {personalized} from "../../api/expore";

// onBeforeMount(async ()=>{
//   const res = await personalized();
//   console.log(res);
// });
</script>

<style lang="less" scoped>
 .el-carousel--card{
  margin: auto;
  width: 80%;
 }

.el-carousel__item h3 {
  color: #475669;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
  text-align: center;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>

<style lang="less">

</style>

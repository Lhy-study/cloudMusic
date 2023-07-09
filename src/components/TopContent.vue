<template>
  <header>
    <div class="topNav">
      <ul>
        <li @click="Back">
          <span class="iconfont icon-xiangzuo1" ></span>
        </li>
        <li @click="Forword"><span class="iconfont icon-xiangyou1" ></span></li>
        <li style="margin-right: 15px">
          <span class="iconfont icon-shuaxin" style="font-size: 27px"></span>
        </li>
        <div id="sousuo">
          <!-- <span class="iconfont icon-sousuo"></span
          ><input type="text" placeholder="搜索" v-model="keyword" @keydown.enter="exprole"/> -->
          <Search/>
        </div>
      </ul>
      <ul style="padding-right:20px">
        <Setting />
        <LoginVue />
      </ul>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from "vue";
import {useRouter} from "vue-router";
import LoginVue from "./modules/login.vue";
import Setting from "./modules/setting.vue";
import Search from "./modules/search.vue";
const router=useRouter()

let keyword=ref("");
// function exprole(){
//   if(keyword.value.trim()){
//     router.replace(`/search/${encodeURIComponent(keyword.value)}/song`);
//   }else{
//     ElMessage({
//       duration:2000,
//       type:"warning",
//       message:"搜索框不能为空"
//     });
//   }
// }
function Forword() {
  history.forward();
}
function Back() {
  history.back();
}
</script>

<style lang="less" scoped>
header {
  position: sticky;
  width: 100%;
  top: -1px;
  z-index: 3;
  box-sizing: border-box;
  background-color: @modeBgColor;
  padding-bottom: 1.5rem;
  .topNav {
    position: relative;
    display: flex;
    justify-content: space-between;
    width: 100%;
    ul {
      display: flex;
      align-items: center;
      #sousuo {
        position: relative;
        span {
          position: absolute;
          left: 10px;
          top: 7px;
          font-size: 1.6rem;
        }
        input {
          outline: none;
          text-indent: 27px;
          border-radius: 15px;
          height: 30px;
          width: 180px;
          font-family: kaiti;
          border: 0px white solid;
        }
      }
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
          color: @startColor;;
          line-height: 50px;
          font-size: 23px;
        }
      }
    }
  }
}
@media screen and (max-width: 1280px) {
  .topNav {
    li {
      transform: scale(0.8); //设置图标
    }
  }
}
</style>
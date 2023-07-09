<template>
  <div id="personal">
    <div class="base">
      <img :src="`${userInfo.avatarUrl}param=150y150`" alt="" @error="dealImgError">
      <div class="info">
        <h1>{{ userInfo.nickname }}</h1>
        <p>Lv{{ userInfo.level }}&nbsp;&nbsp;<span :class="{iconfont:true}" v-bind:class="formatGender(userInfo.gender)"></span></p>
        <p>{{ formatDate(userInfo.createTime) }}注册</p>
        <div><span>关注:{{ userInfo.follows }}</span> <span>粉丝:{{ userInfo.followeds }}</span></div>
        <p>个人介绍：<span v-if="userInfo.signature">{{userInfo.signature}}</span><span v-else>还没有写个人介绍。。。</span></p>
      </div>
    </div>
    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" :ellipsis="false">  
      <el-menu-item index="1"><router-link to="/personal/follows">我的关注</router-link></el-menu-item>
      <el-menu-item index="2"><router-link to="/personal/fans">我的粉丝</router-link></el-menu-item>
      <el-sub-menu index="3">
        <template #title>歌单</template>
          <el-menu-item index="3-1"><router-link to="/personal/likeList">我喜欢的音乐({{ likeList().likelists.length }}首)</router-link></el-menu-item>
          <el-menu-item index="3-2"><router-link to="/personal/create">我的歌单</router-link></el-menu-item>
          <el-menu-item index="3-3"><router-link to="/personal/home">最近播放</router-link></el-menu-item>
      </el-sub-menu>
    </el-menu>
    <router-view></router-view>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import {storeToRefs} from "pinia";
import {useStore} from "../store/user";
import {likeList} from "../store/likeList";
import {formatGender,formatDate} from "../api/format";
import { dealImgError } from "../baseconfig";

const {userInfo} = storeToRefs(useStore());
// const {likelists} = storeToRefs(likeList());

document.title=`${userInfo.value.nickname}的个人空间`
const activeIndex = ref('1');
</script>

<style lang="less">
.el-menu-item{
  a{
    font-size: 1.6rem;
    color: @modeTextColor !important;
  }
}
.el-sub-menu__title{
  font-size: 1.7rem;
  color: @modeTextColor !important;
}
</style>

<style lang="less" scoped>
.icon-nan{
    color: #0091ff !important;
}
.icon-nv{
    color: #ff4d94 !important;
}

#personal{
  .base{
    display: flex;
    img{
      width: 20rem;
      height: 20rem;
      border-radius: 50%;
    }
    .info{
      display: flex;
      flex-direction: column;
      justify-content: center;
      margin-left: 1.3rem;
      h1{
        font-size: 2rem;
        color: @modePColor;
      }
      p{
        font-size: 1.5rem;
        color: @modePColor;
      }
    }
  }
}

</style>

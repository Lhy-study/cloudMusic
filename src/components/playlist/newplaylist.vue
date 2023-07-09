<template>
  <h2>欧美音乐</h2>
  <ul class="new">
    <li v-for="(i, index) in newData.newList" :key="`${i.id}+${i.name}`">
      <router-link :to="`/playlistpage/${i.id}/songs`">
        <img :src="`${image.Cover}`" alt=""  :data-src="`${i.coverImgUrl}?param=200y200`" @error="dealImgError" v-lazyImg/>
        <p>{{ i.name }}</p>
        <i class="iconfont icon-18erji-2">&nbsp;{{ formatNum(i.playCount) }}</i>
      </router-link>
      <span class="iconfont icon-shipinbofangshibofang" @click.self="play(i.id)"></span>
    </li>
    <!-- <li v-for="(i,index) in host" :key="index">{{i}}</li> -->
  </ul>
</template>

<script setup lang="ts">
import {  reactive, onBeforeMount } from "vue";
import { getAllList ,plDetail} from "../../api/playlist";
import {playAllMusic,getAllId} from "../../api/playing";
import { formatNum } from "../../api/format";
import { image ,dealImgError} from "../../baseconfig";
import { ElMessage } from "element-plus";

function fun(e:Event){
  if(e.type==="error"){
    console.log(e.target as HTMLImageElement);
    (e.target as HTMLImageElement).src=image.errorImg;
  }
}

// const coverUrl = "src/assets/";
let newData = reactive({
  newList: [] as any[],
});
onBeforeMount(async () => {
  try {
    let { data } = await getAllList({ limit: 6, order: "old", cat: "欧美" });
  // console.log(data);
    newData.newList = data.playlists 
  } catch (error) {
    ElMessage({
      type:"error",
      message:error as string
    })
  }
});

async function play(id:number){
  console.log(id);
  let {data} =await plDetail(id);
  playAllMusic(getAllId(data.playlist.trackIds));
}

// console.log(newData.newList);
</script>

<style lang="less" scoped>
@import '../../assets/css/playlistSame.less';
</style>
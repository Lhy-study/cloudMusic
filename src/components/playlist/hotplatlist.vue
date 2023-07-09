<template>
  <div id="hotplatlist" v-if="!loaderFlage">
    <h2>华语热门歌单</h2>
    <ul class="hot">
      <li v-for="(i, index) in hotData.hotList" :key="`${i.id}+${i.name}`">
        <router-link :to="`/playlistpage/${i.id}/songs`">
          <img :src="image.Cover" :data-src="`${i.coverImgUr}?param=150y150`" @error="dealImgError" v-lazyImg/>
          <p>{{ i.name }}</p>
          <i class="iconfont icon-18erji-2">&nbsp;{{ formatNum(i.playCount) }}</i>
        </router-link>
        <span class="iconfont icon-shipinbofangshibofang" @click.self="play(i.id)"></span>
      </li>
      <!-- <li v-for="(i,index) in host" :key="index">{{i}}</li> -->
    </ul>
  </div>
  <SkeletonVue v-else />
</template>

<script setup lang="ts">
import SkeletonVue from "../skeleton/skeleton.vue";
import { ref, reactive ,onBeforeMount} from "vue";
import { getAllList ,plDetail} from "../../api/playlist";
import { formatNum} from "../../api/format";
import {playAllMusic,getAllId} from "../../api/playing";
import { ElMessage } from "element-plus";
import { image , dealImgError} from "../../baseconfig";

let hotData = reactive({
  hotList: [] as any[],
});
let loaderFlage = ref(true);

async function play(id:number){
  // console.log(id);
  try {
    let {data} =await plDetail(id);
    if(data.playlist){
      playAllMusic(getAllId(data.playlist.trackIds)); 
    }
  } catch (error) {
    if(error instanceof Error){
      ElMessage({
        type:"error",
        message:error.message
      });
    }else{
      ElMessage({
        type:"error",
        message:error as string
      });
    }
  }
}

onBeforeMount(async ()=>{
  try {
    let {data}=await getAllList({limit:14,order:"hot",cat:"华语"});
  // console.log(data);
  hotData.hotList=data.playlists;
  loaderFlage.value=false;
  } catch (error) {
    ElMessage({
      type:"error",
      message:error as string
    })
  }
})


</script>

<style lang="less" scoped>
@import '../../assets/css/playlistSame.less';
</style>
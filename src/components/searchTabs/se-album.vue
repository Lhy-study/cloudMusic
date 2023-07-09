<template>
    <ul class="singer" v-if="!loaderFlag">
      <router-link :to="`/singerpage/${item.id}/album`" v-for="(item, index) in result.albums">
        <li :key="`${item.id}+${item.name}`">
          <img :src="image.Cover" :data-src="`${item.picUrl}?param=130y130`" @error="dealImgError"  v-lazyImg>
          <p>{{ item.name }}</p>
        </li>
      </router-link>
      <el-pagination layout="prev, pager, next" :total="result.albumCount" background v-model:current-page="pageCount" 
        :page-size="page.smallPage" v-if="result.albumCount > page.smallPage" />
        <div class="error" v-if="result.albumCount==0">
        <p>
            很抱歉，没有找到与“<span>{{ route.params.keyword }}</span>”相关的单曲
        </p>
        </div>
    </ul>
    <SearchLoadingVue v-if="loaderFlag" />
  </template>
  
  <script setup lang="ts">
  import SearchLoadingVue from "../loading/searchLoading.vue";
  import { ElMessage } from "element-plus";
  import { watchEffect, reactive ,ref} from "vue";
  import { useRoute ,onBeforeRouteLeave} from "vue-router";
  import { search } from "../../api/search";
  import { simBlum } from "../../type/index";
  import { page ,image , dealImgError} from "../../baseconfig";
  let pageCount = ref(1);
// let offset = ref(0);
  let loaderFlag = ref(true);
  let result = reactive({
    albumCount: 0,
    albums: [] as Array<simBlum>
    //item 下有一个属性 followed 为是否入住
  })
  
  let route = useRoute();
  const stop=watchEffect(async () => {
    try {
      let { data } = await search({
        keywords: route.params.keyword as string,
        limit: page.smallPage,
        type: 10,
        offset: pageCount.value,
      });
      console.log(data);
      result.albumCount=data.result.albumCount;
      let arr:simBlum[]=[];
      for(let i=0;i<data.result.albums.length;i++){
        arr.push({
          id:data.result.albums[i].id,
          name:data.result.albums[i].name,
          picUrl:data.result.albums[i].artist.picUrl,
          artist:{
            name:data.result.albums[i].artist.name,
            id:data.result.albums[i].artist.id,
            alias:data.result.albums[i].artist.alias}
        })
      }
     result.albums=arr;
     loaderFlag.value=false;
    } catch (error) {
      ElMessage({
        duration: 2000,
        type: "error",
        message: error as string
      })
    }
  });
  
  onBeforeRouteLeave(()=>{
    stop();
  })
  
  </script>
  
  <style lang="less" scoped>
  .singer {
    li {
      display: flex;
      align-items: center;
      box-sizing: border-box;
      padding: 1rem;
      img {
        width: 7rem;
        height: 7rem;
      }
      p{
        font-size: 1.5rem;
        padding-left: 10px;
        color: @modeTextColor;
      }
    }
  }
  </style>
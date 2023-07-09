<template>
<div class="title">
  <h1>最近播放</h1>
</div>
  
</template>

<script setup lang="ts">
    import {onMounted} from "vue";
    import {musicListStore} from "../store/playlist";
    import {storeToRefs}from "pinia";
    import {getDeatils} from "../api/music";
    let { playlist }=storeToRefs(musicListStore());

    // let str=(playlist.value).toString();
    // console.log(str);
    // let ids=str.replace("[","").replace("]","");
    // console.log(ids);
    onMounted(async ()=>{
      // let {data}=await getDeatils(playlist.value);
    // let {data}=await axios.get(`/song/detail?ids=33894312,461347998`);
      // console.log(data);
    })
    // let b='[1,34,,4,,5]';
    // console.log(b);
</script>

<style scoped lang="less">

</style>
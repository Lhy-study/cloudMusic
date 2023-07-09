<template>
  <ul class="singer">
    <router-link :to="`/singerpage/${item.id}/album`" v-for="(item, index) in result.artists">
      <li :key="`${item.id}+${item.name}`">
        <img :src="image.Cover"  :data-src="`${item.picUrl}?param=150y150`" alt="" @error="dealImgError" v-lazyImg>
        <p>{{ item.name }}</p>
      </li>
    </router-link>
  </ul>
</template>

<script setup lang="ts">
import { ElMessage } from "element-plus"
import { watchEffect, reactive } from "vue";
import { useRoute ,onBeforeRouteLeave} from "vue-router";
import { search } from "../../api/search";
import { image ,dealImgError} from "../../baseconfig";

let result = reactive({
  artistCount: 0,
  artists: [] as Array<any>
  //item 下有一个属性 followed 为是否入住
})

let route = useRoute();
const stop=watchEffect(async () => {
  try {
    let { data } = await search({
      keywords: route.params.keyword as string,
      type: 100,
    });
    console.log(data);
    result.artistCount=data.result.artistCount;
    result.artists=data.result.artists
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
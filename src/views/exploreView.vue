<template>
    <div id="explore-tabs">
            <ul class="tab">
                <li><router-link :to="`/explore/personalityRecommendation`"><span
                        :class="{ ischeck: `/explore/personalityRecommendation` == route.path }">个性推荐</span></router-link>
                </li>
                <li><router-link :to="`/explore/playlistAll`"><span
                        :class="{ ischeck: route.path=='/explore/playlistAll' }">歌单广场</span></router-link>
                </li>
                <li><router-link :to="`/explore/toplist`"><span
                        :class="{ ischeck: `/explore/toplist` == route.path }">排行榜</span></router-link>
                </li>
                <li><router-link :to="`/explore/singerAll`"><span
                        :class="{ ischeck: `/explore/singerAll` == route.path }">歌手</span></router-link>
                </li>
                <li><router-link :to="`/explore/newestMusic/newmusic`"><span
                        :class="{ ischeck: `/explore/newestMusic` == route.path }">新音乐</span></router-link>
                </li>
                </ul>
        <router-view></router-view>
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRoute } from "vue-router";
const route = useRoute();
document.title='探索';
</script>

<style lang="less" scoped>
.ischeck {
  border-bottom: 3px solid red;
}

// #explore-tabs{
//   width: 85%;
//   margin: auto;
// }
.tab {
  width: 85%;
  margin: auto;
    display: flex;
    position: sticky;
    top: calc(50px + 1rem);
    z-index: 1;
    background-color: @modeBgColor;
    li {
      span {
        margin-right: 3rem;
        display: block;
        padding: 10px 0 0 0px;
        height: 30px;
        font-size: 1.7rem;
        line-height: 30px;
        color: @modeTextColor;
      }
    }
  }
</style>
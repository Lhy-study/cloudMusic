<template>
  <div id="searchView">
    <h1>搜索 {{ route.params.keyword }} 的结果如下</h1>
    <div class="interest">
      <h2>你可能感兴趣</h2>
      <div class="interest-main">
        <ul>
          <router-link :to="`/singerpage/${item.id}/album`" v-for="(item) in dataSuggest.result.artist" :key="`${item.id}+${item.name}`">
            <li>
              <div class="info">
                <img :src="item.picUrl ? `${item.picUrl}?param=130y130` : image.userImg" alt="" @error="dealImgError">
                <div class="text">
                  <p><span>{{ item.occupation }}</span> : <span>{{ item.name }}</span> <span v-if="item.trans"
                      style="color: #d2d2d2;">({{
                        item.trans }})</span></p>
                  <p><span>粉丝:{{ formatNum(item.fansSize) }}</span> <span>歌曲:{{ formatNum(item.musicSize) }}</span></p>
                </div>
              </div>
            </li>
          </router-link>
        </ul>
        <template v-if="dataSuggest.result.playlist">
          <router-link :to="`/playlistpage/${item.id}/songs`" v-for="(item) in dataSuggest.result.playlist" :key="`${item.id}+${item.name}`" >
            <div id="playlist">
            <div class="info">
                <img :src="item.coverImgUrl ? `${item.coverImgUrl}?param=130y130` : image.Cover" alt="" @error="dealImgError">
                <div class="text">
                  <p>歌单：{{ item.name }}</p>
                  <p><span>歌曲:{{ formatNum(item.trackCount) }}</span> <span>播放:{{ formatNum(item.playCount) }}</span></p>
                </div>
              </div>
          </div>
          </router-link>
          
        </template>
      </div>
    </div>
    <ul class="tab">
      <li><router-link :to="`/search/${encodeURIComponent(route.params.keyword as string)}/song`"><span
            :class="{ ischeck: `/search/${encodeURIComponent(route.params.keyword as string)}/song` == route.path }">单曲</span></router-link>
      </li>
      <li><router-link :to="`/search/${encodeURIComponent(route.params.keyword as string)}/singer`"><span
            :class="{ ischeck: `/search/${encodeURIComponent(route.params.keyword as string)}/singer` == route.path }">歌手</span></router-link>
      </li>
      <li><router-link :to="`/search/${encodeURIComponent(route.params.keyword as string)}/album`"><span
            :class="{ ischeck: `/search/${encodeURIComponent(route.params.keyword as string)}/album` == route.path }">专辑</span></router-link>
      </li>
    </ul>
    <router-view></router-view>
    <!-- <resoult/> -->
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus';
import { watchEffect, reactive ,provide} from "vue";
import { useRoute, RouterView ,onBeforeRouteLeave} from "vue-router";
import { multimatch } from "../api/search";
import { formatNum } from "../utils/format";
import { image ,dealImgError} from "../baseconfig";
let route = useRoute();
provide('route',111)
let dataSuggest = reactive({
  result: {} as any
});
document.title='搜索'

// async function getFnas(id: number) {
//   return new Promise((resolve,reject)=>{
//     let res =await fansNum(id);
//     resolve(res.data.data.fansCnt)
//   })
// }

const stop = watchEffect(async () => {
  try{
    let { data } = await multimatch({ keywords: route.params.keyword as string });
  // console.log(data);
  // console.log(data.result.artist);
  dataSuggest.result = data.result
  }catch(error){
    ElMessage({
      duration:2000,
      type:"error",
      message:"网络错误，请重试"
    })
  }
});


onBeforeRouteLeave(()=>{
  stop();
})
</script>

<style lang="less" scoped>
.ischeck {
  border-bottom: 3px solid red;
}
#searchView {
  h1{
    padding-bottom: 2rem;
  }
  .tab {
    display: flex;

    li {
      span {
        margin-right: 3rem;
        display: block;
        padding: 10px 0 0 0px;
        height: 30px;
        font-size: 1.5rem;
        line-height: 30px;
        color: @modeTextColor;
      }
    }
  }

  .interest {
    h2 {
      color: @modeTextColor;
      margin-bottom: 20px;
    }

    .interest-main {
      display: flex;
      ul {
        display: flex;
      }

      a {
        li,#playlist {
          display: flex;
          align-self: center;
          box-sizing: border-box;
          align-items: center;
          padding: 1rem;
          width: 30rem;
          height: 7rem;
          background-color: #f5f5f5;
          margin-right: 10px;
          border-radius: 5px;
          // background-color: aqua;

          .info {
            display: flex;
            align-items: center;
            color: @modeTextColor;
            img {
              width: 4rem;
              height: 4rem;
              border-radius: 50%;
            }

            .text {
              width: 230px;
              margin-left: 10px;
              display: flex;
              flex-direction: column;

              p:nth-of-type(1) {
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                font-size: 1.5rem;
              }

              p:nth-of-type(2) {
                font-size: 1.1rem;
              }
            }
          }
        }
      }

    }
  }
}
</style>
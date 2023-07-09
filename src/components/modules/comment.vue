<template>
  <LoadingVue v-if="isLoading"/>
  <div class="comments">
    <ul v-if="comments.hotComments.length">
        <h1>精选热门评论 :10条</h1>
        <li v-for="(item ,index) in comments.hotComments" :key="`${item.id}+${item.name}`">
          <div class="left">
            <router-link :to="`/clientHome/${item.user.userId}`">
              <img :src="image.userImg" alt="" :data-src="`${item.user.avatarUrl}?param=70y70`" @error="dealImgError" v-lazyImg>
            </router-link>
          </div>
          <div class="right">
            <div class="top">
              <p><router-link :to="`/clientHome/${item.user.userId}`">{{item.user.nickname}}&nbsp;:&nbsp;</router-link>{{item.content}}</p>
            </div>
            <div class="under">
              <p>{{item.timeStr}}&nbsp;&nbsp;{{formatTime(item.time)}}</p>
              <div><p><span class="iconfont icon-dianzan"></span>{{item.likedCount}}</p></div>
            </div>
          </div>
        </li>
    </ul>
    <p v-else>抱歉暂时无热门评论</p>
    <ul>
        <h1>最新评论</h1>
        <li></li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import {ref,onMounted,watch, reactive} from "vue";
import { getHotComment } from "../../api/comment";
import { formatTime } from "../../api/format";
import {storeToRefs} from "pinia";
import {musicListStore} from "../../store/playlist";
import LoadingVue from "./loading.vue";
import {image,dealImgError} from "../../baseconfig";
import { ElMessage } from "element-plus";
// console.log('comment');


let {playMusic} =storeToRefs(musicListStore());

let comments=reactive({
  hotComments:[] as any[],
  // newComments:[],
});
let isLoading=ref(true);
onMounted(async () => {
  try {
    let { data } = await getHotComment({ id: playMusic.value.id, limit: 10 });
    console.log(data);
    comments.hotComments = data.hotComments;
      isLoading.value = false;
  } catch (error) {
    ElMessage({
      type: "error",
      message: error as string
    })
  }
});



watch(() => playMusic.value, async (val, oldVal) => {
  isLoading.value = true;
  try {
    let { data } = await getHotComment({ id: val.id, limit: 10 });
    comments.hotComments = data.hotComments;
    if (data.hotComments != 0) {
      isLoading.value = false;
    }
    isLoading.value = false;
  } catch (error) {
    ElMessage({
      type: "error",
      message: error as string
    });
    isLoading.value = false;
  }
});
</script>

<style scoped lang="less">
  .comments{
    h1{
      color:@modeTextColor;
    }
    ul{
      li{
        display: flex;
        margin-top: 1.3rem;
        padding-bottom: 1rem;
        border-bottom: 1px solid @modePColor;
        .left{
          padding-right: 1rem;
          img{
            width: 7rem;
            height: 7rem;
            border-radius: 50%;
            border: 0.1px solid @modeTextColor;
          }
        }
        .right{
          &>div{
            width: 45rem;
            // background-color: aqua;
          }
          .top{
            p{
              width: 100%;
              padding-bottom: 1rem;
              font-family: kaiti;
              font-size: 1.7rem;
              color: @modePColor;
              a{
                color:@textColor
              }
            }
          }
          .under{
            display: flex;
            justify-content: space-between;
            span{
              cursor: pointer;
            }
          }
        }
      }
    }
  }
</style>
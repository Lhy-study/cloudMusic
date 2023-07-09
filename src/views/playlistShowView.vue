<template>
  <div id="playlist">
    <div id="main">
      <img :src="result.coverImgUrl ? `${result.coverImgUrl}?param=170y170` : image.Cover" :title="result.name" @error="dealImgError">
      <div class="info">
        <p><span>歌单</span><span>{{ result.name }}</span></p>
        <p>
          <router-link :to="`/clientHome/${result.user!.userId}`"><img
              :src="result.user!.avatarUrl ? `${result.user!.avatarUrl}?param=20y20` : image.userImg" alt="" @error="dealImgError">
          </router-link> <router-link :to="`/clientHome/${result.user!.userId}`">{{ result.user!.nickname }}</router-link>
          <span>{{ formatDate(result.createTime!) }}创建</span>
        </p>
        <div class="operate">
          <div class="all">
            <span class="iconfont icon-shipinbofangshibofang" @click="playAllMusic(result.trackIds!)"></span>
            <span>播放全部</span>
            <span class="iconfont icon-tianjia" @click="addplayList(result.trackIds!)"></span>
          </div>
          <div :class="{ collection: true, issubscribed: result.subscribed }" @click="subscribeing">
            <span v-show="result.subscribed">✔已</span>收藏：({{ formatNum(result.subscribedCount!) }})
          </div>
        </div>
        <p>标签：<router-link to="/explore/playlistAll" v-for="(item) in result.tags" class="text"
            :key="item" @click="setInfo({name:item,category:0,hot:false})"><span>{{ item }}</span></router-link> <span v-if="!result.tags?.length">无</span></p>
        <p><span>歌曲：{{ result.trackCount }}</span><span>播放：{{ formatNum(result.playCount) }}</span></p>
        <el-collapse accordion>
          <el-collapse-item title="简介" name="4">
            <p style="font-size: 1.6rem;">{{ result.description }}</p>
          </el-collapse-item>
        </el-collapse>
      </div>
    </div>
    <ul class="tab">
      <li><router-link :to="`/playlistpage/${encodeURIComponent(route.params.playlistid as string)}/songs`"><span
            :class="{ ischeck: `/playlistpage/${encodeURIComponent(route.params.playlistid as string)}/songs` == route.path }">歌曲列表</span></router-link>
      </li>
      <li><router-link :to="`/playlistpage/${encodeURIComponent(route.params.playlistid as string)}/comments`"><span
            :class="{ ischeck: `/playlistpage/${encodeURIComponent(route.params.playlistid as string)}/comments` == route.path }">评论({{
              formatNum(result.commentCount!) }})</span></router-link>
      </li>
      <li><router-link :to="`/playlistpage/${encodeURIComponent(route.params.playlistid as string)}/collectors`"><span
            :class="{ ischeck: `/playlistpage/${encodeURIComponent(route.params.playlistid as string)}/collectors` == route.path }">收藏者</span></router-link>
      </li>
    </ul>
    <router-view></router-view>
  </div>
</template>

<script setup lang="ts">
import { reactive, watchEffect } from "vue";
import { useRoute, onBeforeRouteLeave } from "vue-router";
import { usdetail } from "../api/user";
import { plDetail, dynamic, subscribe } from "../api/playlist";
import { formatDate, formatNum } from "../api/format";
import { playAllMusic ,addplayList } from "../api/playing";
import { pldetail } from "../type/index";
import { useStore } from "../store/user";
import { plTagState } from "../store/tag";
import { storeToRefs } from "pinia";
import { image ,dealImgError} from "../baseconfig";
import { ElMessage } from "element-plus";

let { userInfo } = storeToRefs(useStore());
const {setInfo} =plTagState();
document.title = '歌单详情'

let route = useRoute();
let result = reactive<pldetail>({
  id: NaN,
  playCount: NaN,//播放量
  subscribedCount: NaN,//收藏数
  trackCount: NaN,//包含歌曲数
  createTime: NaN,//创建时间
  commentCount: NaN,//评论数
  userId: NaN,
  name: "",
  description: "",//简介
  coverImgUrl: "",
  subscribed: false,//用户是否收藏
  tags: [""],
  trackIds: [],
  user: {
    avatarUrl: "",
    nickname: "",
    userId: NaN,
  }
});
const stop = watchEffect(async () => {
  try {
    let { data } = await plDetail(parseInt(route.params.playlistid as string));
    // console.log(data);
    result.id = data.playlist.id;
    result.playCount = data.playlist.playCount;
    result.subscribedCount = data.playlist.subscribedCount;
    result.trackCount = data.playlist.trackCount;
    result.createTime = data.playlist.createTime;
    result.commentCount = data.playlist.commentCount;
    result.userId = data.playlist.userId;
    result.name = data.playlist.name;
    result.description = data.playlist.description;
    result.coverImgUrl = data.playlist.coverImgUrl;
    result.tags = data.playlist.tags;
    result.trackIds = data.playlist.trackIds;
    let userData = await usdetail(data.playlist.userId);
    result.user!.avatarUrl = userData.data.profile.avatarUrl;
    result.user!.nickname = userData.data.profile.nickname;
    result.user!.userId = userData.data.profile.userId;
  } catch (error) {
    console.log(error);
  }
});

const dynamiWatch = watchEffect(async () => {
  try {
    let { data } = await dynamic(parseInt(route.params.playlistid as string));
    // console.log(data);    
    result.subscribed = data.subscribed;
  } catch (error) {
    ElMessage({
      type: "error",
      message: error as string
    })
  }
});

async function subscribeing() {//收藏歌单
  if (result.subscribed) {//代表订阅了
    try {
      let res = await subscribe(result.id, 0);
      //  console.log(res.data);
      let { data } = await dynamic(parseInt(route.params.playlistid as string));
      // console.log(data);
      result.subscribed = data.subscribed;
      console.log(`订阅了`);
    } catch (error) {
      ElMessage({
        type: "error",
        message: error as string
      })
    }
  } else {
    if (userInfo.value.userId) {//代表已经登录了
      try {
        let res = await subscribe(result.id, 1);
        // console.log(res.data);
        let { data } = await dynamic(parseInt(route.params.playlistid as string));
        // console.log(data);
        result.subscribed = data.subscribed;
        // console.log(`bu订阅了`);
      } catch (error) {
        ElMessage({
          type: "error",
          message: error as string
        })
      }
    } else {
      ElMessage({
        type: "warning",
        message: "登录后方可收藏该歌单",
        duration: 2000,
      })
    }
  }
}

onBeforeRouteLeave(() => {
  stop();
  dynamiWatch();
})
</script>

<style lang="less" scoped>
 @h: 3rem;
.ischeck {
  border-bottom: 3px solid red;
}

.issubscribed {
  background-color: @textColor;
}

#playlist {
  #main {
    display: flex;

    &>img {
      width: 20rem;
      height: 20rem;
      border-radius: 5%;
    }
  }

  .info {
    position: relative;
    flex: 1;
    box-sizing: border-box;
    padding-left: 2rem;

    p {
      color: @modeTextColor;
      margin-bottom: 1rem;
    }

    p:nth-of-type(1) {
      display: flex;
      align-items: center;
      span:nth-of-type(1) {
        font-size: 1.5rem;
        border: 1px solid red;
        padding: 1px;
      }

      span:nth-of-type(2) {
          margin-left: 1rem;
          display: block;
          font-size: 2rem;
          max-width: 40vw;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
    }

    p:nth-of-type(2) {
      display: flex;
      align-items: center;

      img {
        width: 3rem;
        height: 3rem;
        border-radius: 50%;
      }

      a:nth-of-type(2) {
        margin-left: 1rem;
        font-size: 1.7rem;
        color: @modePColor;
      }

      span {
        margin-left: 1rem;
        font-size: 1.7rem;
      }
    }

    p:nth-of-type(3) {
      font-size: 1.4rem;

      .text+.text::before {
        content: "/";
        margin: 0px 3px;
      }

      span {
        color: rgb(69, 194, 194);

        &:hover {
          opacity: .8;
        }
      }
    }

    .operate {
      display: flex;
      margin-bottom: 1rem;

      .all {
       
        display: flex;
        justify-content: space-between;
        position: relative;
        background-color: red;
        // width: @h * 4;
        // height: @h;
        border-radius: @h;
        cursor: pointer;

        span:nth-of-type(1),
        span:nth-of-type(3) {
          display: block;
          // position: absolute;
          width: @h;
          height: @h;
          border-radius: 50%;
          line-height: @h;
          text-align: center;
          color: white;
          font-size: 1.6rem;
        }

        span:nth-of-type(2) {
          height: @h;
          line-height: @h;
          color: white;
          letter-spacing: 2px;
          font-size: 1.3rem !important;
        }

        // span:nth-of-type(1){
        //   left: 0;
        // }
        span:nth-of-type(3):hover::after {
          display: block;
          width: 15rem;
          content: "添加到全部播放列表";
          font-size: 1rem;
          color: @modePColor;
          background-color: white;
        }
      }

      // @media screen and (max-width:1400) and (min-width: 1200px){
      //   .all{
      //     transform: scale(.8);
      //   }
      // }

      // @media screen and (max-width: 1200px){
      //   .all{
      //     transform: scale(.5);
      //   }
      // }
      .collection {
        box-sizing: border-box;
        margin-left: 3rem;
        width: 14rem;
        height: @h;
        line-height: @h;
        word-spacing: 2px;
        text-align: center;
        // background-color: aquamarine;
        border: 1px solid @modeTextColor;
        color: @modeTextColor;
        border-radius: @h;
        cursor: pointer;

        &:hover {
          opacity: .8;
        }
      }
    }
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
}</style>

<style lang="less">.el-collapse {
  border-color: transparent;
}

.el-collapse-item__header {
  font-size: 1.5rem;
  color: @modeTextColor;
  background-color: @modeBgColor;
  border-bottom-color: transparent;
}

.el-collapse-item__wrap {
  background-color: @modeBgColor;
  border-color: transparent;
}</style>
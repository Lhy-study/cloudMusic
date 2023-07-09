<template>
  <div v-if="rightRrawer">
    <el-drawer v-model="rightRrawer" :with-header="false" direction="rtl" size="40%">
      <div class="title">
        <h1>播放列表</h1>
        <span>共{{ playlist?.length }}首</span>
      </div>
      <ul>
        <li v-for="(item, index) in musicListInfo.songs" :key="item.id"
          :class="{ check: item.id == playMusic.id }">
          <div class="one">
            <MusicLoader v-if="flag && item.id == playMusic.id" />
            <p v-else :class="{ check: item.id == playMusic.id }">{{ index + 1 }}</p>
          </div>
          <div class="one b">
            <p class="iconfont icon-weibiaoti519" v-if="flag && item.id == playMusic.id" @click="timeOut"></p>
            <p class="iconfont icon-shipinbofangshibofang" v-else @click="begin(); setMusic(item.id)"></p>
          </div>
          <div class="two">
            <div class="right">
              <p :class="{ check: item.id == playMusic.id }">
                {{ item.name }}
              </p>
              <template v-for="(authorTtem, authorIndex) in item.ar" :key="authorTtem.id">
                <router-link :to="`/singerpage/${authorTtem.id}/album`" @click.stop="test"><span>{{ authorTtem.name }}</span></router-link><span
                  v-if="authorIndex != item.ar.length - 1">/</span>
              </template>
            </div>
          </div>
          <div class="album">
            <router-link to="/">
              <p :class="{ check: item.id == playMusic.id }">{{ item.al.name }}</p>
            </router-link>
          </div>
          <div class="duration">
            <p :class="{ check: item.id == playMusic.id }">{{ fomatDuration(item.dt / 1000) }}</p>
          </div>
        </li>
      </ul>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import MusicLoader from "../../components/modules/musicLoader.vue"
import { musicListStore } from "../../store/playlist";
import { musicStateStore } from "../../store/musicState"
import { elementStore } from "../../store/element";
import { storeToRefs } from "pinia";
import { getDeatils } from "../../api/music";
import {fomatDuration} from "../../api/format";
import { reactive, ref, watchEffect} from "vue";
import { ElMessage } from "element-plus";

let { playlist, playMusic } = storeToRefs(musicListStore());
let { rightRrawer } = storeToRefs(elementStore());
let { flag } = storeToRefs(musicStateStore());
const { setMusic } = musicListStore()
const { begin, timeOut } = musicStateStore();
// const { rightRrawer, playlist, playMusic ,flag,shuffleList,isShuffle} = storeToRefs(musicListStore());
// const {flagtoFalse,flagtoTrue,begin,timeOut,setMusic} = musicListStore();


let musicListInfo = reactive({
  songs: [] as any[],
});

function test() {
  console.log("test");
}

let limit=ref(40);
let offset=ref(1);

watchEffect(async ()=>{
  // console.log(rightRrawer);
  
  // console.log(playlist.value);
  try {
    if(playlist.value){
      let { data } = await getDeatils(playlist.value.slice(0,limit.value * offset.value));
      console.log(data);
      musicListInfo.songs = data.songs;
    }
  } catch (error) {
    ElMessage({
      type:"error",
      message:error as string
    })
  }
});

</script>

<style lang="less" scoped>
.check {
  color: @startColor !important;
}

/deep/.el-overlay {
  margin: auto;
  position: absolute !important;
  z-index: 8000 !important;
  width: 100%;
  height: 500px;
  //   width: 100vw !important;
  max-width: 2300px;
  height: 100% !important;
  //   background-color: aqua;
}

/deep/.el-drawer {
  border-right: 1px solid;
  height: 100% !important;
  // max-height: 1000px !important;
  background-color: @modeBgColor;
}

.title {
  display: flex;
  align-items: center;
  letter-spacing: 0.7rem;
  color: @modeTextColor !important;

  h1 {
    margin-right: 30px;
    // color:@modeTextColor
  }

  span {
    font-family: kaiti;
    font-size: 1.7rem;
  }
}

ul {
  height: 500px;
  overflow: auto;

  li {
    position: relative;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    padding: 1rem 1rem;
    align-items: center;
    color: @modePColor;
    border-radius: 1.5rem;
    height: 4rem;
    

    &:hover {
      background-color: @bgColor;
    }

    &:hover .b {
      opacity: 1;
    }

    .b {
      position: absolute;
      opacity: 0;
      background-color: @bgColor;
    }

    .one {
      width: 3rem;
      height: 3rem;

      p {
        font-size: 2.1rem;
        line-height: 3rem;
        text-align: center;
      }

      margin:0 2rem;
    }

    .two {
      display: flex;
      align-items: center;
      width: 20rem;
      height: 4rem;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;

      .right {
        p {
          font-size: 1.6rem;
        }

        span {
          padding-right: 0.3rem;
        }

        &>a>span:nth-of-type(n + 1) {
          color: #978d8c !important;
          cursor: pointer;
        }

        &>a>span:nth-of-type(n + 1):hover {
          text-decoration: underline;
        }
      }
    }

    .album {
      width: 20rem;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;

      &:hover {
        text-decoration: underline;
      }
    }

    .album,
    .duration {
      padding-left: 20px;
      display: flex;
      align-items: center;

      p {
        font-family: kaiti;
        font-weight: 400;
        font-size: 1.7rem;
        color: @modePColor;
      }
    }
  }
}
</style>
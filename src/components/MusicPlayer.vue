<template>
  <div class="music" ref="music" :style="pWidth">
    <div class="progress">
      <p>{{ timeStr }}</p>
      <el-slider @change="ch" @input="inp" v-model="value1" :step="0.01" :max="1.0" input-size="small"
        :show-tooltip="false" />
      <p>{{ fomatDuration(duration) }}</p>
    </div>
    <!-- 下面是歌曲进度条那一整栏-->
    <div id="musicTools">
      <span class="iconfont icon-xingming" v-if="!playMusic.id" style="color: @modeColor"></span>
      <div class="Info" v-else>
        <div class="cover">
          <img :src="musicCover ? `${musicCover}?param=100y100` : image.Cover" alt="打开歌曲详情页"  @error="dealImgError"/>
          <span class="iconfont icon-xiangshangzhanhang" @click="changeDrawer"></span>
        </div>
        <!-- 下面是歌曲封面、作者一栏-->
        <div class="infoCard">
          <p>{{ name }}</p>
          <div>
            <router-link :to="`/singerpage/${encodeURIComponent(item.id)}/album`" v-for="(item, index) in author" :key="`${item.id}+${item.name}`"><span>{{ item.name
            }}</span></router-link>
          </div>
        </div>
      </div>
      <!-- 下面是控制歌曲播放一栏-->
      <div class="control">
        <div class="control-main">
          <span class="iconfont icon-cainixihuan"></span><!-- 喜欢图片-->
          <span class="iconfont icon-shangyishou" @click="preSong"></span>
          <!-- 上一首歌曲-->
          <span v-if="!flag" :class="{ iconfont: true, 'icon-zanting': !flag }" @click="begin"></span><!-- 暂停状态的图标-->
          <span v-else :class="{ iconfont: true, 'icon-zanting1': flag }" @click="timeOut"></span><!-- 播放状态的图标-->
          <span class="iconfont icon-xiayishou" @click="nextSong"></span>
          <!-- 下一首歌曲-->
          <span v-if="!isShuffle" class="iconfont icon-shunxubofang" @click="changeIsShuffle"></span><!-- 顺序播放状态的图标-->
          <span v-else class="iconfont icon-suijibofang" @click="changeIsShuffle"></span><!-- 随机播放状态的图标-->
        </div>
      </div>
      <div class="volume">
        <div class="volumeControl">
          <span class="iconfont icon-shengyinjingyin" v-if="isMute" @click="() => (isMute = false)"></span>
          <span class="iconfont icon-shengyin" v-else @click="() => (isMute = true)"></span>
          <el-slider :step="0.01" :max="1.0" @change="changeVolume" v-model="value2" :show-tooltip="false" />
        </div>
        <span class="iconfont icon-24gf-playlistMusic4" @click="changeRightDrawer"></span>
      </div>
    </div>
    <audio ref="Audioelement" @timeupdate="update" :src="musicUrl" @ended="nextSong" preload="metadata" :muted="isMute" 
      @canplay="free"></audio>
    <rightNavVue v-show="rightRrawer"/>
  </div>
  <MusicInfoShow />
  <!-- <Playlist v-if="rightRrawer" /> -->
</template>

<script setup lang="ts">
// :src="`https://music.163.com/song/media/outer/url?id=${playMusic.id}.mp3`"

// 异步加载组件
// const MusicInfoShow = defineAsyncComponent(() =>
//   import("./modules/musicInfoShow.vue")
// );
// @playing="onPlay();()=>console.log('开始播放')"
// @waiting="onPause();()=>console.log('等待中');"
import MusicInfoShow from "./modules/musicInfoShow.vue";
import rightNavVue from "./modules/rightNav.vue";
import { ElMessage } from "element-plus";
import { onClickOutside } from "@vueuse/core";
import {
  ref,
  watch,
  onMounted,
  computed,
nextTick
} from "vue";
import { musicStore } from "../store/musicInfo";
import { musicStateStore } from "../store/musicState";
import { musicListStore } from "../store/playlist";
import { elementStore } from "../store/element";
import { image ,dealImgError} from "../baseconfig";
import { storeToRefs } from "pinia";
import { checkMusic, getDeatils, getUrl } from "../api/music";
import { fomatDuration } from "../api/format";

let Audioelement = ref<HTMLAudioElement|null>(null);
let music =ref<HTMLElement|null>(null);

onClickOutside(music, () => {
  rightDrawerClose();
});


let { name, musicCover, duration, author, musicUrl, id, album, fee, state, freeTrialInfo } = storeToRefs(musicStore());//歌曲信息
let { isShuffle, playMusic } = storeToRefs(musicListStore());
let { isMute, flag, timeStr, value1, value2, intermediateVariables, timer, musicAudio } = storeToRefs(musicStateStore());
let {rightRrawer ,isDrawer} = storeToRefs(elementStore())

const { onPlay, timeOut, begin, update, free, flagtoFalse } = musicStateStore();
const { setPlayList, setMusic, shuffle, preSong, nextSong } = musicListStore();
const { changeDrawer, changeRightDrawer ,rightDrawerClose} = elementStore();

// const bufferedEnd = computed(() => {
//   nextTick();
//   return Audioelement.value?.buffered.end(0)!;
// });

let bufferedEnd=ref(0);
onMounted(() => {
  musicAudio.value = Audioelement.value;
  
  Audioelement.value?.addEventListener("progress", () => {
    // console.log(Audioelement.value?.buffered.end(0));
    bufferedEnd.value = Audioelement.value?.buffered.end(0)!;
    // console.log(duration.value,bufferedEnd.value);
  });
  // Audioelement.value?.addEventListener("keyup",(e)=>{
  //   console.log(e.code);
    
  //   if(e && e.code=="Space"){
      
  //   }
  // });
});

nextTick();
let pWidth=computed(()=>{
  return `--width:${(bufferedEnd.value / duration.value)*100}%`
})
// let pWidth=ref(`--width:${(bufferedEnd.value / duration.value)*100}%`);

function cushioning() {
  clearInterval(timer.value);
}

setPlayList(JSON.parse(localStorage.getItem("playlist") as string) ?? []);
setMusic(
  JSON.parse(localStorage.getItem("playMusic") as string)
    ? JSON.parse(localStorage.getItem("playMusic") as string).id
    : NaN
);
// console.log(
//   typeof JSON.parse(localStorage.getItem("playMusic") as string),
//   typeof JSON.parse(localStorage.getItem("playlist") as string)
// );


// //进度条值改变的时候，（既拖拽后放下那一刻）
function ch(val: number) {
  // console.log(11);
  intermediateVariables.value = val * duration.value; //拿到了后要重新更新定时器
  clearInterval(timer.value);
  setTimeout(() => {
    onPlay();
    // console.log(444);
  }, 10);
  // console.log(value1.value*duration.value);
  // musicAudio.value.currentTime=value1.value*playMusic.value.duration;

  (musicAudio.value as HTMLAudioElement).currentTime = value1.value * duration.value; //获取歌曲的实时播放时间 = 进度条的值 * 播放时间的总时长
}

function inp(val: number) {
  //拖拽进度条的时候
  // console.log(val);
  clearInterval(timer.value);
  fomatTime(val);
}

//改变是否顺序播放还是随机播放
function changeIsShuffle() {
  isShuffle.value = !isShuffle.value;
  if (isShuffle.value) {
    shuffle(); //随机排序原来的播放歌单
  }
}



function fomatTime(val: number) {
  //注意这个是拖拽进度条控制的  进度条-》时间戳   格式化实时歌曲的时间 musicInfo.time菜市渲染到dom上的
  // console.log(val);
  let value = val,
    dt = duration.value;
  let Time = Math.floor((value * dt) / 60);
  let minute;
  if (Time >= 10) {
    minute = Time;
  } else if (Time > 0) {
    minute = "0" + Time;
  } else {
    minute = "00";
  }
  let seconds =
    Math.floor((value * dt) % 60) > 10
      ? Math.floor((value * dt) % 60)
      : "0" + Math.floor((value * dt) % 60);
  timeStr.value = `${minute}:${seconds}`;
}

function changeVolume(val: number) {
  //通过拖拽滑块改变音量大小
  // console.log(musicAudio.value.volume);
  (musicAudio.value as HTMLAudioElement).volume = val;
  if (val == 0) {
    isMute.value = true;
  }
}

/*
 *
 */
watch(
  () => playMusic.value.id,
  async (val, odlVal) => {
    // console.log("MusicPlayer-playMusic");
    value1.value = 0; //将进度条的值归0    第一步 无论歌曲是否加载成功都必须先把进度条归0
    timeStr.value = "00:00";
    intermediateVariables.value = 0; //时间戳的那个值要重置变0
    // console.log(111);
    // console.log(val.id);
    let { data } = await checkMusic(val);
    // console.log(data);
    if (data.success) {
      let arr:number[]=[val];
      let { data } = await getDeatils(arr); //第二步拿数据（歌曲时间、封面等等信息）
      let dataSongs = data;
      if (data.songs.length != 0) {
        //第三步 如果拿到的话 先更新歌曲的总时长 把暂停标志弄好
        // clearInterval(timer);
        // console.log(dataSongs);
        name.value = dataSongs.songs[0].name;
        id.value = dataSongs.songs[0].id; //歌曲的id
        duration.value = dataSongs.songs[0].dt / 1000; //放回来是一个毫秒值 /1000
        state.value = true; //
        author.value = dataSongs.songs[0].ar; //这首歌的作者 不一定是一个人所以说数组
        album.value = dataSongs.songs[0].al; //专辑信息 :{id,name,picUrl}
        musicCover.value = dataSongs.songs[0].al.picUrl;
        fee.value = dataSongs.songs[0].fee; //该歌曲是收费歌曲还是购买专辑获得

        let { data } = await getUrl(val);
        //  free();//切换歌曲
        if (data.data[0].url) {
          //如果根据获取歌曲url的接口为null货值报错,就做下一步
          if (data.data[0].freeTrialInfo) {
            //代表歌曲为vip的或者不是登录状态
            freeTrialInfo.value = data.data[0].freeTrialInfo;
          } else {
            freeTrialInfo.value = {};
          }
          musicUrl.value = data.data[0].url;
        } else {
          musicUrl.value = `https://music.163.com/song/media/outer/url?id=${val}.mp3`;
        }
      }
      if (dataSongs.songs[0].fee == 1) {
        ElMessage({
          type: "warning",
          message: "现在为您播放的是vip歌曲的试听部分,",
          duration: 7000,
        });
      }
    } else {
      //如果返回的数组是空
      duration.value = 0; //歌曲的总时长变零
      state.value = false; //这首歌的状态是不可以的
      flagtoFalse();
      // flag.value=false;
      clearInterval(timer.value); //清楚定时器
      // alert("歌曲播放获取失败,请换下一首歌曲");
    }
    // data.songs[0].id//歌曲的id值
  },
  {
    immediate: true,
  }
);

//防抖
// function debounce(fn: any, delay: number) {
//   let timer: any = null;
//   return function () {
//     let context = this;
//     let args = arguments;
//     clearTimeout(timer);
//     timer = setTimeout(() => {
//       fn.apply(context, args);
//     }, delay);
//   };
// }
</script>

<style lang="less" scoped>
.music {
  // border-top: 2px solid @modePColor;
  width: 100vw;
  max-width: 2300px;
  position: fixed;
  bottom: 0;
  z-index: 7000;
  background-color: @modeBgColor;

  .progress {
    display: flex;
    align-items: center;
    // box-sizing: border-box;
    // padding-left: 20px;
    width: 100%;
    margin: auto;
    background-color: @modeBgColor;

    p {
      width: 100px;
      text-align: center;
      color: @modePColor;
    }
  }

  #musicTools {
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: sticky;
    bottom: 0;
    z-index: 10;
    width: 100% !important;

    &>span {
      display: block;
      width: 50px;
      width: 30%;
      padding-left: 25px;
    }

    &>div:nth-of-type(1) {
      padding-left: 25px;
    }

    &>div:nth-of-type(2) {
      padding-right: 25px;
    }

    .Info {
      display: flex;
      align-items: center;
      width: 30%;

      .cover {
        position: relative;
        width: 5rem;
        height: 5rem;

        &:hover {
          cursor: pointer;
        }

        &:hover span {
          opacity: 1;
        }

        img {
          width: 100%;
          height: 100%;
          border-radius: 50px;
        }

        span {
          position: absolute;
          top: 0;
          display: block;
          width: 100%;
          height: 100%;
          line-height: 50px;
          text-align: center;
          font-size: 3rem;
          color: white;
          opacity: 0;
          transition: 0.3s;
        }
      }

      .infoCard {
        width: 300px;
        margin-left: 10px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        color: @textColor;

        &>p {
          width: 170px;
          // background-color: aqua;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-size: 1.6rem;
          font-family: kaiti;
        }

        &>div {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          width: 100%;

          a>span {
            // display: block;
            letter-spacing: 2px;
            list-style: none;
            font-family: 微软雅黑;
            color: @textColor;
          }
        }
      }
    }

    //歌曲控件
    .control {
      display: flex;
      justify-content: center;
      align-items: center;
      padding-right: 0px !important;
      width: 30%;

      .control-main {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      span {
        position: relative;
        cursor: pointer;
        display: block;
        width: 30px;
        height: 30px;
        text-align: center;
        line-height: 30px;
        font-size: 1.9rem;
        color: @textColor;

        &:nth-of-type(3) {
          transform: scale(1.3);
        }

        &:nth-of-type(5)::after {
          top: 100%;
          left: 0%;
          position: absolute;
          width: 100px;
          display: block;
          content: "顺序播放";
          font-size: 1.2rem;
          opacity: 0;
        }

        &:nth-of-type(5):hover::after {
          opacity: 1;
        }
      }
    }

    .volume {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      padding-right: 25px;
      width: 30%;

      .volumeControl {
        display: flex;
        align-items: center;
        width: 160px;
        margin-right: 10px;

        span {
          cursor: pointer;
          display: block;
          width: 30px;
          height: 30px;
          text-align: center;
          line-height: 30px;
          font-size: 1.9rem;
          // color: @textColor;
        }
      }

      span {
        cursor: pointer;
        padding-right: 10px;
        color: @textColor;
        font-size: 1.9rem;
      }
    }
  }

  /*以下是对element-plus组件样式的修改*/
  /deep/.el-slider__runway {
    background-color: #cccc;
    height: 4px;
    &::after {
      display: block;
      content: "";
      // width: 40%;
      width: var(--width);
      transition: .5s;
      height: 100%;
      background-color: #c0bcbc;
      // opacity: .5;
    }
    .el-slider__bar {
      background-color: @bgColor;
      height: 4px;
    }

    .el-slider__button {
      width: 10px;
      height: 10px;
      background-color: @bgColor;
      border: none;
    }
  }

  /deep/.volume .el-slider__bar,
  /deep/.volume .el-slider__button {
    background-color: @textColor;
  }
}
</style>
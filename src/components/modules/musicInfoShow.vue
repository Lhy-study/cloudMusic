<template>
  <div class="page">
    <el-drawer v-model="isDrawer" title="I am the title" :with-header="false" direction="btt" size="100%">
      <span class="iconfont icon-xiangxiazhanhang" @click="changeDrawer" id="close"></span>
      <div class="pageMain">
        <div class="container">
          <div class="cover">
            <div :class="{ tools: true, pause: !flag, play: flag }"></div>
            <div :class="{ image: true, paused: !flag, active: flag }">
              <div class="img_waitao"></div>
              <img :src="musicCover" alt="" @error="dealImgError" />
            </div>
          </div>
          <ul id="lyric" ref="ul" @mousewheel="stopWatch">
            <template v-for="(item, index) in musicLrc.lrc" :key="`${item.time}+${item.text}`">
              <li ref="li">
                <p v-if="!item.text">......</p>
                <p :class="{ hightLight: index == checkIndex }" style="word-spacing: 4px">
                  {{ item.text }}
                </p>
                <p :class="{ hightLight: index == checkIndex }" style="word-spacing: 2px">
                  {{ item.lrc }}
                </p>
              </li>
            </template>
          </ul>
        </div>
        <div class="recommend">
          <Comment />
          <SimilarSongs />
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script  setup lang="ts">
import {
  ref,
  onMounted,
  watch,
  reactive,
  watchEffect,
  nextTick,
} from "vue";
import { storeToRefs } from "pinia";
import { elementStore } from "../../store/element";
import { musicStore } from "../../store/musicInfo";
import { musicStateStore } from "../../store/musicState";
import { musicListStore } from "../../store/playlist"
import { getLrc, checkMusic } from "../../api/music";
import Comment from "./comment.vue";
import SimilarSongs from "./similarSongs.vue";
import { ElMessage } from "element-plus";
import { dealImgError } from "../../baseconfig";

let { isDrawer } = storeToRefs(elementStore());
let { flag, time } = storeToRefs(musicStateStore());
let { playMusic } = storeToRefs(musicListStore());
let { musicCover } = storeToRefs(musicStore());
// let {isDrawer playMusic, time, flag, musicInfo } = storeToRefs(musicStore());
const { changeDrawer } = elementStore();
let setTimer = ref();
let checkIndex = ref(0);

// let currentTime = inject("currentTime");

let musicLrc = reactive({
  // text:[],
  lrc: [] as any[],
});


// let li = ref<NodeList|null>(null);

let touch = ref(true);
// watch(()=>currentTime.value,(value,oldVal)=>{
//           if(Math.round(value)-0.4!=Math.round(old)+0.3){
//       }
// });
onMounted(async () => {
  try {
    let { data } = await checkMusic(playMusic.value.id);
  if (data.success) {
    //如果歌曲可用的话
    let { data } = await getLrc(playMusic.value.id);
    // console.log(data);
    musicLrc.lrc = fomatAllLyric(data);
  } else {
    // alert(`${data.message}`);
    musicLrc.lrc = [];
  } 
  } catch (error) {
    ElMessage({
      type:"error",
      message:error as string
    })
  }
});

function fomatAllLyric(data: any) {
  // musicLrc.data=data.lrc.lyric;
  let lrc: any[] = [],
    romalrc: any[] = [],
    tlyric: any[] = [];
  if (data.lrc.lyric) {
    lrc = fromLyric(data.lrc.lyric);
  }
  if (data.romalrc) {
    romalrc = fromLyric(data.romalrc.lyric); //粤语发音
  }
  if (data.tlyric) {
    tlyric = fromLyric(data.tlyric.lyric); //外语的中文翻译
  }

  let type = [];
  if (romalrc.length) {
    type = romalrc;
  } else if (tlyric.length) {
    type = tlyric;
  } else {
    type = lrc;
  }
  if (romalrc.length || tlyric.length) {
    // console.log(type);console.log(lrc);
    for (let item = 0; item < lrc.length; item++) {
      // console.log(lrc[item].time,item);
      for (let i = 0; i < type.length; i++) {
        // console.log(type[i].time,i);
        if (lrc[item].time == type[i].time) {
          lrc[item]["lrc"] = type[i].text;
          //    console.log(type[i].time,i);
          //   // console.log(i);
          i = i + 1;
          break;
        }
      }
    }
  }
  // console.log(lrc);
  return lrc;
  //     musicLrc.lrc=lrc
}

function fromLyric(text: string) {
  //进行歌词的处理
  // console.log(1);
  // console.log(text);
  let arr = [],
    typeList: string[] = [];
  let textArr: string[] = text.split("\n");
  textArr.forEach((item) => {
    if (item.length != 0) {
      let obj: any = {};
      let b = item.split("]");
      obj.text = b[1];
      let Arr = b[0].replace("[", "").split(":");
      obj.time = Number(Arr[0]) * 60 + Number(Arr[1]);
      // if(obj.text){
      //   typeList.push(obj);
      // }
      typeList.push(obj);
    }
  });
  // console.log("typeList", typeList);
  return typeList;
}

function stopWatch() {
  clearTimeout(setTimer.value);
  console.log('节流');
  // console.log(document.querySelector("#lyric")?.scrollTop);
  
  touch.value = false;
  setTimer.value = setTimeout(() => {
    touch.value = true;
  }, 700);
}

//节流
// function throttle(fn, delay) { 
//   let timer = null;
//   return function () {
//     let context = this;
//     let args = arguments;
//     if (!timer) {
//       timer = setTimeout(() => {
//         fn.apply(context, args);
//         timer = null;
//       }, delay);
//     }
//   };
// }




// onBeforeUpdate(async ()=>{
//   console.log('dsfd');
//   await nextTick();//在这里dom还没有生成
//   let stop=watchEffect(()=>{
//     // console.log(111);
//     if(isDrawer.value){
//        let ul=document.querySelector("#lyric");
//        let height=li.value[0].clientHeight;
//       // console.log("点击发送到就分开了都是就分开了");
//       for(let i=0;i<musicLrc.lrc.length;i++){
//       // console.log(currentTime.value);
//         if(Math.floor(musicLrc.lrc[i].time)==Math.floor(time.value)){
//           checkIndex.value=i;
//           if(touch.value){
//             ul.scrollTop=li.value[checkIndex.value].offsetTop-ul.clientHeight/2;
//           }
//           // li.value[checkIndex.value].scrollIntoView({block:"center",behavior:"smooth"});
//         }
//       }
//     }
//   });
// });

// watch(
//   () => playMusic.value,
//   async (val, oldVal) => {
//     let {data} =await checkMusic(val.id);
//     if(data.success){//如果歌曲可用的话
//       let { data } = await getLrc(val.id);
//       // console.log(data);
//       musicLrc.lrc=fomatAllLyric(data);
//     }else{
//       musicLrc.lrc=[];
//     }
// });

watchEffect(async () => {
  let { data } = await checkMusic(playMusic.value.id);
  if (data.success) {
    //如果歌曲可用的话
    let { data } = await getLrc(playMusic.value.id);
    // console.log(data);
    musicLrc.lrc = fomatAllLyric(data);
  } else {
    musicLrc.lrc = [];
  }
});

watch(
  () => time.value,
  async (val, oldVal) => { 
    await nextTick(() => {
      if (isDrawer.value) {
        let li = document.querySelectorAll("#lyric li");
        // let ul = ref<HTMLElement | null>(null)
        let ul:HTMLElement|null=document.querySelector("#lyric");
        // let height = li.value[0].clientHeight;
        // console.log("点击发送到就分开了都是就分开了");
        for (let i = 0; i < musicLrc.lrc.length; i++) {
          // console.log(currentTime.value);
          if (Math.round(musicLrc.lrc[i].time) == Math.round(val)) {
            checkIndex.value = i;
            // console.log(touch.value,ul);
            
            if (touch.value && ul) {
              // console.log(li);
              ul.scrollTop =
                (li[checkIndex.value] as HTMLLIElement)?.offsetTop - ul.clientHeight / 2;
            }
          }
        }
      }
    }); //在这里dom还没有生成
  }
);

</script>

<style lang="less" scoped>
@import "../../theme/style.less";

.active {
  animation-play-state: running !important;
}

.paused {
  animation-play-state: paused !important;
}

.pause {
  transform: rotate(20deg) !important;
}

.play {
  transform: rotate(0deg) !important;
}

.hightLight {
  transition: font-size 0.3s;
  // font-size: 1.7rem !important;
  color: rgb(99, 133, 133) !important;
}

/deep/.el-overlay {
  margin: auto;
  position: fixed;
  width: 100vw !important;
  max-width: 2300px;
  height: 100vh !important;

  #close {
    display: block;
    position: absolute;
    width: 50px;
    height: 50px;
    line-height: 50px;
    text-align: center;
    font-size: 3rem;
    cursor: pointer;
  }

  #lyric {
    position: relative;
    width: 40rem;
    height: 40rem;
    overflow: auto;
    cursor: pointer;
    overflow-y: overlay;

    &::-webkit-scrollbar {
      display: none; //取消滚动条
    }
    &:hover::-webkit-scrollbar{
      display: block;
    }
    &::-webkit-scrollbar-track-piece {
      width: 10px;
    }

    li {
      padding-bottom: 2rem;

      p {
        font-size: 1.5rem;
        color: @modePColor;
        text-align: center;
      }
    }
  }
}

.pageMain {
  margin: auto;
  width: 55vw;
  min-width: 900px;
}

.container {
  width: 100%;
  display: flex;
  // vertical-align: baseline;
  justify-content: space-between;
  align-items: center;

  .cover {
    position: relative;
    // margin-right: 30rem;
    width: 30rem;
    height: 30rem;

    .tools {
      position: absolute;
      left: -20%;
      z-index: 3;
      transition: 0.5s linear;
      transform: rotate(0deg);
      transform-origin: 0 0;
      width: 35%;
      height: 50%;
      background-image: url("../../assets/needle-ip6.png");
      background-size: cover;
    }

    .image {
      position: relative;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #d7d1cd;
      animation: optional 36s linear infinite;

      .img_waitao {
        position: absolute;
        width: 100%;
        height: 100%;
        border-radius: 50%;
        z-index: 2;
        background-image: url("../../assets/disc-ip6.png");
        background-size: cover;
      }

      img {
        position: absolute;
        border-radius: 50%;
        z-index: 1;
        top: 50%;
        left: 50%;
        width: 80%;
        height: 80%;
        transform: translate(-50%, -50%);
      }
    }
  }
}

.recommend {
  margin-top: 3.5rem;
  display: flex;
  justify-content: space-between;
}

@keyframes optional {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

/deep/.el-drawer {
  height: 100% !important;
  background-image: @modePageColor;
}
</style>
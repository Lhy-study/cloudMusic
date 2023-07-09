<template>
    <div id="rightRrawer" v-if="playlist.length && rightRrawer">
        <div class="title">
          <h1>播放列表</h1>
          <span>共{{ playlist?playlist.length:0 }}首</span>
        </div>
        <ul ref="rightNavUl" v-infinite-scroll="test" :infinite-scroll-immediate="false" :infinite-scroll-distance="100">
          <li v-for="(item, index) in musicListInfo.songs.slice(0,limit*pageCount)" :key="item.id"
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
            <!-- <div class="album">
              <router-link to="/">
                <p :class="{ check: item.id == playMusic.id }">{{ item.al.name }}</p>
              </router-link>
            </div> -->
            <div class="duration">
              <p :class="{ check: item.id == playMusic.id }">{{ fomatDuration(item.dt / 1000) }}</p>
            </div>
          </li>
        </ul>
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
  import { reactive, ref, watch , watchEffect} from "vue";
  import { ElMessage } from "element-plus";
  
  let rightNavUl=ref<HTMLElement|null>(null);
  let { playlist, playMusic } = storeToRefs(musicListStore());
  let { rightRrawer } = storeToRefs(elementStore());
  let { flag } = storeToRefs(musicStateStore());
  const { setMusic } = musicListStore()
  const { begin, timeOut } = musicStateStore();
  // const { rightRrawer, playlist, playMusic ,flag,shuffleList,isShuffle} = storeToRefs(musicListStore());
  // const {flagtoFalse,flagtoTrue,begin,timeOut,setMusic} = musicListStore();
  
  let ul=document.querySelector("#rightRrawer ul");
  
  let musicListInfo = reactive({
    songs: [] as any[],
  });
  

  function test() {
    // console.log(rightNavUl.value);
    if(limit.value * pageCount.value<playlist.value.length){
        pageCount.value++;
    }
  }
  
  let limit=ref(40);
  let pageCount=ref(1);
  
  watchEffect(async ()=>{
    // console.log(playlist);
    
    // console.log(rightRrawer);
    
    // console.log(playlist.value);
    try {
      if(playlist.value){
        let { data } = await getDeatils([...playlist.value]);
        // console.log(data);
        if(data.songs){
          musicListInfo.songs=data.songs;
        }
      }
    } catch (error) {
      // console.log(error);
      
      if(error instanceof Error){
        ElMessage({
          type:"error",
          message:error.message
        });
      }
    }
  });

  // watch(()=>[...playlist.value],async()=>{
  //   // console.log(playlist);
    
  //   // console.log(rightRrawer);
    
  //   // console.log(playlist.value);
  //   try {
  //     if(playlist.value){
  //       let { data } = await getDeatils([...playlist.value]);
  //       // console.log(data);
  //       if(data.songs){
  //         musicListInfo.songs=data.songs;
  //       }
  //     }
  //   } catch (error) {
  //     // console.log(error);
  //     if(error instanceof Error){
  //       ElMessage({
  //         type:"error",
  //         message:error.message
  //       });
  //     }
  //   }
  // },{
  //   immediate:true,
  //   deep:true
  // });
  

  </script>
  
  <style lang="less" scoped>
    #rightRrawer{
        border-left: 2px solid @startColor;
        padding-right: 1rem;
        bottom: 100%;
        right: 0%;
        position: absolute;
        height: calc(100vh - 32px - 5rem);
        background-color: @modeBgColor;
    }

  .check {
    color: @startColor !important;
  }
  
  
  .title {
    display: flex;
    align-items: center;
    height: 3rem;
    letter-spacing: 0.7rem;
    padding: 1.5rem;
    color: @modeTextColor !important;
  
    h1 {
      margin-right: 30px;
      // color:@modeTextColor
    }
  
    span {
      font-family: kaiti;
      font-size: 1.3rem;
    }
  }
  
  ul {
    // height: 500px;
    height:calc(100% - 6rem) ;
    overflow: auto;
    &::-webkit-scrollbar {
      display: none;
    }
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
      background-color: @modeBgColor;

      &:hover {
        background-color: @bgColor;
      }

      &:hover .one:nth-of-type(1){
        opacity: 0;
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
        // background-color: @modeBgColor;
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
            font-size: 1rem;
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
        a{
            display: block;
            width: 7rem;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }
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
          font-size: 1rem;
          color: @modePColor;
        }
      }
    }
  }
  </style>
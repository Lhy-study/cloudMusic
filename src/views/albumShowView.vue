<template>
      <div id="album">
        <div id="main">
          <img :src="result.picUrl ? `${result.picUrl}?param=170y170` : image.Cover" :title="result.name" @error="dealImgError">
          <div class="info">
            <p><span>专辑</span><span>{{ result.name }}</span></p>
            <p>
              <span>{{ formatDate(result.publishTime!) }}创建</span>
            </p>
            <div class="operate">
              <div class="all">
                <span class="iconfont icon-shipinbofangshibofang" @click.stop="playAllMusic(getAllId(result.songs))"></span>
                <span>播放全部</span>
                <span class="iconfont icon-tianjia" @click.stop="addplayList(getAllId(result.songs))"></span>
              </div>
              <div :class="{ collection: true, issubscribed: result.isSub }" @click="subscribeing">
                <span v-show="result.isSub">✔已</span>收藏：({{ formatNum(result.subCount!) }})
              </div>
            </div>
            <p>歌手: &nbsp;<router-link :to="`/singerpage/${item.id}/album`" v-for="(item) in result.artists" class="text" :key="`${item.id}+${item.name}`"><span>{{ item.name }}</span></router-link> <span v-if="!result.artists?.length">无</span></p>
            <!-- <el-collapse accordion>
            <el-collapse-item title="简介" name="4">
              <p style="font-size: 1.6rem;">{{ result.description }}</p>
            </el-collapse-item>
          </el-collapse> -->
          </div>
        </div>
        <ul class="tab">
          <li><router-link :to="`/albumpage/${encodeURIComponent(route.params.albumid as string)}/songs`"><span
                :class="{ ischeck: `/albumpage/${encodeURIComponent(route.params.albumid as string)}/songs` == route.path }">歌曲列表</span></router-link>
          </li>
          <li><router-link :to="`/albumpage/${encodeURIComponent(route.params.albumid as string)}/comments`"><span
                :class="{ ischeck: `/albumpage/${encodeURIComponent(route.params.albumid as string)}/comments` == route.path }">评论({{ formatNum(result.commentCount!) }})</span></router-link>
          </li>
          <li><router-link :to="`/albumpage/${encodeURIComponent(route.params.albumid as string)}/introduce`"><span
                :class="{ ischeck: `/albumpage/${encodeURIComponent(route.params.albumid as string)}/introduce` == route.path }">简介</span></router-link>
          </li>
        </ul>
        <router-view></router-view>
      </div>
  </template>
  
  <script setup lang="ts">
  import { reactive, watchEffect ,provide} from "vue";
  import { useRoute ,onBeforeRouteLeave} from "vue-router";
  import { albumCont , albumDynamic,albumSub} from "../api/album";
  import { formatDate ,formatNum} from "../api/format";
  import { playAllMusic ,addplayList, getAllId } from "../api/playing";
  import { aldetail, musicDeatils } from "../type/index";
  import {useStore} from "../store/user";
  import { storeToRefs } from "pinia";
  import {image , dealImgError} from "../baseconfig";
  import { ElMessage } from "element-plus";
  import { al_Result } from "../inject_provide";
  
  let {userInfo}=storeToRefs(useStore());
  document.title='专辑详情';
  
  let route = useRoute();
  let result = reactive<aldetail>({
    id: NaN,
    name:"",//专辑名
    subCount: NaN,//收藏数
    publishTime: NaN,//创建时间
    commentCount:NaN,//评论数
    size: NaN,//歌曲数
    shareCount: NaN,//分享数
    description: "",//简介
    picUrl: "",
    isSub:false,//用户是否收藏
    artists: [],
    songs: [],
  });

  provide(al_Result,result);
  const stop= watchEffect(async () => {
    try {
      let { data } = await albumCont(parseInt(route.params.albumid as string));
      let arr:{name:string,id:number}[]=[];
        // console.log(data);
        result.id = data.album.id;
        result.name = data.album.name;
        result.description = data.album.description;
        result.picUrl = data.album.picUrl;
        result.publishTime = data.album.publishTime;
        result.size = data.album.size;
        for(let i=0;i<data.album.artists.length;i++){
          arr.push({name:data.album.artists[i].name,id:data.album.artists[i].id});
        }
        result.artists=arr;
        //顺便获取歌曲
        if(data.songs){
          let arr:musicDeatils[]=[];
          for (let i = 0; i < data.songs.length; i++) {
            arr.push({
                    name: data.songs[i].name,
                    id: data.songs[i].id,
                    fee: data.songs[i].fee,
                    dt: data.songs[i].dt,
                    al: {
                        id: data.songs[i].al.id,
                        name: data.songs[i].al.name,
                        picUrl: data.songs[i].al.picUrl,
                    },
                    ar: data.songs[i].ar
                });
          }
          result.songs=arr;
        }
        //第二个请求
        let res = await albumDynamic(data.album.id);
        // console.log(res.data);
        
        result.shareCount = res.data.shareCount;
        result.commentCount = res.data.commentCount;
        result.subCount = res.data.subCount;
        result.isSub = res.data.isSub;
    }catch(e){
        ElMessage({
            type:"error",
            message:"专辑不存在"
        })
    }
  });
  
//   const dynamiWatch=watchEffect(async ()=>{
//     try {
//       let { data } =await dynamic(parseInt(route.params.albumid as string));
//       // console.log(data);    
//       result.subscribed=data.subscribed;
//     } catch (error) {
//       ElMessage({
//         type:"error",
//         message:error as string
//       })
//     }
//   });
  
  async function subscribeing() {//收藏歌单
    if (result.isSub) {//代表订阅了
      try {
         await albumSub(result.id, 0);
        //  console.log(res.data);
        let { data } = await albumDynamic(parseInt(route.params.playlistid as string));
        // console.log(data);
        result.isSub = data.isSub;
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
          await albumSub(result.id, 1);
          // console.log(res.data);
          let { data } = await albumDynamic(parseInt(route.params.playlistid as string));
          // console.log(data);
          result.isSub = data.isSub;
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
  
  onBeforeRouteLeave(()=>{
    stop();
    // dynamiWatch();
  })
  </script>
  
  <style lang="less" scoped>
  .ischeck {
    border-bottom: 3px solid red;
  }
  
  .issubscribed{
    background-color: @textColor;
  }
  
  @h:3rem;
  #album {
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
      p{
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
        span{
          margin-left: 1rem;
          font-size: 1.7rem;
        }
      }
      p:nth-of-type(3){
        width: 50vw;
        font-size: 1.4rem;
        .text+.text::before{
          content: "/";
          margin:0px 3px;
        }
        span{
          color: rgb(69, 194, 194);
          &:hover{
            opacity: .8;
          }
        }
      }
      .operate{
        display: flex;
        margin-bottom: 1rem;
        .all{
          display: flex;
          justify-content: space-between;
          position: relative;
          background-color: red;
          width: @h * 4;
          height: @h;
          border-radius: @h;
          cursor: pointer;
          span:nth-of-type(1),span:nth-of-type(3){
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
          span:nth-of-type(2){
            height: @h;
            line-height: @h;
            color: white;
            letter-spacing: 2px;
          }
          // span:nth-of-type(1){
          //   left: 0;
          // }
          span:nth-of-type(3):hover::after{
            display: block;
            width: 15rem;
            content: "添加到全部播放列表";
            font-size: 1rem;
            color: @modePColor;
            background-color: white;
          }
        }
        .collection{
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
          border-radius:@h;
          cursor: pointer;
          &:hover{
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
  }
  </style>
  
  <style lang="less">
  .el-collapse{
    border-color: transparent;
  }
  .el-collapse-item__header {
    font-size: 1.5rem;
    color: @modeTextColor;
    background-color: @modeBgColor;
    border-bottom-color:transparent;
  }
  
  .el-collapse-item__wrap {
    background-color: @modeBgColor;
    border-color: transparent;
  }
  </style>